import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  homeNav() {
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }

  personalLoanNav(): void{
    this.router.navigate(['/user/personal-loan']).then(() => {
      window.location.reload();
    });
  }

  businessLoanNav(): void{
    this.router.navigate(['/user/business-loan']).then(() => {
      window.location.reload();
    });
  }

  homeLoanNav(): void{
    this.router.navigate(['/user/home-loan']).then(() => {
      window.location.reload();
    });
  }
}