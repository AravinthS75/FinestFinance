import { ViewEncapsulation } from '@angular/core';
import { Component } from '@angular/core';

interface Feature {
  icon: string;
  title: string;
  details: string;
}

interface Benefit {
  title: string;
  text: string;
}

interface DocumentCategory {
  category: string;
  items: string[];
  isOpen: boolean;
}

interface FAQ {
  question: string;
  answer: string;
  isOpen: boolean;
}


@Component({
  selector: 'app-car-loan-description',
  standalone: false,
  templateUrl: './car-loan-description.component.html',
  styleUrls: ['./car-loan-description.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CarLoanDescriptionComponent { 
  loanAmount: number = 500000;
  interestRate: number = 9.5; // Example Interest Rate
  tenure: number = 60; // Months (5 years)
  calculatedEMI: number = 0;

  particles = Array.from({ length: 100 }, () => ({
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: Math.random() * 10 + 5,
    duration: Math.random() * 10 + 5,
    delay: Math.random() * 5
  }));

  features: Feature[] = [
    { icon: '🚗', title: '100% Funding', details: 'Finance your entire car cost including RTO and insurance' },
    { icon: '📅', title: 'Flexible Tenure', details: 'Repayment options from 1 to 7 years' },
    { icon: '💸', title: 'Low Rates', details: 'Special rates for electric and hybrid vehicles' }
  ];

  benefits: Benefit[] = [
    { title: 'Instant Approval', text: 'Digital processing with minute approvals' },
    { title: 'No Prepayment', text: 'Zero charges for early loan closure' },
    { title: 'Doorstep Service', text: 'Complete paperwork at your convenience' }
  ];

  documents: DocumentCategory[] = [
    { category: 'Identity Proof', items: ['PAN Card', 'Aadhaar Card', 'Passport'], isOpen: false },
    { category: 'Financial Proof', items: ['6 Month Bank Statements', 'Salary Slips', 'Form 16'], isOpen: false }
  ];

  faqs: FAQ[] = [
    { question: 'What is the minimum loan amount?', answer: 'The minimum loan amount is ₹1,00,000.', isOpen: false },
    { question: 'Can I prepay my loan?', answer: 'Yes, you can prepay your loan without any additional charges.', isOpen: false },
    { question: 'What is the maximum tenure?', answer: 'The maximum tenure is 7 years.', isOpen: false }
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

  toggleDoc(doc: DocumentCategory): void {
    doc.isOpen = !doc.isOpen;
  
    this.documents.forEach(d => {
      if (d !== doc) d.isOpen = false;
    });
  }
  
  toggleFaq(faq: FAQ): void {
    faq.isOpen = !faq.isOpen;
    
    this.faqs.forEach(f => {
      if (f !== faq) f.isOpen = false;
    });
  }

}

