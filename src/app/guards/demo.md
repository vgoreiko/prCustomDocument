# Routing Refactoring Demo

This file demonstrates the before and after of the routing approach refactoring.

## Before (Manual Permission Management)

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'mrnccd-tools',
    loadComponent: () => import('./features/mrnccd-tools/mrnccd-tools.component').then(m => m.MrnccdToolsComponent),
    canActivate: [authGuard],
    data: { permission: [ToolsEntitlement.MRNCCD_TOOLS_DASHBOARD, ToolsEntitlement.MRNCCD_TOOL_ANALYTICS] }, // Manual!
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
    canActivate: [authGuard],
    data: { permission: [ToolsEntitlement.PRODUCT_SUPPORT_TICKETS, ToolsEntitlement.PRODUCT_SUPPORT_KNOWLEDGE_BASE] }, // Manual!
    children: [
      {
        path: '',
        loadChildren: () => import('./features/product-support/product-support.routes').then(m => m.PRODUCT_SUPPORT_ROUTES)
      }
    ]
  }
];

// mrnccd-tools.routes.ts
export const MRNCCD_TOOLS_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    data: { permission: [ToolsEntitlement.MRNCCD_TOOLS_DASHBOARD] }
  },
  {
    path: 'analytics',
    loadComponent: () => import('./pages/analytics/analytics.component').then(m => m.AnalyticsComponent),
    data: { permission: [ToolsEntitlement.MRNCCD_TOOL_ANALYTICS] }
  }
];

// product-support.routes.ts
export const PRODUCT_SUPPORT_ROUTES: Routes = [
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
```

## After (Automatic Permission Management)

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'mrnccd-tools',
    loadComponent: () => import('./features/mrnccd-tools/mrnccd-tools.component').then(m => m.MrnccdToolsComponent),
    canActivate: [parentPermissionGuard, authGuard], // parentPermissionGuard runs first!
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
    canActivate: [parentPermissionGuard, authGuard], // parentPermissionGuard runs first!
    children: [
      {
        path: '',
        loadChildren: () => import('./features/product-support/product-support.routes').then(m => m.PRODUCT_SUPPORT_ROUTES)
      }
    ]
  }
];

// Child routes remain the same - they define their own permissions
// mrnccd-tools.routes.ts and product-support.routes.ts unchanged
```

## How It Works

1. **parentPermissionGuard** runs first in the guard chain
2. It recursively traverses all child routes
3. Collects all unique permissions from children
4. Automatically adds them to the parent route's `data.permission` property
5. **authGuard** runs second and sees the automatically collected permissions

## Benefits

✅ **No more manual permission duplication**
✅ **Automatic permission inheritance**
✅ **Easier maintenance**
✅ **Reduced chance of errors**
✅ **DRY principle followed**

## Example Flow

1. User navigates to `/mrnccd-tools`
2. `parentPermissionGuard` runs:
   - Finds child route `dashboard` with permission `[MRNCCD_TOOLS_DASHBOARD]`
   - Finds child route `analytics` with permission `[MRNCCD_TOOL_ANALYTICS]`
   - Sets parent route permission to `[MRNCCD_TOOLS_DASHBOARD, MRNCCD_TOOL_ANALYTICS]`
3. `authGuard` runs and checks the automatically collected permissions
4. Access granted/denied based on user's actual permissions

## Adding New Child Routes

Simply add a new child route with its permission - the parent automatically gets it!

```typescript
// Add new route
{
  path: 'reports',
  loadComponent: () => import('./pages/reports/reports.component').then(m => m.ReportsComponent),
  data: { permission: [ToolsEntitlement.MRNCCD_TOOL_REPORTS] }
}

// Parent route automatically gets this permission too!
// No need to update parent route configuration
```
