import { ViewportScroller } from '@angular/common';
import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact-us',
  standalone: false,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {
  contactForm: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private tostr: ToastrService, private viewportScroller: ViewportScroller) { 
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.animateOnScroll();
  }

  animateOnScroll() {
    const elements = document.querySelectorAll('.value-card, .timeline-item');
    elements.forEach(element => {
      const position = element.getBoundingClientRect();
      if(position.top < window.innerHeight) {
        element.classList.add('animate');
      }
    });
  }
  
  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      const formData = this.contactForm.value;

      this.isSubmitting = false;
      this.contactForm.reset();
      this.tostr.success('Your message has been sent successfully!', 'Success', {
        timeOut: 3000,
        progressBar: true,
        progressAnimation: 'increasing',
        closeButton: true,
        tapToDismiss: true,
        positionClass: 'toast-top-right'
      });
    }
  }
}
