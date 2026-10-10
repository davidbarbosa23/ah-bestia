import { calculateGear, findEquivalentGears, speedAtCadence } from '../utils/fixedGear';
import type { BikeScene, RideState } from './fixedGearScene';

class FixedGearCalculator extends HTMLElement {
  private controller?: AbortController;
  private scene?: BikeScene;
  private observer?: IntersectionObserver;
  private state: RideState = { ratio: 48 / 17, patches: 17, rpm: 90 };
  private playing = false;
  private lastRatio = 0;

  connectedCallback() {
    this.controller?.abort();
    this.controller = new AbortController();
    const signal = this.controller.signal;
    const loading = this.querySelector<HTMLElement>('[data-scene-status]');
    if (loading) loading.textContent = this.dataset.loading ?? '';
    this.querySelectorAll<HTMLButtonElement | HTMLInputElement | HTMLSelectElement>('button, input, select').forEach((control) => { control.disabled = false; });
    const form = this.querySelector('[data-fg-form]');
    form?.addEventListener('input', () => this.update(), { signal });
    form?.addEventListener('change', () => this.update(true), { signal });
    form?.addEventListener('submit', (event) => event.preventDefault(), { signal });
    this.addEventListener('click', (event) => {
      if (!(event.target instanceof Element)) return;
      const target = event.target.closest<HTMLButtonElement>('button');
      if (!target) return;
      if (target.hasAttribute('data-pause')) this.setPlaying(!this.playing);
      if (target.hasAttribute('data-reset-view')) this.scene?.reset();
      if (target.hasAttribute('data-side-view')) this.scene?.reset(true);
      if (!target.dataset.equivalentRing) return;
      const ring = this.querySelector<HTMLSelectElement>('[data-chainring]');
      const cog = this.querySelector<HTMLSelectElement>('[data-sprocket]');
      if (!ring || !cog) return;
      ring.value = target.dataset.equivalentRing;
      cog.value = target.dataset.equivalentCog ?? cog.value;
      this.update(true);
      ring.focus({ preventScroll: true });
      ring.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }, { signal });
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    this.setPlaying(!reducedMotion.matches);
    reducedMotion.addEventListener('change', () => this.setPlaying(!reducedMotion.matches), { signal });
    this.update();
    // Defer Three.js until the workbench is near the viewport. Calculations never wait for it.
    this.observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      this.observer?.disconnect();
      void this.loadScene(signal);
    }, { rootMargin: '100px' });
    this.observer.observe(this.querySelector('[data-scene]')!);
    // Release GPU resources before Astro's outgoing DOM becomes a transition snapshot.
    document.addEventListener('astro:before-swap', () => this.scene?.dispose(), { signal });
  }

  disconnectedCallback() {
    this.controller?.abort();
    this.observer?.disconnect();
    this.scene?.dispose();
    this.scene = undefined;
  }

  private async loadScene(signal: AbortSignal) {
    const host = this.querySelector<HTMLElement>('[data-scene]');
    if (!host) return;
    const unavailable = () => {
      this.scene?.dispose();
      this.scene = undefined;
      const status = this.querySelector<HTMLElement>('[data-scene-status]');
      if (status) { status.hidden = false; status.textContent = this.dataset.unavailable ?? ''; }
      const actions = this.querySelector<HTMLElement>('[data-view-actions]');
      if (actions) actions.hidden = true;
      host.dataset.state = 'unavailable';
    };
    try {
      const { createBikeScene } = await import('./fixedGearScene');
      if (signal.aborted || !this.isConnected) return;
      this.scene = createBikeScene(host, unavailable);
      this.scene.update(this.state);
      this.scene.setPlaying(this.playing);
      const status = this.querySelector<HTMLElement>('[data-scene-status]');
      if (status) status.hidden = true;
      const actions = this.querySelector<HTMLElement>('[data-view-actions]');
      if (actions) actions.hidden = false;
      host.dataset.state = 'ready';
    } catch {
      if (!signal.aborted) unavailable();
    }
  }

  private setPlaying(playing: boolean) {
    this.playing = playing;
    this.scene?.setPlaying(playing);
    const button = this.querySelector<HTMLButtonElement>('[data-pause]');
    if (button) button.textContent = (playing ? this.dataset.pauseLabel : this.dataset.playLabel) ?? '';
  }

  private update(announce = false) {
    const chainring = Number(this.querySelector<HTMLSelectElement>('[data-chainring]')?.value ?? 48);
    const sprocket = Number(this.querySelector<HTMLSelectElement>('[data-sprocket]')?.value ?? 17);
    const circumferenceMm = Number(this.querySelector<HTMLSelectElement>('[data-tire]')?.value ?? 2105);
    const ambidextrous = this.querySelector<HTMLInputElement>('[data-ambidextrous]')?.checked ?? false;
    const units = this.querySelector<HTMLInputElement>('[data-units]:checked')?.value ?? 'metric';
    const rpm = Number(this.querySelector<HTMLInputElement>('[data-cadence-input]')?.value ?? 90);
    const format = (value: number, digits: number) => value.toLocaleString(this.dataset.lang, { minimumFractionDigits: digits, maximumFractionDigits: digits });
    const { ratio, patches, rolloutM } = calculateGear({ chainring, sprocket, circumferenceMm, ambidextrous });
    const put = (selector: string, value: string) => this.querySelectorAll<HTMLElement>(selector).forEach((node) => { node.textContent = value; });
    put('[data-ratio]', format(ratio, 2));
    put('[data-patches]', String(patches));
    put('[data-visual-gear]', `${chainring} × ${sprocket}`);
    const rolloutText = format(units === 'metric' ? rolloutM : rolloutM * 39.3701, units === 'metric' ? 2 : 1);
    const rolloutUnit = units === 'metric' ? 'm' : 'in';
    const speedUnit = units === 'metric' ? 'km/h' : 'mph';
    put('[data-rollout]', rolloutText);
    put('[data-rollout-unit]', rolloutUnit);
    put('[data-current-rpm]', String(rpm));
    put('[data-wheel-rpm]', format(rpm * ratio, 1));
    put('[data-current-speed]', format(speedAtCadence(rolloutM, rpm) / (units === 'metric' ? 1 : 1.609344), 1));
    put('[data-speed-unit]', speedUnit);
    this.state = { ratio, patches, rpm };
    this.scene?.update(this.state);
    // Keep equivalent buttons stable during cadence, tire and unit adjustments.
    if (this.lastRatio !== ratio) {
      this.lastRatio = ratio;
      const root = this.querySelector<HTMLElement>('[data-equivalents]');
      root?.replaceChildren(...findEquivalentGears(ratio).map(([ring, cog]) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'button button--secondary';
        button.dataset.equivalentRing = String(ring);
        button.dataset.equivalentCog = String(cog);
        button.setAttribute('aria-label', `${this.dataset.combinationLabel} ${ring} × ${cog}`);
        button.textContent = `${ring} × ${cog}`;
        return button;
      }));
    }
    this.querySelectorAll<HTMLButtonElement>('[data-equivalent-ring]').forEach((button) => {
      button.setAttribute('aria-pressed', String(Number(button.dataset.equivalentRing) === chainring && Number(button.dataset.equivalentCog) === sprocket));
    });
    this.querySelectorAll<HTMLElement>('[data-rpm]').forEach((item) => {
      const cadence = Number(item.dataset.rpm);
      const speed = item.querySelector<HTMLElement>('[data-speed]');
      if (speed) speed.textContent = `${format(speedAtCadence(rolloutM, cadence) / (units === 'metric' ? 1 : 1.609344), 1)} ${speedUnit}`;
      item.dataset.active = String(cadence === rpm);
    });
    if (announce) put('[data-live-status]', [this.dataset.liveMessage, `${this.dataset.ratioLabel}: ${format(ratio, 2)}`, `${this.dataset.patchesLabel}: ${patches}`, `${this.dataset.rolloutLabel}: ${rolloutText} ${rolloutUnit}`].join('. '));
  }
}
if (!customElements.get('fixed-gear-calculator')) customElements.define('fixed-gear-calculator', FixedGearCalculator);
