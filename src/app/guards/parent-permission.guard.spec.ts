import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { parentPermissionGuard } from './parent-permission.guard';

describe('parentPermissionGuard', () => {
  let mockRoute: Partial<ActivatedRouteSnapshot>;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    mockState = {} as RouterStateSnapshot;
  });

  it('should return true when route has no children', () => {
    mockRoute = {
      data: {},
      children: []
    } as Partial<ActivatedRouteSnapshot>;

    const result = parentPermissionGuard(mockRoute as ActivatedRouteSnapshot, mockState);
    
    expect(result).toBeDefined();
    result.subscribe(value => {
      expect(value).toBe(true);
    });
  });

  it('should return true when route already has permissions', () => {
    mockRoute = {
      data: { permission: ['existing-permission'] },
      children: []
    } as Partial<ActivatedRouteSnapshot>;

    const result = parentPermissionGuard(mockRoute as ActivatedRouteSnapshot, mockState);
    
    result.subscribe(value => {
      expect(value).toBe(true);
      expect(mockRoute.data!['permission']).toEqual(['existing-permission']);
    });
  });

  it('should collect permissions from child routes', () => {
    const childRoute1 = {
      data: { permission: ['dashboard-permission'] },
      children: []
    } as Partial<ActivatedRouteSnapshot>;

    const childRoute2 = {
      data: { permission: ['analytics-permission'] },
      children: []
    } as Partial<ActivatedRouteSnapshot>;

    mockRoute = {
      data: {},
      children: [childRoute1 as ActivatedRouteSnapshot, childRoute2 as ActivatedRouteSnapshot]
    } as Partial<ActivatedRouteSnapshot>;

    const result = parentPermissionGuard(mockRoute as ActivatedRouteSnapshot, mockState);
    
    result.subscribe(value => {
      expect(value).toBe(true);
      expect(mockRoute.data!['permission']).toEqual(['dashboard-permission', 'analytics-permission']);
    });
  });

  it('should handle nested child routes', () => {
    const grandChildRoute = {
      data: { permission: ['nested-permission'] },
      children: []
    } as Partial<ActivatedRouteSnapshot>;

    const childRoute = {
      data: { permission: ['child-permission'] },
      children: [grandChildRoute as ActivatedRouteSnapshot]
    } as Partial<ActivatedRouteSnapshot>;

    mockRoute = {
      data: {},
      children: [childRoute as ActivatedRouteSnapshot]
    } as Partial<ActivatedRouteSnapshot>;

    const result = parentPermissionGuard(mockRoute as ActivatedRouteSnapshot, mockState);
    
    result.subscribe(value => {
      expect(value).toBe(true);
      expect(mockRoute.data!['permission']).toEqual(['child-permission', 'nested-permission']);
    });
  });

  it('should handle array and string permissions', () => {
    const childRoute1 = {
      data: { permission: ['permission1', 'permission2'] },
      children: []
    } as Partial<ActivatedRouteSnapshot>;

    const childRoute2 = {
      data: { permission: 'single-permission' },
      children: []
    } as Partial<ActivatedRouteSnapshot>;

    mockRoute = {
      data: {},
      children: [childRoute1 as ActivatedRouteSnapshot, childRoute2 as ActivatedRouteSnapshot]
    } as Partial<ActivatedRouteSnapshot>;

    const result = parentPermissionGuard(mockRoute as ActivatedRouteSnapshot, mockState);
    
    result.subscribe(value => {
      expect(value).toBe(true);
      expect(mockRoute.data!['permission']).toEqual(['permission1', 'permission2', 'single-permission']);
    });
  });

  it('should remove duplicate permissions', () => {
    const childRoute1 = {
      data: { permission: ['permission1', 'permission2'] },
      children: []
    } as Partial<ActivatedRouteSnapshot>;

    const childRoute2 = {
      data: { permission: ['permission2', 'permission3'] },
      children: []
    } as Partial<ActivatedRouteSnapshot>;

    mockRoute = {
      data: {},
      children: [childRoute1 as ActivatedRouteSnapshot, childRoute2 as ActivatedRouteSnapshot]
    } as Partial<ActivatedRouteSnapshot>;

    const result = parentPermissionGuard(mockRoute as ActivatedRouteSnapshot, mockState);
    
    result.subscribe(value => {
      expect(value).toBe(true);
      expect(mockRoute.data!['permission']).toEqual(['permission1', 'permission2', 'permission3']);
    });
  });

  it('should handle routes with no permission data', () => {
    const childRoute1 = {
      data: {},
      children: []
    } as Partial<ActivatedRouteSnapshot>;

    const childRoute2 = {
      data: { permission: ['some-permission'] },
      children: []
    } as Partial<ActivatedRouteSnapshot>;

    mockRoute = {
      data: {},
      children: [childRoute1 as ActivatedRouteSnapshot, childRoute2 as ActivatedRouteSnapshot]
    } as Partial<ActivatedRouteSnapshot>;

    const result = parentPermissionGuard(mockRoute as ActivatedRouteSnapshot, mockState);
    
    result.subscribe(value => {
      expect(value).toBe(true);
      expect(mockRoute.data!['permission']).toEqual(['some-permission']);
    });
  });
});
