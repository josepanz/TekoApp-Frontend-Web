// GENERADO por `pnpm generate:api-types` desde http://127.0.0.1:3000/tekoapp-backend/api/swagger-json — no editar a mano.
export interface paths {
    "/tekoapp-backend/api/healthcheck": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Verifica el estado de salud global de la infraestructura de TekoApp */
        get: operations["HealthController_check"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/v1/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Login del usuario con hash dinámico y nonce.
         * @description Login del usuario, si es primer login se importan sus datos y configuraciones.
         */
        post: operations["AuthApiController_login"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/v1/auth/create-password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Creación de credenciales y password del usuario.
         * @description Creación de credenciales y password del usuario.
         */
        post: operations["AuthApiController_createPassword"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/v1/auth/change-password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Cambio de credenciales y password del usuario.
         * @description Cambio de credenciales y password del usuario.
         */
        put: operations["AuthApiController_changePassword"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/v1/auth/forgot-password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Olvide mi contraseña. Cambio de credenciales y password del usuario.
         * @description Olvide mi contraseña. Cambio de credenciales y password del usuario.
         */
        put: operations["AuthApiController_forgotPassword"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/v1/auth/refresh-token": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Refresca el token de acceso usando el token de refresco.
         * @description Endpoint para obtener un nuevo token de acceso a partir de un token de refresco válido.
         */
        post: operations["AuthApiController_refreshToken"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/v1/auth/scope": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Obtiene el scope del usuario.
         * @description Obtiene el scope del usuario, sus roles y permisos asignados.
         */
        get: operations["AuthApiController_scope"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/v1/auth/user-verify": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Verifica el email del usuario.
         * @description Verifica el email del usuario y lo activa para que tenga acceso al sistema.
         */
        get: operations["AuthApiController_userVerify"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/v1/auth/verification-status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Consulta el estado de verificación del email del usuario.
         * @description Endpoint para consultar si un email ya ha sido verificado.
         */
        get: operations["AuthApiController_userVerificationStatus"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/v1/auth/email/send-verification": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Enviar email de verificación */
        post: operations["AuthApiController_sendVerificationEmail"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/v1/auth/email/send-create-password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Enviar email para recuperación de contraseña */
        post: operations["sendCreatePasswordEmail"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/v1/auth/email/send-password-reset": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Enviar email para recuperación de contraseña */
        post: operations["AuthApiController_sendPasswordResetEmail"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/v1/roles": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Listar todos los roles
         * @description Obtiene una lista de todos los roles con filtros opcionales por estado y búsqueda.
         */
        get: operations["RolesApiController_getAllRoles"];
        put?: never;
        /**
         * Crear un nuevo rol
         * @description Crea un nuevo rol en el sistema con nombre y descripción.
         */
        post: operations["RolesApiController_createRole"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/v1/roles/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Obtener un rol por ID
         * @description Obtiene los detalles de un rol específico por su ID.
         */
        get: operations["RolesApiController_getRoleById"];
        /**
         * Actualizar un rol
         * @description Actualiza los datos de un rol existente (nombre, descripción, estado).
         */
        put: operations["RolesApiController_updateRole"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/v1/users/{userId}/roles": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Obtener usuario con roles y permisos
         * @description Obtiene un usuario con todos sus roles y permisos (heredados y directos).
         */
        get: operations["UsersRolesApiController_getUserWithRoles"];
        put?: never;
        /**
         * Asignar roles a un usuario
         * @description Asigna una lista de roles a un usuario. Reemplaza los roles existentes.
         */
        post: operations["UsersRolesApiController_assignRolesToUser"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/v1/users/{userId}/permissions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Asignar permisos directos a un usuario
         * @description Asigna permisos directos a un usuario (adicionales a los heredados por roles).
         */
        post: operations["UsersRolesApiController_assignPermissionsToUser"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/v1/onboarding": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Onboarding de un nuevo usuario
         * @description Registrar un nuevo usuario con datos proveidos
         */
        post: operations["OnboardingController_onboarding"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/v1/users": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Listar todos los usuarios
         * @description Retorna la lista de usuarios en todos los estados
         */
        get: operations["UsersController_findAll"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/v1/users/reference/{referenceId}/edit-context": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Obtiene usuario con su contexto por referenceId
         * @description Obtiene el usuario por su UUID público con su contexto (acceso, asignaciones, permisos).
         */
        get: operations["getEditContext"];
        /**
         * Actualizar usuario y su contexto por referenceId
         * @description Actualiza el usuario por su UUID público con su contexto (acceso, asignaciones, permisos).
         */
        put: operations["updateEditContext"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/v1/users/reference/{referenceId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Obtener usuario por referenceId
         * @description Retorna un usuario específico por su UUID público. Uso frontend.
         */
        get: operations["UsersController_findOneByReference"];
        /**
         * Actualizar un usuario por referenceId
         * @description Actualiza los datos del usuario por su UUID público. Uso frontend.
         */
        put: operations["UsersController_updateByReference"];
        post?: never;
        /**
         * Eliminar un usuario por referenceId
         * @description Inactiva el usuario por su UUID público (soft delete). Uso frontend.
         */
        delete: operations["UsersController_deleteByReference"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/v1/users/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Obtener usuario por ID interno
         * @description Retorna un usuario específico por su ID numérico. Uso interno/backend.
         */
        get: operations["UsersController_findOne"];
        /**
         * Actualizar un usuario por ID interno
         * @description Actualiza los datos del usuario por su ID numérico. Uso interno/backend.
         */
        put: operations["UsersController_update"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/v1/users/{id}/block": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Bloquear un usuario por ID interno
         * @description Bloquea un usuario por su ID numérico y registra el motivo. Uso interno/backend.
         */
        patch: operations["UsersController_block"];
        trace?: never;
    };
    "/tekoapp-backend/api/v1/users/{id}/unblock": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Desbloquear un usuario por ID interno
         * @description Desbloquea un usuario por su ID numérico y registra el motivo. Uso interno/backend.
         */
        patch: operations["UsersController_unblock"];
        trace?: never;
    };
    "/tekoapp-backend/api/professionals": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtener lista de profesionales con filtros */
        get: operations["ProfessionalsController_getProfessionals"];
        put?: never;
        /** Registrar un nuevo profesional */
        post: operations["ProfessionalsController_registerProfessional"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/professionals/nearby": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtener profesionales cercanos por ubicación */
        get: operations["ProfessionalsController_getNearbyProfessionals"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/professionals/search/skills": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Buscar profesionales por habilidades */
        get: operations["ProfessionalsController_searchBySkills"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/professionals/top-rated": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtener profesionales mejor calificados */
        get: operations["ProfessionalsController_getTopRatedProfessionals"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/professionals/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtener el perfil profesional propio del usuario autenticado */
        get: operations["ProfessionalsController_getMyProfessionalProfile"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/professionals/reference/{referenceId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtener un profesional por su referenceId */
        get: operations["ProfessionalsController_getProfessionalByReference"];
        /** Actualizar perfil de profesional por referenceId */
        put: operations["ProfessionalsController_updateProfessionalByReference"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/professionals/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtener un profesional por ID */
        get: operations["ProfessionalsController_getProfessionalById"];
        /** Actualizar perfil de profesional */
        put: operations["ProfessionalsController_updateProfessional"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/professionals/{id}/availability": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Actualizar disponibilidad del profesional */
        post: operations["ProfessionalsController_updateAvailability"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/professionals/{id}/location": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Actualizar ubicación del profesional */
        post: operations["ProfessionalsController_updateLocation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/professionals/{id}/services": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtener servicios del profesional */
        get: operations["ProfessionalsController_getProfessionalServices"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/professionals/{id}/reviews": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtener reseñas del profesional */
        get: operations["ProfessionalsController_getProfessionalReviews"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/professionals/{id}/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtener estadísticas del profesional */
        get: operations["ProfessionalsController_getProfessionalStats"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/professionals/{id}/verify": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Verificar identidad del profesional (solo admin) */
        post: operations["ProfessionalsController_verifyProfessional"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/professionals/{id}/suspend": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Suspender profesional (solo admin) */
        post: operations["ProfessionalsController_suspendProfessional"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/services": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtener lista de servicios con filtros */
        get: operations["ServicesController_getServices"];
        put?: never;
        /** Crear un nuevo servicio */
        post: operations["ServicesController_createService"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/services/nearby": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtener servicios cercanos por ubicación */
        get: operations["ServicesController_getNearbyServices"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/services/my-services": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtener servicios del usuario autenticado */
        get: operations["ServicesController_getMyServices"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/services/dashboard/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtener estadísticas del dashboard */
        get: operations["ServicesController_getDashboardStats"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/services/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtener un servicio por ID */
        get: operations["ServicesController_getServiceById"];
        /** Actualizar un servicio */
        put: operations["ServicesController_updateService"];
        post?: never;
        /** Cancelar un servicio */
        delete: operations["ServicesController_cancelService"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/services/{id}/accept": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Aceptar un servicio (solo profesionales) */
        post: operations["ServicesController_acceptService"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/services/{id}/start": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Iniciar un servicio (solo profesionales) */
        post: operations["ServicesController_startService"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/services/{id}/complete": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Completar un servicio (solo profesionales) */
        post: operations["ServicesController_completeService"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/services/{id}/requests": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtener solicitudes de un servicio */
        get: operations["ServicesController_getServiceRequests"];
        put?: never;
        /** Crear una solicitud para un servicio (solo profesionales) */
        post: operations["ServicesController_createServiceRequest"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/services/{id}/requests/{requestId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Responder a una solicitud de servicio */
        put: operations["ServicesController_respondToServiceRequest"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/service-types": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Listar tipos de servicio activos */
        get: operations["ServiceTypesController_findAll"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/locations/update": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Actualizar ubicación del profesional
         * @description Permite a un proveedor autenticado renovar su posición geográfica.
         */
        post: operations["LocationsController_updateLocation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/locations/nearby": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Buscar profesionales cercanos via Haversine
         * @description Retorna profesionales optimizados basados en radio y disponibilidad.
         */
        get: operations["LocationsController_findNearbyProfessionals"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/locations/professional/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtener coordenadas activas de un profesional */
        get: operations["LocationsController_getProfessionalLocation"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/locations/online-count": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Totalizar profesionales en línea concurrentes */
        get: operations["LocationsController_getOnlineProfessionalsCount"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/locations/area": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Filtrar profesionales inscritos dentro de un área bounding-box cuadrangular */
        get: operations["LocationsController_getProfessionalsByArea"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/locations/distance": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Calcular distancia geodésica escalar entre dos puntos coordenados autónomos */
        get: operations["LocationsController_calculateDistance"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/payments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtener lista de pagos con filtros */
        get: operations["PaymentController_findAll"];
        put?: never;
        /** Crear un nuevo pago */
        post: operations["PaymentController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/payments/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtener resumen de métricas de pagos */
        get: operations["PaymentController_getSummary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/payments/trends": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtener tendencias de pagos */
        get: operations["PaymentController_getTrends"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/payments/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtener un pago por ID */
        get: operations["PaymentController_findOne"];
        /** Actualizar un pago */
        put: operations["PaymentController_update"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/payments/{id}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Cancelar un pago */
        post: operations["PaymentController_cancel"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/payments/{id}/refund": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Reembolsar un pago */
        post: operations["PaymentController_refund"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/payments/methods": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Crear un método de pago */
        post: operations["PaymentController_createMethod"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/payments/methods/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Actualizar un método de pago */
        put: operations["PaymentController_updateMethod"];
        post?: never;
        /** Eliminar un método de pago */
        delete: operations["PaymentController_deleteMethod"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/payments/webhooks/{provider}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Recibir webhook de proveedor de pagos */
        post: operations["PaymentController_handleWebhooks"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/notifications": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtener historial de notificaciones paginado del usuario */
        get: operations["NotificationsController_findAll"];
        put?: never;
        /** Emitir y encolar una nueva notificación */
        post: operations["NotificationsController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/notifications/unread": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Listar las notificaciones no leídas */
        get: operations["NotificationsController_findUnread"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/notifications/unread/count": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtener contador de elementos no leídos */
        get: operations["NotificationsController_getUnreadCount"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/notifications/{id}/read": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Marcar una notificación específica como leída */
        put: operations["NotificationsController_markAsRead"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/notifications/read-all": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Marcar todas las notificaciones del usuario como leídas */
        put: operations["NotificationsController_markAllAsRead"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/notifications/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Remover una notificación del historial */
        delete: operations["NotificationsController_remove"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/promotions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtener todas las promociones */
        get: operations["PromotionsController_findAll"];
        put?: never;
        /** Crear una nueva promoción */
        post: operations["PromotionsController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/promotions/active": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtener promociones activas y vigentes */
        get: operations["PromotionsController_findActive"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/promotions/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtener estadísticas de uso de promociones */
        get: operations["PromotionsController_getStats"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/promotions/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtener una promoción por ID */
        get: operations["PromotionsController_findOne"];
        /** Actualizar una promoción existente */
        put: operations["PromotionsController_update"];
        post?: never;
        /** Desactivar una promoción (soft delete) */
        delete: operations["PromotionsController_remove"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/promotions/validate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Validar un código de promoción sin aplicarlo */
        post: operations["PromotionsController_validatePromotion"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/promotions/apply": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Aplicar una promoción y registrar su uso */
        post: operations["PromotionsController_applyPromotion"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/ratings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtener todas las calificaciones */
        get: operations["RatingsController_findAll"];
        put?: never;
        /** Crear una nueva calificación */
        post: operations["RatingsController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/ratings/professional-to-client": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Calificar a un cliente (profesional autenticado) */
        post: operations["RatingsController_createProfessionalToClientRating"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/ratings/recent": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtener calificaciones recientes */
        get: operations["RatingsController_getRecentRatings"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/ratings/top-professionals": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtener profesionales mejor calificados */
        get: operations["RatingsController_getTopRatedProfessionals"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/ratings/user/{userId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtener calificaciones de un usuario */
        get: operations["RatingsController_findByUser"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/ratings/user/{userId}/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtener estadísticas de calificaciones de un usuario */
        get: operations["RatingsController_getUserRatingStats"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/ratings/professional/{professionalId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtener calificaciones de un profesional */
        get: operations["RatingsController_findByProfessional"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/ratings/professional/{professionalId}/client-ratings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtener calificaciones de clientes a un profesional */
        get: operations["RatingsController_getClientRatings"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/ratings/professional/{professionalId}/average": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtener calificación promedio de un profesional */
        get: operations["RatingsController_getAverageRating"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/ratings/service/{serviceRequestId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtener calificaciones de una solicitud de servicio */
        get: operations["RatingsController_findByServiceRequest"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/ratings/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtener una calificación específica */
        get: operations["RatingsController_findOne"];
        put?: never;
        post?: never;
        /** Eliminar una calificación */
        delete: operations["RatingsController_remove"];
        options?: never;
        head?: never;
        /** Actualizar una calificación */
        patch: operations["RatingsController_update"];
        trace?: never;
    };
    "/tekoapp-backend/api/ratings/{id}/report": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Reportar una calificación */
        post: operations["RatingsController_reportRating"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/categories": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Obtener todas las categorías
         * @description Retorna todas las categorías activas y visibles.
         */
        get: operations["CategoriesController_findAll"];
        put?: never;
        /**
         * Crear nueva categoría
         * @description Crea una nueva categoría de servicios profesionales.
         */
        post: operations["CategoriesController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/categories/all": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Obtener todas las categorías (incluyendo inactivas)
         * @description Retorna todo el árbol de categorías para panel de administración.
         */
        get: operations["CategoriesController_findAllWithRelations"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/categories/main": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Obtener categorías principales
         * @description Retorna raíz de categorías (Filtra las subcategorías).
         */
        get: operations["CategoriesController_findMainCategories"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/categories/subcategories/{parentId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Obtener subcategorías
         * @description Retorna las subcategorías hijas de una categoría raíz.
         */
        get: operations["CategoriesController_findSubcategories"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/categories/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Buscar categorías
         * @description Busca coincidencias por nombre o descripciones indexadas.
         */
        get: operations["CategoriesController_searchCategories"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/categories/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Obtener categoría por ID
         * @description Busca de forma exacta un registro por ID.
         */
        get: operations["CategoriesController_findOne"];
        put?: never;
        post?: never;
        /** Eliminar físicamente una categoría */
        delete: operations["CategoriesController_remove"];
        options?: never;
        head?: never;
        /** Actualizar categoría de forma parcial */
        patch: operations["CategoriesController_update"];
        trace?: never;
    };
    "/tekoapp-backend/api/categories/slug/{slug}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtener categoría por slug */
        get: operations["CategoriesController_findBySlug"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/categories/{id}/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtener métricas y contadores de la categoría */
        get: operations["CategoriesController_getCategoryStats"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/categories/{id}/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Mutar estado transaccional de una categoría */
        patch: operations["CategoriesController_changeStatus"];
        trace?: never;
    };
    "/tekoapp-backend/api/categories/{id}/toggle-visibility": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Invertir bandera de visibilidad pública */
        patch: operations["CategoriesController_toggleVisibility"];
        trace?: never;
    };
    "/tekoapp-backend/api/v1/uploads/image": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Sube una imagen y la almacena en S3. Optimiza con Sharp si está disponible. */
        post: operations["UploadsController_uploadImage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/v1/uploads/document": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Sube un documento (PDF, Word) y lo almacena en S3. */
        post: operations["UploadsController_uploadDocument"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/v1/uploads/avatar": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Sube un avatar (solo imágenes). Crea thumbnail 150x150 automáticamente. */
        post: operations["UploadsController_uploadAvatar"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/v1/uploads/merchant-docs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Sube documentos de onboarding de merchant a S3 y actualiza los datos de documento del usuario. */
        post: operations["UploadsController_uploadMerchantDocs"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/v1/uploads/presigned-url": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Genera una URL presignada de acceso temporal para un archivo en S3. */
        get: operations["UploadsController_getPresignedUrl"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/v1/uploads/info/{filename}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["UploadsController_getFileInfo"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/v1/uploads/{filename}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Elimina un archivo de S3 por su clave. */
        delete: operations["UploadsController_deleteFile"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/analytics/dashboard": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Obtener métricas globales consolidadas del panel de control (Dashboard) */
        get: operations["AnalyticsController_getDashboardStats"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tekoapp-backend/api/analytics/categories": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Listar rendimiento financiero y operativo ordenado por categorías */
        get: operations["AnalyticsController_getCategoryPerformance"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        LoginUserDTO: {
            /**
             * @description Email del usuario.
             * @example user@example.com
             */
            email: string;
            /**
             * Format: password
             * @description Contraseña encriptada del usuario.
             * @example hashedPassword123
             */
            encryptedPassword: string;
            /**
             * @description Mantener la sesion activa.
             * @example true
             */
            rememberMe: boolean;
        };
        LoginUserResponseDTO: {
            /**
             * @description Indica si el login fue exitoso.
             * @example true
             */
            login: boolean;
            /**
             * @description Token de acceso JWT.
             * @example eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
             */
            accessToken?: string;
            /**
             * @description Token de refresco JWT.
             * @example eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
             */
            refreshToken?: string;
            /**
             * @description Indica si el usuario necesita crear una nueva contraseña.
             * @example false
             */
            requiredNewPassword?: boolean;
        };
        UnauthorizedException: Record<string, never>;
        CreatePasswordDTO: {
            /**
             * @description Email del usuario
             * @example usuario@example.com
             */
            email: string;
            /**
             * @description Contraseña encriptada
             * @example encryptedPasswordString
             */
            encryptedPassword: string;
            /**
             * @description Token de verificación enviado por email
             * @example eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
             */
            token: string;
        };
        UpdateUserPasswordDTO: {
            /**
             * @description Email del usuario.
             * @example user@example.com
             */
            email: string;
            /**
             * Format: password
             * @description Contraseña actual encriptada del usuario.
             * @example oldPassword123
             */
            encryptedOldPassword: string;
            /**
             * Format: password
             * @description Nueva contraseña encriptada del usuario.
             * @example newPassword456
             */
            encryptedNewPassword: string;
        };
        ForgotUserPasswordDTO: {
            /**
             * @description Token temporal enviado por email para recuperación.
             * @example eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
             */
            token: string;
            /**
             * Format: password
             * @description Nueva contraseña del usuario encriptado.
             * @example newPassword123
             */
            encryptedNewPassword: string;
            /**
             * Format: password
             * @description Confirmación de la nueva contraseña encriptada.
             * @example newPassword123
             */
            encryptedConfirmPassword: string;
        };
        RoleScopeDTO: {
            /** @example merchant-admin */
            name: string;
            /** @example Administrador del comercio */
            description: string | null;
        };
        PermissionScopeDTO: {
            /** @example dashboard:read */
            name: string;
        };
        UserScopeResponseDTO: {
            /**
             * @example {
             *       "id": "123e4567-e89b-12d3-a456-426614174000",
             *       "email": "user@example.com",
             *       "firstName": "John",
             *       "lastName": "Doe",
             *       "status": "ACTIVE",
             *       "profileStatus": "COMPLETE",
             *       "isEmployee": false,
             *       "documentType": "CI",
             *       "documentNumber": "12345678",
             *       "phoneNumber": "+595981234567"
             *     }
             */
            user: Record<string, never>;
            roles: components["schemas"]["RoleScopeDTO"][];
            permissions: components["schemas"]["PermissionScopeDTO"][];
        };
        EmailSendRequestDTO: {
            /**
             * @description Email del usuario.
             * @example user@example.com
             */
            email: string;
        };
        PasswordOnlyMessageResponseDTO: {
            /** @description Mensaje descriptivo del resultado de la operación */
            message: string;
        };
        CreateRoleRequestDTO: {
            /**
             * @description Nombre único del rol (formato PascalCase)
             * @example MerchantAdmin
             */
            name: string;
            /**
             * @description Descripción del rol
             * @example Administrador del comercio con acceso completo
             */
            description?: string;
        };
        RoleResponseDTO: {
            /**
             * @description ID del rol
             * @example 1
             */
            id: number;
            /**
             * @description Nombre del rol
             * @example MerchantAdmin
             */
            name: string;
            /**
             * @description Nombre en pantalla del rol
             * @example Administrador de comercio
             */
            displayName: string;
            /**
             * @description Descripción del rol
             * @example Administrador del comercio con acceso completo
             */
            description: string | null;
            /**
             * @description Estado del rol
             * @example true
             */
            isActive: boolean;
            /**
             * Format: date-time
             * @description Fecha de creación
             * @example 2024-01-15T10:30:00Z
             */
            createdAt: string;
            /**
             * @description Usuario que creó el rol
             * @example admin@correo.com.py
             */
            createdBy: string;
            /**
             * Format: date-time
             * @description Fecha de última modificación
             * @example 2024-01-20T14:45:00Z
             */
            lastChangedAt: string | null;
            /**
             * @description Usuario que modificó por última vez
             * @example admin@correo.com.py
             */
            lastChangedBy: string | null;
        };
        RoleListResponseDTO: {
            /** @description Lista de roles */
            roles: components["schemas"]["RoleResponseDTO"][];
            /**
             * @description Total de roles
             * @example 15
             */
            total: number;
            /**
             * @description Roles activos
             * @example 10
             */
            active: number;
            /**
             * @description Roles inactivos
             * @example 5
             */
            inactive: number;
        };
        UpdateRoleRequestDTO: {
            /**
             * @description Nombre del rol (formato PascalCase)
             * @example MerchantAdmin
             */
            name?: string;
            /**
             * @description Descripción del rol
             * @example Administrador del comercio con acceso completo
             */
            description?: string;
            /**
             * @description Estado del rol (activo/inactivo)
             * @example true
             */
            isActive?: boolean;
        };
        RoleItemDTO: {
            /**
             * @description ID del rol
             * @example 1
             */
            id: number;
        };
        AssignRolesToUserRequestDTO: {
            /**
             * @description Lista de roles a asignar al usuario. Se reemplazarán los roles actuales por estos.
             * @example [
             *       {
             *         "id": 1
             *       },
             *       {
             *         "id": 2
             *       }
             *     ]
             */
            roles: components["schemas"]["RoleItemDTO"][];
        };
        AssignedRoleDTO: {
            /**
             * @description ID del rol
             * @example 1
             */
            id: number;
            /**
             * @description Nombre del rol
             * @example MerchantAdmin
             */
            name: string;
            /**
             * @description Nombre para mostrar del permiso
             * @example Leer clientes
             */
            displayName: string;
            /**
             * @description Si fue asignado exitosamente
             * @example true
             */
            assigned: boolean;
            /**
             * @description Mensaje de estado
             * @example Rol asignado correctamente
             */
            message: string | null;
        };
        UserRoleAssignmentResponseDTO: {
            /**
             * @description Indica si la operación fue exitosa
             * @example true
             */
            success: boolean;
            /**
             * @description ID del usuario
             * @example 10
             */
            userId: number;
            /**
             * @description Email del usuario
             * @example user@correo.com.py
             */
            userEmail: string;
            /**
             * @description Nombre completo del usuario
             * @example Juan Pérez
             */
            userName: string;
            /**
             * @description Detalle de roles asignados
             * @example [
             *       {
             *         "id": 1,
             *         "name": "MerchantAdmin",
             *         "assigned": true,
             *         "message": "Rol asignado correctamente"
             *       }
             *     ]
             */
            roles: components["schemas"]["AssignedRoleDTO"][];
            /**
             * @description Total de roles procesados
             * @example 2
             */
            totalProcessed: number;
            /**
             * @description Roles asignados exitosamente
             * @example 2
             */
            successfulAssignments: number;
            /**
             * @description Roles que fallaron
             * @example 0
             */
            failedAssignments: number;
            /**
             * Format: date-time
             * @description Fecha de la operación
             * @example 2024-01-26T10:30:00Z
             */
            assignedAt: string;
            /**
             * @description Usuario que realizó la asignación
             * @example admin@correo.com.py
             */
            assignedBy: string;
        };
        RoleSummaryDTO: {
            /**
             * @description ID del rol
             * @example 1
             */
            id: number;
            /**
             * @description Nombre del rol
             * @example MerchantAdmin
             */
            name: string;
            /**
             * @description Nombre para mostrar del permiso
             * @example Leer clientes
             */
            displayName: string;
            /**
             * @description Descripción del rol
             * @example Administrador del comercio
             */
            description: string | null;
            /**
             * @description Estado del rol
             * @example true
             */
            isActive: boolean;
        };
        PermissionSummaryDTO: {
            /**
             * @description ID del permiso
             * @example 1
             */
            id: number;
            /**
             * @description Nombre del permiso
             * @example customers:read
             */
            name: string;
            /**
             * @description Nombre para mostrar del permiso
             * @example Leer clientes
             */
            displayName: string;
            /**
             * @description Origen del permiso: "directo" o nombre del rol
             * @example directo
             */
            source: string;
        };
        UserWithRolesResponseDTO: {
            /**
             * @description ID del usuario
             * @example 10
             */
            userId: number;
            /**
             * @description Email del usuario
             * @example user@correo.com.py
             */
            email: string;
            /**
             * @description Nombre del usuario
             * @example Juan
             */
            firstName: string;
            /**
             * @description Apellido del usuario
             * @example Pérez
             */
            lastName: string;
            /**
             * @description Roles asignados al usuario
             * @example [
             *       {
             *         "id": 1,
             *         "name": "MerchantAdmin",
             *         "description": "Administrador del comercio",
             *         "isActive": true
             *       }
             *     ]
             */
            roles: components["schemas"]["RoleSummaryDTO"][];
            /**
             * @description Permisos directos del usuario
             * @example [
             *       {
             *         "id": 5,
             *         "name": "reports:export",
             *         "source": "directo"
             *       }
             *     ]
             */
            directPermissions: components["schemas"]["PermissionSummaryDTO"][];
            /**
             * @description Todos los permisos (roles + directos)
             * @example [
             *       {
             *         "id": 1,
             *         "name": "customers:read",
             *         "source": "MerchantAdmin"
             *       },
             *       {
             *         "id": 2,
             *         "name": "customers:update",
             *         "source": "MerchantAdmin"
             *       },
             *       {
             *         "id": 5,
             *         "name": "reports:export",
             *         "source": "directo"
             *       }
             *     ]
             */
            allPermissions: components["schemas"]["PermissionSummaryDTO"][];
            /**
             * @description Cantidad de roles asignados
             * @example 2
             */
            rolesCount: number;
            /**
             * @description Cantidad total de permisos (incluyendo heredados)
             * @example 8
             */
            permissionsCount: number;
        };
        PermissionItemDTO: {
            /**
             * @description ID del permiso
             * @example 1
             */
            id: number;
            /**
             * @description Nombre del permiso (opcional, solo para claridad)
             * @example reports:export
             */
            name?: string;
        };
        AssignPermissionsToUserRequestDTO: {
            /**
             * @description Lista de permisos directos a asignar al usuario
             * @example [
             *       {
             *         "id": 5,
             *         "name": "reports:export"
             *       },
             *       {
             *         "id": 6,
             *         "name": "analytics:read"
             *       }
             *     ]
             */
            permissions: components["schemas"]["PermissionItemDTO"][];
        };
        AssignedPermissionDTO: {
            /**
             * @description ID del permiso
             * @example 1
             */
            id: number;
            /**
             * @description Nombre del permiso
             * @example reports:export
             */
            name: string;
            /**
             * @description Nombre para mostrar del permiso
             * @example Leer clientes
             */
            displayName: string;
            /**
             * @description Si fue asignado exitosamente
             * @example true
             */
            assigned: boolean;
            /**
             * @description Mensaje de estado
             * @example Permiso directo asignado correctamente
             */
            message: string | null;
        };
        UserPermissionAssignmentResponseDTO: {
            /**
             * @description Indica si la operación fue exitosa
             * @example true
             */
            success: boolean;
            /**
             * @description ID del usuario
             * @example 10
             */
            userId: number;
            /**
             * @description Email del usuario
             * @example user@correo.com.py
             */
            userEmail: string;
            /**
             * @description Nombre completo del usuario
             * @example Juan Pérez
             */
            userName: string;
            /**
             * @description Detalle de permisos directos asignados
             * @example [
             *       {
             *         "id": 5,
             *         "name": "reports:export",
             *         "assigned": true,
             *         "message": "Permiso directo asignado correctamente"
             *       }
             *     ]
             */
            permissions: components["schemas"]["AssignedPermissionDTO"][];
            /**
             * @description Total de permisos procesados
             * @example 2
             */
            totalProcessed: number;
            /**
             * @description Permisos asignados exitosamente
             * @example 2
             */
            successfulAssignments: number;
            /**
             * @description Permisos que fallaron
             * @example 0
             */
            failedAssignments: number;
            /**
             * Format: date-time
             * @description Fecha de la operación
             * @example 2024-01-26T10:30:00Z
             */
            assignedAt: string;
            /**
             * @description Usuario que realizó la asignación
             * @example admin@correo.com.py
             */
            assignedBy: string;
        };
        OnboardingUserRequestDTO: {
            /**
             * @description El primer nombre del usuario.
             * @example John
             */
            firstName: string;
            /**
             * @description El apellido del usuario.
             * @example Doe
             */
            lastName: string;
            /**
             * @description El correo electrónico del usuario, que será su identificador único.
             * @example user@example.com
             */
            email: string;
            /**
             * @description El telefono del usuario.
             * @example 0981234567
             */
            phoneNumber: string;
            /**
             * Format: password
             * @description Contraseña del usuario (encriptada con RSA-OAEP).
             * @example Base64EncodedEncryptedPassword==
             */
            password: string;
            /**
             * Format: password
             * @description Confirmación de contraseña del usuario (encriptada con RSA-OAEP).
             * @example Base64EncodedEncryptedPassword==
             */
            confirmPassword: string;
            /**
             * @description Aceptación de términos y condiciones
             * @example true
             */
            acceptTerms: boolean;
        };
        OnboardingUserResponseDTO: {
            /**
             * @description Identificador público del usuario, generado como UUID v4. Puede ser usado en el frontend o APIs públicas sin exponer el ID interno.
             * @example 3fa85f64-5717-4562-b3fc-2c963f66afa6
             */
            referenceId: string;
            /**
             * @description Correo electrónico registrado del usuario.
             * @example user@example.com
             */
            email: string;
            /**
             * @description Estado del usuario. Indica si completó el registro y/o la verificación de email.
             * @example PENDING_VERIFICATION
             * @enum {string}
             */
            status: "ACTIVE" | "BLOCKED" | "DELETED" | "INACTIVE" | "REFUSED" | "PENDING_VERIFICATION";
        };
        UserResponseDTO: {
            /** @example 1 */
            id: number;
            /** @example a1b2c3d4-e5f6-7890-abcd-ef1234567890 */
            referenceId: string;
            /** @example user@example.com */
            email: string;
            /**
             * @example ACTIVE
             * @enum {string}
             */
            status: "ACTIVE" | "BLOCKED" | "DELETED" | "INACTIVE" | "REFUSED" | "PENDING_VERIFICATION";
            /** @example John */
            firstName: string;
            /** @example Doe */
            lastName: string;
            /** @example 12345678 */
            documentNumber?: string;
            /** @example +595991234567 */
            phoneNumber?: string;
            /** @example true */
            isEmployee: boolean;
            /** @example false */
            isLdap: boolean;
            /**
             * Format: date-time
             * @example 2024-06-16T10:20:30Z
             */
            lastLogin: string;
            /** @example admin@example.com */
            createdBy?: string;
            /**
             * Format: date-time
             * @example 2024-06-17T14:00:00Z
             */
            createdAt: string;
            /** @example editor@example.com */
            lastChangedBy?: string;
            /**
             * Format: date-time
             * @example 2024-06-17T14:30:00Z
             */
            lastChangedAt?: string;
            /** @example user+alt@example.com */
            unverifiedEmail?: string;
            /** @example Updated profile picture */
            changedReason?: string;
        };
        PaginationMetaDTO: {
            /** @example 100 */
            total: number;
            /** @example 1 */
            page: number;
            /** @example 10 */
            pageSize: number;
            /** @example 10 */
            totalPages: number;
        };
        UsersListResponseDTO: {
            data: components["schemas"]["UserResponseDTO"][];
            pagination: components["schemas"]["PaginationMetaDTO"];
        };
        EditContextUserResponseDTO: {
            /** @example 1 */
            id: number;
            /** @example aafda-213413-adfasdf */
            referenceId: string;
            /** @example John */
            firstName: string;
            /** @example Doe */
            lastName: string;
            /** @example john.doe@example.com */
            email: string;
            /** @example 1234567 */
            documentNumber?: string;
            /** @example +595972425689 */
            phoneNumber?: string;
            /**
             * @example ACTIVE
             * @enum {string}
             */
            status: "ACTIVE" | "BLOCKED" | "DELETED" | "INACTIVE" | "REFUSED" | "PENDING_VERIFICATION";
            /** @example false */
            isEmployee: boolean;
            /** @example false */
            isLdap: boolean;
            /** @example Cambios varios */
            changedReason?: string;
        };
        EditContextRoleDTO: {
            /** @example 1 */
            id: number;
            /** @example admin */
            name: string;
            /** @example Usuario estandar */
            displayName?: string;
            /** @example Role con permisos estandar */
            description?: string;
        };
        EditContextRolesResponseDTO: {
            assigned: components["schemas"]["EditContextRoleDTO"][];
            available: components["schemas"]["EditContextRoleDTO"][];
        };
        GetEditContextResponseDTO: {
            user: components["schemas"]["EditContextUserResponseDTO"];
            roles: components["schemas"]["EditContextRolesResponseDTO"];
        };
        EditContextUserDTO: {
            /** @example John */
            firstName: string;
            /** @example Doe */
            lastName: string;
            /** @example user@example.com */
            email: string;
            /** @example 4.123.456 */
            documentNumber?: string;
            /**
             * @example ACTIVE
             * @enum {string}
             */
            status: "ACTIVE" | "BLOCKED" | "DELETED" | "INACTIVE" | "REFUSED" | "PENDING_VERIFICATION";
            /** @example false */
            isEmployee: boolean;
            /** @example false */
            isLdap: boolean;
            /** @example Corrección de datos */
            changedReason?: string;
        };
        EditContextAccessDTO: {
            /** @example 1 */
            level: number;
            /**
             * @example [
             *       "1",
             *       "2"
             *     ]
             */
            branchCodes: string[];
        };
        UpdateEditContextRequestDTO: {
            user?: components["schemas"]["EditContextUserDTO"];
            /**
             * @example [
             *       1,
             *       2
             *     ]
             */
            roleIds?: number[];
            access?: components["schemas"]["EditContextAccessDTO"];
        };
        UpdateEditContextResponseDTO: {
            /** @example Usuario actualizado correctamente */
            message: string;
        };
        UpdateUserRequestDTO: {
            /**
             * @description El correo electrónico del usuario.
             * @example user@example.com
             */
            email?: string;
            /**
             * @description El primer nombre del usuario.
             * @example John
             */
            firstName?: string;
            /**
             * @description El apellido del usuario.
             * @example Doe
             */
            lastName?: string;
            /**
             * @description Indica si el usuario es un empleado.
             * @example true
             */
            isEmployee?: boolean;
            /**
             * @description Indica si el usuario está autenticado vía LDAP.
             * @example false
             */
            isLdap?: boolean;
            /**
             * @description El estado del usuario.
             * @example ACTIVE
             * @enum {string}
             */
            status?: "ACTIVE" | "BLOCKED" | "DELETED" | "INACTIVE" | "REFUSED" | "PENDING_VERIFICATION";
            /**
             * @description El número de documento del usuario.
             * @example 12345678
             */
            documentNumber?: string;
            /**
             * @description El número de teléfono del usuario.
             * @example +595991234567
             */
            phoneNumber?: string;
            /**
             * @description ID del usuario en el sistema legacy.
             * @example legacy-123
             */
            legacyUserId?: string;
            /**
             * @description El nivel de acceso del usuario.
             * @example 1
             */
            accessLevelId?: number;
            /**
             * @description El tipo de documento usuario.
             * @example 1
             */
            documentType?: number;
            /**
             * Format: date-time
             * @description La fecha y hora de la última modificación.
             * @example 2024-06-16T10:20:30Z
             */
            lastChangedAt?: string;
            /**
             * @description El usuario que realizó la última modificación.
             * @example admin@example.com
             */
            lastChangedBy?: string;
            /**
             * @description Razón por la cual se realizó la última modificación.
             * @example Cantidad de login fallidos superados
             */
            changedReason?: string;
        };
        BlockUserRequestDTO: {
            /**
             * @description Motivo del bloqueo del usuario
             * @example Se detectaron intentos de acceso sospechosos
             */
            reason: string;
        };
        UnblockUserRequestDTO: {
            /**
             * @description Motivo del desbloqueo del usuario
             * @example Se validó identidad y se restableció acceso
             */
            reason: string;
        };
        CreateProfessionalRequestDTO: {
            /**
             * @description ID de la categoría principal
             * @example 1
             */
            categoryId: number;
            /**
             * @description Descripción del perfil profesional
             * @example Electricista con 10 años de experiencia
             */
            description: string;
            /**
             * @description Tarifa por hora
             * @example 50
             */
            hourlyRate: number;
            /**
             * @description Tarifa fija por servicio
             * @example 200
             */
            fixedRate?: number;
            /**
             * @description Habilidades del profesional
             * @example [
             *       "electricidad",
             *       "iluminación"
             *     ]
             */
            skills?: string[];
            /**
             * @description Certificaciones
             * @example [
             *       "IRAM 2020"
             *     ]
             */
            certifications?: string[];
            /**
             * @description Años de experiencia
             * @example 5
             */
            yearsOfExperience?: number;
        };
        UserSummaryResponseDTO: {
            /** @example 1 */
            id: number;
            /** @example juan@example.com */
            email: string;
            /** @example Juan */
            firstName: string;
            /** @example Pérez */
            lastName: string;
            /** @example +595981234567 */
            phoneNumber?: string;
        };
        CategorySummaryResponseDTO: {
            /** @example 1 */
            id: number;
            /** @example Plomería */
            name: string;
            /** @example plomeria */
            slug: string;
            /** @example wrench */
            icon?: string;
            /** @example #FF5733 */
            color?: string;
        };
        ProfessionalDetailResponseDTO: {
            /** @example 1 */
            id: number;
            /** @example a1b2c3d4-e5f6-7890-abcd-ef1234567890 */
            referenceId: string;
            /** @example 5 */
            userId: number;
            /** @example 2 */
            categoryId: number;
            /** @example Plomero con 10 años de experiencia */
            description: string;
            /** @example 50000 */
            hourlyRate: number;
            /** @example 200000 */
            fixedRate?: number;
            /**
             * @example [
             *       "plomería",
             *       "gasfitería"
             *     ]
             */
            skills: string[];
            /**
             * @example [
             *       "Certificado SENAI"
             *     ]
             */
            certifications: string[];
            /** @example 10 */
            yearsOfExperience: number;
            /**
             * @example APPROVED
             * @enum {string}
             */
            status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
            /** @example true */
            isAvailable: boolean;
            /** @example false */
            isOnline: boolean;
            /** @example verified */
            verificationStatus: string;
            /** @example -25.2637 */
            currentLatitude?: number;
            /** @example -57.5759 */
            currentLongitude?: number;
            /** Format: date-time */
            lastLocationUpdate?: string;
            /** @example 42 */
            totalServices: number;
            /** @example 4.8 */
            averageRating: number;
            /** @example 35 */
            totalRatings: number;
            /** Format: date-time */
            createdAt: string;
            user: components["schemas"]["UserSummaryResponseDTO"];
            category: components["schemas"]["CategorySummaryResponseDTO"];
        };
        PaginationResponseDTO: {
            /**
             * @description Total de elementos encontrados.
             * @example 100
             */
            total: number;
            /**
             * @description Pagina para paginación de resultados (opcional, por defecto 1)
             * @example 1
             */
            page: number;
            /**
             * @description Pagina para paginación de resultados (opcional, por defecto 1).
             * @example 2
             */
            pageSize: number;
            /**
             * @description Total de paginas disponibles.
             * @example 2
             */
            totalPages: number;
        };
        ProfessionalsListResponseDTO: {
            data: components["schemas"]["ProfessionalDetailResponseDTO"][];
            pagination: components["schemas"]["PaginationResponseDTO"];
        };
        UpdateProfessionalRequestDTO: {
            /**
             * @description ID de la categoría principal
             * @example 1
             */
            categoryId?: number;
            /** @description Descripción del perfil profesional */
            description?: string;
            /**
             * @description Tarifa por hora
             * @example 50
             */
            hourlyRate?: number;
            /**
             * @description Tarifa fija por servicio
             * @example 200
             */
            fixedRate?: number;
            /** @description Habilidades del profesional */
            skills?: string[];
            /** @description Certificaciones */
            certifications?: string[];
            /**
             * @description Años de experiencia
             * @example 5
             */
            yearsOfExperience?: number;
        };
        UpdateAvailabilityRequestDTO: {
            /**
             * @description Estado de disponibilidad del profesional
             * @example true
             */
            isAvailable: boolean;
        };
        UpdateProfessionalLocationRequestDTO: {
            /**
             * @description Latitud actual
             * @example -25.2637
             */
            latitude: number;
            /**
             * @description Longitud actual
             * @example -57.5759
             */
            longitude: number;
        };
        ServiceSummaryResponseDTO: {
            /** @example uuid-string */
            id: string;
            /** @example Instalación de tuberías */
            title: string;
            /** @example Reparación completa del sistema de agua */
            description: string;
            /**
             * @example COMPLETED
             * @enum {string}
             */
            status: "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
            /** @example 150000 */
            totalAmount?: number;
            /** @example 145000 */
            finalAmount?: number;
            /** Format: date-time */
            scheduledAt?: string;
            /** Format: date-time */
            createdAt: string;
        };
        ProfessionalServicesListResponseDTO: {
            data: components["schemas"]["ServiceSummaryResponseDTO"][];
            pagination: components["schemas"]["PaginationResponseDTO"];
        };
        ReviewSummaryResponseDTO: {
            /** @example uuid-string */
            id: string;
            /** @example 3 */
            userId: number;
            /** @example 4.5 */
            rating: number;
            /** @example Excelente trabajo, muy puntual */
            review?: string;
            /**
             * @example CLIENT_TO_PROFESSIONAL
             * @enum {string}
             */
            type: "CLIENT_TO_PROFESSIONAL" | "PROFESSIONAL_TO_CLIENT";
            /** @example false */
            isAnonymous: boolean;
            /** Format: date-time */
            createdAt: string;
            user?: components["schemas"]["UserSummaryResponseDTO"];
        };
        ProfessionalReviewsListResponseDTO: {
            data: components["schemas"]["ReviewSummaryResponseDTO"][];
            pagination: components["schemas"]["PaginationResponseDTO"];
        };
        ProfessionalStatsResponseDTO: {
            /** @example 42 */
            totalServices: number;
            /** @example 38 */
            completedServices: number;
            /** @example 5700000 */
            totalEarnings: number;
            /** @example 4.8 */
            averageRating: number;
            /** @example 35 */
            totalRatings: number;
        };
        VerifyProfessionalRequestDTO: {
            /**
             * @description true = verificado, false = rechazado
             * @example true
             */
            isVerified: boolean;
            /** @description Notas del proceso de verificación */
            notes?: string;
        };
        SuspendProfessionalRequestDTO: {
            /**
             * @description Motivo de la suspensión
             * @example Conducta inapropiada reportada
             */
            reason: string;
        };
        CreateServiceRequestDTO: {
            /** @description Título del servicio */
            title: string;
            /** @description Descripción detallada del servicio */
            description: string;
            /** @description ID de la categoría del servicio (Int) */
            categoryId: number;
            /** @description ID del tipo de servicio (Int) */
            serviceTypeId: number;
            /** @description Horas estimadas (para servicios por hora) */
            estimatedHours?: number;
            /** @description Tarifa por hora */
            hourlyRate?: number;
            /** @description Precio fijo */
            fixedPrice?: number;
            /** @description Latitud de la ubicación del servicio */
            latitude: number;
            /** @description Longitud de la ubicación del servicio */
            longitude: number;
            /** @description Dirección del servicio */
            address: string;
            /** @description Notas adicionales */
            additionalNotes?: string;
            /** @description URLs de imágenes del servicio */
            images?: string[];
            /** @description Indica si el servicio es urgente */
            isUrgent?: boolean;
            /** @description Fecha y hora programada para el servicio */
            scheduledAt?: string;
        };
        ServiceUserSummaryResponseDTO: {
            /** @example 1 */
            id: number;
            /** @example a1b2c3d4-e5f6-7890-abcd-ef1234567890 */
            referenceId: string;
            /** @example juan@example.com */
            email: string;
            /** @example Juan */
            firstName: string;
            /** @example Pérez */
            lastName: string;
            /** @example +595981234567 */
            phoneNumber?: string;
        };
        ServiceProfessionalSummaryResponseDTO: {
            /** @example 2 */
            id: number;
            /** @example b2c3d4e5-f6a7-8901-bcde-f12345678901 */
            referenceId: string;
            user: components["schemas"]["ServiceUserSummaryResponseDTO"];
        };
        ServiceCategorySummaryResponseDTO: {
            /** @example 1 */
            id: number;
            /** @example Plomería */
            name: string;
            /** @example plomeria */
            slug: string;
            /** @example wrench */
            icon?: string;
            /** @example #FF5733 */
            color?: string;
        };
        ServiceDetailResponseDTO: {
            /** @example a63b5212-db5e-4ef5-9614-726614174000 */
            id: string;
            /** @example 1 */
            userId: number;
            /** @example 2 */
            professionalId?: number;
            /** @example 3 */
            categoryId: number;
            /** @example 4 */
            serviceTypeId: number;
            /** @example Reparación de cañería */
            title: string;
            /** @example Se necesita reparar una cañería rota en el baño */
            description: string;
            /**
             * @example PENDING
             * @enum {string}
             */
            status: "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
            /** @example 2.5 */
            estimatedHours?: number;
            /** @example 2 */
            actualHours?: number;
            /** @example 50000 */
            hourlyRate?: number;
            /** @example 150000 */
            fixedPrice?: number;
            /** @example 125000 */
            totalAmount?: number;
            /** @example 100000 */
            finalAmount?: number;
            /** @example -25.2637 */
            latitude: number;
            /** @example -57.5759 */
            longitude: number;
            /** @example Av. España 1234, Asunción */
            address: string;
            /** @example Tocar el timbre del primer piso */
            additionalNotes?: string;
            /**
             * @example [
             *       "https://example.com/img1.jpg"
             *     ]
             */
            images: string[];
            /** @example false */
            isUrgent: boolean;
            /** Format: date-time */
            scheduledAt?: string;
            /** Format: date-time */
            startedAt?: string;
            /** Format: date-time */
            completedAt?: string;
            /** Format: date-time */
            cancelledAt?: string;
            /** @example El cliente canceló */
            cancellationReason?: string;
            /** Format: date-time */
            createdAt: string;
            users: components["schemas"]["ServiceUserSummaryResponseDTO"];
            professional?: components["schemas"]["ServiceProfessionalSummaryResponseDTO"];
            category?: components["schemas"]["ServiceCategorySummaryResponseDTO"];
        };
        ServicesListResponseDTO: {
            /** @description Lista de servicios */
            data: components["schemas"]["ServiceDetailResponseDTO"][];
            pagination: components["schemas"]["PaginationResponseDTO"];
        };
        ServiceStatsResponseDTO: {
            /** @example 15 */
            total: number;
            /** @example 5 */
            pending: number;
            /** @example 3 */
            inProgress: number;
            /** @example 6 */
            completed: number;
            /** @example 1 */
            cancelled: number;
            /** @example 750000 */
            totalEarnings: number;
        };
        UpdateServiceRequestDTO: {
            /** @description Título del servicio */
            title?: string;
            /** @description Descripción detallada del servicio */
            description?: string;
            /** @description ID de la categoría del servicio (Int) */
            categoryId?: number;
            /** @description ID del tipo de servicio (Int) */
            serviceTypeId?: number;
            /** @description Horas estimadas (para servicios por hora) */
            estimatedHours?: number;
            /** @description Tarifa por hora */
            hourlyRate?: number;
            /** @description Precio fijo */
            fixedPrice?: number;
            /** @description Latitud de la ubicación del servicio */
            latitude?: number;
            /** @description Longitud de la ubicación del servicio */
            longitude?: number;
            /** @description Dirección del servicio */
            address?: string;
            /** @description Notas adicionales */
            additionalNotes?: string;
            /** @description URLs de imágenes del servicio */
            images?: string[];
            /** @description Indica si el servicio es urgente */
            isUrgent?: boolean;
            /** @description Fecha y hora programada para el servicio */
            scheduledAt?: string;
        };
        CancelServiceRequestDTO: {
            /**
             * @description Motivo de la cancelación
             * @example El cliente canceló la solicitud
             */
            reason: string;
        };
        CreateServiceRequestRequestDTO: {
            /** @description Precio propuesto por el profesional */
            proposedPrice?: number;
            /** @description Horas propuestas por el profesional */
            proposedHours?: number;
            /** @description Mensaje del profesional al cliente */
            message?: string;
        };
        ServiceRequestDetailResponseDTO: {
            /** @example b72c6323-ec6f-5fg6-a725-837725285111 */
            id: string;
            /** @example a63b5212-db5e-4ef5-9614-726614174000 */
            serviceId: string;
            /** @example 2 */
            professionalId: number;
            /**
             * @example PENDING
             * @enum {string}
             */
            status: "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED";
            /** @example 120000 */
            proposedPrice?: number;
            /** @example 3 */
            proposedHours?: number;
            /** @example Puedo atenderle esta tarde */
            message?: string;
            /** Format: date-time */
            createdAt: string;
        };
        ServiceRequestsListResponseDTO: {
            /** @description Lista de solicitudes del servicio */
            data: components["schemas"]["ServiceRequestDetailResponseDTO"][];
        };
        RespondServiceRequestRequestDTO: {
            /**
             * @description Estado de la respuesta
             * @enum {string}
             */
            status: "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED";
            /** @description Razón del rechazo (si aplica) */
            reason?: string;
        };
        ServiceTypeResponseDTO: {
            /** @example 1 */
            id: number;
            /** @example Instalación */
            name: string;
        };
        UpdateLocationRequestDTO: {
            /**
             * @description Latitud de la ubicación actual
             * @example -25.2637
             */
            latitude: number;
            /**
             * @description Longitud de la ubicación actual
             * @example -57.5759
             */
            longitude: number;
            /**
             * @description Precisión de la ubicación en metros
             * @example 10
             */
            accuracy?: number;
            /**
             * @description Velocidad del movimiento en m/s
             * @example 5.2
             */
            speed?: number;
            /**
             * @description Dirección del movimiento en grados
             * @example 180
             */
            heading?: number;
        };
        ProfessionalLocationResponseDTO: {
            /**
             * @description Latitud geográfica registrada
             * @example -25.2637
             */
            latitude: number;
            /**
             * @description Longitud geográfica registrada
             * @example -57.5759
             */
            longitude: number;
            /**
             * Format: date-time
             * @description Última estampa de tiempo en la que mutó la coordenada
             * @example 2026-06-07T22:15:30.000Z
             */
            lastUpdate?: string;
        };
        OnlineCountResponseDTO: {
            /**
             * @description Cantidad total consolidada de profesionales activos en línea
             * @example 42
             */
            count: number;
        };
        DistanceResponseDTO: {
            /**
             * @description Métrica escalar lineal resultante calculada
             * @example 4.85
             */
            distance: number;
            /**
             * @description Unidad de medida estándar de la respuesta
             * @example km
             */
            unit: string;
        };
        PaymentDetailsDto: {
            /**
             * @description Últimos 4 dígitos de la tarjeta
             * @example 1234
             */
            cardLast4?: string;
            /**
             * @description Marca de la tarjeta
             * @example visa
             */
            cardBrand?: string;
            /**
             * @description Mes de expiración de la tarjeta
             * @example 12
             */
            cardExpMonth?: number;
            /**
             * @description Año de expiración de la tarjeta
             * @example 2025
             */
            cardExpYear?: number;
            /**
             * @description Nombre del titular de la tarjeta
             * @example Juan Pérez
             */
            cardholderName?: string;
            /**
             * @description Nombre del banco
             * @example Banco Santander
             */
            bankName?: string;
            /**
             * @description Tipo de cuenta bancaria
             * @example checking
             */
            accountType?: string;
            /**
             * @description Últimos 4 dígitos de la cuenta bancaria
             * @example 5678
             */
            accountLast4?: string;
            /**
             * @description Número de ruta bancaria
             * @example 123456789
             */
            routingNumber?: string;
            /**
             * @description Tipo de wallet digital
             * @example paypal
             */
            walletType?: string;
            /**
             * @description Email del wallet digital
             * @example usuario@paypal.com
             */
            walletEmail?: string;
            /**
             * @description Dirección de crypto
             * @example 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6
             */
            cryptoAddress?: string;
            /**
             * @description Red de crypto
             * @example ethereum
             */
            cryptoNetwork?: string;
        };
        CreatePaymentDto: {
            /**
             * @description ID del profesional que recibirá el pago
             * @example 123e4567-e89b-12d3-a456-426614174000
             */
            professionalId: string;
            /**
             * @description ID de la solicitud de servicio
             * @example 123e4567-e89b-12d3-a456-426614174000
             */
            serviceRequestId: string;
            /**
             * @description Monto del pago (sin comisiones ni impuestos)
             * @example 100
             */
            amount: number;
            /**
             * @description Método de pago
             * @example CREDIT_CARD
             * @enum {string}
             */
            paymentMethod: "CASH" | "CREDIT_CARD" | "DEBIT_CARD" | "PREPAID_CARD" | "QR" | "LINK" | "TRANSFER" | "WALLET" | "MOBILE_WALLET" | "CRYPTO";
            /**
             * @description Proveedor de pagos
             * @example STRIPE
             * @enum {string}
             */
            paymentProvider: "STRIPE" | "BANCARD" | "INFONET" | "PAYPAL" | "MERCADO_PAGO" | "RAPIPAGO" | "PAGOFACIL" | "CASH" | "DINELCO" | "BEPSA";
            /**
             * @description ID del método de pago guardado (opcional)
             * @example 123e4567-e89b-12d3-a456-426614174000
             */
            paymentMethodId?: string;
            /**
             * @description Descripción del pago
             * @example Pago por servicio de plomería - Reparación de caño
             */
            description?: string;
            /** @description Detalles del método de pago */
            paymentDetails?: components["schemas"]["PaymentDetailsDto"];
            /**
             * @description Si es un pago recurrente
             * @default false
             * @example false
             */
            isRecurring: boolean;
            /**
             * @description Intervalo de recurrencia (monthly, weekly, etc.)
             * @example monthly
             */
            recurringInterval?: string;
            /**
             * @description Código de moneda ISO 4217
             * @example USD
             */
            currencyCode: string;
            /**
             * @description Metadatos adicionales
             * @example {
             *       "platform": "mobile",
             *       "appVersion": "1.2.0"
             *     }
             */
            metadata?: Record<string, never>;
        };
        PaymentDetailResponseDTO: {
            /** @example f47ac10b-58cc-4372-a567-0e02b2c3d479 */
            id: string;
            /** @example 1 */
            userId: number;
            /** @example 5 */
            professionalId: number;
            /** @example req-uuid-123 */
            serviceRequestId: string;
            /** @example 150000 */
            amount: number;
            /** @example PYG */
            currencyCode: string;
            /** @example 4350 */
            fee: number;
            /** @example 32262 */
            tax: number;
            /** @example 186612 */
            totalAmount: number;
            /**
             * @example PENDING
             * @enum {string}
             */
            status: "PENDING" | "PAID" | "FAILED" | "REFUNDED" | "PARTIAL_REFUNDED" | "CANCELLED" | "PROCESSING" | "COMPLETED";
            /**
             * @example CREDIT_CARD
             * @enum {string}
             */
            paymentMethod: "CASH" | "CREDIT_CARD" | "DEBIT_CARD" | "PREPAID_CARD" | "QR" | "LINK" | "TRANSFER" | "WALLET" | "MOBILE_WALLET" | "CRYPTO";
            /**
             * @example STRIPE
             * @enum {string}
             */
            paymentProvider: "STRIPE" | "BANCARD" | "INFONET" | "PAYPAL" | "MERCADO_PAGO" | "RAPIPAGO" | "PAGOFACIL" | "CASH" | "DINELCO" | "BEPSA";
            /** @example txn-uuid-abc */
            transactionId: string;
            /** @example pi_stripe_123 */
            externalTransactionId?: string;
            /** @example Servicio de plomería */
            description?: string;
            paymentDetails?: Record<string, never>;
            metadata?: Record<string, never>;
            /** Format: date-time */
            processedAt?: string;
            /** Format: date-time */
            failedAt?: string;
            /** Format: date-time */
            paidAt?: string;
            failureReason?: string;
            refundDetails?: Record<string, never>;
            /** @example 0 */
            platformFee: number;
            /** @example 150000 */
            professionalNetAmount?: number;
            /** @example false */
            isRecurring: boolean;
            recurringInterval?: string;
            /** Format: date-time */
            nextPaymentDate?: string;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            lastChangedAt?: string;
        };
        PaymentSummaryResponseDTO: {
            /** @example 120 */
            totalPayments: number;
            /** @example 98 */
            successfulPayments: number;
            /** @example 10 */
            failedPayments: number;
            /** @example 12 */
            pendingPayments: number;
            /** @example 15600000 */
            totalAmount: number;
            /**
             * @description Tasa de éxito en porcentaje
             * @example 81.67
             */
            successRate: number;
            /**
             * @description Monto promedio por pago
             * @example 130000
             */
            averageAmount: number;
        };
        PaymentTrendItemResponseDTO: {
            /** @example 2024-01-15 */
            date: string;
            /** @example 12 */
            count: number;
            /** @example 1560000 */
            amount: number;
        };
        PaymentTrendsResponseDTO: {
            trends: components["schemas"]["PaymentTrendItemResponseDTO"][];
            /**
             * @description Días consultados
             * @example 30
             */
            days: number;
        };
        UpdatePaymentDto: {
            /**
             * @description Monto del pago (sin comisiones ni impuestos)
             * @example 100
             */
            amount?: number;
            /**
             * @description Método de pago
             * @example CREDIT_CARD
             * @enum {string}
             */
            paymentMethod?: "CASH" | "CREDIT_CARD" | "DEBIT_CARD" | "PREPAID_CARD" | "QR" | "LINK" | "TRANSFER" | "WALLET" | "MOBILE_WALLET" | "CRYPTO";
            /**
             * @description Proveedor de pagos
             * @example STRIPE
             * @enum {string}
             */
            paymentProvider?: "STRIPE" | "BANCARD" | "INFONET" | "PAYPAL" | "MERCADO_PAGO" | "RAPIPAGO" | "PAGOFACIL" | "CASH" | "DINELCO" | "BEPSA";
            /**
             * @description ID del método de pago guardado (opcional)
             * @example 123e4567-e89b-12d3-a456-426614174000
             */
            paymentMethodId?: string;
            /**
             * @description Descripción del pago
             * @example Pago por servicio de plomería - Reparación de caño
             */
            description?: string;
            /** @description Detalles del método de pago */
            paymentDetails?: components["schemas"]["PaymentDetailsDto"];
            /**
             * @description Si es un pago recurrente
             * @default false
             * @example false
             */
            isRecurring: boolean;
            /**
             * @description Intervalo de recurrencia (monthly, weekly, etc.)
             * @example monthly
             */
            recurringInterval?: string;
            /**
             * @description Código de moneda ISO 4217
             * @example USD
             */
            currencyCode?: string;
            /**
             * @description Metadatos adicionales
             * @example {
             *       "platform": "mobile",
             *       "appVersion": "1.2.0"
             *     }
             */
            metadata?: Record<string, never>;
        };
        RefundPaymentDto: {
            /**
             * @description Monto a reembolsar (debe ser menor o igual al monto original)
             * @example 100
             */
            amount: number;
            /**
             * @description Motivo del reembolso
             * @example customer_request
             * @enum {string}
             */
            reason: "customer_request" | "duplicate_payment" | "fraud" | "service_not_provided" | "poor_service_quality" | "technical_issue" | "other";
            /**
             * @description Descripción detallada del motivo del reembolso
             * @example El cliente solicitó el reembolso debido a que el servicio no cumplió con las expectativas acordadas
             */
            description?: string;
            /**
             * @description Metadatos adicionales del reembolso
             * @example {
             *       "adminApproved": true,
             *       "customerServiceNotes": "Cliente insatisfecho"
             *     }
             */
            metadata?: Record<string, never>;
        };
        CreatePaymentMethodRequestDTO: {
            /**
             * @description Nombre descriptivo del método de pago
             * @example Tarjeta Visa personal
             */
            name: string;
            /**
             * @description Tipo de método de pago
             * @enum {string}
             */
            type: "CASH" | "CREDIT_CARD" | "DEBIT_CARD" | "PREPAID_CARD" | "QR" | "LINK" | "TRANSFER" | "WALLET" | "MOBILE_WALLET" | "CRYPTO";
            /**
             * @description Proveedor de pagos
             * @enum {string}
             */
            provider: "STRIPE" | "BANCARD" | "INFONET" | "PAYPAL" | "MERCADO_PAGO" | "RAPIPAGO" | "PAGOFACIL" | "CASH" | "DINELCO" | "BEPSA";
            /**
             * @description Establecer como método predeterminado
             * @example false
             */
            isDefault?: boolean;
            /**
             * @description Detalles adicionales del método (últimos 4 dígitos, etc.)
             * @example {
             *       "cardLast4": "1234"
             *     }
             */
            details?: Record<string, never>;
            /** @description ID externo del proveedor (token de Stripe, etc.) */
            externalId?: string;
        };
        PaymentMethodDetailResponseDTO: {
            /** @example f47ac10b-58cc-4372-a567-0e02b2c3d479 */
            id: string;
            /** @example 1 */
            userId: number;
            /**
             * @example CREDIT_CARD
             * @enum {string}
             */
            type: "CASH" | "CREDIT_CARD" | "DEBIT_CARD" | "PREPAID_CARD" | "QR" | "LINK" | "TRANSFER" | "WALLET" | "MOBILE_WALLET" | "CRYPTO";
            /**
             * @example STRIPE
             * @enum {string}
             */
            provider: "STRIPE" | "BANCARD" | "INFONET" | "PAYPAL" | "MERCADO_PAGO" | "RAPIPAGO" | "PAGOFACIL" | "CASH" | "DINELCO" | "BEPSA";
            /** @example Visa terminada en 4242 */
            name: string;
            /** @example true */
            isDefault: boolean;
            /** @example true */
            isActive: boolean;
            /**
             * @example {
             *       "last4": "4242",
             *       "brand": "visa"
             *     }
             */
            details: Record<string, never>;
            /** @example pm_stripe_xyz */
            externalId?: string;
            metadata?: Record<string, never>;
            /** Format: date-time */
            lastUsedAt?: string;
            /** Format: date-time */
            expiresAt?: string;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        UpdatePaymentMethodDto: {
            /**
             * @description Nombre descriptivo del método de pago
             * @example Tarjeta Visa personal
             */
            name?: string;
            /**
             * @description Tipo de método de pago
             * @enum {string}
             */
            type?: "CASH" | "CREDIT_CARD" | "DEBIT_CARD" | "PREPAID_CARD" | "QR" | "LINK" | "TRANSFER" | "WALLET" | "MOBILE_WALLET" | "CRYPTO";
            /**
             * @description Proveedor de pagos
             * @enum {string}
             */
            provider?: "STRIPE" | "BANCARD" | "INFONET" | "PAYPAL" | "MERCADO_PAGO" | "RAPIPAGO" | "PAGOFACIL" | "CASH" | "DINELCO" | "BEPSA";
            /**
             * @description Establecer como método predeterminado
             * @example false
             */
            isDefault?: boolean;
            /**
             * @description Detalles adicionales del método (últimos 4 dígitos, etc.)
             * @example {
             *       "cardLast4": "1234"
             *     }
             */
            details?: Record<string, never>;
            /** @description ID externo del proveedor (token de Stripe, etc.) */
            externalId?: string;
        };
        CreateNotificationRequestDTO: {
            /**
             * @description Título descriptivo de la notificación
             * @example Nueva solicitud de servicio
             */
            title: string;
            /**
             * @description Cuerpo detallado del mensaje de la notificación
             * @example El cliente Juan Pérez ha solicitado un servicio de plomería.
             */
            message: string;
            /**
             * @description Tipo o categoría de la notificación para segmentación
             * @example service_request
             * @enum {string}
             */
            type: "service_request" | "service_accepted" | "service_rejected" | "service_completed" | "payment_received" | "rating_received" | "promotion" | "system";
            /**
             * @description Objeto con datos dinámicos requeridos por el cliente (Payload útil)
             * @example {
             *       "requestId": "c52b5212-db5e-4ef5-9614-726614174000",
             *       "price": 45000
             *     }
             */
            data?: Record<string, never>;
            /**
             * @description Canales específicos de distribución y despacho para la notificación
             * @default [
             *       "in_app"
             *     ]
             * @example [
             *       "in_app",
             *       "push",
             *       "email"
             *     ]
             */
            channels: string[];
            /**
             * @description Metadatos adicionales de auditoría o traza técnica
             * @example {
             *       "ip": "192.168.1.1",
             *       "device": "iOS"
             *     }
             */
            metadata?: Record<string, never>;
        };
        NotificationResponseDTO: {
            /**
             * @description ID de la notificación
             * @example 6481fc923fbc4a3a6c23e801
             */
            id: string;
            /**
             * @description ID del usuario destino
             * @example 6481fc923fbc4a3a6c23e802
             */
            userId: string;
            /**
             * @description Título de la notificación
             * @example Pago Recibido
             */
            title: string;
            /**
             * @description Mensaje de la notificación
             * @example Tu pago ha sido procesado exitosamente.
             */
            message: string;
            /**
             * @example payment_received
             * @enum {string}
             */
            type: "service_request" | "service_accepted" | "service_rejected" | "service_completed" | "payment_received" | "rating_received" | "promotion" | "system";
            /**
             * @example read
             * @enum {string}
             */
            status: "pending" | "sent" | "read" | "failed";
            /**
             * @description Canales asignados
             * @example [
             *       "in_app"
             *     ]
             */
            channels: string[];
            /** @description Payload con datos extras */
            data?: Record<string, never>;
            /**
             * Format: date-time
             * @description Fecha de lectura
             * @example 2026-06-07T22:30:00.000Z
             */
            readAt?: string;
            /**
             * Format: date-time
             * @description Fecha de envío
             * @example 2026-06-07T22:25:00.000Z
             */
            sentAt?: string;
            /**
             * Format: date-time
             * @description Fecha de creación
             * @example 2026-06-07T22:24:00.000Z
             */
            createdAt: string;
        };
        UnreadCountResponseDTO: {
            /**
             * @description Cantidad consolidada de notificaciones pendientes de lectura
             * @example 5
             */
            count: number;
        };
        CreatePromotionRequestDTO: {
            /**
             * @description Código único de la promoción
             * @example PROMO2025
             */
            code: string;
            /**
             * @description Nombre descriptivo de la promoción
             * @example Descuento de verano
             */
            name: string;
            /**
             * @description Descripción detallada
             * @example 20% de descuento en todos los servicios
             */
            description?: string;
            /**
             * @description Tipo de descuento
             * @example PERCENTAGE
             * @enum {string}
             */
            type: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SERVICE";
            /**
             * @description Valor del descuento (porcentaje o monto fijo)
             * @example 20
             */
            discountValue: number;
            /**
             * @description Monto mínimo del servicio para aplicar la promoción
             * @example 50000
             */
            minimumAmount?: number;
            /**
             * @description Descuento máximo permitido (para tipo PERCENTAGE)
             * @example 100000
             */
            maximumDiscount?: number;
            /**
             * @description Cantidad máxima de usos totales (-1 = ilimitado)
             * @example 100
             */
            maxUsage?: number;
            /**
             * @description Cantidad máxima de usos por usuario
             * @example 1
             */
            maxUsagePerUser?: number;
            /**
             * @description Fecha de inicio de vigencia (ISO 8601)
             * @example 2025-01-01T00:00:00Z
             */
            validFrom: string;
            /**
             * @description Fecha de fin de vigencia (ISO 8601)
             * @example 2025-12-31T23:59:59Z
             */
            validUntil: string;
            /**
             * @description Categorías de servicio aplicables
             * @example [
             *       "plomeria",
             *       "electricidad"
             *     ]
             */
            applicableCategories?: string[];
            /**
             * @description IDs de servicios específicos aplicables
             * @example [
             *       "uuid-1",
             *       "uuid-2"
             *     ]
             */
            applicableServices?: string[];
            /**
             * @description Solo para el primer uso del usuario
             * @example false
             */
            isFirstTimeOnly?: boolean;
            /**
             * @description Solo para profesionales
             * @example false
             */
            isProfessionalOnly?: boolean;
            /**
             * @description Solo para clientes
             * @example true
             */
            isClientOnly?: boolean;
        };
        PromotionDetailResponseDTO: {
            /** @example a63b5212-db5e-4ef5-9614-726614174000 */
            id: string;
            /** @example PROMO2025 */
            code: string;
            /** @example Descuento de verano */
            name: string;
            /** @example 20% de descuento en todos los servicios */
            description?: string;
            /**
             * @example PERCENTAGE
             * @enum {string}
             */
            type: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SERVICE";
            /**
             * @example ACTIVE
             * @enum {string}
             */
            status: "ACTIVE" | "INACTIVE" | "EXPIRED" | "DEPLETED";
            /**
             * @description Porcentaje de descuento (tipo PERCENTAGE)
             * @example 20
             */
            discountPercentage?: number;
            /**
             * @description Monto fijo de descuento (tipo FIXED_AMOUNT)
             * @example 50000
             */
            discountAmount?: number;
            /** @example 30000 */
            minimumAmount?: number;
            /** @example 100000 */
            maximumDiscount?: number;
            /**
             * @description -1 = ilimitado
             * @example 100
             */
            maxUsage: number;
            /** @example 1 */
            maxUsagePerUser: number;
            /** @example 42 */
            currentUsage: number;
            /**
             * Format: date-time
             * @example 2025-01-01T00:00:00.000Z
             */
            validFrom: string;
            /**
             * Format: date-time
             * @example 2025-12-31T23:59:59.000Z
             */
            validUntil: string;
            /**
             * @example [
             *       "cliente",
             *       "profesional"
             *     ]
             */
            allowedUserTypes: string[];
            /**
             * @example [
             *       1,
             *       2,
             *       3
             *     ]
             */
            specificUserIds: number[];
            /** @example 5 */
            createdById?: number;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            lastChangedAt?: string;
        };
        PromotionStatsResponseDTO: {
            /**
             * @description Total de promociones registradas
             * @example 25
             */
            totalPromotions: number;
            /**
             * @description Promociones actualmente activas y vigentes
             * @example 8
             */
            activePromotions: number;
            /**
             * @description Total de usos de promociones
             * @example 342
             */
            totalUsage: number;
            /**
             * @description Suma total de descuentos otorgados
             * @example 5750000
             */
            totalDiscount: number;
        };
        ValidatePromotionRequestDTO: {
            /**
             * @description Código de la promoción
             * @example PROMO2025
             */
            code: string;
            /**
             * @description Monto del servicio a aplicar la promoción
             * @example 150
             */
            serviceAmount: number;
        };
        PromotionValidateResponseDTO: {
            /**
             * @description Indica si la promoción es válida y aplicable
             * @example true
             */
            isValid: boolean;
            /**
             * @description Monto de descuento calculado
             * @example 30000
             */
            discountAmount: number;
            /** @description Detalle de la promoción (solo si isValid=true) */
            promotion?: components["schemas"]["PromotionDetailResponseDTO"];
            /** @example La promoción no está activa o ha expirado */
            message?: string;
        };
        ApplyPromotionRequestDTO: {
            /**
             * @description Código de la promoción a aplicar
             * @example PROMO2025
             */
            promotionCode: string;
            /**
             * @description ID del servicio al que se aplica la promoción
             * @example a63b5212-db5e-4ef5-9614-726614174000
             */
            serviceId?: string;
            /**
             * @description Monto del servicio sobre el que se calcula el descuento
             * @example 150000
             */
            serviceAmount: number;
        };
        PromotionApplyResponseDTO: {
            /**
             * @description Indica si la promoción fue aplicada correctamente
             * @example true
             */
            success: boolean;
            /**
             * @description Monto de descuento aplicado
             * @example 30000
             */
            discountAmount: number;
            /**
             * @description Monto final después del descuento
             * @example 120000
             */
            finalAmount: number;
            /** @description Detalle de la promoción aplicada */
            promotion?: components["schemas"]["PromotionDetailResponseDTO"];
            /** @example Promoción aplicada. Descuento: 30000 */
            message?: string;
        };
        RatingCriteriaRequestDTO: {
            /**
             * @description Calificación de puntualidad (1-5)
             * @example 5
             */
            punctuality?: number;
            /**
             * @description Calificación de calidad del trabajo (1-5)
             * @example 5
             */
            quality?: number;
            /**
             * @description Calificación de comunicación (1-5)
             * @example 4
             */
            communication?: number;
            /**
             * @description Calificación de limpieza (1-5)
             * @example 5
             */
            cleanliness?: number;
            /**
             * @description Calificación de relación calidad-precio (1-5)
             * @example 4
             */
            value?: number;
        };
        CreateRatingRequestDTO: {
            /**
             * @description ID del profesional calificado
             * @example 123e4567-e89b-12d3-a456-426614174000
             */
            professionalId: string;
            /**
             * @description ID de la solicitud de servicio
             * @example 123e4567-e89b-12d3-a456-426614174000
             */
            serviceRequestId: string;
            /**
             * @description Tipo de calificación
             * @example CLIENT_TO_PROFESSIONAL
             * @enum {string}
             */
            type: "CLIENT_TO_PROFESSIONAL" | "PROFESSIONAL_TO_CLIENT";
            /**
             * @description Calificación general (1-5 estrellas)
             * @example 5
             */
            rating: number;
            /**
             * @description Comentario sobre el servicio
             * @example Excelente trabajo, muy profesional y puntual
             */
            comment?: string;
            /** @description Calificaciones por criterios específicos */
            criteria?: components["schemas"]["RatingCriteriaRequestDTO"];
            /**
             * @description Si la calificación es anónima
             * @default false
             * @example false
             */
            isAnonymous: boolean;
            /**
             * @description Metadatos adicionales
             * @example {
             *       "platform": "mobile",
             *       "appVersion": "1.2.0"
             *     }
             */
            metadata?: Record<string, never>;
        };
        RatingDetailResponseDTO: {
            /**
             * @description ID único de la calificación
             * @example a63b5212-db5e-4ef5-9614-726614174000
             */
            id: string;
            /**
             * @description ID del usuario que calificó
             * @example 1
             */
            userId: number;
            /**
             * @description ID del profesional calificado
             * @example 1
             */
            professionalId: number;
            /**
             * @description ID de la solicitud de servicio asociada
             * @example b72c6323-ec6f-5fg6-a725-837725285111
             */
            serviceId: string | null;
            /**
             * @description Tipo de calificación
             * @example CLIENT_TO_PROFESSIONAL
             * @enum {string}
             */
            type: "CLIENT_TO_PROFESSIONAL" | "PROFESSIONAL_TO_CLIENT";
            /**
             * @description Calificación general (1-5)
             * @example 4.5
             */
            rating: number;
            /**
             * @description Comentario de la calificación
             * @example Excelente trabajo
             */
            review: string | null;
            /** @description Criterios de calificación */
            criteria: Record<string, never> | null;
            /**
             * @description Si la calificación es anónima
             * @example false
             */
            isAnonymous: boolean;
            /**
             * @description Si la calificación fue reportada
             * @example false
             */
            isReported: boolean;
            /** @description Motivo del reporte */
            reportReason: string | null;
            /**
             * @description Si la calificación está activa
             * @example true
             */
            isActive: boolean;
            /**
             * Format: date-time
             * @description Fecha de creación
             */
            createdAt: string;
            /** @description Creado por (userId) */
            createdBy: string | null;
        };
        CreateProfessionalToClientRatingRequestDTO: {
            /**
             * @description referenceId (UUID) del cliente calificado
             * @example a1b2c3d4-e5f6-7890-abcd-ef1234567890
             */
            clientId: string;
            /**
             * @description ID de la solicitud de servicio
             * @example 123e4567-e89b-12d3-a456-426614174000
             */
            serviceRequestId: string;
            /**
             * @description Calificación general (1-5 estrellas)
             * @example 5
             */
            rating: number;
            /**
             * @description Comentario sobre el cliente
             * @example Cliente puntual y claro con los requerimientos
             */
            comment?: string;
            /** @description Calificaciones por criterios específicos */
            criteria?: components["schemas"]["RatingCriteriaRequestDTO"];
            /**
             * @description Si la calificación es anónima
             * @default false
             * @example false
             */
            isAnonymous: boolean;
        };
        RatingsListResponseDTO: {
            /** @description Lista de calificaciones */
            data: components["schemas"]["RatingDetailResponseDTO"][];
        };
        TopRatedProfessionalResponseDTO: {
            /**
             * @description ID del profesional
             * @example 123e4567-e89b-12d3-a456-426614174000
             */
            professionalId: string;
            /**
             * @description Calificación promedio del profesional
             * @example 4.8
             */
            averageRating: number;
            /**
             * @description Número total de calificaciones del profesional
             * @example 45
             */
            totalRatings: number;
        };
        UserRatingStatsResponseDTO: {
            /**
             * @description Número de calificaciones dadas por el usuario
             * @example 15
             */
            givenRatings: number;
            /**
             * @description Número de calificaciones recibidas por el usuario
             * @example 8
             */
            receivedRatings: number;
            /**
             * @description Calificación promedio de las calificaciones dadas
             * @example 4.2
             */
            averageGivenRating: number;
            /**
             * @description Calificación promedio de las calificaciones recibidas
             * @example 4.5
             */
            averageReceivedRating: number;
        };
        RatingDistributionResponseDTO: {
            /**
             * @description Número de calificaciones de 1 estrella
             * @example 2
             */
            1: number;
            /**
             * @description Número de calificaciones de 2 estrellas
             * @example 5
             */
            2: number;
            /**
             * @description Número de calificaciones de 3 estrellas
             * @example 12
             */
            3: number;
            /**
             * @description Número de calificaciones de 4 estrellas
             * @example 25
             */
            4: number;
            /**
             * @description Número de calificaciones de 5 estrellas
             * @example 56
             */
            5: number;
        };
        AverageCriteriaResponseDTO: {
            /**
             * @description Calificación promedio de puntualidad
             * @example 4.2
             */
            punctuality?: number;
            /**
             * @description Calificación promedio de calidad
             * @example 4.5
             */
            quality?: number;
            /**
             * @description Calificación promedio de comunicación
             * @example 4
             */
            communication?: number;
            /**
             * @description Calificación promedio de limpieza
             * @example 4.3
             */
            cleanliness?: number;
            /**
             * @description Calificación promedio de relación calidad-precio
             * @example 4.1
             */
            value?: number;
        };
        ProfessionalRatingStatsResponseDTO: {
            /**
             * @description Calificación promedio general
             * @example 4.3
             */
            averageRating: number;
            /**
             * @description Número total de calificaciones
             * @example 100
             */
            totalRatings: number;
            /** @description Distribución de calificaciones por estrellas */
            ratingDistribution: components["schemas"]["RatingDistributionResponseDTO"];
            /** @description Calificaciones promedio por criterios específicos */
            averageCriteria: components["schemas"]["AverageCriteriaResponseDTO"];
        };
        UpdateRatingRequestDTO: {
            /**
             * @description Calificación general (1-5 estrellas)
             * @example 5
             */
            rating?: number;
            /**
             * @description Comentario sobre el servicio
             * @example Excelente trabajo, muy profesional y puntual
             */
            comment?: string;
            /** @description Calificaciones por criterios específicos */
            criteria?: components["schemas"]["RatingCriteriaRequestDTO"];
            /**
             * @description Si la calificación es anónima
             * @default false
             * @example false
             */
            isAnonymous: boolean;
            /**
             * @description Metadatos adicionales
             * @example {
             *       "platform": "mobile",
             *       "appVersion": "1.2.0"
             *     }
             */
            metadata?: Record<string, never>;
        };
        ReportRatingRequestDTO: {
            /**
             * @description Motivo del reporte de la calificación
             * @example Esta calificación contiene lenguaje inapropiado y no refleja la realidad del servicio
             */
            reason: string;
        };
        CreateCategoryDto: {
            /**
             * @description Nombre de la categoría
             * @example Plomería
             */
            name: string;
            /**
             * @description Slug de la categoría, autogenerado si se omite
             * @example plomeria
             */
            slug?: string;
            /**
             * @description Descripción detallada
             * @example Servicios de reparación e instalaciones sanitarias
             */
            description?: string;
            /**
             * @description Nombre del icono o clase para renderizado
             * @example wrench-outline
             */
            icon?: string;
            /**
             * @description Color identificador en formato hexadecimal
             * @example #2ecc71
             */
            color?: string;
            /**
             * @description Posición de ordenamiento en las consultas
             * @default 0
             * @example 5
             */
            sortOrder: number;
            /**
             * @description Estado inicial en el sistema
             * @default ACTIVE
             * @enum {string}
             */
            status: "ACTIVE" | "INACTIVE" | "PENDING";
            /**
             * @description Indica si es visible en los buscadores de cara al cliente
             * @default true
             */
            isVisible: boolean;
            /**
             * @description Determina si exige acreditación de títulos/certificados
             * @default false
             */
            requiresVerification: boolean;
            /**
             * @description UUID de la categoría padre si actúa como subcategoría
             * @example 1
             */
            parentCategoryId?: number;
            /**
             * @description Estructura libre JSONb para configurar parámetros dinámicos de frontera
             * @example {
             *       "taxRate": 10,
             *       "minFee": 50000
             *     }
             */
            metadata?: Record<string, never>;
        };
        CategoryDetailResponseDTO: {
            /**
             * @description ID de la categoría
             * @example 1
             */
            id: number;
            /**
             * @description Nombre único de la categoría
             * @example Plomería
             */
            name: string;
            /**
             * @description Slug url-ready único
             * @example plomeria
             */
            slug: string;
            /**
             * @description Descripción detallada
             * @example Servicios de reparación e instalaciones sanitarias
             */
            description?: string | null;
            /**
             * @description Nombre del icono o clase para renderizado
             * @example wrench-outline
             */
            icon?: string | null;
            /**
             * @description Color identificador en formato hexadecimal
             * @example #2ecc71
             */
            color?: string | null;
            /**
             * @description Posición de ordenamiento
             * @example 0
             */
            sortOrder: number;
            /**
             * @description Estado de la categoría
             * @example ACTIVE
             * @enum {string}
             */
            status: "ACTIVE" | "INACTIVE" | "PENDING";
            /**
             * @description Indica si es visible públicamente
             * @example true
             */
            isVisible: boolean;
            /**
             * @description Determina si exige acreditación de títulos/certificados
             * @example false
             */
            requiresVerification: boolean;
            /**
             * @description Metadata dinámica JSONb
             * @example {
             *       "taxRate": 10,
             *       "minFee": 50000
             *     }
             */
            metadata?: Record<string, never> | null;
            /**
             * @description ID de la categoría padre (null si es raíz)
             * @example null
             */
            parentCategoryId?: number | null;
            /**
             * Format: date-time
             * @description Fecha de creación
             */
            createdAt: string;
            /**
             * Format: date-time
             * @description Fecha de última modificación
             */
            lastChangedAt?: string | null;
        };
        CategoryStatsResponseDTO: {
            /**
             * @description Número de profesionales asociados a la categoría
             * @example 42
             */
            professionalCount: number;
            /**
             * @description Número de servicios vinculados a la categoría
             * @example 15
             */
            serviceCount: number;
            /**
             * @description Calificación promedio de los profesionales de la categoría
             * @example 4.75
             */
            averageRating: number;
            /**
             * @description Total de servicios (alias de serviceCount)
             * @example 15
             */
            totalServices: number;
        };
        UpdateCategoryDto: {
            /**
             * @description Nombre de la categoría
             * @example Plomería
             */
            name?: string;
            /**
             * @description Slug de la categoría, autogenerado si se omite
             * @example plomeria
             */
            slug?: string;
            /**
             * @description Descripción detallada
             * @example Servicios de reparación e instalaciones sanitarias
             */
            description?: string;
            /**
             * @description Nombre del icono o clase para renderizado
             * @example wrench-outline
             */
            icon?: string;
            /**
             * @description Color identificador en formato hexadecimal
             * @example #2ecc71
             */
            color?: string;
            /**
             * @description Posición de ordenamiento en las consultas
             * @default 0
             * @example 5
             */
            sortOrder: number;
            /**
             * @description Estado inicial en el sistema
             * @default ACTIVE
             * @enum {string}
             */
            status: "ACTIVE" | "INACTIVE" | "PENDING";
            /**
             * @description Indica si es visible en los buscadores de cara al cliente
             * @default true
             */
            isVisible: boolean;
            /**
             * @description Determina si exige acreditación de títulos/certificados
             * @default false
             */
            requiresVerification: boolean;
            /**
             * @description UUID de la categoría padre si actúa como subcategoría
             * @example 1
             */
            parentCategoryId?: number;
            /**
             * @description Estructura libre JSONb para configurar parámetros dinámicos de frontera
             * @example {
             *       "taxRate": 10,
             *       "minFee": 50000
             *     }
             */
            metadata?: Record<string, never>;
        };
        FileInfoResponseDTO: {
            /** @description Nombre único del archivo en el sistema */
            filename: string;
            /** @description Nombre original del archivo */
            originalname: string;
            /** @description Tipo MIME del archivo */
            mimetype: string;
            /** @description Tamaño en bytes */
            size: number;
            /**
             * @description Clave del objeto en S3
             * @example a1b2c3d4.jpg
             */
            key: string;
            /** @description URL presignada para acceso inmediato al archivo */
            url: string;
        };
        UserStatsDTO: {
            /** @example 1500 */
            total: number;
            /** @example 120 */
            new: number;
            /** @example 450 */
            active: number;
            /**
             * @description Tasa de crecimiento porcentual
             * @example 12.5
             */
            growth: number;
        };
        ProfessionalStatsDTO: {
            /** @example 350 */
            total: number;
            /** @example 25 */
            new: number;
            /** @example 310 */
            verified: number;
            /** @example 5.4 */
            growth: number;
        };
        ServiceStatsDetailsDTO: {
            /** @example 850 */
            total: number;
            /** @example 45 */
            active: number;
            /** @example 750 */
            completed: number;
            /** @example 55 */
            pending: number;
            /** @example 8.2 */
            growth: number;
        };
        RevenueStatsDTO: {
            /** @example 25000000 */
            total: number;
            /**
             * @description Facturación del periodo actual
             * @example 4500000
             */
            period: number;
            /**
             * @description Ticket promedio
             * @example 150000
             */
            average: number;
            /** @example 15.3 */
            growth: number;
        };
        RatingStatsDTO: {
            /** @example 4.7 */
            average: number;
            /** @example 980 */
            total: number;
            /** @example 120 */
            period: number;
            /**
             * @description Mapeo de estrellas distribuidas
             * @example {
             *       "5 estrellas": 80,
             *       "4 estrellas": 15
             *     }
             */
            distribution: Record<string, never>;
        };
        PeriodDTO: {
            /**
             * Format: date-time
             * @example 2026-05-01T00:00:00.000Z
             */
            startDate: string;
            /**
             * Format: date-time
             * @example 2026-05-31T23:59:59.999Z
             */
            endDate: string;
        };
        DashboardStatsResponseDTO: {
            success: boolean;
            users: components["schemas"]["UserStatsDTO"];
            professionals: components["schemas"]["ProfessionalStatsDTO"];
            services: components["schemas"]["ServiceStatsDetailsDTO"];
            revenue: components["schemas"]["RevenueStatsDTO"];
            ratings: components["schemas"]["RatingStatsDTO"];
            period: components["schemas"]["PeriodDTO"];
        };
        CategoryPerformanceItemDTO: {
            /** @example Plomería */
            category: string;
            /** @example 140 */
            serviceCount: number;
            /** @example 18500000 */
            revenue: number;
            /** @example 4.8 */
            averageRating: number;
        };
        CategoryPerformanceResponseDTO: {
            success: boolean;
            data: components["schemas"]["CategoryPerformanceItemDTO"][];
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    HealthController_check: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The Health Check is successful */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example ok */
                        status?: string;
                        /**
                         * @example {
                         *       "database": {
                         *         "status": "up"
                         *       }
                         *     }
                         */
                        info?: {
                            [key: string]: {
                                status: string;
                            } & {
                                [key: string]: unknown;
                            };
                        } | null;
                        /** @example {} */
                        error?: {
                            [key: string]: {
                                status: string;
                            } & {
                                [key: string]: unknown;
                            };
                        } | null;
                        /**
                         * @example {
                         *       "database": {
                         *         "status": "up"
                         *       }
                         *     }
                         */
                        details?: {
                            [key: string]: {
                                status: string;
                            } & {
                                [key: string]: unknown;
                            };
                        };
                    };
                };
            };
            /** @description The Health Check is not successful */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example error */
                        status?: string;
                        /**
                         * @example {
                         *       "database": {
                         *         "status": "up"
                         *       }
                         *     }
                         */
                        info?: {
                            [key: string]: {
                                status: string;
                            } & {
                                [key: string]: unknown;
                            };
                        } | null;
                        /**
                         * @example {
                         *       "redis": {
                         *         "status": "down",
                         *         "message": "Could not connect"
                         *       }
                         *     }
                         */
                        error?: {
                            [key: string]: {
                                status: string;
                            } & {
                                [key: string]: unknown;
                            };
                        } | null;
                        /**
                         * @example {
                         *       "database": {
                         *         "status": "up"
                         *       },
                         *       "redis": {
                         *         "status": "down",
                         *         "message": "Could not connect"
                         *       }
                         *     }
                         */
                        details?: {
                            [key: string]: {
                                status: string;
                            } & {
                                [key: string]: unknown;
                            };
                        };
                    };
                };
            };
        };
    };
    AuthApiController_login: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LoginUserDTO"];
            };
        };
        responses: {
            /** @description Usuario logueado exitosamente. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LoginUserResponseDTO"];
                };
            };
            /** @description Credenciales inválidas. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UnauthorizedException"];
                };
            };
        };
    };
    AuthApiController_createPassword: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreatePasswordDTO"];
            };
        };
        responses: {
            /** @description Credenciales creadas correctamente. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthApiController_changePassword: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateUserPasswordDTO"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthApiController_forgotPassword: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ForgotUserPasswordDTO"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthApiController_refreshToken: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Tokens renovados con éxito. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthApiController_scope: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Scope del usuario obtenido con éxito. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserScopeResponseDTO"];
                };
            };
        };
    };
    AuthApiController_userVerify: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthApiController_userVerificationStatus: {
        parameters: {
            query: {
                /** @description Email del usuario a verificar. */
                email: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Estado de verificación consultado exitosamente. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthApiController_sendVerificationEmail: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EmailSendRequestDTO"];
            };
        };
        responses: {
            /** @description Email de verificación enviado correctamente. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Solicitud inválida. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Usuario no encontrado */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    sendCreatePasswordEmail: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EmailSendRequestDTO"];
            };
        };
        responses: {
            /** @description Email de recuperación enviado correctamente. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PasswordOnlyMessageResponseDTO"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "error": "Unauthorized",
                     *       "errors": [
                     *         {
                     *           "field": "_",
                     *           "message": "Token inválido o expirado"
                     *         }
                     *       ],
                     *       "timestamp": "2025-10-28T10:30:00-03:00"
                     *     }
                     */
                    "application/json": unknown;
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "error": "Forbidden",
                     *       "errors": [
                     *         {
                     *           "field": "_",
                     *           "message": "No tiene permisos para operar con tarjetas"
                     *         }
                     *       ],
                     *       "timestamp": "2025-10-28T10:30:00-03:00"
                     *     }
                     */
                    "application/json": unknown;
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "error": "Internal Server Error",
                     *       "errors": [
                     *         {
                     *           "field": "_",
                     *           "message": "Error inesperado"
                     *         }
                     *       ],
                     *       "timestamp": "2025-10-28T10:30:00-03:00"
                     *     }
                     */
                    "application/json": unknown;
                };
            };
        };
    };
    AuthApiController_sendPasswordResetEmail: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EmailSendRequestDTO"];
            };
        };
        responses: {
            /** @description Email de recuperación enviado correctamente. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Solicitud inválida. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Usuario no encontrado */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    RolesApiController_getAllRoles: {
        parameters: {
            query?: {
                /** @description Pagina para paginación de resultados (opcional, por defecto 1) */
                page?: number;
                /** @description Pagina para paginación de resultados (opcional, por defecto 10) */
                pageSize?: number;
                /** @description Campo por el cual ordenar los resultados (opcional, por defecto "fechaHora") y orden ascendente o descendente (opcional, por defecto "DESC"), separados por : */
                orderBy?: string;
                /** @description Fecha de rango de inicio de consulta */
                startDate?: string;
                /** @description Fecha de rango de fin de consulta */
                endDate?: string;
                /** @description Código/s de sucursal/es especifica hasta 10 */
                branches?: string;
                /** @description Estado del rol */
                isActive?: boolean;
                /** @description Filtro de búsqueda */
                search?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Lista de roles obtenida exitosamente. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RoleListResponseDTO"];
                };
            };
        };
    };
    RolesApiController_createRole: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateRoleRequestDTO"];
            };
        };
        responses: {
            /** @description Rol creado exitosamente. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RoleResponseDTO"];
                };
            };
            /** @description No autorizado. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Ya existe un rol con ese nombre. */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    RolesApiController_getRoleById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Identificador del rol */
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Rol obtenido exitosamente. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RoleResponseDTO"];
                };
            };
            /** @description Rol no encontrado. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    RolesApiController_updateRole: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Identificador del rol */
                id: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateRoleRequestDTO"];
            };
        };
        responses: {
            /** @description Rol actualizado exitosamente. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RoleResponseDTO"];
                };
            };
            /** @description Rol no encontrado. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Ya existe un rol con ese nombre. */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UsersRolesApiController_getUserWithRoles: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Identificador del usuario */
                userId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Usuario con roles y permisos obtenido exitosamente. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserWithRolesResponseDTO"];
                };
            };
            /** @description Usuario no encontrado. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UsersRolesApiController_assignRolesToUser: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Identificador del usuario */
                userId: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AssignRolesToUserRequestDTO"];
            };
        };
        responses: {
            /** @description Roles asignados exitosamente. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserRoleAssignmentResponseDTO"];
                };
            };
            /** @description Roles inválidos o inactivos. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Usuario o roles no encontrados. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UsersRolesApiController_assignPermissionsToUser: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Identificador del usuario */
                userId: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AssignPermissionsToUserRequestDTO"];
            };
        };
        responses: {
            /** @description Permisos directos asignados exitosamente. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserPermissionAssignmentResponseDTO"];
                };
            };
            /** @description Usuario o permisos no encontrados. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    OnboardingController_onboarding: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["OnboardingUserRequestDTO"];
            };
        };
        responses: {
            /** @description Usuario creado satisfactoriamente */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OnboardingUserResponseDTO"];
                };
            };
            /** @description Solicitud mal formada, verifique los datos y/o parametros enviados. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Credenciales inválidas. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UnauthorizedException"];
                };
            };
            /** @description Usuario bloqueado. */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Error interno del servidor al procesar la solicitud. */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UsersController_findAll: {
        parameters: {
            query?: {
                page?: number;
                pageSize?: number;
                orderBy?: string;
                orderDir?: "asc" | "desc";
                startDate?: string;
                endDate?: string;
                name?: string;
                email?: string;
                documentNumber?: string;
                status?: "ACTIVE" | "BLOCKED" | "DELETED" | "INACTIVE" | "REFUSED" | "PENDING_VERIFICATION";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Usuarios obtenidos exitosamente */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UsersListResponseDTO"];
                };
            };
            /** @description Credenciales inválidas. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Sin permisos suficientes. */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getEditContext: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                referenceId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Usuario obtenido exitosamente */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GetEditContextResponseDTO"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "error": "Unauthorized",
                     *       "errors": [
                     *         {
                     *           "field": "_",
                     *           "message": "Token inválido o expirado"
                     *         }
                     *       ],
                     *       "timestamp": "2025-10-28T10:30:00-03:00"
                     *     }
                     */
                    "application/json": unknown;
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "error": "Forbidden",
                     *       "errors": [
                     *         {
                     *           "field": "_",
                     *           "message": "No tiene permisos para operar con tarjetas"
                     *         }
                     *       ],
                     *       "timestamp": "2025-10-28T10:30:00-03:00"
                     *     }
                     */
                    "application/json": unknown;
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "error": "Internal Server Error",
                     *       "errors": [
                     *         {
                     *           "field": "_",
                     *           "message": "Error inesperado"
                     *         }
                     *       ],
                     *       "timestamp": "2025-10-28T10:30:00-03:00"
                     *     }
                     */
                    "application/json": unknown;
                };
            };
        };
    };
    updateEditContext: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                referenceId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateEditContextRequestDTO"];
            };
        };
        responses: {
            /** @description Usuario actualizado exitosamente */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UpdateEditContextResponseDTO"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "error": "Unauthorized",
                     *       "errors": [
                     *         {
                     *           "field": "_",
                     *           "message": "Token inválido o expirado"
                     *         }
                     *       ],
                     *       "timestamp": "2025-10-28T10:30:00-03:00"
                     *     }
                     */
                    "application/json": unknown;
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "error": "Forbidden",
                     *       "errors": [
                     *         {
                     *           "field": "_",
                     *           "message": "No tiene permisos para operar con tarjetas"
                     *         }
                     *       ],
                     *       "timestamp": "2025-10-28T10:30:00-03:00"
                     *     }
                     */
                    "application/json": unknown;
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "error": "Internal Server Error",
                     *       "errors": [
                     *         {
                     *           "field": "_",
                     *           "message": "Error inesperado"
                     *         }
                     *       ],
                     *       "timestamp": "2025-10-28T10:30:00-03:00"
                     *     }
                     */
                    "application/json": unknown;
                };
            };
        };
    };
    UsersController_findOneByReference: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                referenceId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Usuario encontrado exitosamente */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserResponseDTO"];
                };
            };
            /** @description No tenés permisos para ver este usuario. */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Usuario no encontrado. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UsersController_updateByReference: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                referenceId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateUserRequestDTO"];
            };
        };
        responses: {
            /** @description Usuario actualizado exitosamente */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserResponseDTO"];
                };
            };
            /** @description Solicitud mal formada, verifique los datos y/o parametros enviados. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Usuario no encontrado. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UsersController_deleteByReference: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                referenceId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Usuario eliminado exitosamente */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Usuario no encontrado. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UsersController_findOne: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Usuario encontrado exitosamente */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserResponseDTO"];
                };
            };
            /** @description Solicitud mal formada, verifique los datos y/o parametros enviados. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description No tenés permisos para ver este usuario. */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Usuario no encontrado. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UsersController_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateUserRequestDTO"];
            };
        };
        responses: {
            /** @description Usuario actualizado exitosamente */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserResponseDTO"];
                };
            };
            /** @description Solicitud mal formada, verifique los datos y/o parametros enviados. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Usuario no encontrado. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UsersController_block: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BlockUserRequestDTO"];
            };
        };
        responses: {
            /** @description Usuario bloqueado exitosamente */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserResponseDTO"];
                };
            };
            /** @description Solicitud mal formada, verifique los datos y/o parametros enviados. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Usuario no encontrado. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UsersController_unblock: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UnblockUserRequestDTO"];
            };
        };
        responses: {
            /** @description Usuario desbloqueado exitosamente */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserResponseDTO"];
                };
            };
            /** @description Solicitud mal formada, verifique los datos y/o parametros enviados. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Usuario no encontrado. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ProfessionalsController_getProfessionals: {
        parameters: {
            query?: {
                /** @description Pagina para paginación de resultados (opcional, por defecto 1) */
                page?: number;
                /** @description Pagina para paginación de resultados (opcional, por defecto 10) */
                pageSize?: number;
                /** @description Campo por el cual ordenar los resultados (opcional, por defecto "fechaHora") y orden ascendente o descendente (opcional, por defecto "DESC"), separados por : */
                orderBy?: string;
                /** @description Fecha de rango de inicio de consulta */
                startDate?: string;
                /** @description Fecha de rango de fin de consulta */
                endDate?: string;
                /** @description Código/s de sucursal/es especifica hasta 10 */
                branches?: string;
                /** @description Filtrar por ID de categoría */
                categoryId?: number;
                /** @description Latitud para filtro geográfico */
                latitude?: number;
                /** @description Longitud para filtro geográfico */
                longitude?: number;
                /** @description Radio de búsqueda en km */
                radius?: number;
                /** @description Calificación mínima (0-5) */
                minRating?: number;
                /** @description Tarifa máxima por hora */
                maxPrice?: number;
                /** @description Filtrar solo disponibles */
                isAvailable?: boolean;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfessionalsListResponseDTO"];
                };
            };
        };
    };
    ProfessionalsController_registerProfessional: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateProfessionalRequestDTO"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfessionalDetailResponseDTO"];
                };
            };
        };
    };
    ProfessionalsController_getNearbyProfessionals: {
        parameters: {
            query: {
                /** @description Latitud del punto central */
                latitude: number;
                /** @description Longitud del punto central */
                longitude: number;
                /** @description Radio en km */
                radius?: number;
                /** @description Filtrar por ID de categoría */
                categoryId?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfessionalDetailResponseDTO"][];
                };
            };
        };
    };
    ProfessionalsController_searchBySkills: {
        parameters: {
            query: {
                /** @description Pagina para paginación de resultados (opcional, por defecto 1) */
                page?: number;
                /** @description Pagina para paginación de resultados (opcional, por defecto 10) */
                pageSize?: number;
                /** @description Campo por el cual ordenar los resultados (opcional, por defecto "fechaHora") y orden ascendente o descendente (opcional, por defecto "DESC"), separados por : */
                orderBy?: string;
                /** @description Fecha de rango de inicio de consulta */
                startDate?: string;
                /** @description Fecha de rango de fin de consulta */
                endDate?: string;
                /** @description Código/s de sucursal/es especifica hasta 10 */
                branches?: string;
                /** @description Habilidades separadas por comas */
                skills: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfessionalsListResponseDTO"];
                };
            };
        };
    };
    ProfessionalsController_getTopRatedProfessionals: {
        parameters: {
            query?: {
                /** @description Filtrar por ID de categoría */
                categoryId?: number;
                /** @description Cantidad máxima de resultados */
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfessionalDetailResponseDTO"][];
                };
            };
        };
    };
    ProfessionalsController_getMyProfessionalProfile: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfessionalDetailResponseDTO"];
                };
            };
            /** @description El usuario autenticado no tiene perfil profesional */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ProfessionalsController_getProfessionalByReference: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Reference ID (UUID) público del profesional */
                referenceId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfessionalDetailResponseDTO"];
                };
            };
            /** @description Profesional no encontrado */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ProfessionalsController_updateProfessionalByReference: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Reference ID (UUID) público del profesional */
                referenceId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateProfessionalRequestDTO"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfessionalDetailResponseDTO"];
                };
            };
        };
    };
    ProfessionalsController_getProfessionalById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID del profesional */
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfessionalDetailResponseDTO"];
                };
            };
            /** @description Profesional no encontrado */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ProfessionalsController_updateProfessional: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID del profesional */
                id: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateProfessionalRequestDTO"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfessionalDetailResponseDTO"];
                };
            };
        };
    };
    ProfessionalsController_updateAvailability: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID del profesional */
                id: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateAvailabilityRequestDTO"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfessionalDetailResponseDTO"];
                };
            };
        };
    };
    ProfessionalsController_updateLocation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID del profesional */
                id: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateProfessionalLocationRequestDTO"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfessionalDetailResponseDTO"];
                };
            };
        };
    };
    ProfessionalsController_getProfessionalServices: {
        parameters: {
            query?: {
                /** @description Pagina para paginación de resultados (opcional, por defecto 1) */
                page?: number;
                /** @description Pagina para paginación de resultados (opcional, por defecto 10) */
                pageSize?: number;
                /** @description Campo por el cual ordenar los resultados (opcional, por defecto "fechaHora") y orden ascendente o descendente (opcional, por defecto "DESC"), separados por : */
                orderBy?: string;
                /** @description Fecha de rango de inicio de consulta */
                startDate?: string;
                /** @description Fecha de rango de fin de consulta */
                endDate?: string;
                /** @description Código/s de sucursal/es especifica hasta 10 */
                branches?: string;
                /** @description Filtrar por estado del servicio */
                status?: "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
            };
            header?: never;
            path: {
                /** @description ID del profesional */
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfessionalServicesListResponseDTO"];
                };
            };
        };
    };
    ProfessionalsController_getProfessionalReviews: {
        parameters: {
            query?: {
                /** @description Pagina para paginación de resultados (opcional, por defecto 1) */
                page?: number;
                /** @description Pagina para paginación de resultados (opcional, por defecto 10) */
                pageSize?: number;
                /** @description Campo por el cual ordenar los resultados (opcional, por defecto "fechaHora") y orden ascendente o descendente (opcional, por defecto "DESC"), separados por : */
                orderBy?: string;
                /** @description Fecha de rango de inicio de consulta */
                startDate?: string;
                /** @description Fecha de rango de fin de consulta */
                endDate?: string;
                /** @description Código/s de sucursal/es especifica hasta 10 */
                branches?: string;
            };
            header?: never;
            path: {
                /** @description ID del profesional */
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfessionalReviewsListResponseDTO"];
                };
            };
        };
    };
    ProfessionalsController_getProfessionalStats: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID del profesional */
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfessionalStatsResponseDTO"];
                };
            };
        };
    };
    ProfessionalsController_verifyProfessional: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID del profesional */
                id: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["VerifyProfessionalRequestDTO"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfessionalDetailResponseDTO"];
                };
            };
        };
    };
    ProfessionalsController_suspendProfessional: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID del profesional */
                id: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SuspendProfessionalRequestDTO"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfessionalDetailResponseDTO"];
                };
            };
        };
    };
    ServicesController_getServices: {
        parameters: {
            query?: {
                /** @description Pagina para paginación de resultados (opcional, por defecto 1) */
                page?: number;
                /** @description Pagina para paginación de resultados (opcional, por defecto 10) */
                pageSize?: number;
                /** @description Campo por el cual ordenar los resultados (opcional, por defecto "fechaHora") y orden ascendente o descendente (opcional, por defecto "DESC"), separados por : */
                orderBy?: string;
                /** @description Fecha de rango de inicio de consulta */
                startDate?: string;
                /** @description Fecha de rango de fin de consulta */
                endDate?: string;
                /** @description Código/s de sucursal/es especifica hasta 10 */
                branches?: string;
                /** @description Filtrar por estado */
                status?: "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
                /** @description Filtrar por ID de categoría */
                categoryId?: number;
                /** @description Latitud para filtro geográfico */
                latitude?: number;
                /** @description Longitud para filtro geográfico */
                longitude?: number;
                /** @description Radio en km */
                radius?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Lista de servicios obtenida */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ServicesListResponseDTO"];
                };
            };
            /** @description No autorizado */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ServicesController_createService: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateServiceRequestDTO"];
            };
        };
        responses: {
            /** @description Servicio creado exitosamente */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ServiceDetailResponseDTO"];
                };
            };
            /** @description Datos inválidos */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description No autorizado */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ServicesController_getNearbyServices: {
        parameters: {
            query: {
                /** @description Latitud del punto central */
                latitude: number;
                /** @description Longitud del punto central */
                longitude: number;
                /** @description Radio en km */
                radius?: number;
                /** @description Filtrar por ID de categoría */
                categoryId?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Servicios cercanos obtenidos */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ServiceDetailResponseDTO"][];
                };
            };
            /** @description No autorizado */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ServicesController_getMyServices: {
        parameters: {
            query?: {
                /** @description Filtrar por estado del servicio */
                status?: "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
                /** @description Rol del usuario en el servicio */
                role?: "client" | "professional";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Servicios del usuario obtenidos */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ServiceDetailResponseDTO"][];
                };
            };
            /** @description No autorizado */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ServicesController_getDashboardStats: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Estadísticas obtenidas */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ServiceStatsResponseDTO"];
                };
            };
            /** @description No autorizado */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ServicesController_getServiceById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID UUID del servicio */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Servicio encontrado */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ServiceDetailResponseDTO"];
                };
            };
            /** @description No autorizado */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Servicio no encontrado */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ServicesController_updateService: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID UUID del servicio */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateServiceRequestDTO"];
            };
        };
        responses: {
            /** @description Servicio actualizado */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ServiceDetailResponseDTO"];
                };
            };
            /** @description No autorizado para modificar este servicio */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Servicio no encontrado */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ServicesController_cancelService: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID UUID del servicio */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CancelServiceRequestDTO"];
            };
        };
        responses: {
            /** @description Servicio cancelado */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ServiceDetailResponseDTO"];
                };
            };
            /** @description No autorizado para cancelar este servicio */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Servicio no encontrado */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ServicesController_acceptService: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID UUID del servicio */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Servicio aceptado */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ServiceDetailResponseDTO"];
                };
            };
            /** @description No autorizado o no es profesional */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Servicio no encontrado */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ServicesController_startService: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID UUID del servicio */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Servicio iniciado */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ServiceDetailResponseDTO"];
                };
            };
            /** @description No autorizado o no es profesional */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Servicio no encontrado */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ServicesController_completeService: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID UUID del servicio */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Servicio completado */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ServiceDetailResponseDTO"];
                };
            };
            /** @description No autorizado o no es profesional */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Servicio no encontrado */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ServicesController_getServiceRequests: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID UUID del servicio */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Solicitudes obtenidas */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ServiceRequestsListResponseDTO"];
                };
            };
            /** @description Servicio no encontrado */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ServicesController_createServiceRequest: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID UUID del servicio */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateServiceRequestRequestDTO"];
            };
        };
        responses: {
            /** @description Solicitud creada */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ServiceRequestDetailResponseDTO"];
                };
            };
            /** @description No autorizado o no es profesional */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Servicio no encontrado */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ServicesController_respondToServiceRequest: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID UUID del servicio */
                id: string;
                /** @description ID UUID de la solicitud */
                requestId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RespondServiceRequestRequestDTO"];
            };
        };
        responses: {
            /** @description Solicitud respondida */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ServiceRequestDetailResponseDTO"];
                };
            };
            /** @description No autorizado para responder esta solicitud */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Solicitud no encontrada */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ServiceTypesController_findAll: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ServiceTypeResponseDTO"][];
                };
            };
        };
    };
    LocationsController_updateLocation: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateLocationRequestDTO"];
            };
        };
        responses: {
            /** @description Ubicación actualizada con éxito. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    LocationsController_findNearbyProfessionals: {
        parameters: {
            query: {
                /** @description Latitud centro de búsqueda */
                latitude: number;
                /** @description Longitud centro de búsqueda */
                longitude: number;
                /** @description Radio máximo de búsqueda en kilómetros */
                radius?: number;
                /** @description Filtrar por ID de categoría única (UUID v4) */
                categoryId?: string;
                /** @description Número máximo de registros a retornar */
                limit?: number;
                /** @description Filtrar solo profesionales con estado disponible habilitado */
                availableOnly?: boolean;
                /** @description Filtrar solo profesionales conectados en tiempo real */
                onlineOnly?: boolean;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Colección ordenada por proximidad. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    LocationsController_getProfessionalLocation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID Único del Profesional (UUIDv4) */
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfessionalLocationResponseDTO"];
                };
            };
        };
    };
    LocationsController_getOnlineProfessionalsCount: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OnlineCountResponseDTO"];
                };
            };
        };
    };
    LocationsController_getProfessionalsByArea: {
        parameters: {
            query: {
                /** @description Latitud mínima del cuadrante (Bounding Box) */
                minLat: number;
                /** @description Latitud máxima del cuadrante (Bounding Box) */
                maxLat: number;
                /** @description Longitud mínima del cuadrante (Bounding Box) */
                minLng: number;
                /** @description Longitud máxima del cuadrante (Bounding Box) */
                maxLng: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    LocationsController_calculateDistance: {
        parameters: {
            query: {
                /** @description Latitud del Punto A */
                lat1: number;
                /** @description Longitud del Punto A */
                lng1: number;
                /** @description Latitud del Punto B */
                lat2: number;
                /** @description Longitud del Punto B */
                lng2: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DistanceResponseDTO"];
                };
            };
        };
    };
    PaymentController_findAll: {
        parameters: {
            query?: {
                /** @description Filtrar por ID de usuario */
                userId?: number;
                /** @description Filtrar por ID de profesional */
                professionalId?: number;
                /** @description Filtrar por estado del pago */
                status?: "PENDING" | "PAID" | "FAILED" | "REFUNDED" | "PARTIAL_REFUNDED" | "CANCELLED" | "PROCESSING" | "COMPLETED";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Lista de pagos obtenida */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaymentDetailResponseDTO"][];
                };
            };
        };
    };
    PaymentController_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreatePaymentDto"];
            };
        };
        responses: {
            /** @description Pago creado exitosamente */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaymentDetailResponseDTO"];
                };
            };
            /** @description Ya existe un pago para esta solicitud */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PaymentController_getSummary: {
        parameters: {
            query?: {
                /** @description Filtrar por ID de usuario */
                userId?: number;
                /** @description Filtrar por ID de profesional */
                professionalId?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Resumen obtenido */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaymentSummaryResponseDTO"];
                };
            };
        };
    };
    PaymentController_getTrends: {
        parameters: {
            query?: {
                /** @description Número de días a analizar */
                days?: number;
                /** @description Filtrar por ID de usuario */
                userId?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Tendencias obtenidas */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaymentTrendsResponseDTO"];
                };
            };
        };
    };
    PaymentController_findOne: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID UUID del pago */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Pago encontrado */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaymentDetailResponseDTO"];
                };
            };
            /** @description Pago no encontrado */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PaymentController_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID UUID del pago */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdatePaymentDto"];
            };
        };
        responses: {
            /** @description Pago actualizado */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaymentDetailResponseDTO"];
                };
            };
            /** @description Solo se pueden actualizar pagos pendientes */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PaymentController_cancel: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID UUID del pago */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Pago cancelado */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaymentDetailResponseDTO"];
                };
            };
            /** @description No tienes permisos para cancelar este pago */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PaymentController_refund: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID UUID del pago */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RefundPaymentDto"];
            };
        };
        responses: {
            /** @description Reembolso procesado */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaymentDetailResponseDTO"];
                };
            };
            /** @description El monto del reembolso excede el disponible */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PaymentController_createMethod: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreatePaymentMethodRequestDTO"];
            };
        };
        responses: {
            /** @description Método de pago creado */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaymentMethodDetailResponseDTO"];
                };
            };
        };
    };
    PaymentController_updateMethod: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID UUID del método de pago */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdatePaymentMethodDto"];
            };
        };
        responses: {
            /** @description Método de pago actualizado */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaymentMethodDetailResponseDTO"];
                };
            };
            /** @description Método de pago no encontrado */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PaymentController_deleteMethod: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID UUID del método de pago */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Método de pago eliminado */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description No se puede eliminar el único método de pago */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PaymentController_handleWebhooks: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Proveedor del webhook de pago */
                provider: "STRIPE" | "BANCARD" | "INFONET" | "PAYPAL" | "MERCADO_PAGO" | "RAPIPAGO" | "PAGOFACIL" | "CASH" | "DINELCO" | "BEPSA";
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Webhook procesado */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    NotificationsController_findAll: {
        parameters: {
            query?: {
                /** @description Límite máximo de notificaciones a retornar en la consulta */
                limit?: number;
                /** @description Cantidad de registros a omitir para paginación (Offset) */
                offset?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotificationResponseDTO"][];
                };
            };
        };
    };
    NotificationsController_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateNotificationRequestDTO"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotificationResponseDTO"];
                };
            };
        };
    };
    NotificationsController_findUnread: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotificationResponseDTO"][];
                };
            };
        };
    };
    NotificationsController_getUnreadCount: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UnreadCountResponseDTO"];
                };
            };
        };
    };
    NotificationsController_markAsRead: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Identificador único de la notificación (MongoDB ObjectId) */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotificationResponseDTO"];
                };
            };
        };
    };
    NotificationsController_markAllAsRead: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    NotificationsController_remove: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Identificador único de la notificación (MongoDB ObjectId) */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PromotionsController_findAll: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Lista de promociones */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PromotionDetailResponseDTO"][];
                };
            };
        };
    };
    PromotionsController_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreatePromotionRequestDTO"];
            };
        };
        responses: {
            /** @description Promoción creada exitosamente */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PromotionDetailResponseDTO"];
                };
            };
            /** @description El código de promoción ya existe */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description No autorizado */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PromotionsController_findActive: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Lista de promociones activas */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PromotionDetailResponseDTO"][];
                };
            };
        };
    };
    PromotionsController_getStats: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Estadísticas obtenidas */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PromotionStatsResponseDTO"];
                };
            };
            /** @description No autorizado */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PromotionsController_findOne: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID UUID de la promoción */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Promoción encontrada */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PromotionDetailResponseDTO"];
                };
            };
            /** @description Promoción no encontrada */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PromotionsController_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID UUID de la promoción */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Promoción actualizada */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PromotionDetailResponseDTO"];
                };
            };
            /** @description No autorizado */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Promoción no encontrada */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PromotionsController_remove: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID UUID de la promoción */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Promoción desactivada */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PromotionDetailResponseDTO"];
                };
            };
            /** @description No autorizado */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Promoción no encontrada */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PromotionsController_validatePromotion: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ValidatePromotionRequestDTO"];
            };
        };
        responses: {
            /** @description Resultado de validación */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PromotionValidateResponseDTO"];
                };
            };
            /** @description No autorizado */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PromotionsController_applyPromotion: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ApplyPromotionRequestDTO"];
            };
        };
        responses: {
            /** @description Resultado de la aplicación */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PromotionApplyResponseDTO"];
                };
            };
            /** @description No autorizado */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    RatingsController_findAll: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Lista de calificaciones obtenida exitosamente */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RatingsListResponseDTO"];
                };
            };
        };
    };
    RatingsController_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateRatingRequestDTO"];
            };
        };
        responses: {
            /** @description Calificación creada exitosamente */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RatingDetailResponseDTO"];
                };
            };
            /** @description Datos inválidos o calificación duplicada */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    RatingsController_createProfessionalToClientRating: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateProfessionalToClientRatingRequestDTO"];
            };
        };
        responses: {
            /** @description Calificación creada exitosamente */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RatingDetailResponseDTO"];
                };
            };
            /** @description Datos inválidos o calificación duplicada */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description El usuario autenticado no tiene perfil profesional */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Cliente no encontrado */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    RatingsController_getRecentRatings: {
        parameters: {
            query?: {
                /** @description Cantidad máxima de resultados */
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Calificaciones recientes obtenidas exitosamente */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RatingsListResponseDTO"];
                };
            };
        };
    };
    RatingsController_getTopRatedProfessionals: {
        parameters: {
            query?: {
                /** @description Cantidad máxima de resultados */
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Lista de profesionales mejor calificados */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TopRatedProfessionalResponseDTO"][];
                };
            };
        };
    };
    RatingsController_findByUser: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID del usuario */
                userId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Calificaciones del usuario obtenidas exitosamente */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RatingsListResponseDTO"];
                };
            };
        };
    };
    RatingsController_getUserRatingStats: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID del usuario */
                userId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Estadísticas del usuario obtenidas exitosamente */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserRatingStatsResponseDTO"];
                };
            };
        };
    };
    RatingsController_findByProfessional: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID del profesional */
                professionalId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Calificaciones del profesional obtenidas exitosamente */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RatingsListResponseDTO"];
                };
            };
        };
    };
    RatingsController_getClientRatings: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID del profesional */
                professionalId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Calificaciones de clientes obtenidas exitosamente */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RatingsListResponseDTO"];
                };
            };
        };
    };
    RatingsController_getAverageRating: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID del profesional */
                professionalId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Estadísticas de calificaciones obtenidas */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProfessionalRatingStatsResponseDTO"];
                };
            };
        };
    };
    RatingsController_findByServiceRequest: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID UUID de la solicitud de servicio */
                serviceRequestId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Calificaciones de la solicitud obtenidas exitosamente */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RatingsListResponseDTO"];
                };
            };
        };
    };
    RatingsController_findOne: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID UUID de la calificación */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Calificación encontrada exitosamente */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RatingDetailResponseDTO"];
                };
            };
            /** @description Calificación no encontrada */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    RatingsController_remove: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID UUID de la calificación */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Calificación eliminada exitosamente */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description No tienes permisos para eliminar esta calificación */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    RatingsController_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID UUID de la calificación */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateRatingRequestDTO"];
            };
        };
        responses: {
            /** @description Calificación actualizada exitosamente */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RatingDetailResponseDTO"];
                };
            };
            /** @description No se puede editar la calificación después de 24 horas */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description No tienes permisos para editar esta calificación */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    RatingsController_reportRating: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID UUID de la calificación */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReportRatingRequestDTO"];
            };
        };
        responses: {
            /** @description Calificación reportada exitosamente */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RatingDetailResponseDTO"];
                };
            };
            /** @description No puedes reportar tu propia calificación */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    CategoriesController_findAll: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Lista de categorías activas. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CategoryDetailResponseDTO"][];
                };
            };
        };
    };
    CategoriesController_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateCategoryDto"];
            };
        };
        responses: {
            /** @description Categoría creada exitosamente. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CategoryDetailResponseDTO"];
                };
            };
            /** @description Datos de entrada inválidos. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Ya existe una categoría con este nombre. */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    CategoriesController_findAllWithRelations: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Árbol completo de categorías. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CategoryDetailResponseDTO"][];
                };
            };
        };
    };
    CategoriesController_findMainCategories: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Lista de categorías raíz. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CategoryDetailResponseDTO"][];
                };
            };
        };
    };
    CategoriesController_findSubcategories: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID de la categoría padre */
                parentId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Lista de subcategorías. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CategoryDetailResponseDTO"][];
                };
            };
            /** @description Categoría padre no encontrada. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    CategoriesController_searchCategories: {
        parameters: {
            query: {
                /** @description Término o palabra clave de búsqueda */
                q: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Resultados de búsqueda. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CategoryDetailResponseDTO"][];
                };
            };
        };
    };
    CategoriesController_findOne: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID de la categoría */
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Categoría encontrada. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CategoryDetailResponseDTO"];
                };
            };
            /** @description Categoría no encontrada. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    CategoriesController_remove: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID de la categoría */
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Categoría eliminada. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description No se puede eliminar: tiene dependencias activas. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Categoría no encontrada. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    CategoriesController_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID de la categoría */
                id: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateCategoryDto"];
            };
        };
        responses: {
            /** @description Categoría actualizada. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CategoryDetailResponseDTO"];
                };
            };
            /** @description Categoría no encontrada. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Ya existe otra categoría con este nombre. */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    CategoriesController_findBySlug: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Slug único estructurado url-ready */
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Categoría encontrada. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CategoryDetailResponseDTO"];
                };
            };
            /** @description Categoría no encontrada por el slug provisto. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    CategoriesController_getCategoryStats: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID de la categoría */
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Estadísticas de la categoría. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CategoryStatsResponseDTO"];
                };
            };
            /** @description Categoría no encontrada. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    CategoriesController_changeStatus: {
        parameters: {
            query: {
                /** @description Nuevo estado de la categoría */
                status: "ACTIVE" | "INACTIVE" | "PENDING";
            };
            header?: never;
            path: {
                /** @description ID de la categoría */
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Estado actualizado. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CategoryDetailResponseDTO"];
                };
            };
            /** @description Categoría no encontrada. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    CategoriesController_toggleVisibility: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID de la categoría */
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Visibilidad actualizada. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CategoryDetailResponseDTO"];
                };
            };
            /** @description Categoría no encontrada. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UploadsController_uploadImage: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": {
                    /** Format: binary */
                    file: string;
                };
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FileInfoResponseDTO"];
                };
            };
        };
    };
    UploadsController_uploadDocument: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": {
                    /** Format: binary */
                    file: string;
                };
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FileInfoResponseDTO"];
                };
            };
        };
    };
    UploadsController_uploadAvatar: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": {
                    /** Format: binary */
                    file: string;
                };
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FileInfoResponseDTO"];
                };
            };
        };
    };
    UploadsController_uploadMerchantDocs: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": {
                    /**
                     * Format: binary
                     * @description Archivo: documentFrontImage (Max: 1)
                     */
                    documentFrontImage: string;
                    /**
                     * Format: binary
                     * @description Archivo: documentBackImage (Max: 1)
                     */
                    documentBackImage: string;
                    /**
                     * Format: binary
                     * @description Archivo: commercialInvoiceImage (Max: 1)
                     */
                    commercialInvoiceImage: string;
                    /**
                     * Format: binary
                     * @description Archivo: businessLicenseImage (Max: 1)
                     */
                    businessLicenseImage: string;
                    /**
                     * Format: binary
                     * @description Archivo: storefrontImage (Max: 1)
                     */
                    storefrontImage: string;
                };
            };
        };
        responses: {
            /** @description Documentos subidos exitosamente. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UploadsController_getPresignedUrl: {
        parameters: {
            query: {
                /** @description Clave S3 del archivo */
                key: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        url?: string;
                    };
                };
            };
        };
    };
    UploadsController_getFileInfo: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Nombre del archivo */
                filename: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UploadsController_deleteFile: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Nombre del archivo */
                filename: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        message?: string;
                    };
                };
            };
        };
    };
    AnalyticsController_getDashboardStats: {
        parameters: {
            query?: {
                /** @description Pagina para paginación de resultados (opcional, por defecto 1) */
                page?: number;
                /** @description Pagina para paginación de resultados (opcional, por defecto 10) */
                pageSize?: number;
                /** @description Campo por el cual ordenar los resultados (opcional, por defecto "fechaHora") y orden ascendente o descendente (opcional, por defecto "DESC"), separados por : */
                orderBy?: string;
                /** @description Fecha de rango de inicio de consulta */
                startDate?: string;
                /** @description Fecha de rango de fin de consulta */
                endDate?: string;
                /** @description Código/s de sucursal/es especifica hasta 10 */
                branches?: string;
                /** @description Rango de tiempo predefinido */
                timeRange?: "DAY" | "WEEK" | "MONTH" | "QUARTER" | "YEAR";
                /** @description Tipo de análisis */
                type?: "users" | "professionals" | "services" | "payments" | "ratings" | "revenue" | "performance";
                /** @description ID de categoría para filtrar resultados */
                categoryId?: string;
                /** @description ID de ubicación para filtrar resultados */
                locationId?: string;
                /** @description ID de profesional para filtrar resultados */
                professionalId?: string;
                /** @description ID de usuario para filtrar resultados */
                userId?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DashboardStatsResponseDTO"];
                };
            };
        };
    };
    AnalyticsController_getCategoryPerformance: {
        parameters: {
            query?: {
                /** @description Pagina para paginación de resultados (opcional, por defecto 1) */
                page?: number;
                /** @description Pagina para paginación de resultados (opcional, por defecto 10) */
                pageSize?: number;
                /** @description Campo por el cual ordenar los resultados (opcional, por defecto "fechaHora") y orden ascendente o descendente (opcional, por defecto "DESC"), separados por : */
                orderBy?: string;
                /** @description Fecha de rango de inicio de consulta */
                startDate?: string;
                /** @description Fecha de rango de fin de consulta */
                endDate?: string;
                /** @description Código/s de sucursal/es especifica hasta 10 */
                branches?: string;
                /** @description Rango de tiempo predefinido */
                timeRange?: "DAY" | "WEEK" | "MONTH" | "QUARTER" | "YEAR";
                /** @description Tipo de análisis */
                type?: "users" | "professionals" | "services" | "payments" | "ratings" | "revenue" | "performance";
                /** @description ID de categoría para filtrar resultados */
                categoryId?: string;
                /** @description ID de ubicación para filtrar resultados */
                locationId?: string;
                /** @description ID de profesional para filtrar resultados */
                professionalId?: string;
                /** @description ID de usuario para filtrar resultados */
                userId?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CategoryPerformanceResponseDTO"];
                };
            };
        };
    };
}
