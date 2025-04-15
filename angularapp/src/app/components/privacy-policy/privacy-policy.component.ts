import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  standalone: false,
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.css'
})
export class PrivacyPolicyComponent {
  sections = [
    { id: 'introduction', title: '1. Introduction' },
    { id: 'data-collection', title: '2. Data Collection' },
    { id: 'data-use', title: '3. Data Use' },
    { id: 'data-sharing', title: '4. Data Sharing' },
    { id: 'security', title: '5. Security Measures' },
    { id: 'rights', title: '6. User Rights' },
    { id: 'cookies', title: '7. Cookies' },
    { id: 'changes', title: '8. Policy Changes' }
  ];

  @ViewChildren('policySection') sectionElements!: QueryList<ElementRef>;

  scrollTo(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  }
}
