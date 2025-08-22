import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

export const parentPermissionGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => {
  const router = inject(Router);
  
  // If this route already has permissions, don't modify it
  if (route.data['permission']) {
    return of(true);
  }
  
  // Collect all permissions from child routes
  const childPermissions = collectChildPermissions(route);
  
  // Add collected permissions to the parent route data
  if (childPermissions.length > 0) {
    route.data['permission'] = childPermissions;
  }
  
  return of(true);
};

/**
 * Recursively collects all permissions from child routes
 */
function collectChildPermissions(route: ActivatedRouteSnapshot): string[] {
  const permissions: string[] = [];
  
  // Check if current route has permissions
  if (route.data['permission']) {
    const routePermissions = route.data['permission'];
    if (Array.isArray(routePermissions)) {
      permissions.push(...routePermissions);
    } else if (typeof routePermissions === 'string') {
      permissions.push(routePermissions);
    }
  }
  
  // Recursively check child routes
  if (route.children) {
    route.children.forEach(child => {
      const childPerms = collectChildPermissions(child);
      permissions.push(...childPerms);
    });
  }
  
  // Remove duplicates and return
  return [...new Set(permissions)];
}
