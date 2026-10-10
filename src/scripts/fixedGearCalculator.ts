import { calculateGear, findEquivalentGears, speedAtCadence } from '../utils/fixedGear';

class FixedGearCalculator extends HTMLElement {
  private controller?: AbortController;

  connectedCallback() {
    this.controller?.abort();
    this.controller = new AbortController();
    const form = this.querySelector('[data-fg-form]');
    form?.addEventListener('change', () => this.update(true), { signal: this.controller.signal });
    this.addEventListener('click', (event) => {
      const target = event.target instanceof Element
        ? event.target.closest<HTMLButtonElement>('[data-equivalent-ring]')
        : null;
      if (!target) return;
      const chainring = this.querySelector<HTMLSelectElement>('[data-chainring]');
      const sprocket = this.querySelector<HTMLSelectElement>('[data-sprocket]');
      if (!chainring || !sprocket) return;
      chainring.value = target.dataset.equivalentRing ?? chainring.value;
      sprocket.value = target.dataset.equivalentCog ?? sprocket.value;
      this.update(true);
      chainring.focus({ preventScroll: true });
    }, { signal: this.controller.signal });
    this.update();
  }

  disconnectedCallback() {
    this.controller?.abort();
  }

  private update(announce = false) {
    const chainring = Number(this.querySelector<HTMLSelectElement>('[data-chainring]')?.value ?? 48);
    const sprocket = Number(this.querySelector<HTMLSelectElement>('[data-sprocket]')?.value ?? 17);
    const circumferenceMm = Number(this.querySelector<HTMLSelectElement>('[data-tire]')?.value ?? 2105);
    const ambidextrous = this.querySelector<HTMLInputElement>('[data-ambidextrous]')?.checked ?? false;
    const units = this.querySelector<HTMLInputElement>('[data-units]:checked')?.value ?? 'metric';
    const combinationLabel = this.dataset.combinationLabel ?? '';
    const { ratio, patches, rolloutM } = calculateGear({ chainring, sprocket, circumferenceMm, ambidextrous });

    this.querySelectorAll<HTMLElement>('[data-ratio], [data-visual-ratio]')
      .forEach((node) => { node.textContent = ratio.toFixed(2); });
    const patchesNode = this.querySelector<HTMLElement>('[data-patches]');
    if (patchesNode) patchesNode.textContent = String(patches);
    const visualGear = this.querySelector<HTMLElement>('[data-visual-gear]');
    if (visualGear) visualGear.textContent = `${chainring} × ${sprocket}`;

    const rollout = this.querySelector<HTMLElement>('[data-rollout]');
    const rolloutUnit = this.querySelector<HTMLElement>('[data-rollout-unit]');
    let rolloutText = '';
    let rolloutUnitText = '';
    if (rollout && rolloutUnit) {
      rolloutText = units === 'metric'
        ? rolloutM.toFixed(2)
        : (rolloutM * 39.3701).toFixed(1);
      rolloutUnitText = units === 'metric' ? 'm' : 'in';
      rollout.textContent = rolloutText;
      rolloutUnit.textContent = rolloutUnitText;
    }

    const skidRing = this.querySelector<SVGCircleElement>('[data-skid-ring]');
    if (skidRing) {
      const dash = Math.min(2.2, 55 / patches);
      const gap = Math.max(0.5, (100 / patches) - dash);
      skidRing.style.strokeDasharray = `${dash} ${gap}`;
    }

    const equivalentRoot = this.querySelector<HTMLElement>('[data-equivalents]');
    if (equivalentRoot) {
      const combinations = findEquivalentGears(ratio);
      equivalentRoot.replaceChildren(...combinations.map(([ring, cog]) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.equivalentRing = String(ring);
        button.dataset.equivalentCog = String(cog);
        button.setAttribute('aria-label', `${combinationLabel} ${ring} × ${cog}`);
        button.textContent = `${ring} × ${cog}`;
        if (ring === chainring && cog === sprocket) button.setAttribute('aria-current', 'true');
        return button;
      }));
    }

    this.querySelectorAll<HTMLElement>('[data-rpm]').forEach((item) => {
      const rpm = Number(item.dataset.rpm ?? 0);
      const kmh = speedAtCadence(rolloutM, rpm);
      const speed = item.querySelector<HTMLElement>('[data-speed]');
      if (!speed) return;
      speed.textContent = units === 'metric'
        ? `${kmh.toFixed(1)} km/h`
        : `${(kmh / 1.609344).toFixed(1)} mph`;
    });

    if (announce) {
      const status = this.querySelector<HTMLElement>('[data-live-status]');
      if (status) {
        status.textContent = [
          this.dataset.liveMessage,
          `${this.dataset.ratioLabel}: ${ratio.toFixed(2)}`,
          `${this.dataset.patchesLabel}: ${patches}`,
          `${this.dataset.rolloutLabel}: ${rolloutText} ${rolloutUnitText}`,
        ].filter(Boolean).join('. ');
      }
    }
  }
}

if (!customElements.get('fixed-gear-calculator')) {
  customElements.define('fixed-gear-calculator', FixedGearCalculator);
}
