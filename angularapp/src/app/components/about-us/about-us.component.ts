import { Component, HostListener, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-about-us',
  standalone: false,
  templateUrl: './about-us.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent {


  constructor(){}

  ngOnInit(){
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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


}
