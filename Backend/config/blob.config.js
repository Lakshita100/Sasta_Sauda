import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from "dotenv";

// Ensure dotenv is loaded
dotenv.config();

export const blobServiceClient =
  BlobServiceClient.fromConnectionString(
    process.env.AZURE_BLOB_CONNECTION_STRING
  );
