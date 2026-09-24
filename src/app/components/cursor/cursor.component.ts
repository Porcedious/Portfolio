import { Component, ElementRef, OnInit, OnDestroy, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

/**
 * Global magnetic cursor (dot + ring), matching the reference editorial
 * site's UI. Deliberately hides itself — and restores the system cursor —
 * while the pointer is over `#hero`: the landing section keeps its own
 * unchanged interaction model, and a custom cursor bleeding into it wasn't
 * part of the "keep the landing section as it is" ask.
 *
 * Desktop/mouse only: `(pointer: fine)` gates the whole thing off on touch,
 * where there is no cursor to replace.
 */
@Component({
  selector: 'app-cursor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="enabled">
      <div class="cursor-dot" #dot></div>
      <div class="cursor-ring" #ring></div>
      <div class="cursor-label" #label></div>
    </ng-container>
  `,
  styles: [`
    .cursor-dot {
      position: fixed; top: 0; left: 0; width: 6px; height: 6px; border-radius: 50%;
      background: #B75C40; pointer-events: none; z-index: 100000; transform: translate(-50%, -50%);
      opacity: 0; transition: opacity 0.3s;
    }
    .cursor-dot.visible { opacity: 1; }
    .cursor-ring {
      position: fixed; top: 0; left: 0; width: 45px; height: 45px; border-radius: 50%;
      border: 1px solid rgba(28, 26, 23, 0.3); pointer-events: none; z-index: 99999;
      transform: translate(-50%, -50%); display: flex; align-items: center; justify-content: center;
      font-family: 'Manrope', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 0.1em; color: transparent;
      transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1), height 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                  background-color 0.4s, border-color 0.4s, opacity 0.3s;
      opacity: 0;
    }
    .cursor-ring.visible { opacity: 1; }
    .cursor-ring.active {
      width: 90px; height: 90px; background-color: #1C1A17; border-color: transparent; color: #F2EFE9;
    }

    /* Follows the cursor offset to the right — shown only over elements
       carrying a [data-cursor-label] attribute (the project tiles that
       link out to a real live site), separate from the generic hover ring
       so "here's a clickable thing" and "here's exactly where it goes"
       read as two distinct signals. */
    .cursor-label {
      position: fixed; top: 0; left: 0; pointer-events: none; z-index: 100001;
      transform: translate(24px, -50%); opacity: 0; transition: opacity 0.25s;
      background: #1C1A17; color: #F2EFE9; border: 1px solid rgba(183,92,64,0.4);
      border-radius: 999px; padding: 0.4em 0.9em; white-space: nowrap;
      font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.02em;
    }
    .cursor-label.visible { opacity: 1; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CursorComponent implements OnInit, OnDestroy {
  @ViewChild('dot') dotRef?: ElementRef<HTMLDivElement>;
  @ViewChild('ring') ringRef?: ElementRef<HTMLDivElement>;
  @ViewChild('label') labelRef?: ElementRef<HTMLDivElement>;

  enabled = false;

  private mouseX = 0;
  private mouseY = 0;
  private ringX = 0;
  private ringY = 0;
  private tickerFn?: () => void;
  private onMove?: (e: MouseEvent) => void;
  private onOver?: (e: Event) => void;
  private onOut?: (e: Event) => void;
  private hero?: HTMLElement | null;
  private overHero?: boolean;

  ngOnInit(): void {
    if (typeof window === 'undefined') return;
    this.enabled = window.matchMedia('(pointer: fine)').matches;
    if (!this.enabled) return;

    queueMicrotask(() => this.init());
  }

  private init(): void {
    const dot = this.dotRef?.nativeElement;
    const ring = this.ringRef?.nativeElement;
    const label = this.labelRef?.nativeElement;
    if (!dot || !ring || !label) return;

    this.mouseX = this.ringX = window.innerWidth / 2;
    this.mouseY = this.ringY = window.innerHeight / 2;

    this.onMove = (e: MouseEvent) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      gsap.to(dot, { x: this.mouseX, y: this.mouseY, duration: 0.1, ease: 'power2.out' });
      gsap.to(label, { x: this.mouseX, y: this.mouseY, duration: 0.15, ease: 'power2.out' });
    };
    window.addEventListener('mousemove', this.onMove, { passive: true });

    this.hero = document.getElementById('hero');

    // Checked every frame rather than on mouseenter/mouseleave over #hero:
    // scrolling moves sections under a *stationary* cursor, and a scroll by
    // itself never fires a pointer-enter/leave event — so a discrete
    // listener leaves the cursor hidden (or shown) based on whichever
    // section happened to be under it the last time the mouse actually
    // moved, not the one under it now.
    this.tickerFn = () => {
      this.ringX += (this.mouseX - this.ringX) * 0.15;
      this.ringY += (this.mouseY - this.ringY) * 0.15;
      gsap.set(ring, { x: this.ringX, y: this.ringY });

      const overHero = this.isPointInHero();
      if (overHero !== this.overHero) {
        this.overHero = overHero;
        ring.classList.toggle('visible', !overHero);
        dot.classList.toggle('visible', !overHero);
        if (overHero) label.classList.remove('visible');
      }
    };
    gsap.ticker.add(this.tickerFn);

    this.onOver = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('.hover-target, .hover-trigger')) {
        ring.classList.add('active');
        ring.textContent = 'VIEW';
      }
      const linked = target.closest<HTMLElement>('[data-cursor-label]');
      if (linked) {
        label.textContent = (linked.dataset['cursorLabel'] || '') + ' ↗';
        label.classList.add('visible');
      }
    };
    this.onOut = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('.hover-target, .hover-trigger')) {
        ring.classList.remove('active');
        ring.textContent = '';
      }
      if (target.closest('[data-cursor-label]')) {
        label.classList.remove('visible');
      }
    };
    document.addEventListener('mouseover', this.onOver, { passive: true });
    document.addEventListener('mouseout', this.onOut, { passive: true });

    // Suppress the native system cursor everywhere this custom one is
    // active — without it, the two render on top of each other (the actual
    // bug behind what looked like a stray dot next to the pointer). Scoped
    // to a class on <html> rather than unconditionally, and undone inside
    // #hero via the .ed-cursor-none exclusion below, so the landing section
    // keeps its normal pointer.
    document.documentElement.classList.add('ed-cursor-none');

    this.overHero = this.isPointInHero();
    ring.classList.toggle('visible', !this.overHero);
    dot.classList.toggle('visible', !this.overHero);
  }

  private isPointInHero(): boolean {
    if (!this.hero) return false;
    const r = this.hero.getBoundingClientRect();
    return this.mouseY >= r.top && this.mouseY <= r.bottom;
  }

  ngOnDestroy(): void {
    document.documentElement.classList.remove('ed-cursor-none');
    if (this.onMove) window.removeEventListener('mousemove', this.onMove);
    if (this.tickerFn) gsap.ticker.remove(this.tickerFn);
    if (this.onOver) document.removeEventListener('mouseover', this.onOver);
    if (this.onOut) document.removeEventListener('mouseout', this.onOut);
  }
}
