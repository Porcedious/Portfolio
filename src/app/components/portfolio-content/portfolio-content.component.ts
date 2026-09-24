import { Component, ChangeDetectionStrategy, ElementRef, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EdsplorerPreviewComponent } from '../project-previews/edsplorer-preview.component';
import { ExpllingoPreviewComponent } from '../project-previews/expllingo-preview.component';
import { MjolniirPreviewComponent } from '../project-previews/mjolniir-preview.component';
import { HaryanaPreviewComponent } from '../project-previews/haryana-preview.component';

interface ExpertiseRow {
  index: string;
  title: string;
  caption: string;
  plain: string;
  tags: string[];
}

interface ProjectItem {
  number: string;
  tag: string;
  name: string;
  desc: string;
  tech: string;
  status: string;
  image: string;
  alt: string;
  /** Ported live preview instead of a static image — see project-previews/. */
  preview?: 'edsplorer' | 'expllingo' | 'mjolniir' | 'haryana';
  /** Real live site — omitted for the flagship build, which has no public URL. */
  url?: string;
  /** Short label shown next to the cursor on hover, e.g. "edsplorer.in". */
  urlLabel?: string;
  /** Who built it, shown as a bold line under the description. */
  founder?: string;
  /** Landscape source image (e.g. a 16:9 graphic) — sizes the tile as a
   *  rectangle and shows it uncropped, instead of the default portrait
   *  gallery-tile crop used by the rest of the projects. */
  wideImage?: boolean;
}

interface Capability {
  title: string;
  desc: string;
}

/**
 * Editorial content stream (everything below the hero).
 *
 * Deliberately flat, solid-color sections instead of the old floating
 * `backdrop-blur` glass cards — a blurred card repaints its blur region on
 * every compositor frame it's visible for, which fights a smooth Lenis
 * scroll. Solid sections composite once per scroll position, same as the
 * plain scroll they'd get anyway, so the scroll-linked reveals here are the
 * only extra cost, and they're driven by transform/opacity, the two
 * properties a compositor can animate without ever touching layout or paint.
 *
 * All reveal/park state (initial hidden position, pinned widths, etc.) is
 * applied by GSAP at runtime inside afterViewInit — never in static CSS — so
 * the prerendered HTML a crawler sees (Googlebot, or a non-JS AEO/GEO
 * fetcher) is fully visible, readable body text, not opacity:0 placeholders
 * waiting on JavaScript.
 */
@Component({
  selector: 'app-portfolio-content',
  standalone: true,
  imports: [CommonModule, EdsplorerPreviewComponent, ExpllingoPreviewComponent, MjolniirPreviewComponent, HaryanaPreviewComponent],
  template: `
    <div class="relative z-10 w-full ed-font-body">

      <!-- ============================================================ -->
      <!-- 01 / STORY & PHILOSOPHY (light)                               -->
      <!-- ============================================================ -->
      <section id="about" class="ed-section ed-light">
        <div class="ed-pad w-full max-w-5xl mx-auto">
          <div class="flex items-start justify-between gap-6 mb-10 sm:mb-14">
            <span class="ed-caption ed-accent reveal">01 / Story &amp; Philosophy</span>
            <span class="ed-caption text-[#857f75] reveal">UP, India</span>
          </div>

          <div class="hl-container word-reveal-block">
            <span class="hl-w reveal-word">I</span>
            <span class="hl-w reveal-word">build</span>
            <span class="hl-w reveal-word">software</span>
            <span class="hl-w reveal-word">that</span>
            <span class="hl-w reveal-word">behaves</span>
            <span class="hl-w reveal-word">like</span>
            <span class="hl-w reveal-word">it</span>
            <span class="hl-w reveal-word">was</span>
            <span class="hl-w reveal-word">always</span>
            <span class="hl-w reveal-word">meant</span>
            <span class="hl-w reveal-word">to</span>
            <span class="hl-w reveal-word">exist</span>
            <span class="hl-w reveal-word">&mdash;</span>
            <span class="hl-w hl-serif reveal-word">websites</span>
            <span class="hl-w reveal-word">that</span>
            <span class="hl-w reveal-word">load</span>
            <span class="hl-w reveal-word">like</span>
            <span class="hl-w reveal-word">thought,</span>
            <br class="hidden sm:block">
            <span class="hl-w hl-serif reveal-word">applications</span>
            <span class="hl-w reveal-word">that</span>
            <span class="hl-w reveal-word">hold</span>
            <span class="hl-w reveal-word">up</span>
            <span class="hl-w reveal-word">under</span>
            <span class="hl-w reveal-word">real</span>
            <span class="hl-w reveal-word">use,</span>
            <span class="hl-w reveal-word">and</span>
            <span class="hl-tag reveal-word">AI</span>
            <span class="hl-w reveal-word">pipelines</span>
            <span class="hl-w reveal-word">that</span>
            <span class="hl-w reveal-word">run</span>
            <span class="hl-w reveal-word">themselves.</span>

            <div class="w-full h-[2vh]"></div>

            <span class="hl-w hl-muted reveal-word">Good</span>
            <span class="hl-w hl-muted reveal-word">software</span>
            <span class="hl-w hl-muted reveal-word">should</span>
            <span class="hl-w hl-muted reveal-word">behave</span>
            <span class="hl-w hl-muted reveal-word">like</span>
            <span class="hl-w hl-muted reveal-word">good</span>
            <span class="hl-w hl-muted reveal-word">infrastructure:</span>
            <span class="hl-w hl-serif reveal-word">invisible,</span>
            <span class="hl-w hl-serif reveal-word">reliable,</span>
            <span class="hl-w reveal-word">engineered</span>
            <span class="hl-w reveal-word">to</span>
            <span class="hl-w hl-serif hl-underline reveal-word">disappear.</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16 mt-16 sm:mt-24 pt-10 border-t border-black/10">
            <div class="space-y-3 reveal">
              <h3 class="ed-h3">End-to-End Delivery</h3>
              <p class="ed-body">
                Websites, web applications, and backend services built as one coherent system — not handed off in pieces. Design, architecture, and the code that ships, all under one roof.
              </p>
            </div>
            <div class="space-y-3 reveal">
              <h3 class="ed-h3">Design &amp; Engineering</h3>
              <p class="ed-body">
                Following Dieter Rams &amp; Apple-grade minimalism: interfaces and APIs should perform invisibly, delivering solid, reliable outcomes without unnecessary clutter.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- 02 / TECHNICAL MATRIX (light, hover list)                     -->
      <!-- ============================================================ -->
      <section id="expertise" class="ed-section ed-light">
        <div class="ed-pad w-full max-w-5xl mx-auto">
          <span class="ed-caption ed-accent reveal">02 / Technical Matrix</span>
          <h2 class="ed-h2 mt-3 mb-10 sm:mb-16 reveal">Engineering Stack</h2>

          <div class="ed-hover-list">
            <div class="ed-l-item hover-trigger" *ngFor="let row of expertiseRows; let i = index" [attr.data-idx]="i">
              <div>
                <h3 class="ed-l-title">{{ row.title }}</h3>
                <p class="ed-plain mt-2 max-w-md">{{ row.plain }}</p>
                <div class="flex flex-wrap gap-2 mt-3">
                  <span class="ed-chip" *ngFor="let tag of row.tags">{{ tag }}</span>
                </div>
              </div>
              <span class="ed-caption text-[#857f75]">{{ row.index }} &mdash; {{ row.caption }}</span>
            </div>
          </div>

          <div class="ed-follower">
            <div class="ed-follower-inner">
              <span class="ed-follower-tags" *ngFor="let row of expertiseRows; let i = index" [attr.data-idx]="i">
                <span class="ed-chip ed-chip-dark" *ngFor="let tag of row.tags">{{ tag }}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- 03 / WHAT I CAN DELIVER (light, capability cards)             -->
      <!-- ============================================================ -->
      <section id="capabilities" class="ed-section ed-light" style="min-height:auto;">
        <div class="ed-pad w-full max-w-6xl mx-auto py-[12vh]">
          <span class="ed-caption ed-accent reveal">03 / What I Can Deliver</span>
          <h2 class="ed-h2 mt-3 mb-14 reveal">From a Landing Page to a Full Platform</h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="ed-capability-card reveal" *ngFor="let cap of capabilities; let i = index">
              <span class="ed-caption text-[#857f75]">{{ '0' + (i + 1) }}</span>
              <h3 class="ed-h3 mt-3">{{ cap.title }}</h3>
              <p class="ed-body-sm mt-2">{{ cap.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- MARQUEE BAND (dark, decorative)                               -->
      <!-- ============================================================ -->
      <section class="ed-dark ed-marquee-section" aria-hidden="true">
        <div class="ed-marquee-wrap">
          <span class="ed-marquee-text">Available for select engagements &nbsp;&#10022;&nbsp; Edsplorer &nbsp;&#10022;&nbsp; Expllingo &nbsp;&#10022;&nbsp; Mjolniir &nbsp;&#10022;&nbsp; Haryana Brothers &nbsp;&#10022;&nbsp; </span>
          <span class="ed-marquee-text">Available for select engagements &nbsp;&#10022;&nbsp; Edsplorer &nbsp;&#10022;&nbsp; Expllingo &nbsp;&#10022;&nbsp; Mjolniir &nbsp;&#10022;&nbsp; Haryana Brothers &nbsp;&#10022;&nbsp; </span>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- PROJECTS: 01. FLAWLESS CINEMATIC EXPAND ("My Projects.")     -->
      <!-- ============================================================ -->
      <section class="section s-expand theme-dark" id="projects">
        <div class="expand-wrapper">
          <div class="expand-container" id="expand-box">
            <img
              loading="lazy"
              src="assets/projects-wallpaper.webp"
              alt="My Projects"
              class="expand-img"
              id="expand-img"
            >
          </div>
          <div class="expand-text w-full flex-center">
            <div class="t-caption mb-4" style="letter-spacing: 0.3em; color: rgba(242,239,233,0.9); text-shadow: 0 2px 20px rgba(0,0,0,0.8);">
              The Flagship Build &amp; Selected Works
            </div>
            <h2 class="t-display italic" style="color: #F2EFE9;">My Projects.</h2>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- PROJECTS: 02. HORIZONTAL GALLERY SCROLL                      -->
      <!-- ============================================================ -->
      <section class="s-horiz theme-light" id="hz-trigger">
        <div class="horiz-track">
          <div class="h-panel" *ngFor="let proj of projectsList">
            <div class="h-text">
              <div class="t-caption text-accent mb-6 gs-fade">{{ proj.tag }} &mdash; {{ proj.number }}</div>
              <h2 class="t-h2 split-words mb-6"><span class="italic font-serif">{{ proj.name }}.</span></h2>
              <p class="t-body gs-fade">{{ proj.desc }}</p>
              <p *ngIf="proj.founder" class="t-body gs-fade mt-2"><strong>Founder: {{ proj.founder }}</strong></p>
              <div class="flex items-center gap-4 mt-6 t-caption gs-fade">
                <span class="text-muted">{{ proj.tech }}</span>
                <span class="text-accent font-semibold">{{ proj.status }}</span>
              </div>
            </div>
            <a
              class="img-mask h-img hz-img hover-target"
              [class.hover-scale]="!proj.preview"
              [class.h-img-wide]="proj.wideImage"
              [attr.href]="proj.url || null"
              [attr.target]="proj.url ? '_blank' : null"
              [attr.rel]="proj.url ? 'noopener noreferrer' : null"
              [attr.data-cursor-label]="proj.urlLabel || null"
              [attr.aria-label]="proj.url ? ('Visit ' + proj.name + ' (opens in a new tab)') : null"
            >
              <ng-container [ngSwitch]="proj.preview">
                <app-edsplorer-preview *ngSwitchCase="'edsplorer'" />
                <app-expllingo-preview *ngSwitchCase="'expllingo'" />
                <app-mjolniir-preview *ngSwitchCase="'mjolniir'" />
                <app-haryana-preview *ngSwitchCase="'haryana'" />
                <img *ngSwitchDefault [src]="proj.image" [alt]="proj.alt"
                     class="img-parallax" [class.img-fit-contain]="proj.wideImage" loading="lazy">
              </ng-container>
            </a>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- THE ACHIEVEMENT (dark, dramatic capstone before Contact)      -->
      <!-- Deliberately the darkest, quietest, most spaced-out section on -->
      <!-- the page — everything before it has been fast/kinetic (pins,   -->
      <!-- horizontal scroll, marquee), so a slow, still, centered moment -->
      <!-- right before the light closing CTA reads as the "and then     -->
      <!-- this happened" beat rather than just another content block.   -->
      <!-- ============================================================ -->
      <section id="achievement" class="ed-section ed-dark ach-section" style="min-height:auto;">
        <div class="ach-bg" aria-hidden="true">
          <img src="assets/army/army-1.webp" alt="" loading="lazy">
          <img src="assets/army/army-2.webp" alt="" loading="lazy">
          <img src="assets/army/army-3.webp" alt="" loading="lazy">
        </div>
        <div class="ed-pad w-full max-w-4xl mx-auto py-[18vh] text-center" style="position:relative; z-index:1;">
          <span class="ed-caption ed-accent reveal">Beyond the Portfolio</span>

          <div class="ach-container word-reveal-block mt-10">
            <span class="hl-w reveal-word">Built</span>
            <span class="hl-w reveal-word">alone.</span>
            <span class="hl-w hl-serif reveal-word">Deployed</span>
            <span class="hl-w reveal-word">for</span>
            <span class="hl-w hl-serif hl-underline hl-army-shimmer reveal-word">the&nbsp;Indian&nbsp;Army.</span>
          </div>

          <p class="ed-body mt-10 max-w-2xl mx-auto reveal" style="opacity:0.7;">
            The build I&rsquo;m proudest of isn&rsquo;t on this page by name &mdash; some work speaks
            for itself without needing a case study. Architecture, code, testing, deployment:
            one complete system, start to finish, with no one else in the room.
          </p>

          <div class="ach-stats mt-14 reveal">
            <div class="ach-stat">
              <span class="ach-stat-num">1</span>
              <span class="ach-stat-label">Engineer</span>
            </div>
            <div class="ach-stat-divider" aria-hidden="true"></div>
            <div class="ach-stat">
              <span class="ach-stat-num">0</span>
              <span class="ach-stat-label">Handoffs</span>
            </div>
            <div class="ach-stat-divider" aria-hidden="true"></div>
            <div class="ach-stat">
              <span class="ach-stat-num">100%</span>
              <span class="ach-stat-label">Delivered</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- 05 / CONTACT (light, arrival CTA + footer)                    -->
      <!-- ============================================================ -->
      <section id="contact" class="ed-section ed-light" style="min-height:auto;">
        <div class="ed-pad w-full max-w-5xl mx-auto py-[14vh]">
          <div class="text-center mb-[10vh]">
            <span class="ed-caption ed-accent reveal">06 / Communication</span>
            <h2 class="ed-h2 mt-4 reveal">There is no roadmap to shipped software.</h2>
            <p class="ed-h1-serif italic ed-accent mt-2 reveal">Ship.</p>
            <p class="ed-body text-[#857f75] mt-6 max-w-lg mx-auto reveal">Available for websites, web applications, and AI-powered automation systems.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <a href="mailto:utkarsh.vermait@gmail.com" class="ed-contact-box reveal">
              <div>
                <span class="ed-caption text-[#857f75]">Direct Email</span>
                <p class="ed-body font-mono mt-1">utkarsh.vermait&#64;gmail.com</p>
              </div>
              <span class="ed-contact-arrow" aria-hidden="true">&rarr;</span>
            </a>
            <a href="https://github.com/Porcedious" target="_blank" rel="noopener noreferrer" class="ed-contact-box reveal">
              <div>
                <span class="ed-caption text-[#857f75]">GitHub Profile</span>
                <p class="ed-body font-mono mt-1">github.com/Porcedious</p>
              </div>
              <span class="ed-contact-arrow" aria-hidden="true">&rarr;</span>
            </a>
          </div>

          <footer class="pt-8 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4 ed-caption text-[#857f75]">
            <p>&copy; 2026 Utkarsh Verma. All rights reserved.</p>
            <p>Built with Angular 20 &bull; GSAP &bull; Lenis</p>
          </footer>
        </div>
      </section>

    </div>
  `,
  styles: [`
    :host { display: block; }

    /* Editorial content typeface — Manrope for body copy, matching the
       reference site. The hero above this component keeps its own
       Helvetica Neue ME brand face untouched (it sets font-hn explicitly on
       every element it renders, so it never inherits this). */
    .ed-font-body { font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-weight: 300; }

    .ed-section {
      position: relative;
      width: 100%;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .ed-pad { padding-left: 6vw; padding-right: 6vw; }
    @media (min-width: 640px) { .ed-pad { padding-left: 5vw; padding-right: 5vw; } }

    .ed-light { background: #F2EFE9; color: #1C1A17; }
    .ed-dark  { background: #151412; color: #F2EFE9; }

    .ed-caption { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 500; }
    .ed-accent { color: #B75C40 !important; }
    .ed-serif-italic { font-style: italic; }

    .ed-h2 { font-size: clamp(1.9rem, 4vw, 3.2rem); font-weight: 500; letter-spacing: -0.01em; line-height: 1.05; }
    .ed-h2-serif { font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(1.6rem, 3.4vw, 2.6rem); font-style: italic; font-weight: 400; line-height: 1.1; }
    .ed-h3 { font-size: clamp(1.1rem, 1.6vw, 1.4rem); font-weight: 600; }
    .ed-h1-serif { font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(2.6rem, 7vw, 5.5rem); font-weight: 400; line-height: 0.95; letter-spacing: -0.01em; }
    .ed-body { font-size: clamp(1.05rem, 1.25vw, 1.35rem); line-height: 1.6; opacity: 0.85; }
    .ed-body-sm { font-size: 0.85rem; line-height: 1.6; opacity: 0.75; }
    /* The "translate the jargon" line — visually quieter and smaller than
       .ed-body so it reads as a footnote, not a repeat of the sentence above. */
    .ed-plain { font-size: 0.82rem; line-height: 1.55; font-style: italic; opacity: 0.7; }

    /* ---- 01 Story: creative highlight text block ---- */
    .hl-container { line-height: 1.5; }
    .hl-w { display: inline-block; font-size: clamp(1.4rem, 3vw, 2.6rem); font-weight: 300; margin: 0 0.12em; }
    .hl-serif {
      font-family: 'Cormorant Garamond', Georgia, serif; font-style: italic; color: #B75C40;
      font-size: clamp(1.9rem, 4.5vw, 4.2rem);
    }
    .hl-muted { color: #857f75; }
    .hl-underline { text-decoration: underline; text-decoration-color: #B75C40; text-underline-offset: 6px; }
    /* Shimmering text-fill — a slow-travelling highlight sweeping through
       the glyphs, reserved for "the Indian Army" so that one line reads as
       the section's quiet high point. */
    .hl-army-shimmer {
      color: #B75C40;
      text-shadow: 0 0 80px rgba(255,255,255,.5);
      background: url(https://i.ibb.co/RDTnNrT/animated-text-fill.png) repeat-y;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      -webkit-animation: hl-army-shimmer-move 80s linear infinite;
      animation: hl-army-shimmer-move 80s linear infinite;
      -webkit-transform: translate3d(0, 0, 0);
      -webkit-backface-visibility: hidden;
    }
    @-webkit-keyframes hl-army-shimmer-move {
      0% { background-position: 0% 50%; }
      100% { background-position: 100% 50%; }
    }
    @keyframes hl-army-shimmer-move {
      0% { background-position: 0% 50%; }
      100% { background-position: 100% 50%; }
    }
    .hl-tag {
      display: inline-block; vertical-align: middle; margin: 0 0.15em; transform: translateY(-0.1em);
      padding: 0.15em 0.7em; border-radius: 999px; font-family: monospace; font-size: 0.9rem; font-weight: 600;
      background: rgba(183, 92, 64, 0.12); border: 1px solid rgba(183, 92, 64, 0.4); color: #B75C40;
    }

    /* ---- Achievement capstone: centered variant of .hl-container's
       word-blur reveal, plus the stat row underneath ---- */
    .ach-section { position: relative; overflow: hidden; }
    /* Three real portrait photos, laid side by side and faded into the
       section's own onyx background so they read as texture behind the
       copy rather than a competing photo strip. Row on desktop (the
       photos are already tall/portrait, so a row reads better than a
       column); stacked on mobile, where a row of three portrait crops
       would squeeze each one down too far to read. */
    .ach-bg {
      position: absolute; inset: 0; display: flex; z-index: 0;
    }
    .ach-bg::after {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(180deg, #151412 0%, rgba(21,20,18,0.55) 30%, rgba(21,20,18,0.55) 70%, #151412 100%);
    }
    .ach-bg img {
      flex: 1; width: 100%; height: 100%; object-fit: cover;
      filter: grayscale(35%) brightness(0.55) contrast(1.05);
      opacity: 0.9;
    }
    .ach-bg img:not(:last-child) { border-right: 1px solid rgba(242,239,233,0.06); }
    @media (max-width: 768px) {
      .ach-bg { flex-direction: column; }
      .ach-bg img:not(:last-child) { border-right: none; border-bottom: 1px solid rgba(242,239,233,0.06); }
    }
    .ach-container { text-align: center; line-height: 1.35; }
    .ach-stats {
      display: flex; align-items: center; justify-content: center; gap: 2.5rem;
      flex-wrap: wrap;
    }
    .ach-stat { display: flex; flex-direction: column; align-items: center; gap: 0.35rem; }
    .ach-stat-num {
      font-family: 'Cormorant Garamond', Georgia, serif; font-style: italic; font-weight: 400;
      font-size: clamp(2.2rem, 4vw, 3.2rem); color: #B75C40; line-height: 1;
    }
    .ach-stat-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.15em; color: #857f75; }
    .ach-stat-divider { width: 1px; height: 2.5rem; background: rgba(242,239,233,0.12); }
    @media (max-width: 640px) {
      .ach-stats { gap: 1.75rem; }
      .ach-stat-divider { display: none; }
    }

    /* ==========================================================================
       PROJECTS SECTION STYLES (Exact Image 1 & Image 2 Design)
       ========================================================================== */
    .theme-dark { background-color: #151412; color: #F2EFE9; }
    .theme-light { background-color: #F2EFE9; color: #1C1A17; }

    .t-display {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: clamp(3.8rem, 11vw, 13rem);
      line-height: 0.9;
      font-weight: 400;
      letter-spacing: -0.02em;
      margin: 0;
    }
    .t-h2 {
      font-family: 'Manrope', sans-serif;
      font-size: clamp(2rem, 3.8vw, 4.5rem);
      line-height: 1.05;
      font-weight: 300;
      letter-spacing: -0.02em;
      margin: 0;
    }
    .t-body {
      font-size: clamp(1.05rem, 1.3vw, 1.45rem);
      line-height: 1.6;
      max-width: 550px;
      opacity: 0.85;
    }
    .t-caption {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      font-weight: 500;
    }
    .text-accent { color: #B75C40 !important; }
    .text-muted { color: #857F75 !important; }
    .font-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
    .italic { font-style: italic; }
    .flex-center { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }

    /* ⭐️ FLAWLESS CINEMATIC EXPAND (No clip-path bugs) ⭐️ */
    .s-expand {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      background: #151412;
      padding: 0;
    }
    .expand-wrapper {
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      inset: 0;
      overflow: hidden;
    }
    .expand-container {
      width: 25vw;
      height: 60vh;
      border-radius: 300px;
      overflow: hidden;
      position: relative;
      will-change: width, height, border-radius;
      -webkit-mask-image: -webkit-radial-gradient(white, black);
      transform: translateZ(0);
    }
    .expand-img {
      position: absolute;
      width: 100vw;
      height: 100vh;
      object-fit: cover;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      filter: brightness(0.6) grayscale(20%);
      transition: filter 1s ease;
    }
    .expand-text {
      position: absolute;
      z-index: 10;
      color: #F2EFE9;
      opacity: 0;
      text-shadow: 0 8px 60px rgba(0,0,0,0.85), 0 2px 14px rgba(0,0,0,0.7);
      pointer-events: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      inset: 0;
    }

    /* ⭐️ HORIZONTAL GALLERY ⭐️ */
    .s-horiz {
      height: 100vh;
      overflow: hidden;
      position: relative;
      padding: 0;
      background-color: #F2EFE9;
      color: #1C1A17;
    }
    .horiz-track {
      display: flex;
      height: 100vh;
      width: max-content;
    }
    .h-panel {
      width: 100vw;
      height: 100vh;
      padding: 0 5vw;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8vw;
    }
    .h-text { width: 35vw; }
    .h-img { width: 48vw; height: 70vh; }

    .img-mask {
      /* This is an <a> now (see the template) so each project tile can
         link to the real live site — reset the browser's anchor defaults
         (inline display, underline, link color) back to how the plain
         <div> it replaced behaved. */
      display: block;
      text-decoration: none;
      color: inherit;
      position: relative;
      overflow: hidden;
      clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0 100%);
      will-change: clip-path;
      background: #1C1A17;
      border-radius: 4px;
      /* The three ported project previews were designed as full-viewport
         pages, so their internal clamp()s use vw/vh units. Declaring size
         containment here lets their host components use cqw/cqh instead —
         resolved against this tile's actual box, not the real browser
         viewport — so a hero built for 100vw doesn't render oversized
         inside a ~48vw gallery tile. */
      container-type: size;
    }
    .img-parallax {
      position: absolute;
      top: -15%;
      left: 0;
      width: 100%;
      height: 130%;
      object-fit: cover;
      will-change: transform;
      filter: grayscale(15%) brightness(0.9);
      transition: filter 0.8s ease, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .hover-scale:hover .img-parallax {
      filter: grayscale(0%) brightness(1);
      transform: scale(1.04);
    }

    /* ClipEva's tile: its source graphic is a 16:9 landscape frame with its
       own baked-in text, so the default portrait crop used by the other
       (live-preview) tiles would cut it off. Reshape just this box to match
       the image's real aspect ratio and show the whole thing uncropped. */
    .h-img-wide { height: auto; aspect-ratio: 16 / 9; }
    .img-fit-contain {
      position: absolute;
      inset: 0;
      top: 0;
      height: 100%;
      object-fit: contain;
    }

    @media (max-width: 1024px) {
      .expand-container {
        width: 75vw;
        height: 45vh;
        border-radius: 40px;
      }
      .expand-text {
        opacity: 1;
      }
      .horiz-track {
        flex-direction: column;
        width: 100%;
        height: auto;
      }
      .s-horiz {
        height: auto;
        overflow: visible;
      }
      .h-panel {
        flex-direction: column-reverse;
        height: auto;
        padding: 10vh 5vw;
        gap: 5vh;
        justify-content: center;
      }
      .h-text, .h-img {
        width: 100%;
      }
      .h-img {
        height: 48vh;
      }
      .h-img-wide {
        height: auto;
        aspect-ratio: 16 / 9;
      }
      .img-mask {
        clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%) !important;
      }
    }

    /* ---- 03 Expertise: hover list ---- */
    .ed-hover-list { border-top: 1px solid rgba(0,0,0,0.1); }
    .ed-l-item {
      display: flex; justify-content: space-between; align-items: center;
      padding: 2.2rem 0; border-bottom: 1px solid rgba(0,0,0,0.1);
      cursor: pointer; transition: padding 0.5s cubic-bezier(0.16,1,0.3,1), border-color 0.4s;
    }
    .ed-l-item:hover { padding: 2.8rem 1rem; border-color: #B75C40; }
    .ed-l-title { font-size: clamp(1.4rem, 3.2vw, 2.6rem); font-weight: 500; transition: color 0.4s, transform 0.5s cubic-bezier(0.16,1,0.3,1); margin: 0; }
    .ed-l-item:hover .ed-l-title { color: #B75C40; transform: translateX(1.2rem); }
    .ed-chip {
      display: inline-block; padding: 0.25em 0.7em; border-radius: 999px; font-size: 0.7rem; font-weight: 600;
      border: 1px solid rgba(0,0,0,0.15); color: #1C1A17;
    }
    .ed-chip-dark { border-color: rgba(255,255,255,0.2); color: #F2EFE9; }

    .ed-follower {
      position: fixed; top: 0; left: 0; width: 22vw; min-width: 220px; pointer-events: none; z-index: 5;
      opacity: 0;
      /* Anchored by its left edge, not centered, and offset from the
         tracked point in setupHoverList (see the +70 there) — the magnetic
         cursor's 90px "VIEW" ring is centered on that same point, so a
         panel centered on it too would always have some chip passing
         directly under the ring regardless of internal padding. Sitting
         entirely to the ring's right avoids that no matter how the tags
         wrap. */
      transform: translate(0, -50%) scale(0.6);
      will-change: transform, opacity;
    }
    .ed-follower-inner {
      background: #1C1A17; border: 1px solid rgba(183,92,64,0.35); border-radius: 16px;
      padding: 1.1rem;
      box-shadow: 0 30px 60px rgba(0,0,0,0.25);
    }
    .ed-follower-tags { display: none; flex-wrap: wrap; gap: 0.4rem; }
    .ed-follower-tags.active { display: flex; }
    @media (max-width: 1023px), (hover: none) { .ed-follower { display: none; } }

    /* ---- marquee band ---- */
    .ed-marquee-section { min-height: 22vh; display: flex; align-items: center; overflow: hidden; }
    .ed-marquee-wrap { display: flex; white-space: nowrap; width: max-content; will-change: transform; }
    .ed-marquee-text {
      font-size: clamp(1.6rem, 4.2vw, 3.5rem); font-style: italic; color: transparent;
      -webkit-text-stroke: 1px rgba(242,239,233,0.35); padding-right: 0.5em;
    }

    /* ---- 05 archive grid ---- */
    .ed-archive-grid { display: grid; grid-template-columns: 1fr; gap: 2.5rem; }
    @media (min-width: 900px) {
      .ed-archive-grid { grid-template-columns: repeat(3, 1fr); gap: 2.5vw; align-items: start; }
      .ed-grid-col { display: flex; flex-direction: column; gap: 2.5vw; }
      .ed-grid-col-mid { margin-top: 8vh; }
      .ed-grid-col-low { margin-top: 3vh; }
    }
    .ed-client-card {
      border-radius: 22px; overflow: hidden; border: 1px solid rgba(0,0,0,0.1); background: #ffffff;
      transition: border-color 0.3s, transform 0.3s;
    }
    .ed-client-card:hover { border-color: #B75C40; transform: translateY(-4px); }
    .ed-client-mark {
      height: 8vh; min-height: 64px; display: flex; align-items: center; justify-content: center;
      font-family: 'Cormorant Garamond', Georgia, serif; font-style: italic; font-size: 2.2rem; color: #B75C40;
    }
    .ed-client-body { padding: 1.5rem 1.5rem 1.75rem; }

    /* ---- 03 capability cards (what I can deliver) ---- */
    .ed-capability-card {
      padding: 2rem; border-radius: 22px; border: 1px solid rgba(0,0,0,0.1);
      transition: border-color 0.3s, transform 0.3s;
    }
    .ed-capability-card:hover { border-color: #B75C40; transform: translateY(-4px); }

    /* ---- contact boxes ---- */
    .ed-contact-box {
      display: flex; align-items: center; justify-content: space-between; padding: 1.5rem;
      border: 1px solid rgba(0,0,0,0.12); border-radius: 18px; text-decoration: none; color: inherit;
      transition: border-color 0.3s, transform 0.3s;
    }
    .ed-contact-box:hover { border-color: #B75C40; transform: translateY(-2px); }
    .ed-contact-arrow { font-size: 1.4rem; color: #B75C40; transition: transform 0.3s; }
    .ed-contact-box:hover .ed-contact-arrow { transform: translateX(4px); }

    @media (prefers-reduced-motion: reduce) {
      .ed-client-card, .ed-contact-box, .ed-l-item, .ed-l-title, .ed-contact-arrow {
        transition-duration: 0.01ms !important;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfolioContentComponent implements AfterViewInit, OnDestroy {
  private host = inject(ElementRef<HTMLElement>);
  private triggers: ScrollTrigger[] = [];
  private mouseMoveHandler?: (e: MouseEvent) => void;
  private xTo?: (v: number) => void;
  private yTo?: (v: number) => void;

  expertiseRows: ExpertiseRow[] = [
    { index: '01', title: 'Web Engineering', caption: 'Interfaces', plain: 'Everything you actually see and click — built to feel instant, simple, and never in your way.', tags: ['Angular 20', 'TypeScript', 'Tailwind', 'Signals'] },
    { index: '02', title: 'Application Engineering', caption: 'Services', plain: 'The behind-the-scenes plumbing that moves data between servers, apps, and users — reliably, and mostly invisibly.', tags: ['Node.js', 'REST APIs', 'WebSockets', 'Databases'] },
    { index: '03', title: 'AI Orchestration', caption: 'Automation', plain: 'Getting AI models to do useful work on their own, in the right order, without a person pressing "go" each time.', tags: ['LLM Orchestration', 'AI Automation', 'Prompt Pipelines'] },
    { index: '04', title: 'Automation Systems', caption: 'Pipelines', plain: 'Backend engines that keep running on their own — checking, queuing, and scheduling work without anyone watching over it.', tags: ['Task Queues', 'OAuth', 'Scheduled Workers'] },
    { index: '05', title: 'Systems Integration', caption: 'Delivery', plain: 'Making tools and services that were never built to talk to each other — work together smoothly anyway.', tags: ['CI/CD', 'Third-Party APIs', 'Cross-Platform Delivery'] }
  ];

  capabilities: Capability[] = [
    { title: 'Websites', desc: 'Marketing sites, portfolios, and landing pages built to load fast, read clean, and convert — the kind of site that doesn\'t need explaining.' },
    { title: 'Web Applications', desc: 'Real products with real logic — dashboards, internal tools, and customer-facing apps that do more than just display information.' },
    { title: 'Automation & AI Systems', desc: 'Backend engines that run themselves — scheduling, content pipelines, and AI-powered workflows like ClipEva.' },
    { title: 'Large-Scale Platforms', desc: 'End-to-end builds for bigger ideas — architecture, APIs, and interface, shipped as one coherent system from day one.' }
  ];

  projectsList: ProjectItem[] = [
    {
      number: '01',
      tag: 'The Flagship Build',
      name: 'ClipEva',
      desc: 'A solo-built, end-to-end social video automation engine — ClipEva ingests raw footage, writes its own captions and metadata with AI, manages long-lived OAuth sessions, and publishes across Instagram Reels & YouTube Shorts on a schedule, entirely unattended. Architecture, code, and deployment: designed and shipped alone, start to finish.',
      tech: 'Python • OAuth 2.0 • AI Agents • Async Queue',
      status: 'Flagship',
      image: 'assets/clipeva.webp',
      alt: 'ClipEva automated video publishing pipeline',
      founder: 'Utkarsh Verma',
      wideImage: true
    },
    {
      number: '02',
      tag: 'Production Platform',
      name: 'Edsplorer',
      desc: 'EdTech learning platform featuring modular curriculum delivery, interactive assessments, and real-time student engagement tracking.',
      tech: 'Angular • TypeScript • REST API',
      status: 'Live',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop',
      alt: 'Edsplorer platform interface',
      preview: 'edsplorer',
      url: 'https://edsplorer.in',
      urlLabel: 'edsplorer.in'
    },
    {
      number: '03',
      tag: 'Production Platform',
      name: 'Expllingo',
      desc: 'Premium travel-planning platform with a curated destination gallery — Maldives, Dubai, Bali, and more — and a guided multi-step trip-inquiry flow covering budget, dates, and travel style for both individual and corporate travelers.',
      tech: 'Angular • Cloudinary Media • Multi-Step Booking Flow',
      status: 'Live',
      image: 'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?q=80&w=1600&auto=format&fit=crop',
      alt: 'Expllingo premium travel planning platform',
      preview: 'expllingo',
      url: 'https://expllingo.com',
      urlLabel: 'expllingo.com'
    },
    {
      number: '04',
      tag: 'Production Platform',
      name: 'Mjolniir',
      desc: 'High-performance web architecture & B2B AI Search visibility suite optimized for modern generative discovery engines and neural rankings.',
      tech: 'TypeScript • Tailwind • Schema Pack',
      status: 'Live',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600&auto=format&fit=crop',
      alt: 'Mjolniir web architecture',
      preview: 'mjolniir',
      url: 'https://mjolniir.com',
      urlLabel: 'mjolniir.com'
    },
    {
      number: '05',
      tag: 'Production Platform',
      name: 'Haryana Brothers',
      desc: 'Full-stack e-commerce ecosystem with automated multi-channel inventory synchronization, high-speed checkout flows, and payment gateway integration.',
      tech: 'Full-Stack • Node.js • Payment Gateways',
      status: 'Live',
      image: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=1600&auto=format&fit=crop',
      alt: 'Haryana Brothers e-commerce platform',
      preview: 'haryana',
      url: 'https://haryanabrothers.com',
      urlLabel: 'haryanabrothers.com'
    }
  ];

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // Defer one tick so Lenis (initialised alongside) has already measured
    // the document and ScrollTrigger's refresh() sees final layout.
    requestAnimationFrame(() => {
      this.setupReveals();
      this.setupExpand();
      this.setupHorizontalGallery();
      this.setupHoverList();
      this.setupMarquee();
      ScrollTrigger.refresh();

      // Cormorant Garamond / Manrope load via a <link> stylesheet, so they
      // swap in after this first layout pass — reflowing every section's
      // text and, with it, every pin's start/end distance. Without a second
      // refresh once the swap lands, the pins stay sized to the fallback
      // font's (shorter) layout: a pinned section's scroll budget ends up
      // wrong, which reads as the pin releasing almost immediately or a
      // scrub animation that barely plays before its section is already
      // gone.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    });
  }

  private root(): HTMLElement {
    return this.host.nativeElement;
  }

  private setupReveals(): void {
    const root = this.root();

    root.querySelectorAll<HTMLElement>('.reveal').forEach(el => {
      const tween = gsap.fromTo(
        el,
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' }
        }
      );
      if (tween.scrollTrigger) this.triggers.push(tween.scrollTrigger);
    });

    // Every word-reveal block gets its own ScrollTrigger, scoped to its own
    // words — a single shared '.hl-container' selector only ever resolves
    // the first match in the document, so a second block reusing this
    // technique (e.g. the achievement section) would have animated off the
    // first block's scroll position instead of its own.
    root.querySelectorAll<HTMLElement>('.word-reveal-block').forEach(block => {
      const words = block.querySelectorAll<HTMLElement>('.reveal-word');
      if (!words.length) return;
      const tween = gsap.fromTo(
        words,
        { opacity: 0.12, filter: 'blur(3px)' },
        {
          opacity: 1, filter: 'blur(0px)', stagger: 0.03, ease: 'none',
          scrollTrigger: { trigger: block, start: 'top 80%', end: 'bottom 55%', scrub: 0.6 }
        }
      );
      if (tween.scrollTrigger) this.triggers.push(tween.scrollTrigger);
    });
  }

  private setupHorizontalGallery(): void {
    if (window.innerWidth <= 1024) return;
    const section = this.root().querySelector<HTMLElement>('#hz-trigger');
    const track = this.root().querySelector<HTMLElement>('.horiz-track');
    if (!section || !track) return;

    const panels = track.querySelectorAll<HTMLElement>('.h-panel');
    if (panels.length <= 1) return;

    const travel = () => track.scrollWidth - window.innerWidth;

    const hTween = gsap.to(track, {
      x: () => -travel(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub: 1,
        start: 'top top',
        end: () => '+=' + track.scrollWidth,
        invalidateOnRefresh: true
      }
    });
    if (hTween.scrollTrigger) this.triggers.push(hTween.scrollTrigger);

    // A played-once tween on crossing the threshold, not `scrub`: scrub ties
    // the reveal's progress directly to scroll position, which — given the
    // panel is already sliding in horizontally at the same time — finishes
    // clipping open before the panel is even centered in view, so it reads
    // as "already revealed" rather than as a reveal. A plain duration/ease
    // tween timed to fire as the panel arrives is both what actually looks
    // like a bottom-to-top reveal and, not needing recomputation on every
    // scroll tick the way 5 concurrent scrubs do, considerably cheaper.
    this.root().querySelectorAll<HTMLElement>('.hz-img').forEach(mask => {
      const maskTween = gsap.to(mask, {
        scrollTrigger: {
          trigger: mask,
          containerAnimation: hTween,
          start: 'left 80%',
          toggleActions: 'play none none reverse'
        },
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        duration: 1.1,
        ease: 'power3.out'
      });
      if (maskTween.scrollTrigger) this.triggers.push(maskTween.scrollTrigger);
    });
  }

  private setupExpand(): void {
    if (window.innerWidth <= 1024) return;
    const section = this.root().querySelector<HTMLElement>('#projects');
    const box = this.root().querySelector<HTMLElement>('#expand-box');
    const img = this.root().querySelector<HTMLElement>('#expand-img');
    const text = this.root().querySelector<HTMLElement>('.expand-text');
    if (!section || !box) return;

    const expandTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'center center',
        end: '+=2200',
        pin: true,
        scrub: 1
      }
    });

    expandTl
      .to(box, { width: '100vw', height: '100vh', borderRadius: '0px', ease: 'power2.inOut', duration: 1 })
      .to(img, { filter: 'brightness(0.7) grayscale(0%)', duration: 1 }, '<')
      // Starts fading in while the frame is still expanding (not just at
      // the tail end) and holds at full opacity for a stretch afterward —
      // the earlier version only reached full opacity right as the pin
      // was about to release, so the title was barely readable before it
      // scrolled away.
      .to(text, { opacity: 1, duration: 0.5 }, '-=0.7')
      .to({}, { duration: 0.9 });

    if (expandTl.scrollTrigger) this.triggers.push(expandTl.scrollTrigger);
  }

  private setupHoverList(): void {
    const list = this.root().querySelector<HTMLElement>('.ed-hover-list');
    const follower = this.root().querySelector<HTMLElement>('.ed-follower');
    if (!list || !follower || window.matchMedia('(hover: none)').matches) return;

    // Clears the magnetic cursor's 90px "VIEW" ring (see cursor.component.ts),
    // which is centered on the same tracked point — without this gap the
    // panel (anchored by its left edge, not centered — see .ed-follower)
    // would open directly under the ring.
    const RING_CLEARANCE = 65;

    this.xTo = gsap.quickTo(follower, 'x', { duration: 0.5, ease: 'power3.out' });
    this.yTo = gsap.quickTo(follower, 'y', { duration: 0.5, ease: 'power3.out' });

    let active = false;

    this.mouseMoveHandler = (e: MouseEvent) => {
      if (!active) return;
      this.xTo?.(e.clientX + RING_CLEARANCE);
      this.yTo?.(e.clientY);
    };
    window.addEventListener('mousemove', this.mouseMoveHandler, { passive: true });

    const tagGroups = follower.querySelectorAll<HTMLElement>('.ed-follower-tags');

    list.querySelectorAll<HTMLElement>('.hover-trigger').forEach(item => {
      item.addEventListener('mouseenter', (e) => {
        active = true;
        const idx = item.getAttribute('data-idx');
        tagGroups.forEach(g => g.classList.toggle('active', g.getAttribute('data-idx') === idx));
        gsap.set(follower, { x: (e as MouseEvent).clientX + RING_CLEARANCE, y: (e as MouseEvent).clientY });
        gsap.to(follower, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.6)' });
      });
      item.addEventListener('mouseleave', () => {
        active = false;
        gsap.to(follower, { opacity: 0, scale: 0.6, duration: 0.35, ease: 'power2.in' });
      });
    });
  }

  private setupMarquee(): void {
    const wrap = this.root().querySelector<HTMLElement>('.ed-marquee-wrap');
    if (!wrap) return;
    const tween = gsap.to(wrap, {
      xPercent: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: wrap,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
    if (tween.scrollTrigger) this.triggers.push(tween.scrollTrigger);
  }

  ngOnDestroy(): void {
    this.triggers.forEach(t => t.kill());
    this.triggers = [];
    if (this.mouseMoveHandler) {
      window.removeEventListener('mousemove', this.mouseMoveHandler);
    }
  }
}
