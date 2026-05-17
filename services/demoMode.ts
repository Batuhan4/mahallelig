export type DemoStepListener = (stepsThisTick: number) => void;

export function startDemoStepStream(listener: DemoStepListener, intervalMs = 100, stepsPerTick = 5) {
  const id = setInterval(() => listener(stepsPerTick), intervalMs);
  return { remove: () => clearInterval(id) };
}
