import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ToolsEntitlement } from '../store/app.state';

// Define the structure of route data with permissions
interface IRouteDataWithPermissions {
  permission?: string[] | string;
  [key: string]: any; // Allow other properties
}

// Extend ActivatedRouteSnapshot to include our typed data
interface ITypedActivatedRouteSnapshot extends ActivatedRouteSnapshot {
  data: IRouteDataWithPermissions;
}

export const parentPermissionGuard = (
  route: ITypedActivatedRouteSnapshot
): Observable<boolean> => {
  // If this route already has permissions, don't modify it
  if (route.data.permission) {
    return of(true);
  }
  
  // Collect all permissions from child routes
  const childPermissions = collectChildPermissions(route);
  
  // Add collected permissions to the parent route data
  // Use Object.defineProperty to avoid "object is not extensible" error
  if (childPermissions.length > 0) {
    try {
      // Try to add the permission property safely
      Object.defineProperty(route.data, 'permission', {
        value: childPermissions,
        writable: true,
        enumerable: true,
        configurable: true
      });
    } catch (error) {
      console.warn('Could not add permission to route data:', error);
      // If we can't modify the route data, we'll still return true
      // The dynamic redirect guard will handle the permission checking
    }
  }
  
  return of(true);
};

/**
 * Recursively collects all permissions from child routes
 */
function collectChildPermissions(route: ITypedActivatedRouteSnapshot): string[] {
  const permissions: string[] = [];
  
  // Check if current route has permissions
  if (route.data.permission) {
    const routePermissions = route.data.permission;
    if (Array.isArray(routePermissions)) {
      permissions.push(...routePermissions);
    } else if (typeof routePermissions === 'string') {
      permissions.push(routePermissions);
    }
  }
  
  // Recursively check child routes
  if (route.children) {
    route.children.forEach(child => {
      const childPerms = collectChildPermissions(child as ITypedActivatedRouteSnapshot);
      permissions.push(...childPerms);
    });
  }
  
  // Remove duplicates and return
  return [...new Set(permissions)];
}
