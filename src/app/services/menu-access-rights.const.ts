import { ToolsEntitlement } from '../store/app.state';

/**
 * Menu Access Rights Constants
 * 
 * This file contains all the permission requirements for different menu sections and items.
 * Centralizing these constants makes the menu structure more maintainable and easier to update.
 */

/**
 * Generic function to create section access rights by aggregating child permissions
 * This prevents manual copy/paste and ensures consistency between section and child permissions
 */
function createSectionAccessRights<T extends Record<string, ToolsEntitlement[]>>(
  children: T
): T & { SECTION: ToolsEntitlement[] } {
  // Collect all unique entitlements from all child permission arrays
  const sectionEntitlements = new Set<ToolsEntitlement>();
  
  Object.values(children).forEach(entitlements => {
    entitlements.forEach(entitlement => {
      sectionEntitlements.add(entitlement);
    });
  });
  
  return {
    ...children,
    SECTION: Array.from(sectionEntitlements)
  };
}

/**
 * MRNCCD Tools Menu Section Access Rights
 */
export const MRNCCD_TOOLS_ACCESS_RIGHTS = createSectionAccessRights({
  DASHBOARD: [
    ToolsEntitlement.MRNCCD_TOOLS_DASHBOARD
  ],
  ANALYTICS: [
    ToolsEntitlement.MRNCCD_TOOL_ANALYTICS
  ]
});

/**
 * Product Support Menu Section Access Rights
 */
export const PRODUCT_SUPPORT_ACCESS_RIGHTS = createSectionAccessRights({
  TICKETS: [
    ToolsEntitlement.PRODUCT_SUPPORT_TICKETS
  ],
  KNOWLEDGE_BASE: [
    ToolsEntitlement.PRODUCT_SUPPORT_KNOWLEDGE_BASE
  ]
});

/**
 * All Menu Access Rights (for easy access and overview)
 */
export const ALL_MENU_ACCESS_RIGHTS = {
  MRNCCD_TOOLS: MRNCCD_TOOLS_ACCESS_RIGHTS,
  PRODUCT_SUPPORT: PRODUCT_SUPPORT_ACCESS_RIGHTS
};
