import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ModalType = 'story' | 'jobs' | 'expertise' | 'clients' | 'message' | null;

@Component({
  selector: 'app-detail-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      *ngIf="activeType !== null"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-md transition-opacity duration-300"
      (click)="close.emit()"
    >
      <div 
        class="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-[#121215] border border-[#27272a] rounded-xl p-6 sm:p-10 text-cream shadow-2xl transition-all transform duration-300 scale-100"
        (click)="$event.stopPropagation()"
      >
        <!-- Close Button -->
        <button 
          (click)="close.emit()"
          class="absolute top-6 right-6 p-2 text-cream/70 hover:text-gold transition-colors duration-200"
          aria-label="Close dialog"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <!-- Story View -->
        <div *ngIf="activeType === 'story'" class="space-y-6">
          <span class="text-xs uppercase tracking-[0.25em] text-gold font-hn">Biography & Philosophy</span>
          <h2 class="text-3xl sm:text-4xl font-light tracking-tight text-cream">Utkarsh Verma</h2>
          <p class="text-gold/90 text-lg font-hn italic">“Engineering the unseen. Building the felt.”</p>

          <div class="h-px bg-cream/15 my-4"></div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-cream/80 leading-relaxed font-hn">
            <div>
              <h3 class="text-cream font-medium mb-2 text-base">Background</h3>
              <p>
                Based in Lucknow, Uttar Pradesh, India, Utkarsh Verma is a software engineer building websites, web applications, and AI-orchestrated automation systems.
              </p>
            </div>
            <div>
              <h3 class="text-cream font-medium mb-2 text-base">Engineering Focus</h3>
              <p>
                Specializing in full-stack web engineering, scalable application architecture, and autonomous LLM orchestration workflows.
              </p>
            </div>
          </div>
        </div>

        <!-- Jobs / Featured Project View -->
        <div *ngIf="activeType === 'jobs'" class="space-y-6">
          <span class="text-xs uppercase tracking-[0.25em] text-gold font-hn">Featured Work & System Architecture</span>
          <h2 class="text-3xl sm:text-4xl font-light tracking-tight text-cream">ClipEva</h2>

          <p class="text-cream/70 text-sm leading-relaxed font-hn">
            An automated cross-platform social video publishing and scheduling engine built with Python, Node.js, and Meta/YouTube API integrations — designed, built, and shipped alone, start to finish.
          </p>

          <div class="h-px bg-cream/15 my-4"></div>

          <div class="space-y-4">
            <h3 class="text-base text-cream font-medium">Core Capabilities</h3>
            <ul class="space-y-2 text-sm text-cream/80 font-hn">
              <li class="flex items-start gap-3">
                <span class="w-1.5 h-1.5 rounded-full bg-gold mt-2"></span>
                <span>Long-lived Meta Graph OAuth token automated renewal and validation pipeline.</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="w-1.5 h-1.5 rounded-full bg-gold mt-2"></span>
                <span>Scheduled video publishing background worker with asynchronous task execution.</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="w-1.5 h-1.5 rounded-full bg-gold mt-2"></span>
                <span>High-reliability queue processing for multi-account publishing.</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="w-1.5 h-1.5 rounded-full bg-gold mt-2"></span>
                <span>AI-generated captions and metadata — one upload, written and tagged automatically for every platform.</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Expertise View -->
        <div *ngIf="activeType === 'expertise'" class="space-y-6">
          <span class="text-xs uppercase tracking-[0.25em] text-gold font-hn">Technical Matrix</span>
          <h2 class="text-3xl sm:text-4xl font-light tracking-tight text-cream">Primary Expertise</h2>

          <div class="h-px bg-cream/15 my-4"></div>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div *ngFor="let item of expertiseList" class="p-3 bg-[#18181c] border border-cream/10 rounded-lg text-center hover:border-gold/50 transition-colors">
              <span class="text-sm font-hn text-cream">{{ item }}</span>
            </div>
          </div>
        </div>

        <!-- Client Websites View -->
        <div *ngIf="activeType === 'clients'" class="space-y-6">
          <span class="text-xs uppercase tracking-[0.25em] text-gold font-hn">Production Platforms</span>
          <h2 class="text-3xl sm:text-4xl font-light tracking-tight text-cream">Client Websites</h2>

          <div class="h-px bg-cream/15 my-4"></div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div *ngFor="let client of clients" class="p-4 bg-[#18181c] border border-cream/10 rounded-lg flex items-center justify-between">
              <div>
                <h4 class="text-cream font-medium">{{ client.name }}</h4>
                <p class="text-xs text-cream/50 font-hn mt-1">{{ client.type }}</p>
              </div>
              <span class="text-gold text-xs uppercase tracking-wider font-hn">Production</span>
            </div>
          </div>
        </div>

        <!-- Message / Contact View -->
        <div *ngIf="activeType === 'message'" class="space-y-6">
          <span class="text-xs uppercase tracking-[0.25em] text-gold font-hn">Direct Communication</span>
          <h2 class="text-3xl sm:text-4xl font-light tracking-tight text-cream">Get In Touch</h2>

          <p class="text-cream/70 text-sm font-hn">
            Open for website builds, full-stack application development, and bespoke AI-powered automation systems.
          </p>

          <div class="h-px bg-cream/15 my-4"></div>

          <div class="space-y-4 font-hn">
            <div class="flex items-center justify-between p-4 bg-[#18181c] border border-cream/10 rounded-lg">
              <div>
                <span class="text-xs text-cream/50 uppercase">Email</span>
                <p class="text-base text-cream font-mono mt-0.5">utkarsh.vermait&#64;gmail.com</p>
              </div>
              <a
                href="mailto:utkarsh.vermait@gmail.com"
                class="px-4 py-2 bg-gold text-black font-medium text-xs rounded hover:bg-gold-light transition-colors"
              >
                Send Email
              </a>
            </div>

            <div class="flex items-center justify-between p-4 bg-[#18181c] border border-cream/10 rounded-lg">
              <div>
                <span class="text-xs text-cream/50 uppercase">GitHub Repository</span>
                <p class="text-base text-cream font-mono mt-0.5">github.com/Porcedious</p>
              </div>
              <a 
                href="https://github.com/Porcedious" 
                target="_blank"
                rel="noopener noreferrer" 
                class="px-4 py-2 border border-cream/20 text-cream font-medium text-xs rounded hover:border-gold hover:text-gold transition-colors"
              >
                Visit GitHub
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailModalComponent {
  @Input() activeType: ModalType = null;
  @Output() close = new EventEmitter<void>();

  expertiseList = [
    'Angular 20',
    'TypeScript',
    'Node.js',
    'REST APIs',
    'WebSockets',
    'Tailwind',
    'AI Automation',
    'LLM Orchestration',
    'OAuth',
    'CI/CD'
  ];

  clients = [
    { name: 'Edsplorer', type: 'Educational Tech Platform' },
    { name: 'Expllingo', type: 'Premium Travel Planning Platform' },
    { name: 'Mjolniir', type: 'High-Performance Web Architecture' },
    { name: 'Haryana Brothers', type: 'E-Commerce & Digital Presence' }
  ];
}
