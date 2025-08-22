# Guards

This directory contains Angular route guards that handle authentication and authorization.

## Available Guards

### `authGuard`
Handles basic authentication checks.

### `parentPermissionGuard`
Collects permissions from child routes and adds them to parent route data.

### `dynamicRedirectGuard` (NEW)
Intelligently redirects users to the first child route they have access to, with automatic parent route detection. No hardcoded route names required.

## Dynamic Redirect Guard

The `dynamicRedirectGuard` solves the problem of hardcoded route redirects by:

1. **Permission-Based Routing**: Instead of redirecting all users to a fixed first child route (e.g., 'dashboard'), it checks user permissions and redirects to the first accessible route.

2. **Automatic Route Detection**: Dynamically detects parent routes that have child routes with permissions, eliminating the need for hardcoded route names.

3. **Fallback Handling**: If a user doesn't have access to the first child route, it automatically tries the next one in sequence.

4. **Scalable Architecture**: Works with any parent route structure, making it suitable for large applications.

### How It Works

1. **Route Detection**: The guard automatically identifies parent routes by:
   - Checking if the current URL has only one segment (parent route)
   - Verifying that the route has child routes with permission requirements
   - Only triggering for routes that meet both criteria

2. **Permission-Based Redirection**: When triggered:
   - The guard retrieves user permissions from the permission service
   - It examines all child routes in order
   - It finds the first route where the user has the required permissions
   - It redirects the user to that accessible route

3. **Fallback Handling**: If no accessible routes are found:
   - The guard logs detailed warning information
   - Redirects the user to the home page (configurable)

### Example Scenarios

**Scenario 1: User has dashboard access**
- User navigates to `/mrnccd-tools`
- Guard checks permissions: `mrnccdToolsDashboard: true`
- User is redirected to `/mrnccd-tools/dashboard`

**Scenario 2: User doesn't have dashboard access but has analytics access**
- User navigates to `/mrnccd-tools`
- Guard checks permissions: `mrnccdToolsDashboard: false`, `mrnccdToolAnalitycs: true`
- User is redirected to `/mrnccd-tools/analytics`

**Scenario 3: User has no access to any child routes**
- User navigates to `/mrnccd-tools`
- Guard checks permissions: all false
- User is redirected to `/` (home page)

### Configuration

The guard is automatically applied to parent routes in `app.routes.ts`:

```typescript
{
  path: 'mrnccd-tools',
  loadComponent: () => import('./features/mrnccd-tools/mrnccd-tools.component'),
  canActivate: [parentPermissionGuard, authGuard, dynamicRedirectGuard],
  children: [...]
}
```

### Benefits

- **Dynamic**: Routes adapt to user permissions automatically
- **Scalable**: Works with any route structure without hardcoded route names
- **Maintainable**: No need to update guard code when adding new parent routes
- **User-Friendly**: Users always land on accessible content
- **Secure**: Prevents access to unauthorized routes
- **Flexible**: Easy to configure different fallback behaviors
- **Future-Proof**: Suitable for large applications with many feature modules
