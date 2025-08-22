import { Injectable } from '@angular/core';
import { PermissionService } from './permission.service';
import { ToolsEntitlement } from '../store/app.state';
import { Observable, map } from 'rxjs';
import { 
  MRNCCD_TOOLS_ACCESS_RIGHTS, 
  PRODUCT_SUPPORT_ACCESS_RIGHTS 
} from './menu-access-rights.const';

export interface AmTreeMenuItem {
  disabled?: boolean;
  expanded?: boolean;
  id?: string;
  items: AmTreeMenuItem[];
  label: string;
  route?: string;
  show: boolean;
  type?: 'item' | 'divider' | 'group' | 'title';
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  constructor(private permissionService: PermissionService) {}

  /**
   * Check if user has permission for any of the specified entitlements
   */
  private isPermissionAllowed(entitlements: ToolsEntitlement[]): boolean {
    return entitlements.some(entitlement => 
      this.permissionService.hasPermission(entitlement)
    );
  }

  /**
   * Check if user has permission for a specific entitlement
   */
  private hasPermission(entitlement: ToolsEntitlement): boolean {
    return this.permissionService.hasPermission(entitlement);
  }

  /**
   * Get the main navigation menu as an observable
   */
  getMainMenu(): Observable<AmTreeMenuItem[]> {
    return this.permissionService.permissions$.pipe(
      map(() => this.buildMenu())
    );
  }

  /**
   * Get visible menu items (filtered by permissions) as an observable
   */
  getVisibleMenuItems(): Observable<AmTreeMenuItem[]> {
    return this.getMainMenu().pipe(
      map(menu => menu.filter(item => item.show))
    );
  }

  /**
   * Check if any menu sections are accessible as an observable
   */
  hasAccessibleSections(): Observable<boolean> {
    return this.getVisibleMenuItems().pipe(
      map(visibleItems => visibleItems.length > 0)
    );
  }

  /**
   * Build the menu structure based on current permissions
   */
  private buildMenu(): AmTreeMenuItem[] {
    return [
      {
        id: 'mrnccd-tools',
        label: 'MRNCCD TOOLS',
        show: this.isPermissionAllowed(MRNCCD_TOOLS_ACCESS_RIGHTS.SECTION),
        type: 'group',
        items: [
          {
            id: 'dashboard',
            label: 'Dashboard',
            show: this.isPermissionAllowed(MRNCCD_TOOLS_ACCESS_RIGHTS.DASHBOARD),
            route: '/mrnccd-tools/dashboard',
            icon: '📊',
            items: []
          },
          {
            id: 'analytics',
            label: 'Analytics',
            show: this.isPermissionAllowed(MRNCCD_TOOLS_ACCESS_RIGHTS.ANALYTICS),
            route: '/mrnccd-tools/analytics',
            icon: '📈',
            items: []
          }
        ]
      },
      {
        id: 'product-support',
        label: 'PRODUCT SUPPORT',
        show: this.isPermissionAllowed(PRODUCT_SUPPORT_ACCESS_RIGHTS.SECTION),
        type: 'group',
        items: [
          {
            id: 'tickets',
            label: 'Support Tickets',
            show: this.isPermissionAllowed(PRODUCT_SUPPORT_ACCESS_RIGHTS.TICKETS),
            route: '/product-support/tickets',
            icon: '🎫',
            items: []
          },
          {
            id: 'knowledge-base',
            label: 'Knowledge Base',
            show: this.isPermissionAllowed(PRODUCT_SUPPORT_ACCESS_RIGHTS.KNOWLEDGE_BASE),
            route: '/product-support/knowledge-base',
            icon: '📚',
            items: []
          }
        ]
      }
    ];
  }
}
