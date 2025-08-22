import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-mrnccd-tools',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="mrnccd-tools-container">
      <header class="feature-header">
        <h1>MRNCCD Tools</h1>
        <nav class="feature-nav">
          <a routerLink="dashboard" routerLinkActive="active" class="nav-link">Dashboard</a>
          <a routerLink="analytics" routerLinkActive="active" class="nav-link">Analytics</a>
          <a routerLink="permission-demo" routerLinkActive="active" class="nav-link">Permission Demo</a>
        </nav>
      </header>
      <main class="feature-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .mrnccd-tools-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .feature-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #e0e0e0;
    }
    
    .feature-header h1 {
      color: #2c3e50;
      margin: 0;
      font-size: 2.5rem;
      font-weight: 600;
    }
    
    .feature-nav {
      display: flex;
      gap: 1rem;
    }
    
    .nav-link {
      padding: 0.75rem 1.5rem;
      text-decoration: none;
      color: #7f8c8d;
      border-radius: 8px;
      transition: all 0.3s ease;
      font-weight: 500;
    }
    
    .nav-link:hover {
      background-color: #f8f9fa;
      color: #2c3e50;
    }
    
    .nav-link.active {
      background-color: #3498db;
      color: white;
    }
    
    .feature-content {
      min-height: 400px;
    }
  `]
})
export class MrnccdToolsComponent {
}
