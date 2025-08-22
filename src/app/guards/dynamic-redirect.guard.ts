import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of, map, take } from 'rxjs';
import { PermissionService } from '../services/permission.service';

interface RouteWithPath {
  path?: string;
  data?: any;
}

export const dynamicRedirectGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => {
  const router = inject(Router);
  const permissionService = inject(PermissionService);
  
  // Check if this is a parent route that should trigger dynamic redirect
  if (!shouldTriggerDynamicRedirect(route, state)) {
    return of(true);
  }
  
  // Get child routes from the current route
  const childRoutes = route.children?.[0]?.children || [];
  
  // If no child routes found, allow the route to proceed
  if (childRoutes.length === 0) {
    return of(true);
  }
  
  // Get user permissions from service and find first accessible route
  return permissionService.permissions$.pipe(
    take(1),
    map(userPermissions => {
      // Find the first accessible child route
      const firstAccessibleRoute = findFirstAccessibleRoute(childRoutes, userPermissions);
      
      if (firstAccessibleRoute) {
        // Redirect to the first accessible route
        router.navigate([state.url, firstAccessibleRoute.path]);
        return false; // Prevent the current route from activating
      }
      
      // If no accessible routes found, log this and redirect to an error page or home
      console.warn('No accessible child routes found for user:', userPermissions);
      console.warn('Available routes:', childRoutes.map((r: RouteWithPath) => ({ 
        path: r.path, 
        permissions: r.data?.['permission'] 
      })));
      
      // You can redirect to an error page or handle this case according to your business logic
      // For now, we'll redirect to the home page
      router.navigate(['/']);
      return false;
    })
  );
};

/**
 * Determines if the current route should trigger dynamic redirect behavior
 * This function detects parent routes that have child routes with permissions
 */
function shouldTriggerDynamicRedirect(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  // Get the current URL segments
  const urlSegments = state.url.split('/').filter(segment => segment.length > 0);
  
  // If we're already on a specific child route (more than one segment), don't redirect
  if (urlSegments.length > 1) {
    return false;
  }
  
  // Check if this route has child routes with permissions
  const childRoutes = route.children?.[0]?.children || [];
  const hasChildrenWithPermissions = childRoutes.some((childRoute: any) => 
    childRoute.data?.['permission']
  );
  
  // Only trigger dynamic redirect if:
  // 1. We're on a parent route (single URL segment)
  // 2. The route has child routes with permission requirements
  return hasChildrenWithPermissions;
}

/**
 * Finds the first child route that the user has access to
 */
function findFirstAccessibleRoute(routes: any[], userPermissions: any): RouteWithPath | null {
  for (const route of routes) {
    if (route.data?.['permission']) {
      const requiredPermissions = Array.isArray(route.data['permission']) 
        ? route.data['permission'] 
        : [route.data['permission']];
      
      // Check if user has access to this route
      const hasAccess = requiredPermissions.every((permission: string) => {
        return userPermissions[permission] === true;
      });
      
      if (hasAccess) {
        return route;
      }
    }
  }
  
  return null;
}
