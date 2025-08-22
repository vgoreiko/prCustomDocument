import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { TUserState, ToolsEntitlement } from '../store/app.state';

// Mock user state for demonstration - replace with actual NgRx store when available
const mockUserState: TUserState = {
  firstName: 'John',
  lastName: 'Doe',
  mrnccdToolAnalitycs: true,
  mrnccdToolsDashboard: true,
  productSupportTickets: true,
  productSupportKnowledgeBase: true
};

// Permission-based auth guard
export const authGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => {
  const router = inject(Router);
  
  // Check if route has permission requirements
  const requiredPermissions = route.data['permission'] as Array<keyof TUserState>;
  
  if (!requiredPermissions || requiredPermissions.length === 0) {
    // No permissions required, allow access
    return of(true);
  }
  
  // Check if user has all required permissions
  const hasAllPermissions = requiredPermissions.every(permission => 
    mockUserState[permission] === true
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

  // Method to check if user can access a specific route
  const canAccessRoute = (routeName: keyof TUserState): Observable<boolean> => {
    const permission = mockUserState[routeName];
    return of(typeof permission === 'boolean' ? permission : false);
  };

  // Method to get current user state
  const getCurrentUser = (): Observable<TUserState | null> => {
    return of(mockUserState);
  };

  // Method to check if user is authenticated (has firstName and lastName)
  const isAuthenticated = (): Observable<boolean> => {
    return of(!!(mockUserState.firstName && mockUserState.lastName));
  };

  // Method to get user's full name
  const getUserFullName = (): Observable<string> => {
    if (mockUserState.firstName && mockUserState.lastName) {
      return of(`${mockUserState.firstName} ${mockUserState.lastName}`);
    }
    return of('Unknown User');
  };

  // Method to check specific permissions
  const hasPermission = (permission: keyof TUserState): Observable<boolean> => {
    return canAccessRoute(permission);
  };

  // Method to check multiple permissions (all must be true)
  const hasAllPermissions = (permissions: Array<keyof TUserState>): Observable<boolean> => {
    const hasAll = permissions.every(permission => mockUserState[permission] || false);
    return of(hasAll);
  };

  // Method to check multiple permissions (at least one must be true)
  const hasAnyPermission = (permissions: Array<keyof TUserState>): Observable<boolean> => {
    const hasAny = permissions.some(permission => mockUserState[permission] || false);
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
  const permission = mockUserState[routeName];
  return of(typeof permission === 'boolean' ? permission : false);
};

export const getCurrentUser = (): Observable<TUserState | null> => {
  return of(mockUserState);
};

export const isAuthenticated = (): Observable<boolean> => {
  return of(!!(mockUserState.firstName && mockUserState.lastName));
};

export const getUserFullName = (): Observable<string> => {
  if (mockUserState.firstName && mockUserState.lastName) {
    return of(`${mockUserState.firstName} ${mockUserState.lastName}`);
  }
  return of('Unknown User');
};

export const hasPermission = (permission: keyof TUserState): Observable<boolean> => {
  return canAccessRoute(permission);
};

export const hasAllPermissions = (permissions: Array<keyof TUserState>): Observable<boolean> => {
  const hasAll = permissions.every(permission => mockUserState[permission] || false);
  return of(hasAll);
};

export const hasAnyPermission = (permissions: Array<keyof TUserState>): Observable<boolean> => {
  const hasAny = permissions.some(permission => mockUserState[permission] || false);
  return of(hasAny);
};
