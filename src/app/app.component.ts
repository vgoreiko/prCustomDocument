import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MenuService, AmTreeMenuItem } from './services/menu.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'prCustomDocument';
  menuItems: AmTreeMenuItem[] = [];
  hasAccessibleSectionsFlag = false;
  private subscription = new Subscription();

  constructor(private menuService: MenuService) {}

  ngOnInit() {
    // Subscribe to menu changes
    this.subscription.add(
      this.menuService.getVisibleMenuItems().subscribe(items => {
        this.menuItems = items;
      })
    );

    // Subscribe to accessible sections status
    this.subscription.add(
      this.menuService.hasAccessibleSections().subscribe(hasAccess => {
        this.hasAccessibleSectionsFlag = hasAccess;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Get visible menu items
   */
  getVisibleMenuItems(): AmTreeMenuItem[] {
    return this.menuItems;
  }

  /**
   * Check if any menu sections are accessible
   */
  hasAccessibleSections(): boolean {
    return this.hasAccessibleSectionsFlag;
  }
}
