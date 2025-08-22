export enum ToolsEntitlement {
  MRNCCD_TOOL_ANALYTICS = 'mrnccdToolAnalitycs',
  MRNCCD_TOOLS_DASHBOARD = 'mrnccdToolsDashboard',
  PRODUCT_SUPPORT_TICKETS = 'productSupportTickets',
  PRODUCT_SUPPORT_KNOWLEDGE_BASE = 'productSupportKnowledgeBase'
}

export interface TUserState {
  firstName: string;
  lastName: string;
  mrnccdToolAnalitycs: boolean;
  mrnccdToolsDashboard: boolean;
  productSupportTickets: boolean;
  productSupportKnowledgeBase: boolean;
}

export interface TAppState {
  app: string;
  user: TUserState;
}
