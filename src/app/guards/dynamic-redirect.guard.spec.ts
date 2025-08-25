import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { dynamicRedirectGuard } from './dynamic-redirect.guard';
import { PermissionService, UserPermissions } from '../services/permission.service';

describe('DynamicRedirectGuard', () => {
  let mockRouter: { navigate: any };
  let mockPermissionService: { permissions$: any };
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    // Create Jest-compatible mock functions
    const mockNavigate = jest.fn();
    mockNavigate.mockReturnValue(undefined);
    
    mockRouter = {
      navigate: mockNavigate
    };
    
    mockPermissionService = {
      permissions$: of({
        mrnccdToolAnalitycs: false,
        mrnccdToolsDashboard: false,
        productSupportTickets: false,
        productSupportKnowledgeBase: false
      })
    };
    
    mockRoute = {
      children: [{
        children: [
          {
            path: 'dashboard',
            data: { permission: ['mrnccdToolsDashboard'] }
          },
          {
            path: 'analytics',
            data: { permission: ['mrnccdToolAnalitycs'] }
          }
        ]
      }]
    } as any;
    
    mockState = {
      url: '/mrnccd-tools'
    } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: PermissionService, useValue: mockPermissionService }
      ]
    });
  });

  it('should redirect to first accessible route when user has dashboard permission', () => {
    const mockUserPermissions: UserPermissions = {
      mrnccdToolAnalitycs: false,
      mrnccdToolsDashboard: true,
      productSupportTickets: false,
      productSupportKnowledgeBase: false
    };
    
    mockPermissionService.permissions$ = of(mockUserPermissions);
    
    const result = dynamicRedirectGuard(mockRoute, mockState);
    
    result.subscribe(shouldActivate => {
      expect(shouldActivate).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/mrnccd-tools/dashboard']);
    });
  });

  it('should redirect to analytics when user only has analytics permission', () => {
    const mockUserPermissions: UserPermissions = {
      mrnccdToolAnalitycs: true,
      mrnccdToolsDashboard: false,
      productSupportTickets: false,
      productSupportKnowledgeBase: false
    };
    
    mockPermissionService.permissions$ = of(mockUserPermissions);
    
    const result = dynamicRedirectGuard(mockRoute, mockState);
    
    result.subscribe(shouldActivate => {
      expect(shouldActivate).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/mrnccd-tools/analytics']);
    });
  });

  it('should redirect to home when user has no permissions', () => {
    const mockUserPermissions: UserPermissions = {
      mrnccdToolAnalitycs: false,
      mrnccdToolsDashboard: false,
      productSupportTickets: false,
      productSupportKnowledgeBase: false
    };
    
    mockPermissionService.permissions$ = of(mockUserPermissions);
    
    const result = dynamicRedirectGuard(mockRoute, mockState);
    
    result.subscribe(shouldActivate => {
      expect(shouldActivate).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  it('should allow route when already on a child route', () => {
    mockState.url = '/mrnccd-tools/dashboard';
    
    const result = dynamicRedirectGuard(mockRoute, mockState);
    
    result.subscribe(shouldActivate => {
      expect(shouldActivate).toBe(true);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  it('should allow route when there are no child routes with permissions', () => {
    mockRoute.children = [{
      children: [
        {
          path: 'public-page',
          // No permission data
        }
      ]
    }] as any;
    
    const result = dynamicRedirectGuard(mockRoute, mockState);
    
    result.subscribe(shouldActivate => {
      expect(shouldActivate).toBe(true);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  it('should work with any parent route name (not hardcoded)', () => {
    mockState.url = '/custom-feature';
    mockRoute.children = [{
      children: [
        {
          path: 'custom-dashboard',
          data: { permission: ['customDashboard'] }
        },
        {
          path: 'custom-analytics',
          data: { permission: ['customAnalytics'] }
        }
      ]
    }] as any;

    const mockUserPermissions: UserPermissions = {
      mrnccdToolAnalitycs: false,
      mrnccdToolsDashboard: false,
      productSupportTickets: false,
      productSupportKnowledgeBase: false
    };
    
    mockPermissionService.permissions$ = of(mockUserPermissions);
    
    const result = dynamicRedirectGuard(mockRoute, mockState);
    
    result.subscribe(shouldActivate => {
      expect(shouldActivate).toBe(false);
      // Should redirect to home since user has no permissions
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
