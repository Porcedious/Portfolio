import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface HeroStat {
  value: string;
  label: string;
}

/**
 * Live miniature of Edsplorer's real hero copy/layout — ported, not
 * screenshotted. The real component also renders a live trial-booking form
 * (reactive forms, a booking service, server submission); none of that
 * belongs in a portfolio preview, so this keeps only the visual half —
 * badge, headline, stats — and drops the form entirely rather than
 * shipping a fake one that looks functional but silently does nothing.
 *
 * `container-type: size` on the host, and every original `vw`/`vh` unit
 * changed to `cqw`/`cqh`, so the full-viewport-designed layout scales to
 * this gallery tile's actual size instead of the real browser viewport.
 */
@Component({
  selector: 'app-edsplorer-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="eds-hero">
      <div class="eds-glow"></div>
      <div class="eds-grid"></div>

      <div class="eds-inner">
        <div class="eds-left">
          <div class="eds-badge">
            <span class="eds-dot"></span>
            Live 1:1 Online Classes for Kids 7&ndash;16
          </div>

          <h3 class="eds-h1">
            <span class="eds-line">Learn to <em class="eds-orange">Code</em></span>
            <span class="eds-line">Through <em class="eds-blue">Games</em></span>
          </h3>

          <p class="eds-sub">Where screen time becomes skill time.</p>

          <span class="eds-cta">Explore Courses</span>

          <div class="eds-stats">
            <div class="eds-stat" *ngFor="let stat of heroStats">
              <div class="eds-stat-n">{{ stat.value }}</div>
              <div class="eds-stat-l">{{ stat.label }}</div>
            </div>
          </div>
        </div>

        <!-- Right: the real trial-booking form, static — no FormGroup, no
             submit handler, no service call. It exists here purely as the
             visual the landing page actually shows; wiring it live would
             mean a "Book Free Trial" button that silently does nothing
             for a real visitor, which is worse than not having it. -->
        <div class="eds-right">
          <div class="eds-form">
            <div class="eds-form-header">
              <h4 class="eds-form-title">Book Your <em class="eds-orange">Free Trial</em></h4>
              <p class="eds-form-sub">One quick session to find the right course and meet a mentor.</p>
            </div>
            <div class="eds-form-row">
              <div class="eds-field"><label>Your Name</label><div class="eds-input">Enter your name</div></div>
              <div class="eds-field"><label>Child&rsquo;s Name</label><div class="eds-input">Enter child&rsquo;s name</div></div>
            </div>
            <div class="eds-form-row">
              <div class="eds-field eds-field-sm"><label>Age</label><div class="eds-input">7&ndash;16</div></div>
              <div class="eds-field"><label>Phone Number</label><div class="eds-input">&#127760; +91 &nbsp;&middot;&nbsp; Enter phone</div></div>
            </div>
            <div class="eds-field"><label>Email Address</label><div class="eds-input">your&#64;email.com</div></div>
            <div class="eds-form-row">
              <div class="eds-field"><label>Select Course</label><div class="eds-input eds-select">Minecraft Coding</div></div>
              <div class="eds-field"><label>Preferred Day</label><div class="eds-input eds-select">Weekend Morning</div></div>
            </div>
            <span class="eds-submit">Book Free Trial</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; height: 100%; container-type: size; container-name: eds; }

    .eds-hero {
      position: relative; width: 100%; height: 100%; overflow: hidden;
      background: linear-gradient(135deg, #0a0f1c, #121a2e);
      display: flex; align-items: center;
    }
    .eds-grid {
      position: absolute; inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px);
      background-size: 14cqw 14cqw;
    }
    .eds-glow {
      position: absolute; width: 45cqw; height: 45cqw; border-radius: 50%;
      background: radial-gradient(circle, rgba(255,123,28,0.3), transparent 70%);
      top: 25%; right: 5%; filter: blur(20px);
    }
    .eds-inner {
      position: relative; z-index: 1; padding: 0 6cqw; width: 100%;
      display: grid; grid-template-columns: 1fr; gap: 3cqh;
    }
    @container eds (min-width: 480px) {
      .eds-inner { grid-template-columns: 1.1fr 0.9fr; align-items: center; gap: 4cqw; }
    }

    .eds-badge {
      display: inline-flex; align-items: center; gap: 1.5cqw;
      background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
      border-radius: 999px; padding: 1cqh 3cqw; font-family: 'Manrope', sans-serif;
      font-size: clamp(0.5rem, 2.4cqw, 0.75rem); font-weight: 600; color: rgba(255,255,255,0.85);
      margin-bottom: 1.6cqh;
    }
    .eds-dot {
      width: 6px; height: 6px; border-radius: 50%; background: #4ADE80;
      box-shadow: 0 0 6px #4ADE80; animation: eds-pulse 2s ease-in-out infinite;
    }
    @keyframes eds-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

    .eds-h1 {
      font-family: 'Manrope', sans-serif; font-weight: 800; color: #fff;
      font-size: clamp(1rem, 6.5cqw, 2rem); line-height: 1.1; margin: 0 0 1.2cqh;
    }
    .eds-line { display: block; }
    .eds-orange { color: #ff7b1c; font-style: normal; }
    .eds-blue { color: #3b82f5; font-style: normal; }

    .eds-sub {
      font-family: 'Manrope', sans-serif; font-size: clamp(0.55rem, 2.6cqw, 0.85rem);
      font-style: italic; color: #cbd5e1; margin: 0 0 2cqh;
    }

    .eds-cta {
      display: inline-block; background: #22c55e; color: #fff; font-family: 'Manrope', sans-serif;
      font-weight: 600; font-size: clamp(0.5rem, 2.1cqw, 0.75rem); padding: 1cqh 3cqw;
      border-radius: 10px; margin-bottom: 2.5cqh;
    }

    .eds-stats { display: flex; gap: 4cqw; margin-top: 1.5cqh; }
    .eds-stat-n {
      font-family: 'Manrope', sans-serif; font-weight: 700; color: #fff;
      font-size: clamp(0.75rem, 3.8cqw, 1.2rem); line-height: 1;
    }
    .eds-stat-l { font-family: 'Manrope', sans-serif; font-size: clamp(0.42rem, 1.7cqw, 0.62rem); color: #9ca3af; }

    /* Right column: the real trial-booking form, rendered static */
    .eds-form {
      background: rgba(255,255,255,0.05); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.1); border-radius: 14px;
      padding: 2.5cqh 2.5cqw; display: flex; flex-direction: column; gap: 1.2cqh;
    }
    .eds-form-header { margin-bottom: 0.4cqh; }
    .eds-form-title {
      font-family: 'Manrope', sans-serif; font-weight: 700; color: #fff;
      font-size: clamp(0.65rem, 3.4cqw, 1.05rem); margin: 0 0 0.4cqh;
    }
    .eds-form-sub { font-family: 'Manrope', sans-serif; font-size: clamp(0.4rem, 1.6cqw, 0.6rem); color: rgba(255,255,255,0.55); margin: 0; line-height: 1.4; }
    .eds-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2cqw; }
    .eds-field { display: flex; flex-direction: column; gap: 0.3cqh; }
    .eds-field label {
      font-family: 'Manrope', sans-serif; font-size: clamp(0.35rem, 1.4cqw, 0.55rem); font-weight: 600; color: rgba(255,255,255,0.75);
    }
    .eds-input {
      padding: 0.9cqh 1cqw; border: 1px solid rgba(255,255,255,0.15); border-radius: 6px;
      font-family: 'Manrope', sans-serif; font-size: clamp(0.4rem, 1.5cqw, 0.6rem); color: rgba(255,255,255,0.4);
      background: rgba(255,255,255,0.03);
    }
    .eds-select { position: relative; }
    .eds-submit {
      display: block; text-align: center; background: #ff7a1a; color: #fff; font-family: 'Manrope', sans-serif;
      font-weight: 600; font-size: clamp(0.45rem, 1.9cqw, 0.7rem); padding: 1cqh 0; border-radius: 8px; margin-top: 0.4cqh;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EdsplorerPreviewComponent {
  heroStats: HeroStat[] = [
    { value: '50+', label: 'Students taught' },
    { value: '4.9/5', label: 'Parent rating' },
    { value: '1:1', label: 'Live classes' }
  ];
}
