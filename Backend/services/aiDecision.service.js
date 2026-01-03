import {
  predictGrainType,
  predictWheatQuality,
  predictRiceQuality
} from "./customVision.service.js";

export async function verifyListing(imageBuffer) {
  // 1️⃣ Predict grain type
  const grainResult = await predictGrainType(imageBuffer);
  const bestGrain = grainResult.predictions.sort(
    (a, b) => b.probability - a.probability
  )[0];

  if (bestGrain.probability < 0.7) {
    return {
      approved: false,
      reason: "Grain type confidence too low"
    };
  }

  let qualityResult;

  if (bestGrain.tagName === "wheat") {
    qualityResult = await predictWheatQuality(imageBuffer);
  } else if (bestGrain.tagName === "rice") {
    qualityResult = await predictRiceQuality(imageBuffer);
  } else {
    return {
      approved: false,
      reason: "Unsupported grain"
    };
  }

  const bestQuality = qualityResult.predictions.sort(
    (a, b) => b.probability - a.probability
  )[0];

  return {
    approved: bestQuality.probability > 0.7,
    grain: bestGrain.tagName,
    grade: bestQuality.tagName,
    confidence: Math.round(bestQuality.probability * 100),
    explanation: `${bestQuality.tagName} quality with ${Math.round(
      bestQuality.probability * 100
    )}% confidence`
  };
}
