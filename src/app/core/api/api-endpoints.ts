export const API_ENDPOINTS = {
  // Surety - Authentication
  auth: {
    userInfo: '/api/surety/auth/get/user-information',
    login: '/api/surety/auth/login',
  },

  // Surety - Users
  users: {
    getAll: '/api/surety/user/get-all',
    getById: '/api/surety/user/get-by-id', // + /{id}
    create: '/api/surety/user/create',
    update: '/api/surety/user/update',
    delete: '/api/surety/user/delete',
  },

  // Surety - Roles
  roles: {
    getAll: '/api/surety/role/get-all',
    getById: '/api/surety/role', // + /{id}
    getPermissions: '/api/surety/role', // + /{id}/permissions
    create: '/api/surety/role/create',
    updatePermissions: '/api/surety/role/permissions',
    update: '/api/surety/role/update',
    delete: '/api/surety/role/delete',
  },

  // Surety - Permissions
  permissions: {
    getByRole: '/api/surety/permission/permisos-por-rol',
  },

  // Clinic - Companion
  companion: {
    getAll: '/api/clinic/companion/get-all',
    getById: '/api/clinic/companion/get-by-id', // + /{id}
    create: '/api/clinic/companion/create',
    update: '/api/clinic/companion/update',
    delete: '/api/clinic/companion/delete',
  },

  // Clinic - Customer
  customer: {
    getAll: '/api/clinic/customer/get-all',
    getById: '/api/clinic/customer/get-by-id', // + /{id}
    create: '/api/clinic/customer/create',
    update: '/api/clinic/customer/update',
    delete: '/api/clinic/customer/delete',
  },

  // Clinic - Person
  person: {
    getPaged: '/api/clinic/person/get-paged',
    getById: '/api/clinic/person/get-by-id', // + /{id}
    create: '/api/clinic/person/create',
    update: '/api/clinic/person/update',
  },

  // Clinic - Professional
  professional: {
    getAll: '/api/clinic/professional/get-all',
    getById: '/api/clinic/professional/get-by-id', // + /{id}
    create: '/api/clinic/professional/create',
    update: '/api/clinic/professional/update',
    delete: '/api/clinic/professional/delete',
  },

  // Master - Blood Type
  bloodType: {
    getAll: '/api/master/blood-type/get-all',
    getById: '/api/master/blood-type/get-by-id', // + /{id}
    create: '/api/master/blood-type/create',
    update: '/api/master/blood-type/update',
    delete: '/api/master/blood-type/delete',
  },

  // Master - Bundle
  bundle: {
    getAll: '/api/master/bundle/get-all',
    getById: '/api/master/bundle/get-by-id', // + /{id}
    create: '/api/master/bundle/create',
    update: '/api/master/bundle/update',
    delete: '/api/master/bundle/delete',
  },

  // Master - Item Type
  itemType: {
    getAll: '/api/masters/item-type/get-all',
    getById: '/api/masters/item-type/get-by-id', // + /{id}
    create: '/api/masters/item-type/create',
    update: '/api/masters/item-type/update',
    delete: '/api/masters/item-type/delete',
  },

  // Master - Gender
  gender: {
    getAll: '/api/master/gender/get-all',
    getById: '/api/master/gender/get-by-id', // + /{id}
    create: '/api/master/gender/create',
    update: '/api/master/gender/update',
    delete: '/api/master/gender/delete',
  },

  // Master - Identification Type
  identificationType: {
    getAll: '/api/master/identification-type/get-all',
    getById: '/api/master/identification-type/get-by-id', // + /{id}
    create: '/api/master/identification-type/create',
    update: '/api/master/identification-type/update',
    delete: '/api/master/identification-type/delete',
  },

  // Master - Job Title
  jobTitle: {
    getAll: '/api/master/job-title/get-all',
    getById: '/api/master/job-title/get-by-id', // + /{id}
    create: '/api/master/job-title/create',
    update: '/api/master/job-title/update',
    delete: '/api/master/job-title/delete',
  },

  // Master - Room Type
  roomType: {
    getAll: '/api/master/room-type/get-all',
    getById: '/api/master/room-type/get-by-id', // + /{id}
    create: '/api/master/room-type/create',
    update: '/api/master/room-type/update',
    delete: '/api/master/room-type/delete',
  },

  // Information
  information: {
    get: '/api/information/get',
  },
} as const;
