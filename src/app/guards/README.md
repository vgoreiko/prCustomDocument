# Guards Documentation

This directory contains Angular route guards that handle authentication, authorization, and dynamic routing.

## Available Guards

### `authGuard`
Handles user authentication. Redirects unauthenticated users to the login page.

### `parentPermissionGuard`
**NEW**: Collects permissions from child routes and attaches them to parent routes. This guard:
- Runs before other guards to collect permission data
- Handles frozen route data gracefully using `Object.defineProperty`
- Integrates with the existing `ToolsEntitlement` enum
- Works alongside `dynamicRedirectGuard` for comprehensive permission management

### `dynamicRedirectGuard`
Handles dynamic routing based on user permissions. Redirects users to their first accessible route within a feature module.

## Guard Execution Order

The guards are executed in the following order:

1. **`authGuard`** - Authenticates the user
2. **`parentPermissionGuard`** - Collects permissions from child routes
3. **`dynamicRedirectGuard`** - Redirects based on collected permissions

## Integration Example

```typescript
// Parent route configuration - parentPermissionGuard runs here
{
  path: 'mrnccd-tools',
  canActivate: [authGuard, parentPermissionGuard, dynamicRedirectGuard],
  children: [
    {
      path: 'dashboard',
      canActivate: [authGuard], // Only authGuard needed on child routes
      data: { permission: [ToolsEntitlement.MRNCCD_TOOLS_DASHBOARD] }
    }
  ]
}
```

## How It Works

1. **`parentPermissionGuard`** runs **only on parent routes**
2. **Automatically discovers all child routes** and collects their permissions
3. **No need to add guards to child routes** - permissions are collected automatically
4. **`dynamicRedirectGuard`** uses the collected permissions to determine the best redirect target
5. Users are automatically redirected to their first accessible route

## Benefits

- **Automatic Permission Collection**: No need to manually maintain permission lists
- **No Redundant Guard Calls**: Guard runs only once per parent route
- **Flexible Routing**: Routes automatically adapt to user permissions
- **Error Handling**: Gracefully handles frozen route data
- **Type Safety**: Full TypeScript support with `ToolsEntitlement` enum
- **Performance**: Efficient permission collection with duplicate removal
- **Maintainable**: Add new routes without touching guard configuration
