import { Component } from '@angular/core';

@Component({
  selector: 'app-knowledge-base',
  standalone: true,
  template: `
    <div class="knowledge-base-container">
      <div class="kb-header">
        <h2>Knowledge Base</h2>
        <div class="search-box">
          <input type="text" placeholder="Search articles..." class="search-input">
          <button class="search-btn">🔍</button>
        </div>
      </div>
      
      <div class="kb-categories">
        <h3>Categories</h3>
        <div class="category-grid">
          <div class="category-card">
            <div class="category-icon">📱</div>
            <h4>Getting Started</h4>
            <p>12 articles</p>
          </div>
          <div class="category-card">
            <div class="category-icon">⚙️</div>
            <h4>Configuration</h4>
            <p>8 articles</p>
          </div>
          <div class="category-card">
            <div class="category-icon">🔧</div>
            <h4>Troubleshooting</h4>
            <p>15 articles</p>
          </div>
          <div class="category-card">
            <div class="category-icon">📚</div>
            <h4>API Reference</h4>
            <p>23 articles</p>
          </div>
        </div>
      </div>
      
      <div class="kb-articles">
        <h3>Popular Articles</h3>
        <div class="articles-list">
          <div class="article-item">
            <div class="article-icon">📖</div>
            <div class="article-content">
              <h4>How to set up your first project</h4>
              <p>Step-by-step guide to get you started with your first project configuration</p>
              <div class="article-meta">
                <span class="article-views">1.2k views</span>
                <span class="article-rating">⭐ 4.8</span>
              </div>
            </div>
          </div>
          
          <div class="article-item">
            <div class="article-icon">🔐</div>
            <div class="article-content">
              <h4>Authentication and security best practices</h4>
              <p>Learn about implementing secure authentication in your applications</p>
              <div class="article-meta">
                <span class="article-views">856 views</span>
                <span class="article-rating">⭐ 4.9</span>
              </div>
            </div>
          </div>
          
          <div class="article-item">
            <div class="article-icon">📊</div>
            <div class="article-content">
              <h4>Data visualization techniques</h4>
              <p>Advanced techniques for creating compelling data visualizations</p>
              <div class="article-meta">
                <span class="article-views">642 views</span>
                <span class="article-rating">⭐ 4.6</span>
              </div>
            </div>
          </div>
          
          <div class="article-item">
            <div class="article-icon">🚀</div>
            <div class="article-content">
              <h4>Performance optimization tips</h4>
              <p>Optimize your application for better performance and user experience</p>
              <div class="article-meta">
                <span class="article-views">1.1k views</span>
                <span class="article-rating">⭐ 4.7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .knowledge-base-container {
      padding: 1rem;
    }
    
    .kb-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    .kb-header h2 {
      color: #2c3e50;
      margin: 0;
      font-size: 2rem;
    }
    
    .search-box {
      display: flex;
      align-items: center;
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .search-input {
      border: none;
      padding: 0.75rem 1rem;
      outline: none;
      min-width: 300px;
      font-size: 1rem;
    }
    
    .search-btn {
      background: #3498db;
      color: white;
      border: none;
      padding: 0.75rem 1rem;
      cursor: pointer;
      font-size: 1.1rem;
    }
    
    .search-btn:hover {
      background: #2980b9;
    }
    
    .kb-categories {
      margin-bottom: 3rem;
    }
    
    .kb-categories h3 {
      color: #34495e;
      margin: 0 0 1.5rem 0;
      font-size: 1.5rem;
    }
    
    .category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }
    
    .category-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: 1px solid #e0e0e0;
      transition: transform 0.2s ease;
    }
    
    .category-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    }
    
    .category-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    
    .category-card h4 {
      color: #2c3e50;
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
    }
    
    .category-card p {
      color: #7f8c8d;
      margin: 0;
      font-size: 0.875rem;
    }
    
    .kb-articles h3 {
      color: #34495e;
      margin: 0 0 1.5rem 0;
      font-size: 1.5rem;
    }
    
    .articles-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .article-item {
      display: flex;
      background: white;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      border: 1px solid #e0e0e0;
      transition: transform 0.2s ease;
    }
    
    .article-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }
    
    .article-icon {
      font-size: 1.5rem;
      margin-right: 1rem;
      flex-shrink: 0;
    }
    
    .article-content {
      flex: 1;
    }
    
    .article-content h4 {
      color: #2c3e50;
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
    }
    
    .article-content p {
      color: #7f8c8d;
      margin: 0 0 1rem 0;
      line-height: 1.4;
    }
    
    .article-meta {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    
    .article-views {
      color: #95a5a6;
      font-size: 0.875rem;
    }
    
    .article-rating {
      color: #f39c12;
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    @media (max-width: 768px) {
      .kb-header {
        flex-direction: column;
        align-items: stretch;
      }
      
      .search-input {
        min-width: auto;
      }
      
      .category-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      }
    }
  `]
})
export class KnowledgeBaseComponent {
}
