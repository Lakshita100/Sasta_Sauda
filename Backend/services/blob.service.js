import { blobServiceClient } from "../config/blob.config.js";

const containerClient = blobServiceClient.getContainerClient(
  process.env.AZURE_BLOB_CONTAINER
);

export async function uploadToBlob(buffer, fileName) {
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);
  await blockBlobClient.uploadData(buffer);
  return blockBlobClient.url;
}
