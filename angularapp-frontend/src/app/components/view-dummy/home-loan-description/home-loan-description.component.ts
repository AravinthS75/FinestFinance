import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-home-loan-description',
  standalone: false,
  
  templateUrl: './home-loan-description.component.html',
  styleUrl: './home-loan-description.component.css',
  encapsulation: ViewEncapsulation.None
})
export class HomeLoanDescriptionComponent {
  loanAmount = 5000000;
  tenure = 20;
  interestRate = 8.4;
  activeFAQIndex: number | null = null;

  faqs = [
    {
      question: "What is the maximum loan amount I can get?",
      answer: "You can get up to ₹5 Crore or 90% of property value (whichever is lower)"
    },
    {
      question: "Can I prepay my home loan?",
      answer: "Yes, partial prepayments allowed after 12 EMIs with nominal charges"
    },
    {
      question: "What is the processing fee?",
      answer: "Up to 1% of loan amount + GST as applicable"
    }
  ];

  calculateEMI() {
    const monthlyRate = this.interestRate / 1200;
    const months = this.tenure * 12;
    return (
      (this.loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1)
    );
  }

  toggleFAQ(index: number) {
    this.activeFAQIndex = this.activeFAQIndex === index ? null : index;
  }

}
