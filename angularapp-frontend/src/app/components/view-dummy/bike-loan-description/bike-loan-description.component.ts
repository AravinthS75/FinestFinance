import { ViewEncapsulation } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  selector: 'app-bike-loan-description',
  standalone: false,
  
  templateUrl: './bike-loan-description.component.html',
  styleUrl: './bike-loan-description.component.css',
  encapsulation: ViewEncapsulation.None
  
})
export class BikeLoanDescriptionComponent {
  loanAmount = 50000;
  interestRate = 8.5; // Example Interest Rate
  tenure = 36; // Months (3 years)
  calculatedEMI = 0;

  particles = Array.from({ length: 100 }, () => ({
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: Math.random() * 10 + 5,
    duration: Math.random() * 10 + 5,
    delay: Math.random() * 5
  }));

  features = [
    { icon: '🏍️', title: '100% Funding', details: 'Finance your entire bike cost including RTO and insurance' },
    { icon: '📅', title: 'Flexible Tenure', details: 'Repayment options from 1 to 5 years' },
    { icon: '💸', title: 'Low Rates', details: 'Special rates for electric bikes' }
  ];

  benefits = [
    { title: 'Instant Approval', text: 'Digital processing with minute approvals' },
    { title: 'No Prepayment', text: 'Zero charges for early loan closure' },
    { title: 'Doorstep Service', text: 'Complete paperwork at your convenience' }
  ];

  documents = [
    { category: 'Identity Proof', items: ['PAN Card', 'Aadhaar Card', 'Passport'], isOpen: false },
    { category: 'Financial Proof', items: ['3 Month Bank Statements', 'Salary Slips', 'Form 16'], isOpen: false }
  ];

  faqs = [
    { question: 'What is the minimum loan amount?', answer: 'The minimum loan amount is ₹50,000.', isOpen: false },
    { question: 'Can I prepay my loan?', answer: 'Yes, you can prepay your loan without any additional charges.', isOpen: false },
    { question: 'What is the maximum tenure?', answer: 'The maximum tenure is 5 years.', isOpen: false }
  ];

  constructor() {
    this.calculateEMI();
  }

  calculateEMI(): void {
    const monthlyInterestRate = this.interestRate / (12 * 100);
    this.calculatedEMI = Math.round(
      (this.loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, this.tenure)) /
      (Math.pow(1 + monthlyInterestRate, this.tenure) - 1)
    );
  }

  toggleDoc(doc: any): void {
    doc.isOpen = !doc.isOpen;
  }

  toggleFaq(faq: any): void {
    faq.isOpen = !faq.isOpen;
  }

}
