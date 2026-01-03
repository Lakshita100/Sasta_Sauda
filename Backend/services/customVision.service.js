import axios from "axios";

// ---------- GRAIN TYPE ----------
export const predictGrainType = async (imageBuffer) => {
  const url = `${process.env.GRAIN_TYPE_ENDPOINT}/customvision/v3.0/Prediction/${process.env.GRAIN_TYPE_PROJECT_ID}/classify/iterations/${process.env.GRAIN_TYPE_MODEL_NAME}/image`;

  const response = await axios.post(
    url,
    imageBuffer,
    {
      headers: {
        "Prediction-Key": process.env.GRAIN_TYPE_PREDICTION_KEY,
        "Content-Type": "application/octet-stream"
      }
    }
  );

  return response.data;
};

// ---------- WHEAT QUALITY ----------
export const predictWheatQuality = async (imageBuffer) => {
  const url = `${process.env.WHEAT_QUALITY_ENDPOINT}/customvision/v3.0/Prediction/${process.env.WHEAT_QUALITY_PROJECT_ID}/classify/iterations/${process.env.WHEAT_QUALITY_MODEL_NAME}/image`;

  const response = await axios.post(
    url,
    imageBuffer,
    {
      headers: {
        "Prediction-Key": process.env.WHEAT_QUALITY_PREDICTION_KEY,
        "Content-Type": "application/octet-stream"
      }
    }
  );

  return response.data;
};

// ---------- RICE QUALITY ----------
export const predictRiceQuality = async (imageBuffer) => {
  const url = `${process.env.RICE_QUALITY_ENDPOINT}/customvision/v3.0/Prediction/${process.env.RICE_QUALITY_PROJECT_ID}/classify/iterations/${process.env.RICE_QUALITY_MODEL_NAME}/image`;

  const response = await axios.post(
    url,
    imageBuffer,
    {
      headers: {
        "Prediction-Key": process.env.RICE_QUALITY_PREDICTION_KEY,
        "Content-Type": "application/octet-stream"
      }
    }
  );

  return response.data;
};
