const { pow, round } = Math;

export default function roundTo(num: number, places: number = 5): number {
  const precision = pow(10, places);
  return round(num * precision) / precision;
}
