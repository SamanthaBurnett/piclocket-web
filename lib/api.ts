import type { CreateUploadRequest, CreateUploadResponse, PhotoResponse } from "@/types/photo";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export async function generateDevToken(userId: string): Promise<string> {
  const response = await fetch(
    `${API_BASE_URL}/dev/token?userId=${encodeURIComponent(userId)}`
  );

  if (!response.ok) {
    throw new Error("Failed to generate dev token");
  }

  return response.text();
}

export async function createUploadRequest(
  request: CreateUploadRequest,
  token: string
): Promise<CreateUploadResponse> {
  const response = await fetch(`${API_BASE_URL}/v1/photos/upload-request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("Failed to create upload request");
  }

  return response.json();
}

export async function uploadFileToS3(
  uploadUrl: string,
  file: File
): Promise<void> {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error("Failed to upload file to S3");
  }
}

export async function getUploadedPhotos(
    token: string
) :Promise<PhotoResponse[]> {
    const response = await fetch(`${API_BASE_URL}/v1/photos`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to retrieve photos");
    }

    return response.json();
}

export async function deletePhoto(photoId: string, token: string): Promise<void> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/photos/${photoId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete photo.");
  }
}
