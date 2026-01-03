import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const blobServiceClient =
  BlobServiceClient.fromConnectionString(
    process.env.AZURE_BLOB_CONNECTION_STRING
  );

const containerClient =
  blobServiceClient.getContainerClient(
    process.env.AZURE_BLOB_CONTAINER
  );

/**
 * Upload image buffer to Azure Blob Storage
 */
export async function uploadToAzure(file) {
  const blobName = `${crypto.randomUUID()}-${file.originalname}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(file.buffer, {
    blobHTTPHeaders: {
      blobContentType: file.mimetype,
    },
  });

  return blockBlobClient.url; // public image URL
}
