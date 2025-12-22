export interface Role {
  id: string;
  name: string;
  description?: string;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoleCreate {
  name: string;
  description?: string;
  status: boolean;
}

export interface RoleUpdate {
  id: string;
  name: string;
  description?: string;
  status: boolean;
}

export interface Permission {
  id: string;
  permissionId: string;
  roleId: string;
  permissionName: string;
  active: boolean;
}

export interface RolePermission {
  permissionId: string;
  roleId: string;
}

export interface RolePermissionUpdate {
  permissionsToAdd: RolePermission[];
  permissionsToRemove: { rolePermissionId: string }[];
}
