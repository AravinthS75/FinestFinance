import { HostListener, ViewEncapsulation } from '@angular/core';
import { Component } from '@angular/core';
import { UserStoreService } from '../../services/user-store.service';
import { Router } from '@angular/router';
import { AuthUser } from '../../models/auth-user.model';

@Component({
  selector: 'app-home',
  standalone: false,
  
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent {
userRole: string | null = null;

  constructor(private userStore: UserStoreService, private router: Router) {}

  ngOnInit(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    this.userStore.userChanges.subscribe((user: AuthUser | null) => {
      this.userRole = user ? user.role : null;
    });

    const user: AuthUser | null = this.userStore.getUser();
    if (user) {
      this.userRole = user.role;
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.animateOnScroll();
  }

  animateOnScroll() {
    const elements = document.querySelectorAll('.value-card, .timeline-item');
    elements.forEach(element => {
      const position = element.getBoundingClientRect();
      if(position.top < window.innerHeight) {
        element.classList.add('animate');
      }
    });
  }

  isUser(): void {
    if(this.userRole === 'USER')
      this.router.navigate(['/user/personal-loan']);
    else
      this.router.navigate(['/login']);
  }
}
