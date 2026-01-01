export function calculateTrustScore(grade, confidence) {
  const base = {
    Grade_A: 90,
    Grade_B: 70,
    Grade_C: 50
  };

  return Math.round(base[grade] * confidence);
}
