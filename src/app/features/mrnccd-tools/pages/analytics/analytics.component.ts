import { Component } from '@angular/core';

@Component({
  selector: 'app-analytics',
  standalone: true,
  template: `
    <div class="analytics-container">
      <h2>Analytics Dashboard</h2>
      <div class="analytics-content">
        <div class="chart-section">
          <h3>Usage Statistics</h3>
          <div class="chart-placeholder">
            <div class="chart-bar" style="height: 60%"></div>
            <div class="chart-bar" style="height: 80%"></div>
            <div class="chart-bar" style="height: 45%"></div>
            <div class="chart-bar" style="height: 90%"></div>
            <div class="chart-bar" style="height: 70%"></div>
            <div class="chart-bar" style="height: 85%"></div>
            <div class="chart-bar" style="height: 55%"></div>
          </div>
          <div class="chart-labels">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>
        
        <div class="metrics-section">
          <div class="metric-card">
            <h4>Total Requests</h4>
            <p class="metric-value">24,567</p>
            <span class="metric-change positive">+15.3%</span>
          </div>
          
          <div class="metric-card">
            <h4>Response Time</h4>
            <p class="metric-value">142ms</p>
            <span class="metric-change negative">-8.2%</span>
          </div>
          
          <div class="metric-card">
            <h4>Error Rate</h4>
            <p class="metric-value">0.12%</p>
            <span class="metric-change positive">-2.1%</span>
          </div>
          
          <div class="metric-card">
            <h4>Peak Load</h4>
            <p class="metric-value">1,847</p>
            <span class="metric-change positive">+22.7%</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .analytics-container {
      padding: 1rem;
    }
    
    .analytics-container h2 {
      color: #2c3e50;
      margin-bottom: 2rem;
      font-size: 2rem;
    }
    
    .analytics-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
    }
    
    .chart-section {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: 1px solid #e0e0e0;
    }
    
    .chart-section h3 {
      color: #34495e;
      margin: 0 0 1.5rem 0;
      font-size: 1.25rem;
    }
    
    .chart-placeholder {
      display: flex;
      align-items: end;
      justify-content: space-around;
      height: 200px;
      margin-bottom: 1rem;
      padding: 1rem 0;
    }
    
    .chart-bar {
      width: 40px;
      background: linear-gradient(to top, #3498db, #5dade2);
      border-radius: 4px 4px 0 0;
      min-height: 20px;
    }
    
    .chart-labels {
      display: flex;
      justify-content: space-around;
      color: #7f8c8d;
      font-size: 0.875rem;
    }
    
    .metrics-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .metric-card {
      background: white;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      border: 1px solid #e0e0e0;
    }
    
    .metric-card h4 {
      color: #7f8c8d;
      margin: 0 0 0.5rem 0;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .metric-value {
      font-size: 1.5rem;
      font-weight: bold;
      color: #2c3e50;
      margin: 0.5rem 0;
    }
    
    .metric-change {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      display: inline-block;
      font-weight: 500;
    }
    
    .metric-change.positive {
      background-color: #d4edda;
      color: #155724;
    }
    
    .metric-change.negative {
      background-color: #f8d7da;
      color: #721c24;
    }
    
    @media (max-width: 768px) {
      .analytics-content {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AnalyticsComponent {
}
