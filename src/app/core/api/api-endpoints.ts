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
    getAll: '/api/masters/blood-type/get-all',
    getById: '/api/masters/blood-type/get-by-id', // + /{id}
    create: '/api/masters/blood-type/create',
    update: '/api/masters/blood-type/update',
    delete: '/api/masters/blood-type/delete',
  },

  // Master - Bundle
  bundle: {
    getAll: '/api/configuration/bundle/get-all',
    getById: '/api/configuration/bundle/get-by-id', // + /{id}
    create: '/api/configuration/bundle/create',
    update: '/api/configuration/bundle/update',
    delete: '/api/configuration/bundle/delete',
  },

  // Configuration - Bundle Items
  bundleItems: {
    getAll: '/api/configuration/bundle-items/get-all',
    create: '/api/configuration/bundle-items/create',
  },

  // Master - Item
  item: {
    getPaged: '/api/clinic/item/get-paged',
    create: '/api/clinic/item/create',
    update: '/api/clinic/item/update',
    delete: '/api/clinic/item/delete',
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
    getAll: '/api/masters/gender/get-all',
    getById: '/api/masters/gender/get-by-id', // + /{id}
    create: '/api/masters/gender/create',
    update: '/api/masters/gender/update',
    delete: '/api/masters/gender/delete',
  },

  // Master - Identification Type
  identificationType: {
    getAll: '/api/masters/identification-type/get-all',
    getById: '/api/masters/identification-type/get-by-id', // + /{id}
    create: '/api/masters/identification-type/create',
    update: '/api/masters/identification-type/update',
    delete: '/api/masters/identification-type/delete',
  },

  // Master - Job Title
  jobTitle: {
    getAll: '/api/masters/job-title/get-all',
    getById: '/api/masters/job-title/get-by-id', // + /{id}
    create: '/api/masters/job-title/create',
    update: '/api/masters/job-title/update',
    delete: '/api/masters/job-title/delete',
  },

  // Master - Room Type
  roomType: {
    getAll: '/api/masters/room-type/get-all',
    getById: '/api/masters/room-type/get-by-id', // + /{id}
    create: '/api/masters/room-type/create',
    update: '/api/masters/room-type/update',
    delete: '/api/masters/room-type/delete',
  },

  // Clinic - Appointment
  appointment: {
    create: '/api/clinic/appointment/create',
    update: '/api/clinic/appointment/update',
    delete: '/api/clinic/appointment/delete',
  },

  // Clinic - Room
  room: {
    getPaged: '/api/clinic/room/get-paged',
    getById: '/api/clinic/room/get-by-id',
    create: '/api/clinic/room/create',
    update: '/api/clinic/room/update',
    delete: '/api/clinic/room/delete',
  },

  serviceOrder: {
    getPaged: '/api/clinic/service-order/get-paged',
    getById: '/api/clinic/service-order/get-by-id', // ?Id={id} | ?Consecutive={consecutive}
    create: '/api/clinic/service-order/create',
    update: '/api/clinic/service-order/update',
    delete: '/api/clinic/service-order/delete',
  },

  // Information
  information: {
    get: '/api/information/get',
  },
} as const;
