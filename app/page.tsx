"use client";

import { useState, useEffect } from "react";
import {
  completeUpload,
  createUploadRequest,
  generateDevToken,
  getUploadedPhotos,
  uploadFileToS3,
} from "@/lib/api";
import { PhotoResponse } from "@/types/photo";

const DEVELOPMENT_USER_ID = "demo-user-success";
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [photos, setPhotos] = useState<PhotoResponse[]>([]);
  const [status, setStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const loadPhotos = async () => {
    try {
      const token = await generateDevToken(DEVELOPMENT_USER_ID);
      const uploadedPhotos = await getUploadedPhotos(token);

      setPhotos(uploadedPhotos);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []
  );

  const handleUpload = async () => {
    if (!file) {
      setStatus("Please select a file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setStatus("File is too large. Max size is 5 MB.");
      return;
    }

    try {
      setIsUploading(true);
      setStatus("Generating upload URL...");

      const token = await generateDevToken(DEVELOPMENT_USER_ID);

      const uploadRequest = await createUploadRequest(
        {
          filename: file.name,
          contentType: file.type,
          fileSizeBytes: file.size,
        },
        token
      );

      setStatus("Uploading file to S3...");
      await uploadFileToS3(uploadRequest.uploadUrl, file);

      setStatus("Completing upload...");
      await completeUpload(uploadRequest.photoId, token);

      await loadPhotos();

      setStatus("Upload successful!");
      setFile(null);
    } catch (error) {
      console.error(error);
      setStatus("Upload failed. Check the console for details.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <p className="mb-2 text-sm uppercase tracking-wide text-cyan-300">
          PicLocket
        </p>

        <h1 className="mb-4 text-3xl font-bold">Upload a photo</h1>

        <p className="mb-6 text-sm text-slate-300">
          Select an image to upload.
        </p>

        <input
          type="file"
          accept="image/*"
          disabled={isUploading}
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="mb-4 block w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-200"
        />

        {file && (
          <div className="mb-4 rounded-lg bg-slate-800 p-3 text-sm text-slate-300">
            <p>Name: {file.name}</p>
            <p>Type: {file.type || "unknown"}</p>
            <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
          </div>
        )}

        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="rounded-lg bg-cyan-400 px-4 py-2 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>

        {status && <p className="mt-4 text-sm text-slate-300">{status}</p>}

        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">Uploaded Photos</h2>

          {photos.length === 0 ? (
            <p className="text-sm text-slate-400">No uploaded photos yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {photos.map((photo) => (
                <img
                  key={photo.photoId}
                  src={photo.downloadUrl}
                  alt="Uploaded photo"
                  className="rounded-lg border border-slate-800"
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}