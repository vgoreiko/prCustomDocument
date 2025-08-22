import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PermissionService, UserPermissions } from '../../../../services/permission.service';

@Component({
  selector: 'app-permission-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="permission-demo">
      <h2>Permission Demo</h2>
      <p>Test different permission scenarios to see how the dynamic redirect guard works.</p>
      
      <div class="permission-controls">
        <h3>Current Permissions</h3>
        <div class="permission-item">
          <label>
            <input type="checkbox" 
                   [checked]="currentPermissions.mrnccdToolsDashboard"
                   (change)="updatePermission('mrnccdToolsDashboard', $event)">
            MRNCCD Tools Dashboard
          </label>
        </div>
        <div class="permission-item">
          <label>
            <input type="checkbox" 
                   [checked]="currentPermissions.mrnccdToolAnalitycs"
                   (change)="updatePermission('mrnccdToolAnalitycs', $event)">
            MRNCCD Tool Analytics
          </label>
        </div>
        <div class="permission-item">
          <label>
            <input type="checkbox" 
                   [checked]="currentPermissions.productSupportTickets"
                   (change)="updatePermission('productSupportTickets', $event)">
            Product Support Tickets
          </label>
        </div>
        <div class="permission-item">
          <label>
            <input type="checkbox" 
                   [checked]="currentPermissions.productSupportKnowledgeBase"
                   (change)="updatePermission('productSupportKnowledgeBase', $event)">
            Product Support Knowledge Base
          </label>
        </div>
      </div>

      <div class="demo-actions">
        <h3>Test Scenarios</h3>
        <div class="scenario-buttons">
          <button (click)="setScenario('dashboard-only')" class="btn btn-primary">
            Dashboard Only
          </button>
          <button (click)="setScenario('analytics-only')" class="btn btn-primary">
            Analytics Only
          </button>
          <button (click)="setScenario('no-permissions')" class="btn btn-warning">
            No Permissions
          </button>
          <button (click)="setScenario('all-permissions')" class="btn btn-success">
            All Permissions
          </button>
        </div>
      </div>

      <div class="test-navigation">
        <h3>Test Navigation</h3>
        <p>Click these links to test the dynamic redirect behavior:</p>
        <div class="nav-links">
          <a routerLink="/mrnccd-tools" class="nav-link">Go to MRNCCD Tools (should redirect to first accessible route)</a>
          <a routerLink="/product-support" class="nav-link">Go to Product Support (should redirect to first accessible route)</a>
        </div>
      </div>

      <div class="current-status">
        <h3>Current Status</h3>
        <p><strong>Current Route:</strong> {{ currentRoute }}</p>
        <p><strong>Active Permissions:</strong> {{ getActivePermissions() }}</p>
      </div>
    </div>
  `,
  styles: [`
    .permission-demo {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .permission-demo h2 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }

    .permission-demo p {
      color: #7f8c8d;
      margin-bottom: 2rem;
    }

    .permission-controls {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .permission-controls h3 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }

    .permission-item {
      margin-bottom: 0.75rem;
    }

    .permission-item label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      font-weight: 500;
    }

    .permission-item input[type="checkbox"] {
      width: 18px;
      height: 18px;
    }

    .demo-actions {
      background: #e8f4fd;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .demo-actions h3 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }

    .scenario-buttons {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: #3498db;
      color: white;
    }

    .btn-primary:hover {
      background: #2980b9;
    }

    .btn-warning {
      background: #f39c12;
      color: white;
    }

    .btn-warning:hover {
      background: #e67e22;
    }

    .btn-success {
      background: #27ae60;
      color: white;
    }

    .btn-success:hover {
      background: #229954;
    }

    .test-navigation {
      background: #f0f8ff;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .test-navigation h3 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }

    .nav-links {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .nav-link {
      color: #3498db;
      text-decoration: none;
      padding: 0.5rem;
      border-radius: 4px;
      transition: background-color 0.3s ease;
    }

    .nav-link:hover {
      background: #e3f2fd;
    }

    .current-status {
      background: #f5f5f5;
      padding: 1.5rem;
      border-radius: 8px;
    }

    .current-status h3 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }

    .current-status p {
      margin-bottom: 0.5rem;
      color: #34495e;
    }
  `]
})
export class PermissionDemoComponent implements OnInit {
  currentPermissions: UserPermissions;
  currentRoute: string = '';

  constructor(
    private permissionService: PermissionService,
    private router: Router
  ) {
    this.currentPermissions = this.permissionService.getPermissions();
  }

  ngOnInit() {
    this.updateCurrentRoute();
    this.router.events.subscribe(() => {
      this.updateCurrentRoute();
    });
  }

  updatePermission(permission: keyof UserPermissions, event: Event) {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.permissionService.updatePermissions({ [permission]: target.checked });
      this.currentPermissions = this.permissionService.getPermissions();
    }
  }

  setScenario(scenario: string) {
    switch (scenario) {
      case 'dashboard-only':
        this.permissionService.updatePermissions({
          mrnccdToolsDashboard: true,
          mrnccdToolAnalitycs: false,
          productSupportTickets: false,
          productSupportKnowledgeBase: false
        });
        break;
      case 'analytics-only':
        this.permissionService.updatePermissions({
          mrnccdToolsDashboard: false,
          mrnccdToolAnalitycs: true,
          productSupportTickets: false,
          productSupportKnowledgeBase: false
        });
        break;
      case 'no-permissions':
        this.permissionService.updatePermissions({
          mrnccdToolsDashboard: false,
          mrnccdToolAnalitycs: false,
          productSupportTickets: false,
          productSupportKnowledgeBase: false
        });
        break;
      case 'all-permissions':
        this.permissionService.updatePermissions({
          mrnccdToolsDashboard: true,
          mrnccdToolAnalitycs: true,
          productSupportTickets: true,
          productSupportKnowledgeBase: true
        });
        break;
    }
    this.currentPermissions = this.permissionService.getPermissions();
  }

  updateCurrentRoute() {
    this.currentRoute = this.router.url;
  }

  getActivePermissions(): string {
    const active = Object.entries(this.currentPermissions)
      .filter(([_, value]) => value)
      .map(([key, _]) => key)
      .join(', ');
    
    return active || 'None';
  }
}
