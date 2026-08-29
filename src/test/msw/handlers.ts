import { aiDisclosuresHandlers } from './handlers/ai-disclosures';
import { analyticsHandlers } from './handlers/analytics';
import { authHandlers } from './handlers/auth';
import { categoriesHandlers } from './handlers/categories';
import { locationsHandlers } from './handlers/locations';
import { myProfileHandlers } from './handlers/my-profile';
import { notificationsHandlers } from './handlers/notifications';
import { paymentsHandlers } from './handlers/payments';
import { professionalsHandlers } from './handlers/professionals';
import { promotionsHandlers } from './handlers/promotions';
import { ratingsHandlers } from './handlers/ratings';
import { rolesHandlers } from './handlers/roles';
import { serviceProgressHandlers } from './handlers/service-progress';
import { servicesHandlers } from './handlers/services';
import { usersHandlers } from './handlers/users';

// Agrega acá los handlers de cada dominio a medida que se implementan
// (ver src/test/msw/handlers/*.ts) — nunca handlers inline duplicados por archivo de test.
export const handlers = [
  ...authHandlers,
  ...analyticsHandlers,
  ...usersHandlers,
  ...locationsHandlers,
  ...professionalsHandlers,
  ...servicesHandlers,
  ...paymentsHandlers,
  ...promotionsHandlers,
  ...ratingsHandlers,
  ...rolesHandlers,
  ...categoriesHandlers,
  ...notificationsHandlers,
  ...myProfileHandlers,
  ...aiDisclosuresHandlers,
  ...serviceProgressHandlers,
];
