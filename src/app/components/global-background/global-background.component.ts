import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * Root-level ambient layer.
 *
 * This used to hold a full-viewport looping `<video>` as the page background.
 * That is a full-screen surface being decoded, GPU-uploaded and composited on
 * every single frame for the entire session — and because it sat underneath
 * every `backdrop-filter` card above it, its repaints also invalidated their
 * blur cache, so scrolling past a glass card meant paying for a full blur
 * recompute every frame too. Under Lenis's continuous, sub-pixel scroll
 * updates that cost is no longer occasional — it is every frame, permanently,
 * which is exactly what shows up as scroll jitter.
 *
 * What survives is a single static film-grain layer: one GPU texture,
 * uploaded once, never re-painted, never re-decoded.
 */
@Component({
  selector: 'app-global-background',
  standalone: true,
  template: `<div class="fixed inset-0 w-full h-full -z-50 pointer-events-none grain-layer"></div>`,
  styles: [`
    :host {
      display: block;
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: -50;
      pointer-events: none;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GlobalBackgroundComponent {}
