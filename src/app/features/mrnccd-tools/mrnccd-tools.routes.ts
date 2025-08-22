import { Routes } from '@angular/router';
import { ToolsEntitlement } from '../../store/app.state';
import { dynamicRedirectGuard } from '../../guards/dynamic-redirect.guard';

export const MRNCCD_TOOLS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [dynamicRedirectGuard],
    children: []
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    data: { permission: [ToolsEntitlement.MRNCCD_TOOLS_DASHBOARD] }
  },
  {
    path: 'analytics',
    loadComponent: () => import('./pages/analytics/analytics.component').then(m => m.AnalyticsComponent),
    data: { permission: [ToolsEntitlement.MRNCCD_TOOL_ANALYTICS] }
  },
  {
    path: 'permission-demo',
    loadComponent: () => import('./pages/permission-demo/permission-demo.component').then(m => m.PermissionDemoComponent)
  }
];
