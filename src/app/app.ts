import { Component, signal, ChangeDetectionStrategy, afterNextRender, inject } from '@angular/core';
import { GlobalBackgroundComponent } from './components/global-background/global-background.component';
import { HeroComponent } from './components/hero/hero.component';
import { PortfolioContentComponent } from './components/portfolio-content/portfolio-content.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CursorComponent } from './components/cursor/cursor.component';
import { SmoothScrollService } from './services/smooth-scroll.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    GlobalBackgroundComponent,
    HeroComponent,
    PortfolioContentComponent,
    NavbarComponent,
    CursorComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  protected readonly title = signal('Utkarsh Verma — Portfolio');

  private readonly smoothScroll = inject(SmoothScrollService);

  constructor() {
    // Deferred to the first post-render tick so Lenis/ScrollTrigger measure
    // real, laid-out section heights rather than an empty initial DOM.
    afterNextRender(() => this.smoothScroll.init());
  }
}
