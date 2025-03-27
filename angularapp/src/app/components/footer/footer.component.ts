import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();

  constructor() { }

  ngOnInit(): void {
  }

  homeNav() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
