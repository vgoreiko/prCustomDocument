import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-mrnccd-tools',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="mrnccd-tools-container">
      <header class="feature-header">
        <h1>MRNCCD Tools</h1>
      </header>
      
      <main class="feature-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .mrnccd-tools-container {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .feature-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1.5rem 2rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .feature-header h1 {
      margin: 0;
      font-size: 2rem;
      font-weight: 600;
    }
    
    .feature-content {
      flex: 1;
      padding: 2rem;
      overflow-y: auto;
      background: #ffffff;
    }
    
    @media (max-width: 768px) {
      .feature-content {
        padding: 1rem;
      }
    }
  `]
})
export class MrnccdToolsComponent {
}
