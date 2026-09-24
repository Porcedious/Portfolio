import { Component, signal, effect, inject, AfterViewInit, OnDestroy, ElementRef, ViewChild, NgZone, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ThreeBackgroundComponent } from '../three-background/three-background.component';
import { DetailModalComponent, ModalType } from '../detail-modal/detail-modal.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, ThreeBackgroundComponent, DetailModalComponent],
  template: `
    <section id="hero" class="relative h-[100dvh] w-full overflow-hidden select-none font-hn bg-[#09090b]">
      
      <!-- BG Image (full-bleed, behind marquee) -->
      <img
        [src]="bgImageUrl()"
        alt=""
        fetchpriority="high"
        decoding="async"
        class="absolute inset-0 h-full w-full object-cover anim-fade-in z-0 pointer-events-none opacity-70 filter brightness-[0.85] contrast-[1.05]"
      />

      <!-- Revolving 3D Microchip & AI Neural Particles (Landing Section Only) -->
      <app-three-background></app-three-background>

      <!-- Real, single semantic h1 for SEO/AEO/GEO crawlers — the marquee below
           is purely decorative (duplicated text for the seamless loop), so it
           is hidden from assistive tech and search indexing to avoid a
           doubled/garbled page title. -->
      <h1 class="sr-only">Utkarsh Verma — Software Engineer building websites, applications &amp; AI systems, Lucknow, India</h1>

      <!-- Marquee Name Layer (z-10, letters scroll behind front portrait) -->
      <div class="absolute inset-x-0 top-[16vh] sm:top-[14vh] z-10 overflow-hidden anim-fade-up delay-500" aria-hidden="true">
        <div
          #marqueeTrack
          class="marquee-track flex w-max whitespace-nowrap font-hn text-[16vh] sm:text-[26vh] leading-none text-cream tracking-tight uppercase"
        >
          <span class="pr-[6vw]">Utkarsh &mdash; Verma</span>
          <span class="pr-[6vw]">Utkarsh &mdash; Verma</span>
        </div>
      </div>

      <!-- Horizontal Cream Rule (z-10) -->
      <div class="absolute inset-x-6 sm:inset-x-10 bottom-[5.5rem] sm:bottom-28 z-10 h-0.5 bg-cream/90 anim-line delay-1200 shadow-sm"></div>

      <!-- Desktop Footer (sm:z-10) -->
      <footer class="absolute inset-x-0 bottom-0 flex items-end justify-between px-6 pb-5 sm:px-10 sm:pb-8 text-xs sm:text-sm leading-relaxed font-hn text-cream pointer-events-auto">
        <!-- Footer Left -->
        <div class="anim-fade-up delay-1400 space-y-0.5">
          <p class="font-medium text-cream">Software Engineer</p>
          <p class="text-cream/80">Websites &bull; Applications &bull; AI Systems</p>
          <p class="text-gold/90 italic">Engineering the unseen &bull; Building the felt</p>
        </div>

        <!-- Footer Right -->
        <div class="anim-fade-up delay-1550 text-right space-y-0.5">
          <p class="text-cream/60 text-xs">Portfolio Homage</p>
          <p class="font-medium text-cream text-sm tracking-wide">Utkarsh Verma</p>
        </div>
      </footer>

      <!-- Front Portrait Cutout Overlay (z-20, sits ON TOP of scrolling marquee, pointer-events none) -->
      <div class="absolute inset-x-0 bottom-0 top-[10vh] sm:top-[7vh] z-20 pointer-events-none flex items-end justify-center anim-rise-in delay-300">
        <img
          [src]="portraitCutoutUrl()"
          alt="Utkarsh Verma Portrait"
          width="1854"
          height="3283"
          fetchpriority="high"
          decoding="async"
          (error)="onImageError($event)"
          class="h-[88%] sm:h-[92%] w-auto max-w-full object-contain object-bottom pointer-events-none"
        />
      </div>

      <!-- Header & Chrome Navigation (z-30) -->
      <header class="absolute inset-x-0 top-0 z-30 flex items-start justify-between px-6 pt-6 sm:px-10 sm:pt-8 pointer-events-auto">
        <!-- Left: Brand Logo -->
        <a 
          href="#" 
          (click)="openModal('story'); $event.preventDefault()"
          class="brand-logo font-hn text-xl sm:text-2xl font-light tracking-wide text-cream hover:text-gold transition-colors duration-300 anim-fade-up delay-800"
        >
          Utkarsh
        </a>

        <!-- Desktop Navigation Cluster -->
        <div class="hidden sm:flex items-start gap-16 lg:gap-24 text-sm font-hn">
          <!-- Year -->
          <span class="text-cream/60 text-sm anim-fade-up delay-900 font-mono">2026</span>

          <!-- Nav Links Stack -->
          <nav class="flex flex-col gap-1 text-sm font-hn">
            <a 
              *ngFor="let item of navItems; let i = index" 
              href="#" 
              (click)="openModal(item.type); $event.preventDefault()"
              class="text-cream hover:text-gold hover:opacity-60 transition-opacity duration-300 anim-fade-up"
              [style.animation-delay.ms]="1000 + i * 80"
            >
              {{ item.label }}
            </a>
          </nav>

          <!-- Social Links Stack -->
          <div class="flex flex-col gap-1 text-sm font-hn">
            <a 
              *ngFor="let social of socialItems; let i = index" 
              [href]="social.url" 
              [target]="social.url.startsWith('http') ? '_blank' : '_self'"
              class="text-cream hover:text-gold hover:opacity-60 transition-opacity duration-300 anim-fade-up"
              [style.animation-delay.ms]="1150 + i * 80"
            >
              {{ social.label }}
            </a>
          </div>
        </div>
      </header>

      <!-- Hamburger Button Toggle (z-50) -->
      <button 
        (click)="toggleDrawer()" 
        class="sm:hidden absolute top-6 right-6 z-50 h-10 w-10 flex flex-col items-center justify-center gap-1.5 focus:outline-none anim-fade-up delay-900"
        aria-label="Toggle Navigation Menu"
      >
        <span 
          class="h-0.5 w-6 bg-cream transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
          [ngClass]="drawerOpen() ? 'rotate-45 translate-y-[7px]' : ''"
        ></span>
        <span 
          class="h-0.5 w-6 bg-cream transition-all duration-300"
          [ngClass]="drawerOpen() ? 'opacity-0' : 'opacity-100'"
        ></span>
        <span 
          class="h-0.5 w-6 bg-cream transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
          [ngClass]="drawerOpen() ? '-rotate-45 -translate-y-[7px]' : ''"
        ></span>
      </button>

      <!-- Mobile Drawer Overlay & Slide-in Panel (z-40) -->
      <div 
        class="fixed inset-0 z-40 sm:hidden bg-black/50 backdrop-blur-md transition-opacity duration-500"
        [ngClass]="drawerOpen() ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
        (click)="toggleDrawer()"
      ></div>

      <aside 
        class="fixed top-0 right-0 bottom-0 z-40 sm:hidden w-[85%] max-w-sm bg-[#121215] border-l border-[#27272a] px-8 py-12 flex flex-col justify-between transition-transform duration-600 ease-[cubic-bezier(0.76,0,0.24,1)] text-cream shadow-2xl"
        [ngClass]="drawerOpen() ? 'translate-x-0' : 'translate-x-full'"
      >
        <!-- Site Index Section -->
        <div class="space-y-8 pt-8">
          <span 
            class="block text-xs uppercase tracking-[0.2em] text-cream/50 font-hn transition-all duration-300"
            [ngClass]="drawerOpen() ? 'translate-y-0 opacity-100 delay-250' : 'translate-y-4 opacity-0'"
          >
            Site Index
          </span>

          <nav class="flex flex-col gap-4 font-hn">
            <a 
              *ngFor="let item of navItems; let i = index" 
              href="#" 
              (click)="openModalFromDrawer(item.type); $event.preventDefault()"
              class="text-3xl font-light text-cream hover:text-gold transition-all duration-500"
              [style.transition-delay.ms]="drawerOpen() ? (300 + i * 80) : 0"
              [ngClass]="drawerOpen() ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'"
            >
              {{ item.label }}
            </a>
          </nav>
        </div>

        <!-- Find Me Section -->
        <div class="space-y-4 pb-4">
          <span 
            class="block text-xs uppercase tracking-[0.2em] text-cream/50 font-hn transition-all duration-300"
            [ngClass]="drawerOpen() ? 'translate-y-0 opacity-100 delay-500' : 'translate-y-4 opacity-0'"
          >
            Find Me
          </span>

          <div class="flex flex-wrap gap-x-6 gap-y-2 text-sm font-hn">
            <a 
              *ngFor="let social of socialItems; let i = index" 
              [href]="social.url"
              [target]="social.url.startsWith('http') ? '_blank' : '_self'"
              class="text-cream/80 hover:text-gold transition-all duration-400"
              [style.transition-delay.ms]="drawerOpen() ? (550 + i * 60) : 0"
              [ngClass]="drawerOpen() ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
            >
              {{ social.label }}
            </a>
          </div>
        </div>
      </aside>

      <!-- Interactive Detail Modal -->
      <app-detail-modal 
        [activeType]="activeModal()" 
        (close)="closeModal()"
      ></app-detail-modal>

    </section>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100dvh;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  @ViewChild('marqueeTrack') marqueeTrack!: ElementRef<HTMLDivElement>;

  private ngZone = inject(NgZone);
  private marqueeTween?: gsap.core.Tween;

  bgImageUrl = signal<string>(
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260729_022513_486985a2-ac8c-4278-91a8-071dcd9fcaff.png&w=1280&q=85'
  );

  /**
   * WebP at full native resolution (1854x3283) — same pixels as the source PNG
   * but 390 kB instead of 6.14 MB, which also cuts the main-thread decode from
   * a ~24 MB RGBA buffer down to something the decoder can hand over quickly.
   * Falls back to the original PNG via (error) if WebP is ever unavailable.
   */
  portraitCutoutUrl = signal<string>(
    'assets/utkarsh-portrait.webp'
  );

  drawerOpen = signal<boolean>(false);
  activeModal = signal<ModalType>(null);

  navItems: { label: string; type: ModalType }[] = [
    { label: 'Story', type: 'story' },
    { label: 'Jobs', type: 'jobs' },
    { label: 'Expertise', type: 'expertise' },
    { label: 'Projects', type: 'clients' },
    { label: 'Message', type: 'message' }
  ];

  socialItems = [
    { label: 'GitHub', url: 'https://github.com/Porcedious' },
    { label: 'Email', url: 'mailto:utkarsh.vermait@gmail.com' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/utkarsh-verma-94091713b/' }
  ];

  constructor() {
    effect(() => {
      if (typeof document !== 'undefined') {
        if (this.drawerOpen() || this.activeModal() !== null) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      if (this.marqueeTrack?.nativeElement) {
        this.marqueeTween = gsap.to(this.marqueeTrack.nativeElement, {
          xPercent: -50,
          repeat: -1,
          duration: 30,
          ease: 'none',
          force3D: true
        });
      }
    });
  }

  toggleDrawer(): void {
    this.drawerOpen.update(v => !v);
  }

  openModal(type: ModalType): void {
    this.activeModal.set(type);
  }

  openModalFromDrawer(type: ModalType): void {
    this.drawerOpen.set(false);
    setTimeout(() => {
      this.activeModal.set(type);
    }, 300);
  }

  closeModal(): void {
    this.activeModal.set(null);
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (!target) return;
    // WebP -> local PNG -> remote PNG. Guarded so a failing remote can't loop.
    if (target.src.endsWith('.webp')) {
      target.src = 'assets/utkarsh-portrait.png';
    } else if (!target.src.startsWith('http')) {
      target.src = 'https://stone-expand-60400629.figma.site/_assets/v11/8da570354e86aa0d44ac3e4aa335a72c8e750d68.png';
    }
  }

  ngOnDestroy(): void {
    if (this.marqueeTween) {
      this.marqueeTween.kill();
    }
  }
}
