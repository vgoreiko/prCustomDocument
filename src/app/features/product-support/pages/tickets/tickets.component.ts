import { Component } from '@angular/core';

@Component({
  selector: 'app-tickets',
  standalone: true,
  template: `
    <div class="tickets-container">
      <div class="tickets-header">
        <h2>Support Tickets</h2>
        <button class="new-ticket-btn">+ New Ticket</button>
      </div>
      
      <div class="tickets-filters">
        <div class="filter-group">
          <label>Status:</label>
          <select class="filter-select">
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>Priority:</label>
          <select class="filter-select">
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>
      
      <div class="tickets-list">
        <div class="ticket-item high">
          <div class="ticket-priority high"></div>
          <div class="ticket-content">
            <h4>Login authentication failed</h4>
            <p>Users are unable to log in with valid credentials</p>
            <div class="ticket-meta">
              <span class="ticket-id">#T-001</span>
              <span class="ticket-status open">Open</span>
              <span class="ticket-date">2 hours ago</span>
            </div>
          </div>
        </div>
        
        <div class="ticket-item medium">
          <div class="ticket-priority medium"></div>
          <div class="ticket-content">
            <h4>Export functionality not working</h4>
            <p>Data export to CSV format fails with error message</p>
            <div class="ticket-meta">
              <span class="ticket-id">#T-002</span>
              <span class="ticket-status in-progress">In Progress</span>
              <span class="ticket-date">1 day ago</span>
            </div>
          </div>
        </div>
        
        <div class="ticket-item low">
          <div class="ticket-priority low"></div>
          <div class="ticket-content">
            <h4>UI alignment issues on mobile</h4>
            <p>Minor layout problems on small screen devices</p>
            <div class="ticket-meta">
              <span class="ticket-id">#T-003</span>
              <span class="ticket-status resolved">Resolved</span>
              <span class="ticket-date">3 days ago</span>
            </div>
          </div>
        </div>
        
        <div class="ticket-item urgent">
          <div class="ticket-priority urgent"></div>
          <div class="ticket-content">
            <h4>Database connection timeout</h4>
            <p>Critical system error causing service disruption</p>
            <div class="ticket-meta">
              <span class="ticket-id">#T-004</span>
              <span class="ticket-status open">Open</span>
              <span class="ticket-date">30 minutes ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tickets-container {
      padding: 1rem;
    }
    
    .tickets-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    
    .tickets-header h2 {
      color: #2c3e50;
      margin: 0;
      font-size: 2rem;
    }
    
    .new-ticket-btn {
      background-color: #27ae60;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.3s ease;
    }
    
    .new-ticket-btn:hover {
      background-color: #229954;
    }
    
    .tickets-filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      padding: 1rem;
      background-color: #f8f9fa;
      border-radius: 8px;
    }
    
    .filter-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .filter-group label {
      font-weight: 500;
      color: #34495e;
    }
    
    .filter-select {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: white;
    }
    
    .tickets-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .ticket-item {
      display: flex;
      background: white;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      border: 1px solid #e0e0e0;
      transition: transform 0.2s ease;
    }
    
    .ticket-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }
    
    .ticket-priority {
      width: 8px;
      border-radius: 4px;
      margin-right: 1rem;
      flex-shrink: 0;
    }
    
    .ticket-priority.urgent { background-color: #e74c3c; }
    .ticket-priority.high { background-color: #f39c12; }
    .ticket-priority.medium { background-color: #f1c40f; }
    .ticket-priority.low { background-color: #27ae60; }
    
    .ticket-content {
      flex: 1;
    }
    
    .ticket-content h4 {
      color: #2c3e50;
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
    }
    
    .ticket-content p {
      color: #7f8c8d;
      margin: 0 0 1rem 0;
      line-height: 1.4;
    }
    
    .ticket-meta {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    
    .ticket-id {
      background-color: #ecf0f1;
      color: #7f8c8d;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .ticket-status {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
    }
    
    .ticket-status.open {
      background-color: #fff3cd;
      color: #856404;
    }
    
    .ticket-status.in-progress {
      background-color: #cce5ff;
      color: #004085;
    }
    
    .ticket-status.resolved {
      background-color: #d4edda;
      color: #155724;
    }
    
    .ticket-date {
      color: #95a5a6;
      font-size: 0.875rem;
    }
  `]
})
export class TicketsComponent {
}
