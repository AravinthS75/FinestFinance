import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-terms-of-service',
  standalone: false,
  templateUrl: './terms-of-service.component.html',
  styleUrl: './terms-of-service.component.css'
})
export class TermsOfServiceComponent {
  sections = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'eligibility', title: 'Eligibility Criteria' },
    { id: 'loan-terms', title: 'Loan Terms' },
    { id: 'responsibilities', title: 'User Responsibilities' },
    { id: 'privacy', title: 'Privacy & Data Security' },
    { id: 'termination', title: 'Termination' }
  ];

  @ViewChildren('sections') sectionElements!: QueryList<ElementRef>;

  ngOnInit() {
    window.addEventListener('scroll', this.onScroll.bind(this));
  }

  scrollTo(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  onScroll() {
    // Add active class logic for current section
    // Implement intersection observer if needed
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onScroll.bind(this));
  }
}
