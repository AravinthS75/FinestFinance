import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-disclaimer',
  standalone: false,
  templateUrl: './disclaimer.component.html',
  styleUrl: './disclaimer.component.css'
})
export class DisclaimerComponent {
  accepted = false;
  
  sections = [
    {
      id: 'general',
      title: 'General Information',
      content: `
        <p>The content provided by Finest Finance is for general informational purposes only. 
        We make no representations or warranties of any kind regarding the accuracy, 
        completeness, or reliability of any information on our platform.</p>
      `
    },
    {
      id: 'advice',
      title: 'Not Professional Advice',
      content: `
        <p>Our services do not constitute financial, legal, or professional advice. 
        Always consult qualified professionals before making financial decisions. 
        Any reliance on information provided is strictly at your own risk.</p>
      `
    },
    {
      id: 'liability',
      title: 'Limitation of Liability',
      content: `
        <p>Under no circumstances shall Finest Finance be liable for any direct, indirect, 
        incidental, or consequential damages resulting from:</p>
        <ul>
          <li>Use or inability to use our services</li>
          <li>Unauthorized access to your data</li>
          <li>Errors or omissions in content</li>
          <li>Third-party services or links</li>
        </ul>
      `
    },
    {
      id: 'external',
      title: 'External Links',
      content: `
        <p>Our platform may contain links to third-party websites. We:</p>
        <ul>
          <li>Do not endorse these sites</li>
          <li>Are not responsible for their content</li>
          <li>Cannot guarantee their security practices</li>
        </ul>
      `
    },
    {
      id: 'accuracy',
      title: 'Information Accuracy',
      content: `
        <p>While we strive to maintain accurate information:</p>
        <ul>
          <li>Rates and terms may change without notice</li>
          <li>Errors may occasionally occur</li>
          <li>Loan approvals are subject to final verification</li>
        </ul>
      `
    }
    ,
    {
      id: 'user-responsibility',
      title: 'User Responsibility',
      content: `
        <p>By using our platform, you agree to:</p>
        <ul>
          <li>Provide accurate information</li>
          <li>Use our services responsibly</li>
          <li>Comply with all applicable laws</li>
        </ul>
      `
    },
    {
      id: 'changes',
      title: 'Changes to Disclaimer',
      content: `
        <p>We may update this disclaimer periodically. 
        Changes will be posted on our platform with an updated effective date.</p>
      `
    }
    ,
    {
      id: 'contact',
      title: 'Contact Us',
      content: `
        <p>If you have questions about this disclaimer, please contact us at:</p> 
        123 Main St, Cityville, ST 12345<br>
        Phone: (123) 456-7890<br>
        `
    }
  ];

  @ViewChildren('disclaimerSection') sectionElements!: QueryList<ElementRef>;

  onAccept() {
    this.accepted = true;
    // Add logic to store acceptance in backend/local storage
  }
}
