import { Component, ElementRef, AfterViewInit, OnDestroy, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Slide {
  name: string;
  description: string;
  image: string;
}

/**
 * Live miniature of Expllingo's actual hero — same markup/CSS as the real
 * site, ported rather than screenshotted, so the animation (the slide
 * auto-rotation) is real rather than a video loop.
 *
 * Two changes from the source: the live `TravelDataService` fetch is
 * replaced with 3 of its own real slides hardcoded (no backend for a
 * portfolio embed to call), and every viewport-relative `vw`/`vh` unit in
 * the original CSS became `cqw`/`cqh` — the host below declares
 * `container-type: size`, so those units resolve against *this tile's*
 * size instead of the actual browser viewport, which is what a full-page
 * hero design assumes when it isn't the whole page anymore.
 */
@Component({
  selector: 'app-expllingo-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="exp-hero">
      <div class="exp-slides">
        <div class="exp-slide" *ngFor="let slide of slides; let i = index" [class.active]="i === activeSlide()">
          <img [src]="slide.image" [alt]="slide.name" class="exp-slide-img" loading="lazy" decoding="async">
          <div class="exp-content">
            <h3 class="exp-heading">{{ slide.name }}</h3>
            <p class="exp-sub">{{ slide.description }}</p>
            <span class="exp-btn">Start Exploring &rarr;</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; height: 100%; container-type: size; container-name: exp; }

    .exp-hero { position: relative; width: 100%; height: 100%; overflow: hidden; background: #0a0f1c; }
    .exp-slides { position: absolute; inset: 0; }
    .exp-slide {
      position: absolute; inset: 0; opacity: 0;
      transition: opacity 1s ease-in-out;
    }
    .exp-slide.active { opacity: 1; }
    .exp-slide-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
    .exp-slide::before {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 35%, rgba(0,0,0,0.05) 100%);
    }
    .exp-content {
      position: absolute; z-index: 2; left: 6cqw; bottom: 8cqh; color: #fff; max-width: 70cqw;
    }
    .exp-heading {
      font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 700;
      font-size: clamp(1.4rem, 11cqw, 3.2rem); line-height: 1.05; margin: 0 0 1cqh;
    }
    .exp-sub {
      font-family: 'Manrope', sans-serif; font-weight: 300; font-size: clamp(0.7rem, 3.2cqw, 1rem);
      line-height: 1.3; margin: 0 0 1.5cqh; opacity: 0.92;
    }
    .exp-btn {
      display: inline-block; background: #fff; color: #79adbb; font-family: 'Manrope', sans-serif;
      font-weight: 600; font-size: clamp(0.6rem, 2.6cqw, 0.85rem); padding: 1.2cqh 3.5cqw; border-radius: 999px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpllingoPreviewComponent implements AfterViewInit, OnDestroy {
  private host = inject(ElementRef<HTMLElement>);
  private intervalId?: ReturnType<typeof setInterval>;
  private observer?: IntersectionObserver;

  activeSlide = signal(0);

  // Real slides from Expllingo's own travel-data.service.ts — the same
  // static Maldives entry the original component itself falls back to for
  // its SSR-safe first paint, plus two more for a visible rotation.
  slides: Slide[] = [
    {
      name: 'Maldives',
      description: 'A mood: barefoot mornings, ocean everywhere, and time that moves slower.',
      image: 'https://res.cloudinary.com/djwss052h/image/upload/f_auto,q_auto,w_900/v1753355254/You_Me_-_Aerial_ym7479.jpg'
    },
    {
      name: 'Dubai',
      description: 'Where luxury meets towering skylines and the thrill of the desert.',
      image: 'https://res.cloudinary.com/djwss052h/image/upload/f_auto,q_auto,w_900/v1753359805/pexels-apasaric-3629227_xmvgqa.jpg'
    },
    {
      name: 'Bali',
      description: 'Where lush jungles meet crystal waters, and every moment feels like a dream.',
      image: 'https://res.cloudinary.com/djwss052h/image/upload/f_auto,q_auto,w_900/v1753356665/pexels-stijn-dijkstra-1306815-2674062_1_vsjcmy.jpg'
    }
  ];

  ngAfterViewInit(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    // Paused whenever this tile is scrolled out of the horizontal gallery's
    // view — it sits inside a wide pinned track where most panels are
    // off-screen at any given moment, so a free-running interval here would
    // keep rotating (and repainting) slides nobody can see.
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.isIntersecting ? this.start() : this.stop();
        }
      },
      { threshold: 0.1 }
    );
    this.observer.observe(this.host.nativeElement);
  }

  private start(): void {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => {
      this.activeSlide.update(v => (v + 1) % this.slides.length);
    }, 4000);
  }

  private stop(): void {
    if (!this.intervalId) return;
    clearInterval(this.intervalId);
    this.intervalId = undefined;
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.stop();
  }
}
