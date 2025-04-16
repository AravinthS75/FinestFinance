import { ViewEncapsulation } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  selector: 'app-business-loan-description',
  standalone: false,
  
  templateUrl: './business-loan-description.component.html',
  styleUrl: './business-loan-description.component.css',
  encapsulation: ViewEncapsulation.None
})
export class BusinessLoanDescriptionComponent {
  activeFAQIndex: number | null = null;

  toggleFAQ(index: number) {
    if (this.activeFAQIndex === index) {
      this.activeFAQIndex = null; // Collapse if already open
    } else {
      this.activeFAQIndex = index; // Open the clicked FAQ
    }
  }
}
