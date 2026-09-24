import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Live miniature of Mjolniir's real hero — the canvas "orbit" animation
 * (dots tracing three tilted ellipses) is the actual drawing code from the
 * source project, not a re-creation, ported as-is since canvas drawing is
 * plain imperative code with no framework dependency to strip.
 *
 * Dropped: `app-button`/`app-container` (trivial wrapper components not
 * worth carrying over for one usage — flattened to plain elements with the
 * same CSS) and `ModalService` (the CTA opened a real lead-capture modal;
 * here it's just a static-looking button, since a modal that opens to
 * nothing would be worse than no modal at all).
 *
 * The rAF loop is paused via IntersectionObserver whenever this tile
 * scrolls out of the horizontal gallery's view — same technique the
 * portfolio's own Three.js hero background uses, for the same reason: a
 * canvas loop nobody can see is pure wasted main-thread work, and this
 * page already runs one such loop (the hero's particle field) plus GSAP
 * and Lenis, so a second one left running unconditionally would erode the
 * scroll smoothness this whole site is built around.
 */
@Component({
  selector: 'app-mjolniir-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mjo-hero">
      <div class="mjo-bg-orb"></div>
      <div class="mjo-bg-grid"></div>

      <div class="mjo-grid">
        <div class="mjo-copy">
          <p class="mjo-eyebrow"><span class="mjo-dot"></span> AI search is rewriting the rules</p>
          <h3 class="mjo-h1">Your Marketing <em>Growth Engine</em> For The <em>Agentic Internet.</em></h3>
          <p class="mjo-sub">High-intent buyers now ask AI who to trust before they ever visit your website.</p>
          <span class="mjo-btn">Request Your AI Visibility Audit &#8599;</span>
        </div>

        <div class="mjo-panel">
          <div class="mjo-orbital">
            <canvas #orbitCanvas width="680" height="680"></canvas>
          </div>

          <div class="mjo-chat-card">
            <div class="mjo-pills">
              <span class="mjo-pill">ChatGPT</span>
              <span class="mjo-pill">Perplexity</span>
              <span class="mjo-pill">Google AI</span>
            </div>
            <div class="mjo-query">Is AI Search recommending you, or your competitors?</div>
          </div>

          <div class="mjo-mini-grid">
            <div class="mjo-mini-card">
              <h4>80%</h4>
              <p>of B2B buyers start with an AI query, not Google</p>
            </div>
            <div class="mjo-mini-card blue">
              <h4>1 in 14</h4>
              <p>brands appear in AI answers for their own category</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; height: 100%; container-type: size; container-name: mjo; }

    .mjo-hero {
      position: relative; width: 100%; height: 100%; overflow: hidden;
      background: #0a0a0c; display: flex; align-items: center;
    }
    .mjo-bg-orb {
      position: absolute; width: 60cqw; height: 60cqw; border-radius: 50%;
      right: -10%; top: 50%; transform: translateY(-50%);
      background: radial-gradient(circle at 60% 50%, rgba(120,100,255,0.1) 0%, transparent 70%);
    }
    .mjo-bg-grid {
      position: absolute; inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
      background-size: 8cqw 8cqw;
      mask-image: radial-gradient(ellipse 80% 80% at 70% 50%, black 0%, transparent 70%);
    }

    .mjo-grid { position: relative; z-index: 1; display: grid; grid-template-columns: 1fr; gap: 3cqh; padding: 0 5cqw; width: 100%; }
    @container mjo (min-width: 560px) {
      .mjo-grid { grid-template-columns: 1.05fr 0.95fr; align-items: center; gap: 4cqw; }
    }

    .mjo-copy { max-width: 60cqw; }
    .mjo-eyebrow {
      display: inline-flex; align-items: center; gap: 1.5cqw; border: 1px solid #3f3f46; border-radius: 999px;
      padding: 0.8cqh 2.5cqw; color: #e4e4e7; font-family: 'Manrope', sans-serif;
      font-size: clamp(0.45rem, 2cqw, 0.65rem); font-weight: 600; margin: 0 0 1.5cqh;
    }
    .mjo-dot { width: 5px; height: 5px; border-radius: 50%; background: #5cd98a; display: inline-block; }
    .mjo-h1 {
      font-family: 'Manrope', sans-serif; font-weight: 700; color: #e6e6e7; margin: 0 0 1.5cqh;
      font-size: clamp(0.9rem, 6.5cqw, 1.9rem); line-height: 1.15; letter-spacing: -0.01em;
    }
    .mjo-h1 em {
      font-style: normal; background: linear-gradient(90deg, #60a5fa, #818cf8, #60a5fa);
      -webkit-background-clip: text; background-clip: text; color: transparent;
      background-size: 200% 200%; animation: mjo-gradient 4s ease infinite;
    }
    @keyframes mjo-gradient { 0%, 100% { background-position: left center; } 50% { background-position: right center; } }
    .mjo-sub { font-family: 'Manrope', sans-serif; color: #a1a1aa; font-size: clamp(0.5rem, 2.4cqw, 0.75rem); line-height: 1.5; margin: 0 0 2cqh; }
    .mjo-btn {
      display: inline-block; border-radius: 12px; background: linear-gradient(135deg, #8b5cf6, #6366f1);
      color: #fff; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(0.5rem, 2.2cqw, 0.75rem);
      padding: 1.2cqh 3cqw;
    }

    .mjo-panel { position: relative; display: grid; gap: 1.5cqh; }
    .mjo-orbital {
      position: absolute; width: 140%; left: 50%; top: 50%; transform: translate(-50%, -50%);
      z-index: -1; pointer-events: none;
    }
    .mjo-orbital canvas { width: 100%; height: auto; display: block; }

    .mjo-chat-card, .mjo-mini-card {
      position: relative; background: linear-gradient(145deg, rgba(22,22,26,0.4) 0%, rgba(10,10,15,0.6) 100%);
      border: 1px solid rgba(139,92,246,0.3); border-radius: 10px; padding: 2cqh 2.5cqw;
    }
    .mjo-pills { display: flex; gap: 1cqw; margin-bottom: 1cqh; flex-wrap: wrap; }
    .mjo-pill {
      background: rgba(139,92,246,0.15); border: 1px solid rgba(139,92,246,0.3); border-radius: 999px;
      color: #e4e4e7; font-family: 'Manrope', sans-serif; font-size: clamp(0.4rem, 1.6cqw, 0.6rem); padding: 0.4cqh 1.5cqw;
    }
    .mjo-query {
      border: 1px solid rgba(139,92,246,0.2); background: linear-gradient(180deg, rgba(139,92,246,0.08) 0%, transparent 100%);
      border-radius: 8px; color: #e4e4e7; font-family: 'Manrope', sans-serif; font-size: clamp(0.45rem, 1.8cqw, 0.7rem);
      line-height: 1.5; padding: 1.2cqh 1.5cqw;
    }
    .mjo-mini-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 1.5cqw; }
    .mjo-mini-card.blue { border-color: rgba(59,130,246,0.3); }
    .mjo-mini-card h4 { margin: 0 0 0.4cqh; font-family: 'Manrope', sans-serif; color: #f4f4f5; font-weight: 700; font-size: clamp(0.7rem, 3.5cqw, 1.1rem); }
    .mjo-mini-card p { margin: 0; color: #a1a1aa; font-family: 'Manrope', sans-serif; font-size: clamp(0.4rem, 1.5cqw, 0.6rem); line-height: 1.3; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MjolniirPreviewComponent implements AfterViewInit, OnDestroy {
  @ViewChild('orbitCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private host = inject(ElementRef<HTMLElement>);

  private animationFrameId?: number;
  private observer?: IntersectionObserver;
  private running = false;
  private startTime: number | null = null;

  ngAfterViewInit(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

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
    if (this.running) return;
    this.running = true;
    this.startTime = null;
    this.animationFrameId = requestAnimationFrame(this.animate);
  }

  private stop(): void {
    this.running = false;
    if (this.animationFrameId !== undefined) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
  }

  private animate = (ts: number): void => {
    if (!this.running) return;
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;

    if (!this.startTime) this.startTime = ts;
    const elapsed = (ts - this.startTime) / 1000;

    const W = 680, H = 680, CX = 340, CY = 340;
    const ellipses = [
      { rx: 280, ry: 110, tilt: -30 * Math.PI / 180 },
      { rx: 280, ry: 110, tilt: 30 * Math.PI / 180 },
      { rx: 100, ry: 290, tilt: 0 }
    ];
    const dots = [
      { ellipseIdx: 0, phase: 0, speed: 0.5 },
      { ellipseIdx: 0, phase: Math.PI, speed: 0.5 },
      { ellipseIdx: 1, phase: 0, speed: 0.4 },
      { ellipseIdx: 1, phase: Math.PI, speed: 0.4 },
      { ellipseIdx: 2, phase: Math.PI / 2, speed: 0.6 }
    ];

    ctx.clearRect(0, 0, W, H);

    for (const el of ellipses) {
      ctx.beginPath();
      ctx.save();
      ctx.translate(CX, CY);
      ctx.rotate(el.tilt);
      ctx.scale(el.rx, el.ry);
      ctx.arc(0, 0, 1, 0, Math.PI * 2);
      ctx.restore();
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    for (const d of dots) {
      const el = ellipses[d.ellipseIdx];
      const angle = d.phase + elapsed * d.speed;
      const lx = el.rx * Math.cos(angle);
      const ly = el.ry * Math.sin(angle);
      const cos = Math.cos(el.tilt);
      const sin = Math.sin(el.tilt);
      const x = CX + lx * cos - ly * sin;
      const y = CY + lx * sin + ly * cos;
      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(220,220,220,1)';
      ctx.fill();
    }

    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.stop();
  }
}
