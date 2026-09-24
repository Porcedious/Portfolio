import { Component, ElementRef, OnInit, OnDestroy, ViewChild, inject, NgZone } from '@angular/core';

@Component({
  selector: 'app-three-background',
  standalone: true,
  template: `
    <div #canvasContainer class="absolute inset-0 z-0 pointer-events-none opacity-40"></div>
  `,
  styles: [`
    :host {
      display: block;
      position: absolute;
      inset: 0;
      pointer-events: none;
    }
  `]
})
export class ThreeBackgroundComponent implements OnInit, OnDestroy {
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef<HTMLDivElement>;

  private ngZone = inject(NgZone);
  private host = inject(ElementRef);

  private renderer?: any;
  private scene?: any;
  private camera?: any;
  private chipParticleSystem?: any;
  private neuralParticleSystem?: any;
  private lineMesh?: any;
  private animationFrameId?: number;

  private mouseX = 0;
  private mouseY = 0;
  private targetMouseX = 0;
  private targetMouseY = 0;

  // 20fps throttle — particles rotate so slowly it's imperceptible at 20fps
  private readonly TARGET_FPS = 20;
  private readonly FRAME_INTERVAL = 1000 / this.TARGET_FPS; // 50ms per frame
  private lastFrameTime = 0;

  // IntersectionObserver to pause WebGL when hero is off-screen
  private visibilityObserver?: IntersectionObserver;
  private isVisible = true;

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(async () => {
      const THREE = await import('three');
      this.initThree(THREE);
      this.setupVisibilityObserver();
    });
  }

  private setupVisibilityObserver(): void {
    if (!('IntersectionObserver' in window)) return;

    this.visibilityObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          this.isVisible = entry.isIntersecting;
          if (this.isVisible) {
            // Resume the loop only if it is actually stopped.
            if (this.animationFrameId === undefined) this.animate();
          } else if (this.animationFrameId !== undefined) {
            // Fully stop the loop rather than leaving a rAF callback firing
            // ~60x/sec to do nothing — that callback keeps the main thread
            // waking up on every frame for the entire rest of the page.
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = undefined;
          }
        }
      },
      { threshold: 0.01 } // Trigger as soon as even 1% is visible
    );

    this.visibilityObserver.observe(this.host.nativeElement);
  }

  private createChipTexture(THREE: any): any {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, 64, 64);
      ctx.strokeStyle = '#c5a059';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(24, 8);  ctx.lineTo(24, 16);
      ctx.moveTo(32, 8);  ctx.lineTo(32, 16);
      ctx.moveTo(40, 8);  ctx.lineTo(40, 16);
      ctx.moveTo(24, 48); ctx.lineTo(24, 56);
      ctx.moveTo(32, 48); ctx.lineTo(32, 56);
      ctx.moveTo(40, 48); ctx.lineTo(40, 56);
      ctx.moveTo(8,  24); ctx.lineTo(16, 24);
      ctx.moveTo(8,  32); ctx.lineTo(16, 32);
      ctx.moveTo(8,  40); ctx.lineTo(16, 40);
      ctx.moveTo(48, 24); ctx.lineTo(56, 24);
      ctx.moveTo(48, 32); ctx.lineTo(56, 32);
      ctx.moveTo(48, 40); ctx.lineTo(56, 40);
      ctx.stroke();

      ctx.fillStyle = '#121215';
      ctx.strokeStyle = '#c5a059';
      ctx.lineWidth = 2.5;
      ctx.fillRect(16, 16, 32, 32);
      ctx.strokeRect(16, 16, 32, 32);

      ctx.fillStyle = '#dfb76c';
      ctx.fillRect(26, 26, 12, 12);

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(20, 20, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  private createNeuralTexture(THREE: any): any {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, 64, 64);
      ctx.strokeStyle = '#c5a059';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(32, 32, 22, 0, Math.PI * 2);
      ctx.stroke();

      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 16);
      gradient.addColorStop(0,   'rgba(243, 229, 171, 1)');
      gradient.addColorStop(0.6, 'rgba(197, 160, 89, 0.8)');
      gradient.addColorStop(1,   'rgba(197, 160, 89, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(32, 32, 16, 0, Math.PI * 2);
      ctx.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  private initThree(THREE: any): void {
    const container = this.canvasContainer.nativeElement;
    const width  = container.clientWidth  || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    this.scene  = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.z = 6;

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    // Force pixel ratio 1 — eliminates Retina 2x overdraw
    this.renderer.setPixelRatio(1);
    container.appendChild(this.renderer.domElement);

    const chipTex   = this.createChipTexture(THREE);
    const neuralTex = this.createNeuralTexture(THREE);

    const chipCount   = 120;
    const neuralCount = 150;

    // Microchip nodes
    const chipPositions = new Float32Array(chipCount * 3);
    for (let i = 0; i < chipCount; i++) {
      chipPositions[i * 3]     = (Math.random() - 0.5) * 16;
      chipPositions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      chipPositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    const chipGeo = new THREE.BufferGeometry();
    chipGeo.setAttribute('position', new THREE.BufferAttribute(chipPositions, 3));
    const chipMat = new THREE.PointsMaterial({
      size: 0.26,
      map: chipTex,
      transparent: true,
      opacity: 0.75,
      depthWrite: false
    });
    this.chipParticleSystem = new THREE.Points(chipGeo, chipMat);
    this.scene.add(this.chipParticleSystem);

    // Neural nodes
    const neuralPositions = new Float32Array(neuralCount * 3);
    for (let i = 0; i < neuralCount; i++) {
      neuralPositions[i * 3]     = (Math.random() - 0.5) * 18;
      neuralPositions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      neuralPositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    const neuralGeo = new THREE.BufferGeometry();
    neuralGeo.setAttribute('position', new THREE.BufferAttribute(neuralPositions, 3));
    const neuralMat = new THREE.PointsMaterial({
      size: 0.20,
      map: neuralTex,
      transparent: true,
      opacity: 0.65,
      depthWrite: false
    });
    this.neuralParticleSystem = new THREE.Points(neuralGeo, neuralMat);
    this.scene.add(this.neuralParticleSystem);

    // Circuit line network
    const linePositions: number[] = [];
    const maxDist = 2.4;
    for (let i = 0; i < chipCount; i++) {
      const x1 = chipPositions[i * 3];
      const y1 = chipPositions[i * 3 + 1];
      const z1 = chipPositions[i * 3 + 2];
      for (let j = i + 1; j < chipCount; j++) {
        const x2 = chipPositions[j * 3];
        const y2 = chipPositions[j * 3 + 1];
        const z2 = chipPositions[j * 3 + 2];
        const dist = Math.sqrt((x1-x2)**2 + (y1-y2)**2 + (z1-z2)**2);
        if (dist < maxDist) {
          linePositions.push(x1, y1, z1, x2, y2, z2);
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xc5a059,
      transparent: true,
      opacity: 0.14
    });
    this.lineMesh = new THREE.LineSegments(lineGeo, lineMat);
    this.scene.add(this.lineMesh);

    // Passive event listeners — never trigger Angular change detection
    window.addEventListener('mousemove',   this.onMouseMove,    { passive: true });
    window.addEventListener('resize',      this.onWindowResize, { passive: true });

    this.animate();
  }

  private onMouseMove = (event: MouseEvent): void => {
    // Nothing reads these while the hero is off-screen, and mousemove fires at
    // pointer rate — so don't do the work at all down-page.
    if (!this.isVisible) return;
    this.targetMouseX = (event.clientX / window.innerWidth  - 0.5) * 0.4;
    this.targetMouseY = (event.clientY / window.innerHeight - 0.5) * 0.4;
  };

  private animate = (now = 0): void => {
    // The IntersectionObserver stops the loop outright when the hero leaves the
    // viewport, so reaching here means we are visible and should keep going.
    this.animationFrameId = requestAnimationFrame(this.animate);

    // 20fps throttle — only render if enough time has elapsed since last frame
    const elapsed = now - this.lastFrameTime;
    if (elapsed < this.FRAME_INTERVAL) return;

    // Snap timestamp to a multiple of FRAME_INTERVAL to avoid drift
    this.lastFrameTime = now - (elapsed % this.FRAME_INTERVAL);

    // Smooth mouse lerp (runs at 20fps — still perfectly smooth for slow rotation)
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    if (this.chipParticleSystem) {
      this.chipParticleSystem.rotation.y += 0.0006;
      this.chipParticleSystem.rotation.x  = this.mouseY * 0.4;
      this.chipParticleSystem.rotation.y += this.mouseX * 0.01;
    }
    if (this.neuralParticleSystem) {
      this.neuralParticleSystem.rotation.y -= 0.0004;
      this.neuralParticleSystem.rotation.x  = -this.mouseY * 0.3;
    }
    if (this.lineMesh) {
      this.lineMesh.rotation.y += 0.0006;
      this.lineMesh.rotation.x  = this.mouseY * 0.4;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  };

  private onWindowResize = (): void => {
    if (!this.renderer || !this.camera || !this.canvasContainer) return;
    const container = this.canvasContainer.nativeElement;
    const width  = container.clientWidth  || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  ngOnDestroy(): void {
    window.removeEventListener('mousemove',   this.onMouseMove);
    window.removeEventListener('resize',      this.onWindowResize);
    if (this.visibilityObserver) {
      this.visibilityObserver.disconnect();
    }
    if (this.animationFrameId !== undefined) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
    // Free GPU buffers/textures explicitly — WebGL resources are not reachable
    // by the JS garbage collector.
    for (const obj of [this.chipParticleSystem, this.neuralParticleSystem, this.lineMesh]) {
      if (!obj) continue;
      obj.geometry?.dispose();
      obj.material?.map?.dispose();
      obj.material?.dispose();
    }
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss?.();
      this.renderer.domElement.remove();
    }
  }
}
