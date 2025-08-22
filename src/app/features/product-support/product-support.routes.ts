import { Routes } from '@angular/router';
import { ToolsEntitlement } from '../../store/app.state';
import { dynamicRedirectGuard } from '../../guards/dynamic-redirect.guard';

export const PRODUCT_SUPPORT_ROUTES: Routes = [
  {
    path: '',
    canActivate: [dynamicRedirectGuard],
    children: []
  },
  {
    path: 'tickets',
    loadComponent: () => import('./pages/tickets/tickets.component').then(m => m.TicketsComponent),
    data: { permission: [ToolsEntitlement.PRODUCT_SUPPORT_TICKETS] }
  },
  {
    path: 'knowledge-base',
    loadComponent: () => import('./pages/knowledge-base/knowledge-base.component').then(m => m.KnowledgeBaseComponent),
    data: { permission: [ToolsEntitlement.PRODUCT_SUPPORT_KNOWLEDGE_BASE] }
  }
];
