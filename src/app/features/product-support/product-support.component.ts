import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-product-support',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="product-support-container">
      <header class="feature-header">
        <h1>Product Support</h1>
      </header>
      
      <main class="feature-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .product-support-container {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .feature-header {
      background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
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
export class ProductSupportComponent {
}
