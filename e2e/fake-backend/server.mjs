// Servidor HTTP mínimo que reemplaza a TekoApp-Backend durante los tests e2e de Playwright.
// No es un mock a nivel de red del browser (Playwright no puede interceptar el fetch
// server-to-server que hace el BFF de Next.js) — es un doble real y liviano del backend, con
// las mismas rutas/formas de respuesta que usa el proxy BFF. Ver documentation/architecture.md.
import { createServer } from 'node:http';

const PORT = process.env.FAKE_BACKEND_PORT || 4000;

// La cookie `accessToken` necesita la forma real de un JWT (header.payload.signature en
// base64url) porque algunas partes del código (ej. el guard de sockets) esperan un JWT parseable
// — la firma no importa porque nunca se valida acá. `core/auth/session.ts` YA NO decodifica este
// payload: pide `GET /v1/auth/scope` (mockeado más abajo) para los permisos/roles reales, igual
// que hace contra el backend real (el JWT real es "delgado" y no lleva permissions/roles).
function buildFakeAccessToken() {
  const base64url = (obj) =>
    Buffer.from(JSON.stringify(obj)).toString('base64url');
  const header = base64url({ alg: 'none', typ: 'JWT' });
  const payload = base64url({
    id: 1,
    referenceId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    email: 'ana@tekoapp.com.py',
    firstName: 'Ana',
    lastName: 'Test',
    accessLevelId: 1,
    userStatus: 'ACTIVE',
    profileStatus: 'COMPLETE',
    permissions: ['admin:all'],
    roles: ['ADMIN'],
  });
  return `${header}.${payload}.fake-signature`;
}

const FAKE_ACCESS_TOKEN = buildFakeAccessToken();

const FAKE_DASHBOARD_STATS = {
  success: true,
  users: { total: 1500, new: 120, active: 450, growth: 12.5 },
  professionals: { total: 350, new: 25, verified: 310, growth: 5.4 },
  services: { total: 850, active: 45, completed: 750, pending: 55, growth: 8.2 },
  revenue: { total: 25000000, period: 4500000, average: 150000, growth: 15.3 },
  ratings: { average: 4.7, total: 980, period: 120, distribution: {} },
  period: {
    startDate: '2026-05-01T00:00:00.000Z',
    endDate: '2026-05-31T23:59:59.999Z',
  },
};

const FAKE_SERVICE_TYPES = [{ id: 4, name: 'Instalación' }];

// Estado mutable en memoria — el flujo e2e de Fase 6 (cliente) solicita un servicio y lo ve
// aparecer en "Mis servicios".
let nextServiceId = 1;
const clientServices = [];

// Estado mutable en memoria — a diferencia del resto (solo lectura), el flujo e2e representativo
// de Fase 4 (categorías) ejercita un CRUD real: crear, ocultar/mostrar y eliminar.
let nextCategoryId = 2;
const categories = [
  {
    id: 1,
    name: 'Plomería',
    slug: 'plomeria',
    description: 'Servicios de reparación e instalaciones sanitarias',
    icon: 'wrench-outline',
    color: '#2ecc71',
    sortOrder: 0,
    status: 'ACTIVE',
    isVisible: true,
    requiresVerification: false,
    parentCategoryId: null,
    createdAt: '2026-06-01T00:00:00.000Z',
    lastChangedAt: null,
  },
];

// Estado mutable en memoria — Fase de I-03 (backlog e2e): reembolso, cancelación y propina sobre
// pagos ya existentes. IDs/referenceId fijos (no incrementales) porque cada test necesita un pago
// en un estado puntual (reembolsable/cancelable/con propina pendiente), nunca cualquiera.
const payments = [
  {
    id: 1,
    referenceId: 'payment-refund-1',
    userId: 1,
    professionalId: 1,
    serviceId: 'svc-payment-1',
    amount: 150000,
    tip: null,
    currencyCode: 'PYG',
    fee: 4350,
    tax: 32262,
    totalAmount: 186612,
    status: 'PAID',
    paymentMethod: 'CREDIT_CARD',
    paymentProvider: 'STRIPE',
    transactionId: 'txn-refund-1',
    description: 'Servicio de plomería',
    platformFee: 0,
    professionalNetAmount: 150000,
    isRecurring: false,
    createdAt: '2026-09-01T10:00:00.000Z',
    paidAt: '2026-09-01T10:05:00.000Z',
  },
  {
    id: 2,
    referenceId: 'payment-cancel-1',
    userId: 1,
    professionalId: 1,
    serviceId: 'svc-payment-2',
    amount: 80000,
    tip: null,
    currencyCode: 'PYG',
    fee: 0,
    tax: 0,
    totalAmount: 80000,
    status: 'PENDING',
    paymentMethod: 'CASH',
    paymentProvider: 'CASH',
    transactionId: 'txn-cancel-1',
    description: 'Servicio de electricidad',
    platformFee: 0,
    isRecurring: false,
    createdAt: '2026-09-02T10:00:00.000Z',
  },
  {
    id: 3,
    referenceId: 'payment-tip-1',
    userId: 1,
    professionalId: 1,
    serviceId: 'svc-payment-3',
    amount: 120000,
    tip: null,
    currencyCode: 'PYG',
    fee: 3000,
    tax: 10000,
    totalAmount: 133000,
    status: 'COMPLETED',
    paymentMethod: 'QR',
    paymentProvider: 'BANCARD',
    transactionId: 'txn-tip-1',
    description: 'Servicio de jardinería',
    platformFee: 0,
    isRecurring: false,
    createdAt: '2026-09-03T10:00:00.000Z',
    paidAt: '2026-09-03T10:05:00.000Z',
  },
];

// Estado mutable en memoria — Fase de I-03 (backlog e2e): embudo de postulación → verificación de
// profesional. Un solo usuario fake existe (Ana), así que "postularse" y "ser el profesional
// verificado por el propio admin" son la misma cuenta cambiando de modo — igual que en el resto de
// este servidor, no hay más de un usuario para simular roles distintos.
const professionals = [];
let nextProfessionalId = 1;
let myProfessionalReferenceId = null;

// Estado mutable en memoria — Fase de I-03 (backlog e2e): colas de revisión de documentos y
// portafolio. Un solo ítem PENDING por cola alcanza para ejercitar aprobar/rechazar de punta a
// punta; no hace falta un profesional real detrás (el `professional` de estos DTOs es solo un
// resumen para mostrar nombre, no una FK que el resto del fake-backend necesite resolver).
const professionalDocuments = [
  {
    referenceId: 'document-1',
    professionalDocumentType: {
      referenceId: 'doctype-1',
      code: 'BACKGROUND_CHECK',
      name: 'Antecedentes penales',
      category: 'BACKGROUND_CHECK',
      isRequired: true,
    },
    fileKey: 'document-abc123.pdf',
    status: 'PENDING',
    issuedAt: '2026-08-01T00:00:00.000Z',
    createdAt: '2026-08-05T10:00:00.000Z',
    professional: {
      referenceId: 'professional-doc-1',
      firstName: 'Carlos',
      lastName: 'Gómez',
    },
  },
];

const portfolioItems = [
  {
    referenceId: 'portfolio-e2e-1',
    fileKey: 'portfolio-e2e-abc123.jpg',
    caption: 'Instalación de aire acondicionado',
    sortOrder: 0,
    isVisible: true,
    status: 'PENDING',
    createdAt: '2026-08-10T10:00:00.000Z',
    professional: {
      referenceId: 'professional-portfolio-1',
      firstName: 'Lucía',
      lastName: 'Fernández',
    },
  },
];

const FAKE_TIP_CONFIG = {
  isEnabled: true,
  isMandatory: false,
  suggestedPercentages: [10, 15, 20],
  allowFreeAmount: true,
};

const FAKE_USERS_PAGE = {
  data: [
    {
      id: 1,
      referenceId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      email: 'ana.gonzalez@example.com',
      status: 'ACTIVE',
      firstName: 'Ana',
      lastName: 'González',
      phoneNumber: '+595991234567',
      isEmployee: false,
      isLdap: false,
      lastLogin: '2026-06-16T10:20:30Z',
      createdAt: '2026-06-17T14:00:00Z',
    },
  ],
  pagination: { total: 1, page: 1, pageSize: 10, totalPages: 1 },
};

function readBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk) => (raw += chunk));
    req.on('end', () => resolve(raw ? JSON.parse(raw) : {}));
  });
}

function sendJson(res, status, body, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json', ...headers });
  res.end(JSON.stringify(body));
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method === 'POST' && url.pathname === '/tekoapp-backend/api/v1/auth/nonce') {
    return sendJson(res, 200, {
      success: true,
      data: { nonce: 'fake-e2e-nonce' },
    });
  }

  if (req.method === 'POST' && url.pathname === '/tekoapp-backend/api/v1/auth/login') {
    const body = await readBody(req);
    if (body.email === 'fail@tekoapp.com.py') {
      return sendJson(res, 401, { message: 'Credenciales inválidas' });
    }
    return sendJson(
      res,
      200,
      { login: true, accessToken: FAKE_ACCESS_TOKEN },
      {
        'Set-Cookie': [
          `accessToken=${FAKE_ACCESS_TOKEN}; Path=/; HttpOnly`,
          'refreshToken=fake-refresh-token; Path=/; HttpOnly',
        ],
      },
    );
  }

  if (req.method === 'GET' && url.pathname === '/tekoapp-backend/api/v1/auth/scope') {
    return sendJson(res, 200, {
      success: true,
      data: {
        user: {
          id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          email: 'ana@tekoapp.com.py',
          firstName: 'Ana',
          lastName: 'Test',
          status: 'ACTIVE',
          profileStatus: 'COMPLETE',
          accessLevelId: 1,
        },
        roles: [{ name: 'ADMIN' }],
        permissions: [{ name: 'admin:all' }],
      },
      message: 'Operación exitosa',
    });
  }

  if (req.method === 'GET' && url.pathname === '/tekoapp-backend/api/v1/analytics/dashboard') {
    return sendJson(res, 200, FAKE_DASHBOARD_STATS);
  }

  if (req.method === 'GET' && url.pathname === '/tekoapp-backend/api/v1/users') {
    return sendJson(res, 200, FAKE_USERS_PAGE);
  }

  if (req.method === 'GET' && url.pathname === '/tekoapp-backend/api/v1/categories/all') {
    return sendJson(res, 200, categories);
  }

  if (req.method === 'GET' && url.pathname === '/tekoapp-backend/api/v1/categories') {
    return sendJson(res, 200, categories.filter((c) => c.isVisible));
  }

  if (req.method === 'GET' && url.pathname === '/tekoapp-backend/api/v1/service-types') {
    return sendJson(res, 200, FAKE_SERVICE_TYPES);
  }

  if (req.method === 'POST' && url.pathname === '/tekoapp-backend/api/v1/services') {
    const body = await readBody(req);
    const service = {
      id: `svc-${nextServiceId++}`,
      userId: 1,
      professionalId: null,
      categoryId: body.categoryId,
      serviceTypeId: body.serviceTypeId,
      title: body.title,
      description: body.description,
      status: 'PENDING',
      latitude: body.latitude,
      longitude: body.longitude,
      address: body.address,
      images: body.images ?? [],
      isUrgent: body.isUrgent ?? false,
      createdAt: new Date().toISOString(),
      users: {
        id: 1,
        referenceId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        email: 'ana@tekoapp.com.py',
        firstName: 'Ana',
        lastName: 'Test',
      },
    };
    clientServices.push(service);
    return sendJson(res, 201, service);
  }

  if (req.method === 'GET' && url.pathname === '/tekoapp-backend/api/v1/services/my-services') {
    return sendJson(res, 200, clientServices);
  }

  if (req.method === 'POST' && url.pathname === '/tekoapp-backend/api/v1/categories') {
    const body = await readBody(req);
    const category = {
      id: nextCategoryId++,
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
      description: body.description ?? null,
      icon: body.icon ?? null,
      color: body.color ?? null,
      sortOrder: body.sortOrder ?? 0,
      status: body.status ?? 'ACTIVE',
      isVisible: body.isVisible ?? true,
      requiresVerification: body.requiresVerification ?? false,
      parentCategoryId: body.parentCategoryId ?? null,
      createdAt: new Date().toISOString(),
      lastChangedAt: null,
    };
    categories.push(category);
    return sendJson(res, 201, category);
  }

  const toggleVisibilityMatch = url.pathname.match(
    /^\/tekoapp-backend\/api\/v1\/categories\/(\d+)\/toggle-visibility$/,
  );
  if (req.method === 'PATCH' && toggleVisibilityMatch) {
    const category = categories.find((c) => c.id === Number(toggleVisibilityMatch[1]));
    if (!category) return sendJson(res, 404, { message: 'Categoría no encontrada' });
    category.isVisible = !category.isVisible;
    return sendJson(res, 200, category);
  }

  const categoryByIdMatch = url.pathname.match(/^\/tekoapp-backend\/api\/v1\/categories\/(\d+)$/);
  if (req.method === 'PATCH' && categoryByIdMatch) {
    const body = await readBody(req);
    const category = categories.find((c) => c.id === Number(categoryByIdMatch[1]));
    if (!category) return sendJson(res, 404, { message: 'Categoría no encontrada' });
    Object.assign(category, body);
    return sendJson(res, 200, category);
  }
  if (req.method === 'DELETE' && categoryByIdMatch) {
    const index = categories.findIndex((c) => c.id === Number(categoryByIdMatch[1]));
    if (index === -1) return sendJson(res, 404, { message: 'Categoría no encontrada' });
    categories.splice(index, 1);
    return sendJson(res, 204, null);
  }

  if (req.method === 'GET' && url.pathname === '/tekoapp-backend/api/v1/payments/me') {
    return sendJson(res, 200, payments);
  }

  if (req.method === 'GET' && url.pathname === '/tekoapp-backend/api/v1/payments') {
    return sendJson(res, 200, payments);
  }

  if (req.method === 'GET' && url.pathname === '/tekoapp-backend/api/v1/tips/config') {
    return sendJson(res, 200, FAKE_TIP_CONFIG);
  }

  const refundMatch = url.pathname.match(
    /^\/tekoapp-backend\/api\/v1\/payments\/([^/]+)\/refund$/,
  );
  if (req.method === 'POST' && refundMatch) {
    const body = await readBody(req);
    const payment = payments.find((p) => p.referenceId === refundMatch[1]);
    if (!payment) return sendJson(res, 404, { message: 'Pago no encontrado' });
    payment.status =
      body.amount >= payment.totalAmount ? 'REFUNDED' : 'PARTIAL_REFUNDED';
    payment.refundDetails = {
      amount: body.amount,
      reason: body.reason,
      description: body.description,
    };
    return sendJson(res, 200, payment);
  }

  const cancelMatch = url.pathname.match(
    /^\/tekoapp-backend\/api\/v1\/payments\/([^/]+)\/cancel$/,
  );
  if (req.method === 'POST' && cancelMatch) {
    const payment = payments.find((p) => p.referenceId === cancelMatch[1]);
    if (!payment) return sendJson(res, 404, { message: 'Pago no encontrado' });
    payment.status = 'CANCELLED';
    return sendJson(res, 200, payment);
  }

  const tipMatch = url.pathname.match(
    /^\/tekoapp-backend\/api\/v1\/payments\/([^/]+)\/tip$/,
  );
  if (req.method === 'POST' && tipMatch) {
    const body = await readBody(req);
    const payment = payments.find((p) => p.referenceId === tipMatch[1]);
    if (!payment) return sendJson(res, 404, { message: 'Pago no encontrado' });
    const amount =
      body.mode === 'PERCENTAGE'
        ? Math.round((payment.amount * body.percentage) / 100)
        : body.amount;
    const tip = {
      referenceId: `tip-${payment.referenceId}`,
      mode: body.mode,
      percentage: body.mode === 'PERCENTAGE' ? body.percentage : null,
      amount,
      currencyCode: payment.currencyCode,
      createdAt: new Date().toISOString(),
    };
    payment.tip = tip;
    return sendJson(res, 201, tip);
  }

  // Va DESPUÉS de /refund, /cancel y /tip: esos son más específicos que este match genérico de
  // "un id cualquiera" y tienen que ganarle en orden de evaluación.
  const paymentByIdMatch = url.pathname.match(
    /^\/tekoapp-backend\/api\/v1\/payments\/([^/]+)$/,
  );
  if (req.method === 'GET' && paymentByIdMatch) {
    const payment = payments.find((p) => p.referenceId === paymentByIdMatch[1]);
    if (!payment) return sendJson(res, 404, { message: 'Pago no encontrado' });
    return sendJson(res, 200, payment);
  }

  // GET /professionals/me (literal, va ANTES de /professionals a secas): 404 hasta que la cuenta
  // se postule, después siempre el mismo profesional. `ProfessionalApplicationForm` y el
  // `ModeSwitcher`/`ProfessionalGate` dependen de esta ruta para saber si ya existe el perfil.
  if (
    req.method === 'GET' &&
    url.pathname === '/tekoapp-backend/api/v1/professionals/me'
  ) {
    const professional = professionals.find(
      (p) => p.referenceId === myProfessionalReferenceId,
    );
    if (!professional) {
      return sendJson(res, 404, { message: 'Profesional no encontrado' });
    }
    return sendJson(res, 200, professional);
  }

  if (
    req.method === 'GET' &&
    url.pathname === '/tekoapp-backend/api/v1/professionals'
  ) {
    return sendJson(res, 200, {
      data: professionals,
      pagination: {
        total: professionals.length,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      },
    });
  }

  if (
    req.method === 'POST' &&
    url.pathname === '/tekoapp-backend/api/v1/professionals'
  ) {
    const body = await readBody(req);
    const category =
      categories.find((c) => c.id === Number(body.categoryId)) ??
      categories[0] ??
      null;
    const professional = {
      id: nextProfessionalId,
      referenceId: `professional-${nextProfessionalId}`,
      userId: 1,
      categoryId: category ? category.id : Number(body.categoryId),
      description: body.description,
      hourlyRate: body.hourlyRate,
      fixedRate: body.fixedRate ?? undefined,
      skills: body.skills ?? [],
      certifications: [],
      yearsOfExperience: body.yearsOfExperience ?? 0,
      status: 'PENDING',
      isAvailable: true,
      isOnline: false,
      verificationStatus: 'UNVERIFIED',
      requiredDocumentsVerified: false,
      totalServices: 0,
      averageRating: 0,
      totalRatings: 0,
      createdAt: new Date().toISOString(),
      user: {
        id: 1,
        referenceId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        email: 'ana@tekoapp.com.py',
        firstName: 'Ana',
        lastName: 'Test',
      },
      category: category
        ? {
            id: category.id,
            name: category.name,
            slug: category.slug,
            icon: category.icon,
            color: category.color,
          }
        : null,
    };
    nextProfessionalId += 1;
    professionals.push(professional);
    myProfessionalReferenceId = professional.referenceId;
    return sendJson(res, 201, professional);
  }

  const verifyMatch = url.pathname.match(
    /^\/tekoapp-backend\/api\/v1\/professionals\/(\d+)\/verify$/,
  );
  if (req.method === 'POST' && verifyMatch) {
    const body = await readBody(req);
    const professional = professionals.find(
      (p) => p.id === Number(verifyMatch[1]),
    );
    if (!professional) {
      return sendJson(res, 404, { message: 'Profesional no encontrado' });
    }
    professional.verificationStatus = body.isVerified ? 'VERIFIED' : 'REJECTED';
    if (body.isVerified) professional.status = 'APPROVED';
    return sendJson(res, 200, professional);
  }

  if (
    req.method === 'GET' &&
    url.pathname === '/tekoapp-backend/api/v1/admin/professional-documents'
  ) {
    return sendJson(res, 200, {
      data: professionalDocuments,
      pagination: {
        total: professionalDocuments.length,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      },
    });
  }

  const documentReviewMatch = url.pathname.match(
    /^\/tekoapp-backend\/api\/v1\/admin\/professional-documents\/([^/]+)\/review$/,
  );
  if (req.method === 'PATCH' && documentReviewMatch) {
    const body = await readBody(req);
    const document = professionalDocuments.find(
      (d) => d.referenceId === documentReviewMatch[1],
    );
    if (!document) {
      return sendJson(res, 404, { message: 'Documento no encontrado' });
    }
    document.status = body.status;
    document.rejectionReason = body.rejectionReason;
    return sendJson(res, 200, document);
  }

  if (
    req.method === 'GET' &&
    url.pathname === '/tekoapp-backend/api/v1/admin/professional-portfolio'
  ) {
    return sendJson(res, 200, {
      data: portfolioItems,
      pagination: {
        total: portfolioItems.length,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      },
    });
  }

  const portfolioReviewMatch = url.pathname.match(
    /^\/tekoapp-backend\/api\/v1\/admin\/professional-portfolio\/([^/]+)\/review$/,
  );
  if (req.method === 'PATCH' && portfolioReviewMatch) {
    const body = await readBody(req);
    const item = portfolioItems.find(
      (p) => p.referenceId === portfolioReviewMatch[1],
    );
    if (!item) return sendJson(res, 404, { message: 'Foto no encontrada' });
    item.status = body.status;
    item.rejectionReason = body.rejectionReason;
    return sendJson(res, 200, item);
  }

  if (
    req.method === 'GET' &&
    url.pathname === '/tekoapp-backend/api/v1/uploads/presigned-url'
  ) {
    return sendJson(res, 200, {
      url: 'https://example.com/fake-presigned-url',
    });
  }

  sendJson(res, 404, { message: `Fake backend: ruta no implementada ${req.method} ${url.pathname}` });
});

// Bind explícito a 127.0.0.1 (no "localhost"/dual-stack) — Playwright resuelve "localhost" a
// ::1 primero en este entorno y su chequeo de webServer.url no encuentra el puerto si el server
// solo escucha en IPv4 por default (mismo tipo de bug que Redis/WSL2 en esta sesión).
server.listen(PORT, "127.0.0.1", () => {
  console.log(`Fake backend escuchando en http://127.0.0.1:${PORT}`);
});
