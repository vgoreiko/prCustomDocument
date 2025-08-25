import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { dynamicRedirectGuard } from './guards/dynamic-redirect.guard';
import { parentPermissionGuard } from './guards/parent-permission.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/mrnccd-tools',
    pathMatch: 'full'
  },
  {
    path: 'mrnccd-tools',
    loadComponent: () => import('./features/mrnccd-tools/mrnccd-tools.component').then(m => m.MrnccdToolsComponent),
    canActivate: [authGuard, parentPermissionGuard, dynamicRedirectGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./features/mrnccd-tools/mrnccd-tools.routes').then(m => m.MRNCCD_TOOLS_ROUTES)
      }
    ]
  },
  {
    path: 'product-support',
    loadComponent: () => import('./features/product-support/product-support.component').then(m => m.ProductSupportComponent),
    canActivate: [authGuard, parentPermissionGuard, dynamicRedirectGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./features/product-support/product-support.routes').then(m => m.PRODUCT_SUPPORT_ROUTES)
      }
    ]
  }
];
