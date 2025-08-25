import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { parentPermissionGuard } from './parent-permission.guard';
import { ToolsEntitlement } from '../store/app.state';

describe('parentPermissionGuard', () => {
  let mockRoute: Partial<ActivatedRouteSnapshot>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should return true when route has no children', () => {
    mockRoute = {
      data: {},
      children: []
    } as Partial<ActivatedRouteSnapshot>;

    const result = parentPermissionGuard(mockRoute as ActivatedRouteSnapshot);
    
    expect(result).toBeDefined();
    result.subscribe(value => {
      expect(value).toBe(true);
    });
  });

  it('should return true when route already has permissions', () => {
    mockRoute = {
      data: { permission: [ToolsEntitlement.MRNCCD_TOOLS_DASHBOARD] },
      children: []
    } as Partial<ActivatedRouteSnapshot>;

    const result = parentPermissionGuard(mockRoute as ActivatedRouteSnapshot);
    
    result.subscribe(value => {
      expect(value).toBe(true);
      expect(mockRoute.data!['permission']).toEqual([ToolsEntitlement.MRNCCD_TOOLS_DASHBOARD]);
    });
  });

  it('should collect permissions from child routes', () => {
    const childRoute1 = {
      data: { permission: [ToolsEntitlement.MRNCCD_TOOLS_DASHBOARD] },
      children: []
    } as Partial<ActivatedRouteSnapshot>;

    const childRoute2 = {
      data: { permission: [ToolsEntitlement.MRNCCD_TOOL_ANALYTICS] },
      children: []
    } as Partial<ActivatedRouteSnapshot>;

    mockRoute = {
      data: {},
      children: [childRoute1 as ActivatedRouteSnapshot, childRoute2 as ActivatedRouteSnapshot]
    } as Partial<ActivatedRouteSnapshot>;

    const result = parentPermissionGuard(mockRoute as ActivatedRouteSnapshot);
    
    result.subscribe(value => {
      expect(value).toBe(true);
      expect(mockRoute.data!['permission']).toEqual([
        ToolsEntitlement.MRNCCD_TOOLS_DASHBOARD, 
        ToolsEntitlement.MRNCCD_TOOL_ANALYTICS
      ]);
    });
  });

  it('should handle nested child routes', () => {
    const grandChildRoute = {
      data: { permission: [ToolsEntitlement.PRODUCT_SUPPORT_KNOWLEDGE_BASE] },
      children: []
    } as Partial<ActivatedRouteSnapshot>;

    const childRoute = {
      data: { permission: [ToolsEntitlement.PRODUCT_SUPPORT_TICKETS] },
      children: [grandChildRoute as ActivatedRouteSnapshot]
    } as Partial<ActivatedRouteSnapshot>;

    mockRoute = {
      data: {},
      children: [childRoute as ActivatedRouteSnapshot]
    } as Partial<ActivatedRouteSnapshot>;

    const result = parentPermissionGuard(mockRoute as ActivatedRouteSnapshot);
    
    result.subscribe(value => {
      expect(value).toBe(true);
      expect(mockRoute.data!['permission']).toEqual([
        ToolsEntitlement.PRODUCT_SUPPORT_TICKETS, 
        ToolsEntitlement.PRODUCT_SUPPORT_KNOWLEDGE_BASE
      ]);
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

    const result = parentPermissionGuard(mockRoute as ActivatedRouteSnapshot);
    
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

    const result = parentPermissionGuard(mockRoute as ActivatedRouteSnapshot);
    
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
      data: { permission: [ToolsEntitlement.MRNCCD_TOOLS_DASHBOARD] },
      children: []
    } as Partial<ActivatedRouteSnapshot>;

    mockRoute = {
      data: {},
      children: [childRoute1 as ActivatedRouteSnapshot, childRoute2 as ActivatedRouteSnapshot]
    } as Partial<ActivatedRouteSnapshot>;

    const result = parentPermissionGuard(mockRoute as ActivatedRouteSnapshot);
    
    result.subscribe(value => {
      expect(value).toBe(true);
      expect(mockRoute.data!['permission']).toEqual([ToolsEntitlement.MRNCCD_TOOLS_DASHBOARD]);
    });
  });

  it('should handle frozen route data gracefully', () => {
    // Create a frozen route data object to simulate the "object is not extensible" scenario
    const frozenData = Object.freeze({});
    
    mockRoute = {
      data: frozenData,
      children: [{
        data: { permission: [ToolsEntitlement.MRNCCD_TOOLS_DASHBOARD] },
        children: []
      } as Partial<ActivatedRouteSnapshot>]
    } as Partial<ActivatedRouteSnapshot>;

    const result = parentPermissionGuard(mockRoute as ActivatedRouteSnapshot);
    
    result.subscribe(value => {
      expect(value).toBe(true);
      // The guard should handle frozen data gracefully and still return true
      // The permission collection will be handled by the dynamic redirect guard
    });
  });
});
