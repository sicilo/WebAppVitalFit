export interface Role {
  id: string;
  name: string;
  createdAt: string;
  updatedAt?: string;
}

export interface RolePermissionView {
  id: string;
  permissionId: string;
  roleId: string;
  permissionName: string;
  active: boolean;
}


export interface PermissionByRoleView {
  roleName: string;
  actions: {
    permissionId: string;
    actionId: string;
    actionName: string;
    active: boolean;
  }[]
}

export interface CreateRoleRequest {
  name: string;
}

export interface UpdateRoleRequest {
  id: string;
  name: string;
}

export interface AddPermissionToRole {
  permissionId: string;
  roleId: string;
}

export interface RemovePermissionFromRole {
  rolePermissionId: string;
}

export interface ManageRolePermissionsRequest {
  permissionsToAdd?: AddPermissionToRole[];
  permissionsToRemove?: RemovePermissionFromRole[];
}
