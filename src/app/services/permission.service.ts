import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToolsEntitlement } from '../store/app.state';

export interface UserPermissions {
  mrnccdToolAnalitycs: boolean;
  mrnccdToolsDashboard: boolean;
  productSupportTickets: boolean;
  productSupportKnowledgeBase: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private permissionsSubject = new BehaviorSubject<UserPermissions>({
    mrnccdToolAnalitycs: true,  // Default to true for demo purposes
    mrnccdToolsDashboard: true, // Default to true for demo purposes
    productSupportTickets: true, // Default to true for demo purposes
    productSupportKnowledgeBase: true // Default to true for demo purposes
  });

  public permissions$ = this.permissionsSubject.asObservable();

  constructor() {
    // In a real application, you would load permissions from a backend service
    // this.loadPermissions();
  }

  /**
   * Get current user permissions
   */
  getPermissions(): UserPermissions {
    return this.permissionsSubject.value;
  }

  /**
   * Check if user has a specific permission
   */
  hasPermission(permission: string): boolean {
    const permissions = this.getPermissions();
    return permissions[permission as keyof UserPermissions] === true;
  }

  /**
   * Check if user has all required permissions
   */
  hasPermissions(requiredPermissions: string[]): boolean {
    return requiredPermissions.every(permission => this.hasPermission(permission));
  }

  /**
   * Update user permissions (for demo/testing purposes)
   */
  updatePermissions(newPermissions: Partial<UserPermissions>): void {
    const currentPermissions = this.getPermissions();
    const updatedPermissions = { ...currentPermissions, ...newPermissions };
    this.permissionsSubject.next(updatedPermissions);
  }

  /**
   * Reset permissions to defaults
   */
  resetPermissions(): void {
    this.permissionsSubject.next({
      mrnccdToolAnalitycs: true,
      mrnccdToolsDashboard: true,
      productSupportTickets: true,
      productSupportKnowledgeBase: true
    });
  }

  /**
   * Load permissions from backend (placeholder for real implementation)
   */
  private loadPermissions(): void {
    // In a real application, you would make an HTTP request here
    // this.http.get<UserPermissions>('/api/user/permissions').subscribe(
    //   permissions => this.permissionsSubject.next(permissions)
    // );
  }
}
