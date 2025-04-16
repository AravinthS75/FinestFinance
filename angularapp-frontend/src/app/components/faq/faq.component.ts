import { Component } from '@angular/core';

@Component({
  selector: 'app-faq',
  standalone: false,
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent {
  activeIndex: number | null = null;
  
  faqs = [
    {
      question: 'What are the eligibility criteria for a loan?',
      answer: 'To be eligible, you must be between 21-65 years old, have a stable income source, and meet our creditworthiness criteria. Minimum monthly income requirement is ₹25,000.'
    },
    {
      question: 'What documents are required for application?',
      answer: 'You need to provide PAN card, Aadhaar card, latest 3 months bank statements, salary slips (if salaried), and address proof. Self-employed applicants need additional business documents.'
    },
    {
      question: 'How long does approval take?',
      answer: 'Most applications are processed within 24-48 hours after document verification. Instant approval available for pre-qualified customers.'
    },
    {
      question: 'What is the maximum loan amount?',
      answer: 'You can borrow up to ₹50 lakhs depending on your income, credit score, and repayment capacity. Use our loan calculator to estimate your eligibility.'
    },
    {
      question: 'Can I prepay my loan?',
      answer: 'Yes, you can make partial or full prepayments after 6 EMIs. Prepayment charges of 2% apply on floating rate loans as per RBI guidelines.'
    }
  ];

  toggleFAQ(index: number) {
    this.activeIndex = this.activeIndex === index ? null : index;
  }
}
