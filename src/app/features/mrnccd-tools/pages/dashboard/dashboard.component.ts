import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="dashboard-container">
      <h2>MRNCCD Tools Dashboard</h2>
      <div class="dashboard-grid">
        <div class="dashboard-card">
          <h3>System Status</h3>
          <p>All systems operational</p>
          <div class="status-indicator online"></div>
        </div>
        <div class="dashboard-card">
          <h3>Active Users</h3>
          <p class="metric">1,247</p>
          <span class="trend positive">+12% from last week</span>
        </div>
        <div class="dashboard-card">
          <h3>Performance</h3>
          <p class="metric">98.7%</p>
          <span class="trend positive">+2.1% from last month</span>
        </div>
        <div class="dashboard-card">
          <h3>Recent Activity</h3>
          <ul class="activity-list">
            <li>User login at 14:32</li>
            <li>Data export completed</li>
            <li>System backup finished</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 1rem;
    }
    
    .dashboard-container h2 {
      color: #2c3e50;
      margin-bottom: 2rem;
      font-size: 2rem;
    }
    
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    
    .dashboard-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: 1px solid #e0e0e0;
    }
    
    .dashboard-card h3 {
      color: #34495e;
      margin: 0 0 1rem 0;
      font-size: 1.25rem;
    }
    
    .dashboard-card p {
      color: #7f8c8d;
      margin: 0.5rem 0;
    }
    
    .metric {
      font-size: 2rem;
      font-weight: bold;
      color: #2c3e50;
      margin: 1rem 0;
    }
    
    .trend {
      font-size: 0.875rem;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      display: inline-block;
    }
    
    .trend.positive {
      background-color: #d4edda;
      color: #155724;
    }
    
    .status-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      display: inline-block;
      margin-left: 0.5rem;
    }
    
    .status-indicator.online {
      background-color: #28a745;
    }
    
    .activity-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .activity-list li {
      padding: 0.5rem 0;
      border-bottom: 1px solid #f0f0f0;
      color: #7f8c8d;
      font-size: 0.875rem;
    }
    
    .activity-list li:last-child {
      border-bottom: none;
    }
  `]
})
export class DashboardComponent {
}
