import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './template.html',
  styleUrls: ['./template.css']
})
export class Template {
  activeMenu: string | null = null;
  activeSubMenu: string | null = null;
  utilisateurConnecte = 'Daïna BAZONGO';

  toggleMenu(menu: string, event?: MouseEvent) {
    event?.stopPropagation();
    this.activeMenu = this.activeMenu === menu ? null : menu;
    this.activeSubMenu = null;
  }

  toggleSubMenu(subMenu: string, event?: MouseEvent) {
    event?.stopPropagation();
    this.activeSubMenu = this.activeSubMenu === subMenu ? null : subMenu;
  }

  @HostListener('document:click', ['$event'])
  closeAllMenus(event: MouseEvent) {
    this.activeMenu = null;
    this.activeSubMenu = null;
  }
}
