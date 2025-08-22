import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { TUserState, ToolsEntitlement } from '../store/app.state';
import { PermissionService } from '../services/permission.service';

// Permission-based auth guard
export const authGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => {
  const router = inject(Router);
  const permissionService = inject(PermissionService);
  
  // Check if route has permission requirements
  const requiredPermissions = route.data['permission'] as Array<keyof TUserState>;
  
  if (!requiredPermissions || requiredPermissions.length === 0) {
    // No permissions required, allow access
    return of(true);
  }
  
  // Check if user has all required permissions using the permission service
  const hasAllPermissions = requiredPermissions.every(permission => 
    permissionService.hasPermission(permission)
  );
  
  if (!hasAllPermissions) {
    // User doesn't have required permissions, redirect to unauthorized or deny access
    console.warn(`Access denied: User missing permissions: ${requiredPermissions.join(', ')}`);
    return of(false);
  }
  
  return of(true);
};

// Factory function to create auth guard functions
export const createAuthGuard = () => {
  const router = inject(Router);
  const permissionService = inject(PermissionService);

  // Method to check if user can access a specific route
  const canAccessRoute = (routeName: keyof TUserState): Observable<boolean> => {
    const permission = permissionService.hasPermission(routeName);
    return of(permission);
  };

  // Method to get current user state
  const getCurrentUser = (): Observable<TUserState | null> => {
    // Create a mock user with permissions from the service
    const mockUser: TUserState = {
      firstName: 'John',
      lastName: 'Doe',
      mrnccdToolAnalitycs: permissionService.hasPermission('mrnccdToolAnalitycs'),
      mrnccdToolsDashboard: permissionService.hasPermission('mrnccdToolsDashboard'),
      productSupportTickets: permissionService.hasPermission('productSupportTickets'),
      productSupportKnowledgeBase: permissionService.hasPermission('productSupportKnowledgeBase')
    };
    return of(mockUser);
  };

  // Method to check if user is authenticated (has firstName and lastName)
  const isAuthenticated = (): Observable<boolean> => {
    return of(true); // Mock user is always authenticated
  };

  // Method to get user's full name
  const getUserFullName = (): Observable<string> => {
    return of('John Doe');
  };

  // Method to check specific permissions
  const hasPermission = (permission: keyof TUserState): Observable<boolean> => {
    return of(permissionService.hasPermission(permission));
  };

  // Method to check multiple permissions (all must be true)
  const hasAllPermissions = (permissions: Array<keyof TUserState>): Observable<boolean> => {
    const hasAll = permissionService.hasPermissions(permissions);
    return of(hasAll);
  };

  // Method to check multiple permissions (at least one must be true)
  const hasAnyPermission = (permissions: Array<keyof TUserState>): Observable<boolean> => {
    const hasAny = permissions.some(permission => permissionService.hasPermission(permission));
    return of(hasAny);
  };

  return {
    canAccessRoute,
    getCurrentUser,
    isAuthenticated,
    getUserFullName,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission
  };
};

// Individual functional functions for direct use
export const canAccessRoute = (routeName: keyof TUserState): Observable<boolean> => {
  const permissionService = inject(PermissionService);
  const permission = permissionService.hasPermission(routeName);
  return of(permission);
};

export const getCurrentUser = (): Observable<TUserState | null> => {
  const permissionService = inject(PermissionService);
  const mockUser: TUserState = {
    firstName: 'John',
    lastName: 'Doe',
    mrnccdToolAnalitycs: permissionService.hasPermission('mrnccdToolAnalitycs'),
    mrnccdToolsDashboard: permissionService.hasPermission('mrnccdToolsDashboard'),
    productSupportTickets: permissionService.hasPermission('productSupportTickets'),
    productSupportKnowledgeBase: permissionService.hasPermission('productSupportKnowledgeBase')
  };
  return of(mockUser);
};

export const isAuthenticated = (): Observable<boolean> => {
  return of(true);
};

export const getUserFullName = (): Observable<string> => {
  return of('John Doe');
};

export const hasPermission = (permission: keyof TUserState): Observable<boolean> => {
  const permissionService = inject(PermissionService);
  return of(permissionService.hasPermission(permission));
};

export const hasAllPermissions = (permissions: Array<keyof TUserState>): Observable<boolean> => {
  const permissionService = inject(PermissionService);
  const hasAll = permissionService.hasPermissions(permissions);
  return of(hasAll);
};

export const hasAnyPermission = (permissions: Array<keyof TUserState>): Observable<boolean> => {
  const permissionService = inject(PermissionService);
  const hasAny = permissions.some(permission => permissionService.hasPermission(permission));
  return of(hasAny);
};
