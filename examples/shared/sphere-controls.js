import { tagSphere } from 'tag-sphere';

export function setupSphereControls({
  sphereEl,
  radiusInput,
  speedInput,
  directionInput,
  valuesEl,
  tags,
  defaults,
}) {
  if (
    !sphereEl ||
    !radiusInput ||
    !speedInput ||
    !directionInput ||
    !valuesEl
  ) {
    throw new Error('Sphere controls: missing DOM nodes.');
  }

  radiusInput.value = String(defaults.radius);
  speedInput.value = String(defaults.speed);
  directionInput.value = String(defaults.direction);

  let instance;

  function render() {
    const radius = Number(radiusInput.value);
    const speed = Number(speedInput.value);
    const direction = Number(directionInput.value);

    if (instance) instance.destroy();

    instance = tagSphere(sphereEl, {
      tags,
      radius,
      speed,
      direction,
    });

    valuesEl.textContent = `radius ${radius}px • speed ${speed.toFixed(3)} • direction ${direction}°`;
  }

  radiusInput.addEventListener('input', render);
  speedInput.addEventListener('input', render);
  directionInput.addEventListener('input', render);

  render();
}
