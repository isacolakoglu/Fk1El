import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable, filter } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  showHeader: boolean = true;

  constructor(private authService: AuthService, private route: Router) {}

  ngOnInit(): void {
    this.authService.isLogged().subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
    });

    this.route.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      if (event.url.includes('/auth')) {
        this.showHeader = false;
      } else {
        this.showHeader = true;
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.route.navigate(['/auth']).then(() => {
      window.location.reload();
    });
  }
}
