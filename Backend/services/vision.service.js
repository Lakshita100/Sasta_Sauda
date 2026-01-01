import axios from "axios";
import { visionEndpoint, visionKey } from "../config/vision.config.js";

export async function runVisionCheck(imageUrl) {
  const response = await axios.post(
    visionEndpoint,
    { url: imageUrl },
    {
      headers: {
        "Ocp-Apim-Subscription-Key": visionKey,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data.blur?.blurLevel === "High";
}
