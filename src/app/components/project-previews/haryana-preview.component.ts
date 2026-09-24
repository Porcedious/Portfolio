import { Component, ElementRef, AfterViewInit, OnDestroy, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface OrbitProduct {
  name: string;
  image: string;
  angle: number;
  /** CSS length for the orbit path diameter — `min(Ncqw,Ncqh)` so a tall,
      narrow tile can't blow the ring out past the tile's actual width. */
  ring: string;
  sway: number;
  /** CSS length for the product's own rendered size, same min() reasoning. */
  size: string;
}

/**
 * Live miniature of Haryana Brothers' real hero — the orbital product
 * system, the flying birds, and the sunlit background are all ported from
 * the source project's actual markup/CSS, not re-created.
 *
 * Two things deliberately left out of this port:
 *  - `home.ts`'s JS-measured responsive sizing (afterNextRender computing
 *    --orbit-size etc. per breakpoint) — this component uses `cqw` sized
 *    off the gallery tile instead, which gets the same "scales with
 *    available space" result without porting the measurement code, since
 *    a fixed-shape tile doesn't need the original's phone/tablet/desktop
 *    breakpoint logic.
 *  - The live Shopify product/cart signals used elsewhere on the real
 *    page — the hero's orbiting products were already static markup in
 *    the source (hardcoded name/description per product), not fetched, so
 *    nothing here talks to a backend.
 *
 * Every CSS animation (birds, orbit rotation, sway, ring pulse) is
 * explicitly paused via IntersectionObserver when this tile scrolls out of
 * the horizontal gallery's view, on top of whatever the browser's own
 * compositor already throttles — six orbiting elements plus two birds is
 * enough concurrent animation to be worth not running unconditionally.
 */
@Component({
  selector: 'app-haryana-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="har-hero" [class.paused]="!visible()">
      <img src="assets/previews/haryana/background.webp" alt="" class="har-bg" loading="lazy">
      <div class="har-sunlight"></div>

      <div class="har-birds" aria-hidden="true">
        <div class="har-bird-container har-bird-container-one"><div class="har-bird har-bird-one"></div></div>
        <div class="har-bird-container har-bird-container-two"><div class="har-bird har-bird-two"></div></div>
      </div>

      <div class="har-left">
        <span class="har-eyebrow">Rooted in Tradition</span>
        <h3 class="har-h1">Pure Food<br>From Our Farms<br><em>To Your Family</em></h3>
        <p class="har-sub">Wholesome, chemical-free, and traditionally made.</p>
        <span class="har-cta">Explore Products</span>
      </div>

      <div class="har-orbit-wrap">
        <div class="har-ring" style="width:min(30cqw,30cqh);height:min(30cqw,30cqh);opacity:0.12;"></div>
        <div class="har-ring" style="width:min(38cqw,38cqh);height:min(38cqw,38cqh);opacity:0.25;"></div>
        <div class="har-ring" style="width:min(46cqw,46cqh);height:min(46cqw,46cqh);opacity:0.45;"></div>

        <div class="har-center">Wholesome<br>by Nature</div>

        <div
          class="har-orbit"
          *ngFor="let p of products"
          [ngStyle]="{ '--angle': p.angle + 'deg', width: p.ring, height: p.ring }"
        >
          <div class="har-orbit-item" [ngStyle]="{ width: p.size, height: p.size }">
            <div class="har-orbit-counter" [ngStyle]="{ '--angle': p.angle + 'deg' }">
              <img [src]="p.image" [alt]="p.name" class="har-product-img" [ngStyle]="{ '--sway': p.sway + 'deg' }" loading="lazy">
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; height: 100%; container-type: size; container-name: har; }

    .har-hero {
      position: relative; width: 100%; height: 100%; overflow: hidden;
      display: flex; align-items: center; background: #EFE6D2;
    }
    .har-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
    .har-sunlight {
      position: absolute; top: -25%; left: -25%; width: 150%; height: 150%;
      background: radial-gradient(circle at 35% 45%, rgba(255,220,140,0.45) 0%, rgba(255,220,140,0.18) 30%, rgba(255,220,140,0.06) 55%, transparent 75%);
      opacity: 0.6;
    }

    .har-left { position: relative; z-index: 20; padding: 0 6cqw; max-width: 55cqw; }
    .har-eyebrow {
      display: block; font-family: 'Manrope', sans-serif; font-size: clamp(0.4rem, 1.8cqw, 0.65rem);
      letter-spacing: 0.2em; text-transform: uppercase; font-weight: 700; color: #1b4b36; margin-bottom: 1.5cqh;
    }
    .har-h1 {
      font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 600; color: #2c2a28;
      font-size: clamp(1rem, 7cqw, 2.1rem); line-height: 1.05; margin: 0 0 1.5cqh;
    }
    .har-h1 em { font-style: italic; color: #fff; font-weight: 400; text-shadow: 0 1px 3px rgba(0,0,0,0.2); }
    .har-sub { font-family: 'Manrope', sans-serif; font-size: clamp(0.45rem, 2.2cqw, 0.75rem); color: #57534e; margin: 0 0 2cqh; }
    .har-cta {
      display: inline-block; background: #1b4b36; color: #fff; font-family: 'Manrope', sans-serif;
      font-weight: 600; font-size: clamp(0.4rem, 1.7cqw, 0.65rem); letter-spacing: 0.08em; text-transform: uppercase;
      padding: 1cqh 2.5cqw; border-radius: 3px;
    }

    .har-orbit-wrap { position: absolute; right: 6cqw; top: 50%; transform: translateY(-50%); width: min(46cqw,46cqh); height: min(46cqw,46cqh); }
    .har-ring {
      position: absolute; top: 50%; left: 50%; transform: translate3d(-50%, -50%, 0);
      border-radius: 50%; border: 2px solid rgb(255, 230, 170); pointer-events: none;
    }
    .har-center {
      position: absolute; top: 50%; left: 50%; transform: translate3d(-50%, -50%, 0);
      width: min(15cqw,15cqh); height: min(15cqw,15cqh); border-radius: 50%; z-index: 20;
      background: radial-gradient(circle at center, #FFF8EA 0%, #F7EBD4 65%, #EFDDBB 100%);
      border: 1px solid rgba(184,148,83,0.25); box-shadow: 0 8px 30px rgba(0,0,0,0.08);
      display: flex; align-items: center; justify-content: center; text-align: center;
      font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 700; color: #1F4D3A;
      font-size: clamp(0.3rem, 1.5cqh, 0.6rem); line-height: 1.2;
    }

    .har-orbit {
      position: absolute; top: 50%; left: 50%; margin: auto; border-radius: 50%; pointer-events: none;
      transform: translate3d(-50%, -50%, 0) rotateZ(var(--angle));
      animation: har-orbit-forward 40s linear infinite;
      animation-delay: calc(var(--angle) / 360 * -40s);
    }
    @keyframes har-orbit-forward {
      from { transform: translate3d(-50%, -50%, 0) rotateZ(var(--angle)); }
      to { transform: translate3d(-50%, -50%, 0) rotateZ(calc(var(--angle) + 360deg)); }
    }
    .har-orbit-item {
      position: absolute; top: 0; left: 50%; transform: translate3d(-50%, -50%, 0);
      border-radius: 50%; pointer-events: none;
    }
    .har-orbit-counter {
      width: 100%; height: 100%; animation: har-orbit-reverse 40s linear infinite;
      animation-delay: calc(var(--angle) / 360 * -40s);
      display: flex; align-items: center; justify-content: center;
    }
    @keyframes har-orbit-reverse {
      from { transform: rotateZ(calc(var(--angle) * -1)); }
      to { transform: rotateZ(calc(var(--angle) * -1 - 360deg)); }
    }
    .har-product-img {
      width: 100%; height: 100%; object-fit: contain;
      animation: har-organic-float 6s ease-in-out infinite;
    }
    @keyframes har-organic-float {
      0% { transform: translateY(-6%) rotate(calc(var(--sway) * -1)); }
      50% { transform: translateY(6%) rotate(var(--sway)); }
      100% { transform: translateY(-6%) rotate(calc(var(--sway) * -1)); }
    }

    /* ---- Flying birds: real CSS sprite-sheet animation from the source
       project (bird-cells.svg stepped via background-position) ---- */
    .har-birds { position: absolute; inset: 0; z-index: 15; pointer-events: none; }
    .har-bird {
      /* Fixed px, not cqh: background-size:auto 100% scales the whole
         10-frame sprite sheet proportionally to this element's height, and
         the step keyframe below moves by a FIXED pixel offset in that
         scaled image's own coordinate space. A cqh-based (i.e. variable at
         runtime) height means the sprite renders at a different scale
         per tile size, so a fixed -900px step lands on a different
         fraction of a frame each time — the flap looked broken because it
         literally was, for whichever size didn't happen to land on an
         exact frame boundary. Fixed px keeps the math exact regardless of
         the tile's actual rendered size; -450px is exactly half of the
         source's -900px, matching this element being exactly half the
         source's 88x125 bird size.
      */
      background-image: url('/assets/previews/haryana/bird-cells.svg');
      opacity: 0.3; background-size: auto 100%; width: 44px; height: 62.5px;
      animation-name: har-fly-cycle; animation-timing-function: steps(10); animation-iteration-count: infinite;
    }
    .har-bird-one { animation-duration: 2s; animation-delay: -0.5s; }
    .har-bird-two { animation-duration: 1.8s; animation-delay: -0.75s; }
    @keyframes har-fly-cycle { 100% { background-position: -450px 0; } }

    .har-bird-container {
      position: absolute; left: 8cqw; transform: translate3d(-15cqw, 0, 0) scale(0);
      animation-timing-function: linear; animation-iteration-count: infinite;
    }
    .har-bird-container-one { top: 12%; animation-name: har-fly-right-one; animation-duration: 14s; animation-delay: 0s; }
    .har-bird-container-two { top: 24%; animation-name: har-fly-right-two; animation-duration: 17s; animation-delay: 2s; }
    @keyframes har-fly-right-one {
      0% { transform: translate3d(-15cqw, 0.5cqh, 0) scale(0.7); opacity: 0; }
      5% { opacity: 1; }
      60% { transform: translate3d(55cqw, 1cqh, 0) scale(1); }
      100% { transform: translate3d(105cqw, 0, 0) scale(0.9); opacity: 0; }
    }
    @keyframes har-fly-right-two {
      0% { transform: translate3d(-15cqw, -0.8cqh, 0) scale(0.6); opacity: 0; }
      8% { opacity: 1; }
      65% { transform: translate3d(50cqw, -0.5cqh, 0) scale(0.9); }
      100% { transform: translate3d(105cqw, 0, 0) scale(0.85); opacity: 0; }
    }

    /* Paused whenever the tile is off-screen (see the IntersectionObserver
       in the component) — six orbiting elements and two birds is enough
       concurrent animation to be worth stopping outright rather than
       trusting every browser's compositor to throttle it unprompted. */
    .har-hero.paused * { animation-play-state: paused !important; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HaryanaPreviewComponent implements AfterViewInit, OnDestroy {
  private host = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  visible = signal(true);

  // Real products from the source hero, at their real orbit angles — ring
  // radii collapsed from the original's 4 JS-measured breakpoint values
  // down to fixed min(cqw,cqh) lengths, since this tile doesn't need to
  // separately support phone/tablet/desktop breakpoints the way the full
  // page's hero does. min() rather than plain cqh keeps every ring inside
  // the tile even when it's taller than it is wide.
  products: OrbitProduct[] = [
    { name: 'Cold Pressed Oil', image: 'assets/previews/haryana/oil.webp', angle: 0, ring: 'min(30cqw,30cqh)', sway: 8, size: 'min(13cqw,13cqh)' },
    { name: 'Mango Pickle', image: 'assets/previews/haryana/pickle.webp', angle: 60, ring: 'min(36cqw,36cqh)', sway: 10, size: 'min(10cqw,10cqh)' },
    { name: 'A2 Cow Ghee', image: 'assets/previews/haryana/ghee.webp', angle: 120, ring: 'min(41cqw,41cqh)', sway: 8, size: 'min(10cqw,10cqh)' },
    { name: 'Stone Ground Aata', image: 'assets/previews/haryana/atta.webp', angle: 180, ring: 'min(46cqw,46cqh)', sway: 6, size: 'min(12cqw,12cqh)' },
    { name: 'Premium Spices', image: 'assets/previews/haryana/spices.webp', angle: 240, ring: 'min(30cqw,30cqh)', sway: 6, size: 'min(10cqw,10cqh)' },
    { name: 'Traditional Laddoos', image: 'assets/previews/haryana/laddoo.webp', angle: 300, ring: 'min(36cqw,36cqh)', sway: 9, size: 'min(10cqw,10cqh)' }
  ];

  ngAfterViewInit(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    this.observer = new IntersectionObserver(
      (entries) => { for (const entry of entries) this.visible.set(entry.isIntersecting); },
      { threshold: 0.1 }
    );
    this.observer.observe(this.host.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
