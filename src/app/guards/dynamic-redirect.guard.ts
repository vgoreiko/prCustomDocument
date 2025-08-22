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
  
  console.log('🔍 DynamicRedirectGuard - Route:', route.url);
  console.log('🔍 DynamicRedirectGuard - State URL:', state.url);
  
  // Check if this is a parent route that should trigger dynamic redirect
  if (!shouldTriggerDynamicRedirect(route, state)) {
    console.log('🔍 DynamicRedirectGuard - Not triggering redirect');
    return of(true);
  }
  
  console.log('🔍 DynamicRedirectGuard - Will trigger redirect');
  
  // Get user permissions from service and find first accessible route
  return permissionService.permissions$.pipe(
    take(1),
    map(userPermissions => {
      console.log('🔍 DynamicRedirectGuard - User permissions:', userPermissions);
      
      // For lazy-loaded routes, we need to check permissions against known route paths
      const firstAccessibleRoute = findFirstAccessibleRouteForParent(state.url, userPermissions);
      console.log('🔍 DynamicRedirectGuard - First accessible route:', firstAccessibleRoute);
      
      if (firstAccessibleRoute) {
        // Redirect to the first accessible route
        console.log(`🚀 Dynamic redirect: ${state.url} -> ${firstAccessibleRoute}`);
        router.navigate([firstAccessibleRoute]);
        return false; // Prevent the current route from activating
      }
      
      // If no accessible routes found, log this and redirect to an error page or home
      console.warn('❌ No accessible child routes found for user:', userPermissions);
      console.warn('❌ Current route:', state.url);
      
      // You can redirect to an error page or handle this case according to your business logic
      // For now, we'll redirect to the home page
      router.navigate(['/']);
      return false;
    })
  );
};

/**
 * Determines if the current route should trigger dynamic redirect behavior
 * This function detects parent routes that should redirect to accessible child routes
 */
function shouldTriggerDynamicRedirect(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  // Get the current URL segments
  const urlSegments = state.url.split('/').filter(segment => segment.length > 0);
  console.log('🔍 shouldTriggerDynamicRedirect - URL segments:', urlSegments);
  
  // If we're already on a specific child route (more than one segment), don't redirect
  if (urlSegments.length > 1) {
    console.log('🔍 shouldTriggerDynamicRedirect - Already on child route, no redirect');
    return false;
  }
  
  // Check if this is a known parent route that should have dynamic redirect
  const parentRoutes = ['mrnccd-tools', 'product-support'];
  const shouldRedirect = parentRoutes.includes(urlSegments[0]);
  console.log('🔍 shouldTriggerDynamicRedirect - Should redirect:', shouldRedirect, 'for route:', urlSegments[0]);
  return shouldRedirect;
}

/**
 * Finds the first accessible route for a given parent route based on user permissions
 */
function findFirstAccessibleRouteForParent(parentUrl: string, userPermissions: any): string | null {
  console.log('🔍 findFirstAccessibleRouteForParent - Parent URL:', parentUrl);
  console.log('🔍 findFirstAccessibleRouteForParent - User permissions:', userPermissions);
  
  if (parentUrl === '/mrnccd-tools') {
    console.log('🔍 Checking MRNCCD tools routes...');
    // Check MRNCCD tools routes in order of preference
    if (userPermissions.mrnccdToolsDashboard) {
      console.log('🔍 Found accessible route: dashboard');
      return '/mrnccd-tools/dashboard';
    }
    if (userPermissions.mrnccdToolAnalitycs) {
      console.log('🔍 Found accessible route: analytics');
      return '/mrnccd-tools/analytics';
    }
    // permission-demo doesn't require permissions, so it's always accessible
    console.log('🔍 Found accessible route: permission-demo (fallback)');
    return '/mrnccd-tools/permission-demo';
  }
  
  if (parentUrl === '/product-support') {
    console.log('🔍 Checking Product Support routes...');
    // Check Product Support routes in order of preference
    if (userPermissions.productSupportTickets) {
      console.log('🔍 Found accessible route: tickets');
      return '/product-support/tickets';
    }
    if (userPermissions.productSupportKnowledgeBase) {
      console.log('🔍 Found accessible route: knowledge-base');
      return '/product-support/knowledge-base';
    }
    // If no permissions, redirect to home
    console.log('🔍 No accessible Product Support routes found');
    return null;
  }
  
  console.log('🔍 Unknown parent route:', parentUrl);
  return null;
}
