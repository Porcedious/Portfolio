import { Component, ChangeDetectionStrategy, signal, afterNextRender, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmoothScrollService } from '../../services/smooth-scroll.service';

interface SectionLink {
  id: string;
  label: string;
}

/**
 * Persistent section nav for everything BELOW the landing hero.
 *
 * The hero owns its own brand/nav/social header, but that header is
 * `absolute` inside `section#hero` — it scrolls away with the hero, so once
 * the user scrolls past it (on any screen size, including mobile, where the
 * hero's hamburger disappears too) there is no way to navigate at all. This
 * component exists only to fill that gap; it never overlaps the hero's own
 * nav because it stays hidden until the user has scrolled.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav
      class="fixed top-0 inset-x-0 z-[45] font-hn transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
      [ngClass]="visible() ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'"
      aria-label="Section navigation"
    >
      <!--
        Solid background, not backdrop-blur. This bar is fixed on top of
        continuously scrolling content — a blur here would force the
        compositor to resample everything underneath it on every scroll
        frame for as long as the bar is visible (unlike the one-time reveal
        transition, this cost never stops). Solid dark bg at high opacity
        reads the same as the rest of the dark UI without that cost.
      -->
      <div class="mx-auto max-w-[1360px] px-6 sm:px-10 h-16 flex items-center justify-between bg-[#09090b]/95 border-b border-white/10">

        <!-- Brand: settles in first -->
        <button
          (click)="scrollToId('hero')"
          class="text-cream text-lg sm:text-xl font-medium tracking-wide hover:text-gold transition-[color,transform,opacity] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
          [ngClass]="visible() ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'"
        >
          Utkarsh
        </button>

        <!-- Desktop section links -->
        <div class="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.15em]">
          <button
            *ngFor="let link of links; let i = index"
            (click)="scrollToId(link.id)"
            class="relative py-1 transition-[color,transform,opacity] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
            [ngClass]="activeId() === link.id ? 'text-gold' : 'text-cream/70 hover:text-cream'"
            [class.translate-y-0]="visible()"
            [class.opacity-100]="visible()"
            [class.-translate-y-2]="!visible()"
            [class.opacity-0]="!visible()"
            [style.transition-delay.ms]="visible() ? 60 + i * 45 : 0"
            [attr.aria-current]="activeId() === link.id ? 'true' : null"
          >
            {{ link.label }}
            <!--
              transform: scaleX, not width. Width is a layout property — an
              underline that grows via a width change forces a real layout
              recalc on every active-section change, i.e. repeatedly WHILE
              the user is scrolling. scaleX with a left-anchored origin gives
              the identical "grows from the left" look at zero layout cost.
            -->
            <span
              class="absolute left-0 -bottom-0.5 h-px w-full bg-gold origin-left transition-transform duration-300"
              [ngClass]="activeId() === link.id ? 'scale-x-100' : 'scale-x-0'"
            ></span>
          </button>
        </div>

        <!-- Mobile toggle -->
        <button
          (click)="toggleMobile()"
          class="md:hidden h-9 w-9 flex flex-col items-center justify-center gap-1.5 transition-opacity duration-400"
          [ngClass]="visible() ? 'opacity-100' : 'opacity-0'"
          aria-label="Toggle section navigation"
          [attr.aria-expanded]="mobileOpen()"
        >
          <span class="h-0.5 w-5 bg-cream transition-transform duration-300" [ngClass]="mobileOpen() ? 'rotate-45 translate-y-[3px]' : ''"></span>
          <span class="h-0.5 w-5 bg-cream transition-opacity duration-300" [ngClass]="mobileOpen() ? 'opacity-0' : 'opacity-100'"></span>
          <span class="h-0.5 w-5 bg-cream transition-transform duration-300" [ngClass]="mobileOpen() ? '-rotate-45 -translate-y-[3px]' : ''"></span>
        </button>
      </div>

      <!--
        Mobile dropdown panel. Positioned absolute (overlaying the content
        below rather than pushing it down), toggled with transform + opacity
        only — no max-height/height animation, which is a layout property and
        would force a reflow on every frame of the open/close transition.
      -->
      <div
        class="md:hidden absolute inset-x-0 top-full origin-top bg-[#09090b]/95 border-b border-white/10 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.76,0,0.24,1)]"
        [ngClass]="mobileOpen() ? 'scale-y-100 opacity-100 pointer-events-auto' : 'scale-y-0 opacity-0 pointer-events-none'"
      >
        <div class="px-6 py-4 flex flex-col gap-4 text-sm uppercase tracking-[0.1em]">
          <button
            *ngFor="let link of links"
            (click)="scrollToId(link.id); mobileOpen.set(false)"
            class="text-left py-1 transition-colors duration-300"
            [ngClass]="activeId() === link.id ? 'text-gold' : 'text-cream/80'"
          >
            {{ link.label }}
          </button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    :host { display: contents; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnDestroy {
  protected readonly links: SectionLink[] = [
    { id: 'about', label: 'About' },
    { id: 'education', label: 'Education' },
    { id: 'expertise', label: 'Expertise' },
    { id: 'capabilities', label: 'Capabilities' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ];

  protected readonly visible = signal(false);
  protected readonly activeId = signal('');
  protected readonly mobileOpen = signal(false);

  private heroObserver?: IntersectionObserver;
  private sectionObserver?: IntersectionObserver;
  private readonly smoothScroll = inject(SmoothScrollService);

  constructor() {
    // Wait for the first real render so #hero and the section ids (owned by
    // sibling components) are guaranteed to exist in the DOM before we look
    // for them.
    afterNextRender(() => this.setupObservers());
  }

  private setupObservers(): void {
    if (!('IntersectionObserver' in window)) return;

    const hero = document.getElementById('hero');
    if (hero) {
      // threshold: 1 fires the instant intersectionRatio drops below 1 — i.e.
      // on the very first pixel of scroll — which is what "appear as soon as
      // scrolling starts" needs. No scroll listener involved: the observer
      // only fires on the boundary crossing, not per scroll frame.
      this.heroObserver = new IntersectionObserver(
        ([entry]) => this.visible.set(entry.intersectionRatio < 1),
        { threshold: [1] }
      );
      this.heroObserver.observe(hero);
    }

    const sections = this.links
      .map(link => document.getElementById(link.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length) {
      this.sectionObserver = new IntersectionObserver(
        (entries) => {
          const intersecting = entries.filter(e => e.isIntersecting);
          if (intersecting.length === 0) return;
          // Whichever intersecting section starts highest wins — matches the
          // section currently occupying the "active" band of the viewport.
          const top = intersecting.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          this.activeId.set(top.target.id);
        },
        // Middle third of the viewport counts as "current section".
        { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
      );
      sections.forEach(section => this.sectionObserver!.observe(section));
    }
  }

  protected toggleMobile(): void {
    this.mobileOpen.update(v => !v);
  }

  protected scrollToId(id: string): void {
    const el = document.getElementById(id);
    if (!el) return;
    this.smoothScroll.scrollTo(el);
  }

  ngOnDestroy(): void {
    this.heroObserver?.disconnect();
    this.sectionObserver?.disconnect();
  }
}
