export function scoreCpu(cpuName: string): number {
  const l = cpuName.toLowerCase();
  if (l.includes('i9') || l.includes('ryzen 9') || l.includes('m3 max') || l.includes('m4 max')) return 95;
  if (l.includes('i7') || l.includes('ryzen 7') || l.includes('m3 pro') || l.includes('m4 pro')) return 85;
  if (l.includes('i5') || l.includes('ryzen 5') || l.includes('m3') || l.includes('m4')) return 70;
  if (l.includes('i3') || l.includes('ryzen 3')) return 50;
  return 60;
}

export function scoreGpu(gpuName: string): number {
  const l = gpuName.toLowerCase();
  if (l.match(/rtx.?(4090|3090|4080)/)) return 95;
  if (l.match(/rtx.?(4070|3080|7800)/)) return 85;
  if (l.match(/rtx.?(4060|3070|4050|3060|7700|7600)/)) return 70;
  if (l.match(/gtx|rtx.?3050|1650|1660/)) return 55;
  if (l.includes('integrated') || l.includes('uhd') || l.includes('iris') || l.includes('radeon graphics')) return 35;
  return 40;
}

export function computeProcessingScore(cpuName: string, gpuName: string): number {
  const cpu = scoreCpu(cpuName);
  const gpu = scoreGpu(gpuName);
  return Math.round(cpu * 0.6 + gpu * 0.4);
}

export function computeMemoryScore(ramGb: number | null, storageGb: number | null): number {
  const ram = ramGb ?? 0;
  const storage = storageGb ?? 0;
  const ramScore = Math.min((ram / 32) * 50, 50);
  const storageScore = Math.min((storage / 2048) * 50, 50);
  return Math.min(Math.round(ramScore + storageScore) + 20, 100);
}

export function computeDisplayScore(
  resX: number | null,
  resY: number | null,
  refreshRate: number | null,
  panelType: string | null
): number {
  let dispScore = 60;
  if (resX && resY) {
    if (resX >= 3840) dispScore += 25;
    else if (resX >= 2560) dispScore += 20;
    if (refreshRate && refreshRate >= 120) dispScore += 15;
    else if (refreshRate && refreshRate >= 60) dispScore += 5;
    if (panelType?.toLowerCase().includes('oled')) dispScore += 10;
    dispScore = Math.min(dispScore, 100);
  }
  return dispScore;
}

export function computeBatteryScore(batteryWh: number | null, batteryHours: number | null): number {
  if (batteryHours) return Math.min(100, Math.round((batteryHours / 15) * 100));
  if (batteryWh) return Math.min(100, Math.round((batteryWh / 100) * 100));
  return 50;
}

export function computeOverallScore(scores: {
  processing: number;
  memory: number;
  display: number;
  battery: number;
}): number {
  const weights = { processing: 1.5, memory: 1.2, display: 1.0, battery: 1.0 };
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  const weightedSum =
    scores.processing * weights.processing +
    scores.memory * weights.memory +
    scores.display * weights.display +
    scores.battery * weights.battery;
  return Math.round(weightedSum / totalWeight);
}

export function formatPrice(priceIdr: number | null): string {
  if (!priceIdr) return 'N/A';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(priceIdr);
}