import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PermissionService } from '../../../../services/permission.service';
import { ToolsEntitlement } from '../../../../store/app.state';

@Component({
  selector: 'app-permission-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="permission-demo">
      <h2>Permission Demo</h2>
      <p>Use this component to test different permission scenarios:</p>
      
      <div class="permissions-grid">
        <div class="permission-item" *ngFor="let permission of permissions">
          <label>
            <input 
              type="checkbox" 
              [checked]="permissionService.hasPermission(permission.key)"
              (change)="onPermissionChange(permission.key, $event)"
            >
            {{ permission.label }}
          </label>
          <span class="status" [class.granted]="permissionService.hasPermission(permission.key)" [class.denied]="!permissionService.hasPermission(permission.key)">
            {{ permissionService.hasPermission(permission.key) ? 'GRANTED' : 'DENIED' }}
          </span>
        </div>
      </div>

      <div class="actions">
        <button (click)="resetPermissions()" class="btn btn-secondary">Reset to Defaults</button>
        <button (click)="grantAllPermissions()" class="btn btn-primary">Grant All</button>
        <button (click)="denyAllPermissions()" class="btn btn-danger">Deny All</button>
      </div>

      <div class="info">
        <h3>Current Access Status:</h3>
        <ul>
          <li>MRNCCD Tools Dashboard: <strong>{{ permissionService.hasPermission('mrnccdToolsDashboard') ? 'ACCESSIBLE' : 'BLOCKED' }}</strong></li>
          <li>MRNCCD Tools Analytics: <strong>{{ permissionService.hasPermission('mrnccdToolAnalitycs') ? 'ACCESSIBLE' : 'BLOCKED' }}</strong></li>
          <li>Product Support Tickets: <strong>{{ permissionService.hasPermission('productSupportTickets') ? 'ACCESSIBLE' : 'BLOCKED' }}</strong></li>
          <li>Product Support Knowledge Base: <strong>{{ permissionService.hasPermission('productSupportKnowledgeBase') ? 'ACCESSIBLE' : 'BLOCKED' }}</strong></li>
        </ul>
      </div>

      <div class="navigation-test">
        <h3>Test Navigation:</h3>
        <p>Try navigating to different routes to see how permissions affect access:</p>
        <ul>
          <li><a routerLink="/mrnccd-tools/dashboard">MRNCCD Tools Dashboard</a> - Should be {{ permissionService.hasPermission('mrnccdToolsDashboard') ? 'accessible' : 'blocked' }}</li>
          <li><a routerLink="/mrnccd-tools/analytics">MRNCCD Tools Analytics</a> - Should be {{ permissionService.hasPermission('mrnccdToolAnalitycs') ? 'accessible' : 'blocked' }}</li>
          <li><a routerLink="/product-support/tickets">Product Support Tickets</a> - Should be {{ permissionService.hasPermission('productSupportTickets') ? 'accessible' : 'blocked' }}</li>
          <li><a routerLink="/product-support/knowledge-base">Product Support Knowledge Base</a> - Should be {{ permissionService.hasPermission('productSupportKnowledgeBase') ? 'accessible' : 'blocked' }}</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .permission-demo {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .permissions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 15px;
      margin: 20px 0;
    }

    .permission-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      background: #f9f9f9;
    }

    .permission-item label {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
    }

    .status {
      padding: 4px 8px;
      border-radius: 3px;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
    }

    .status.granted {
      background: #d4edda;
      color: #155724;
    }

    .status.denied {
      background: #f8d7da;
      color: #721c24;
    }

    .actions {
      margin: 20px 0;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-danger {
      background: #dc3545;
      color: white;
    }

    .info, .navigation-test {
      margin: 20px 0;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 5px;
      background: #f8f9fa;
    }

    .info ul, .navigation-test ul {
      list-style: none;
      padding: 0;
    }

    .info li, .navigation-test li {
      padding: 5px 0;
      border-bottom: 1px solid #eee;
    }

    .navigation-test a {
      color: #007bff;
      text-decoration: none;
    }

    .navigation-test a:hover {
      text-decoration: underline;
    }
  `]
})
export class PermissionDemoComponent implements OnInit {
  permissions = [
    { key: 'mrnccdToolsDashboard', label: 'MRNCCD Tools Dashboard' },
    { key: 'mrnccdToolAnalitycs', label: 'MRNCCD Tools Analytics' },
    { key: 'productSupportTickets', label: 'Product Support Tickets' },
    { key: 'productSupportKnowledgeBase', label: 'Product Support Knowledge Base' }
  ];

  constructor(public permissionService: PermissionService) {}

  ngOnInit(): void {}

  onPermissionChange(permissionKey: string, event: Event): void {
    this.permissionService.updatePermissions({ [permissionKey]: (event.target as HTMLInputElement).checked });
  }

  resetPermissions(): void {
    this.permissionService.resetPermissions();
  }

  grantAllPermissions(): void {
    this.permissionService.updatePermissions({
      mrnccdToolsDashboard: true,
      mrnccdToolAnalitycs: true,
      productSupportTickets: true,
      productSupportKnowledgeBase: true
    });
  }

  denyAllPermissions(): void {
    this.permissionService.updatePermissions({
      mrnccdToolsDashboard: false,
      mrnccdToolAnalitycs: false,
      productSupportTickets: false,
      productSupportKnowledgeBase: false
    });
  }
}
