export const PAIR_TONES = [
  { bg: "#7da36f", ink: "#12231c" },
  { bg: "#5aa3b5", ink: "#12231c" },
  { bg: "#e8a03c", ink: "#1c1712" },
  { bg: "#c47aad", ink: "#1c1712" },
] as const;

export function pairTone(index: number): { bg: string; ink: string } {
  return PAIR_TONES[((index % PAIR_TONES.length) + PAIR_TONES.length) % PAIR_TONES.length];
}
