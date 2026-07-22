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

  if (req.method === 'GET' && url.pathname === '/tekoapp-backend/api/analytics/dashboard') {
    return sendJson(res, 200, FAKE_DASHBOARD_STATS);
  }

  if (req.method === 'GET' && url.pathname === '/tekoapp-backend/api/v1/users') {
    return sendJson(res, 200, FAKE_USERS_PAGE);
  }

  if (req.method === 'GET' && url.pathname === '/tekoapp-backend/api/categories/all') {
    return sendJson(res, 200, categories);
  }

  if (req.method === 'GET' && url.pathname === '/tekoapp-backend/api/categories') {
    return sendJson(res, 200, categories.filter((c) => c.isVisible));
  }

  if (req.method === 'GET' && url.pathname === '/tekoapp-backend/api/service-types') {
    return sendJson(res, 200, FAKE_SERVICE_TYPES);
  }

  if (req.method === 'POST' && url.pathname === '/tekoapp-backend/api/services') {
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

  if (req.method === 'GET' && url.pathname === '/tekoapp-backend/api/services/my-services') {
    return sendJson(res, 200, clientServices);
  }

  if (req.method === 'POST' && url.pathname === '/tekoapp-backend/api/categories') {
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
    /^\/tekoapp-backend\/api\/categories\/(\d+)\/toggle-visibility$/,
  );
  if (req.method === 'PATCH' && toggleVisibilityMatch) {
    const category = categories.find((c) => c.id === Number(toggleVisibilityMatch[1]));
    if (!category) return sendJson(res, 404, { message: 'Categoría no encontrada' });
    category.isVisible = !category.isVisible;
    return sendJson(res, 200, category);
  }

  const categoryByIdMatch = url.pathname.match(/^\/tekoapp-backend\/api\/categories\/(\d+)$/);
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

  sendJson(res, 404, { message: `Fake backend: ruta no implementada ${req.method} ${url.pathname}` });
});

// Bind explícito a 127.0.0.1 (no "localhost"/dual-stack) — Playwright resuelve "localhost" a
// ::1 primero en este entorno y su chequeo de webServer.url no encuentra el puerto si el server
// solo escucha en IPv4 por default (mismo tipo de bug que Redis/WSL2 en esta sesión).
server.listen(PORT, "127.0.0.1", () => {
  console.log(`Fake backend escuchando en http://127.0.0.1:${PORT}`);
});
