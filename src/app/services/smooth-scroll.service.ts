import { Injectable } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

/**
 * Site-wide smooth scroll.
 *
 * Lenis owns the actual scroll position; GSAP's ticker drives its rAF loop
 * (rather than Lenis running its own) so every scroll-linked GSAP/ScrollTrigger
 * animation reads a value that is already in sync for that frame — no
 * one-frame lag between "where Lenis says we are" and "where ScrollTrigger
 * thinks we are". `lagSmoothing(0)` is required alongside this: GSAP's default
 * lag compensation skips ticks after a stall, which would desync Lenis from
 * real elapsed time.
 *
 * Lenis's own `respectReducedMotion` (on by default) already disables the
 * smoothing for prefers-reduced-motion users while keeping scroll on the main
 * thread, so no separate opt-out path is needed here.
 */
@Injectable({ providedIn: 'root' })
export class SmoothScrollService {
  private lenis?: Lenis;
  private started = false;

  private readonly onTick = (time: number): void => {
    this.lenis?.raf(time * 1000);
  };

  init(): void {
    if (this.started || typeof window === 'undefined') return;
    this.started = true;

    gsap.registerPlugin(ScrollTrigger);

    this.lenis = new Lenis({
      // 0.9s, not the 1.1-1.5s range some Lenis demos use — smoothing that
      // lags too far behind the wheel/trackpad input is what actually reads
      // as "draggy", not a lack of easing.
      duration: 0.9,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 1.2
    });

    this.lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(this.onTick);
    gsap.ticker.lagSmoothing(0);
  }

  scrollTo(target: string | HTMLElement, offset = 0): void {
    this.lenis ? this.lenis.scrollTo(target, { offset }) : (document.querySelector(target as string) as HTMLElement)?.scrollIntoView();
  }

  destroy(): void {
    gsap.ticker.remove(this.onTick);
    this.lenis?.destroy();
    this.lenis = undefined;
    this.started = false;
  }
}
