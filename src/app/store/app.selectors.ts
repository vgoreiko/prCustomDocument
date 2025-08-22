import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TAppState, TUserState, ToolsEntitlement } from './app.state';

// Feature selector for the entire app state
export const selectAppState = createFeatureSelector<TAppState>('app');

// Selector for user state
export const selectUserState = createSelector(
  selectAppState,
  (state: TAppState) => state.user
);

// Selectors for specific user properties
export const selectUserFirstName = createSelector(
  selectUserState,
  (user: TUserState) => user.firstName
);

export const selectUserLastName = createSelector(
  selectUserState,
  (user: TUserState) => user.lastName
);

export const selectUserFullName = createSelector(
  selectUserFirstName,
  selectUserLastName,
  (firstName: string, lastName: string) => `${firstName} ${lastName}`.trim()
);

// Selectors for user permissions
export const selectMrnccdToolsDashboardPermission = createSelector(
  selectUserState,
  (user: TUserState) => user[ToolsEntitlement.MRNCCD_TOOLS_DASHBOARD]
);

export const selectMrnccdToolsAnalyticsPermission = createSelector(
  selectUserState,
  (user: TUserState) => user[ToolsEntitlement.MRNCCD_TOOL_ANALYTICS]
);

export const selectProductSupportTicketsPermission = createSelector(
  selectUserState,
  (user: TUserState) => user[ToolsEntitlement.PRODUCT_SUPPORT_TICKETS]
);

export const selectProductSupportKnowledgeBasePermission = createSelector(
  selectUserState,
  (user: TUserState) => user[ToolsEntitlement.PRODUCT_SUPPORT_KNOWLEDGE_BASE]
);

// Selector to check if user is authenticated
export const selectIsAuthenticated = createSelector(
  selectUserFirstName,
  selectUserLastName,
  (firstName: string, lastName: string) => !!(firstName && lastName)
);
