import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Zoneless: every piece of state in this app is a signal, so zone.js was
    // only buying us change-detection runs on events that never change
    // anything — plus it patches rAF, which puts the GSAP marquee and the
    // three.js loop under zone bookkeeping on every frame.
    provideZonelessChangeDetection(),
    provideRouter(routes)
  ]
};
