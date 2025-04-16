import { ViewportScroller } from '@angular/common';
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

  constructor(private router: Router,private viewportScroller: ViewportScroller) { }

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
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }

  homeLoanNav(): void{
    this.router.navigate(['/user/home-loan']).then(() => {
      window.location.reload();
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }

  aboutUsNav(): void{
    this.router.navigate(['/about-us']).then(() => {
      window.location.reload();
    });
  }

  contactUsNav(): void{
    this.router.navigate(['/contact-us']).then(() => {
      window.location.reload();
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }

  faqsNav(): void{
    this.router.navigate(['/faq']).then(() => {
      window.location.reload();
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }

  privacyPolicyNav(): void{
    this.router.navigate(['/privacy-policy']).then(() => {
      window.location.reload();
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }

  termsAndConditionNav(): void{
    this.router.navigate(['/terms-of-service']).then(() => {
      window.location.reload();
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }

  disclaimerNav(): void{
    this.router.navigate(['/disclaimer']).then(() => {
      window.location.reload();
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }
  
}