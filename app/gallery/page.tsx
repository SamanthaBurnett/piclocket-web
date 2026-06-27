"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { generateDevToken, getUploadedPhotos } from "@/lib/api";
import { PhotoResponse } from "@/types/photo";

const DEVELOPMENT_USER_ID = "demo-user-success";

export default function GalleryPage() {
  const [photos, setPhotos] = useState<PhotoResponse[]>([]);
  const [status, setStatus] = useState("Loading photos...");
  const [isLoading, setIsLoading] = useState(true);

  const loadPhotos = async () => {
    try {
      setIsLoading(true);
      setStatus("Loading photos...");

      const token = await generateDevToken(DEVELOPMENT_USER_ID);
      const uploadedPhotos = await getUploadedPhotos(token);

      setPhotos(uploadedPhotos);
      setStatus("");
    } catch (error) {
      console.error(error);
      setStatus("Failed to load photos. Check the console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm uppercase tracking-wide text-cyan-300">
              PicLocket
            </p>

            <h1 className="text-3xl font-bold">Gallery</h1>

            <p className="mt-2 text-sm text-slate-300">
              Photos that have been uploaded and processed.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800"
          >
            Upload photo
          </Link>
        </div>

        <button
          type="button"
          onClick={loadPhotos}
          disabled={isLoading}
          className="mb-6 rounded-lg bg-cyan-400 px-4 py-2 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Refreshing..." : "Refresh gallery"}
        </button>

        {status && <p className="mb-6 text-sm text-slate-300">{status}</p>}

        {photos.length === 0 && !isLoading ? (
          <p className="text-sm text-slate-400">No uploaded photos yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {photos.map((photo) => (
              <img
                key={photo.photoId}
                src={photo.downloadUrl}
                alt="Uploaded photo"
                className="aspect-square rounded-lg border border-slate-800 object-cover"
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
