import { FlowerType } from './FlowerSVGs';

export interface FlowerElement {
  id: string;
  type: FlowerType;
  /** initial position relative to container center, in px */
  initialPosition: { x: number; y: number };
  /** final position in the bouquet, in px from center */
  finalPosition: { x: number; y: number };
  /** rotation at start */
  initialRotation: number;
  /** rotation at rest */
  finalRotation: number;
  /** scale at start */
  initialScale: number;
  /** scale at rest */
  finalScale: number;
  /** delay before entering (0-1, fraction of timeline) */
  delay: number;
  /** duration of flight (0-1, fraction of timeline) */
  duration: number;
  /** depth: 0 = far back, 1 = front */
  depth: number;
  /** color override */
  color?: string;
  /** which wave: 0=large, 1=medium, 2=leaves, 3=small, 4=babysbreath, 5=petals */
  wave: number;
  /** curved path control point (null = straight) */
  curvePoint?: { x: number; y: number } | null;
  /** easing function name */
  ease: string;
}

const easeOptions = [
  'power3.out',
  'power4.out',
  'back.out(1.4)',
  'back.out(1.7)',
  'elastic.out(1, 0.6)',
  'sine.inOut',
  'power2.inOut',
];

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

let idCounter = 0;
function nextId() {
  return `flower-${idCounter++}`;
}

/**
 * Generates a full bouquet composition with individual flower elements.
 * Each flower gets a unique start position, end position, rotation, etc.
 */
export function generateBouquet(seed: number = 42): FlowerElement[] {
  idCounter = 0;
  // Simple seeded random
  let s = seed;
  const sr = (min: number, max: number) => {
    s = (s * 9301 + 49297) % 233280;
    const r = s / 233280;
    return min + r * (max - min);
  };
  const sp = <T>(arr: T[]): T => arr[Math.floor(sr(0, arr.length))];

  const flowers: FlowerElement[] = [];

  // Wave 0: 3 large flowers (center anchors)
  const largeTypes: FlowerType[] = ['rose', 'peony', 'ranunculus'];
  const largePositions = [
    { x: 0, y: -10 },
    { x: -45, y: 5 },
    { x: 42, y: -5 },
  ];
  largeTypes.forEach((type, i) => {
    const startSide = i % 2 === 0 ? -1 : 1;
    flowers.push({
      id: nextId(),
      type,
      initialPosition: { x: startSide * sr(300, 500), y: sr(-200, 200) },
      finalPosition: largePositions[i],
      initialRotation: sr(-180, 180),
      finalRotation: sr(-15, 15),
      initialScale: sr(0.3, 0.5),
      finalScale: sr(1.0, 1.2),
      delay: i * 0.05,
      duration: 0.15,
      depth: sr(0.7, 0.95),
      wave: 0,
      curvePoint: { x: startSide * sr(100, 200), y: sr(-100, 100) },
      ease: 'back.out(1.4)',
    });
  });

  // Wave 1: 5 medium flowers
  const mediumTypes: FlowerType[] = ['rose', 'peony', 'tulip', 'orchid', 'ranunculus'];
  const mediumPositions = [
    { x: -70, y: -25 },
    { x: 65, y: -20 },
    { x: -20, y: -45 },
    { x: 25, y: -40 },
    { x: 0, y: 15 },
  ];
  mediumTypes.forEach((type, i) => {
    const startSide = i % 2 === 0 ? 1 : -1;
    flowers.push({
      id: nextId(),
      type,
      initialPosition: { x: startSide * sr(350, 550), y: sr(-250, 250) },
      finalPosition: mediumPositions[i],
      initialRotation: sr(-200, 200),
      finalRotation: sr(-20, 20),
      initialScale: sr(0.2, 0.4),
      finalScale: sr(0.7, 0.9),
      delay: 0.15 + i * 0.04,
      duration: 0.12,
      depth: sr(0.5, 0.75),
      wave: 1,
      curvePoint: { x: startSide * sr(150, 250), y: sr(-150, 150) },
      ease: 'power3.out',
    });
  });

  // Wave 2: 4 leaves
  const leafPositions = [
    { x: -90, y: 10 },
    { x: 85, y: 15 },
    { x: -35, y: 20 },
    { x: 38, y: 25 },
  ];
  leafPositions.forEach((pos, i) => {
    const startSide = i % 2 === 0 ? -1 : 1;
    flowers.push({
      id: nextId(),
      type: 'leaf',
      initialPosition: { x: startSide * sr(300, 500), y: sr(100, 300) },
      finalPosition: pos,
      initialRotation: sr(-90, 90),
      finalRotation: sr(-60, 60),
      initialScale: sr(0.2, 0.4),
      finalScale: sr(0.6, 0.85),
      delay: 0.35 + i * 0.03,
      duration: 0.1,
      depth: sr(0.3, 0.5),
      wave: 2,
      curvePoint: { x: startSide * sr(50, 150), y: sr(50, 150) },
      ease: 'sine.inOut',
    });
  });

  // Wave 3: 4 small wildflowers
  const smallPositions = [
    { x: -55, y: -55 },
    { x: 50, y: -60 },
    { x: -10, y: -65 },
    { x: 15, y: -50 },
  ];
  smallPositions.forEach((pos, i) => {
    const startSide = i % 2 === 0 ? 1 : -1;
    flowers.push({
      id: nextId(),
      type: 'wildflower',
      initialPosition: { x: startSide * sr(400, 600), y: sr(-300, -100) },
      finalPosition: pos,
      initialRotation: sr(-180, 180),
      finalRotation: sr(-25, 25),
      initialScale: sr(0.1, 0.3),
      finalScale: sr(0.45, 0.6),
      delay: 0.45 + i * 0.03,
      duration: 0.1,
      depth: sr(0.6, 0.85),
      wave: 3,
      curvePoint: { x: startSide * sr(100, 200), y: sr(-100, 0) },
      ease: 'back.out(1.7)',
    });
  });

  // Wave 4: 3 baby's breath clusters
  const babyPositions = [
    { x: -30, y: -70 },
    { x: 35, y: -75 },
    { x: 0, y: -85 },
  ];
  babyPositions.forEach((pos, i) => {
    const startSide = i % 2 === 0 ? -1 : 1;
    flowers.push({
      id: nextId(),
      type: 'babysbreath',
      initialPosition: { x: startSide * sr(350, 550), y: sr(-350, -150) },
      finalPosition: pos,
      initialRotation: sr(-45, 45),
      finalRotation: sr(-15, 15),
      initialScale: sr(0.1, 0.25),
      finalScale: sr(0.5, 0.65),
      delay: 0.55 + i * 0.03,
      duration: 0.1,
      depth: sr(0.7, 0.9),
      wave: 4,
      curvePoint: null,
      ease: 'sine.inOut',
    });
  });

  // Wave 5: 2 lilies for height
  const lilyPositions = [
    { x: -15, y: -60 },
    { x: 18, y: -55 },
  ];
  lilyPositions.forEach((pos, i) => {
    flowers.push({
      id: nextId(),
      type: 'lily',
      initialPosition: { x: sr(-500, 500), y: sr(-400, -250) },
      finalPosition: pos,
      initialRotation: sr(-120, 120),
      finalRotation: sr(-20, 20),
      initialScale: sr(0.1, 0.3),
      finalScale: sr(0.55, 0.7),
      delay: 0.62 + i * 0.04,
      duration: 0.12,
      depth: sr(0.55, 0.7),
      wave: 5,
      curvePoint: { x: sr(-100, 100), y: sr(-200, -100) },
      ease: 'power4.out',
    });
  });

  return flowers;
}

/**
 * Generates loose petals for floating around the bouquet.
 */
export function generatePetals(count: number, seed: number = 100) {
  let s = seed;
  const sr = (min: number, max: number) => {
    s = (s * 9301 + 49297) % 233280;
    const r = s / 233280;
    return min + r * (max - min);
  };

  const colors = ['#C98291', '#E8B8C0', '#D4A574', '#C9A96E', '#EFE4D2'];

  return Array.from({ length: count }).map((_, i) => ({
    id: `petal-${i}`,
    x: sr(-50, 50),
    y: sr(-80, 80),
    initialX: sr(-400, 400),
    initialY: sr(-400, 400),
    rotation: sr(0, 360),
    rotationSpeed: sr(-3, 3),
    scale: sr(0.3, 0.8),
    depth: sr(0.2, 1),
    color: colors[Math.floor(sr(0, colors.length))],
    delay: sr(0.3, 0.9),
    floatAmp: sr(10, 30),
    floatDuration: sr(3, 7),
  }));
}

export { easeOptions, rand, pick };
