import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css',
})
export class CarouselComponent implements OnInit {
  // slides = [
  //   { image: '../../../assets/banner-area.png', title: '25% discount all Paulo Coelho books!' },
  //   { image: '../../../assets/banner-area.png', title: '25% discount all Paulo Coelho books!(2.Sayfa)' },
  //   { image: '../../../assets/banner-area.png', title: '25% discount all Paulo Coelho books!(3.Sayfa)' },
  // ];
  slideIndex: number = 1;

  constructor() {}

  ngOnInit(): void {
    this.showSlides(this.slideIndex);
    setInterval(() => {
      this.showSlides((this.slideIndex += 1));
    }, 4000);
  }

  plusSlide(n: number): void {
    this.showSlides((this.slideIndex += n));
  }

  currentSlide(n: number): void {
    this.showSlides((this.slideIndex = n));
  }

  showSlides(n: number): void {
    const slides: HTMLCollectionOf<Element> = document.getElementsByClassName('slider-item');
    const dots: HTMLCollectionOf<Element> = document.getElementsByClassName('slider-dot');

    if (n > slides.length) {
      this.slideIndex = 1;
    }

    if (n < 1) {
      this.slideIndex = slides.length;
    }

    for (let i = 0; i < slides.length; i++) {
      (slides[i] as HTMLElement).style.display = 'none';
    }

    for (let i = 0; i < dots.length; i++) {
      (dots[i] as HTMLElement).className = (dots[i] as HTMLElement).className.replace(' active', '');
      // (dots[i] as HTMLElement).classList.remove('active')
    }

    (slides[this.slideIndex - 1] as HTMLElement).style.display = 'flex';
    (dots[this.slideIndex - 1] as HTMLElement).className += ' active';
  }
}
