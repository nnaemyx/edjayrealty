"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { getYouTubeThumbnail } from "../../lib/utils";

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: string;
  isVideo?: boolean;
  videoUrl?: string;
}

const CATEGORIES = ["Estates", "Construction", "Events"];

const emptyForm = {
  alt: "",
  category: "Estates",
  videoUrl: "",
};

export default function ManageGalleryPage() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch("/api/gallery");
      if (!res.ok) throw new Error("Failed to fetch gallery");
      const data = await res.json();
      setImages(data);
    } catch (err) {
      console.error("Could not load gallery:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const openEdit = (item: GalleryItem) => {
    setEditingImage(item);
    setFormData({ alt: item.alt, category: item.category, videoUrl: item.videoUrl || "" });
    setImageUrl(item.src);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeForm = () => {
    setShowAddForm(false);
    setEditingImage(null);
    setFormData({ ...emptyForm, videoUrl: "" });
    setImageUrl("");
    setError(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setImageUrl(data.url);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalSrc = imageUrl;
    const isVideo = !!formData.videoUrl;

    if (isVideo) {
      const ytThumb = getYouTubeThumbnail(formData.videoUrl);
      if (!ytThumb) {
        setError("Invalid YouTube Video URL. Could not parse video ID.");
        return;
      }
      finalSrc = ytThumb;
    }

    if (!finalSrc) {
      setError("Please upload an image or enter a YouTube video URL first.");
      return;
    }
    setSubmitting(true);
    setError(null);

    const payload: GalleryItem = {
      id: editingImage?.id || `gallery-${Date.now()}`,
      src: finalSrc,
      alt: formData.alt || "Edjay Realty project photo",
      category: formData.category,
      isVideo,
      videoUrl: formData.videoUrl,
    };

    try {
      const res = await fetch("/api/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save");
      }
      if (editingImage) {
        setImages((prev) => prev.map((img) => (img.id === payload.id ? payload : img)));
      } else {
        setImages((prev) => [payload, ...prev]);
      }
      closeForm();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save image.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this gallery image?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/gallery?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setImages((prev) => prev.filter((img) => img.id !== id));
    } catch {
      alert("Failed to delete image.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center pb-4 border-b border-border/50">
        <div>
          <h2 className="text-xl font-bold text-dark font-[family-name:var(--font-heading)]">
            Site Gallery
          </h2>
          <p className="text-xs text-text-light">
            Upload photos for the gallery page and homepage preview section.
            {!loading && (
              <span className="ml-2 font-bold text-primary">{images.length} images</span>
            )}
          </p>
        </div>
        <button
          onClick={() => (showAddForm ? closeForm() : setShowAddForm(true))}
          className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
        >
          {showAddForm ? "✕ Cancel" : "+ Upload Photo"}
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl border border-border/50 shadow-md space-y-4 max-w-xl animate-scale-in"
        >
          <h3 className="text-base font-bold text-dark">
            {editingImage ? "Edit Gallery Photo" : "New Gallery Photo"}
          </h3>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg">{error}</div>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-2">
              Photo
            </label>
            <div className="flex items-start gap-4">
              <div
                className="relative w-32 h-24 rounded-xl bg-gray-100 border-2 border-dashed border-border overflow-hidden cursor-pointer hover:border-primary transition-colors flex-shrink-0"
                onClick={() => fileInputRef.current?.click()}
              >
                {imageUrl ? (
                  <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-text-light text-xs">Click to upload</div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary text-xs font-bold hover:underline"
                >
                  {uploading ? "Uploading..." : imageUrl ? "Change Photo" : "Select Photo"}
                </button>
                <p className="text-[10px] text-text-light mt-1">Shown on /gallery and homepage.</p>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="gallery-youtube" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
              OR YouTube Video URL
            </label>
            <input
              type="text"
              id="gallery-youtube"
              value={formData.videoUrl}
              onChange={(e) => setFormData((p) => ({ ...p, videoUrl: e.target.value }))}
              placeholder="e.g. https://www.youtube.com/watch?v=..."
              className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:border-primary outline-none"
            />
            <p className="text-[10px] text-text-light mt-1">
              Pasting a YouTube link automatically fetches its preview thumbnail and marks it as playable.
            </p>
          </div>

          <div>
            <label htmlFor="gallery-alt" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
              Alt Text / Caption
            </label>
            <input
              type="text"
              id="gallery-alt"
              value={formData.alt}
              onChange={(e) => setFormData((p) => ({ ...p, alt: e.target.value }))}
              placeholder="e.g. Genesis City Estate aerial view"
              className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:border-primary outline-none"
            />
          </div>

          <div>
            <label htmlFor="gallery-category" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
              Category
            </label>
            <select
              id="gallery-category"
              value={formData.category}
              onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-border text-xs bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={closeForm} className="flex-1 border border-border text-text-muted font-bold py-2.5 rounded-xl text-xs">
              Cancel
            </button>
            <button type="submit" disabled={submitting || uploading} className="flex-1 bg-primary text-white font-bold py-2.5 rounded-xl text-xs disabled:opacity-60">
              {submitting ? "Saving..." : editingImage ? "Save Changes" : "Add to Gallery"}
            </button>
          </div>
        </form>
      )}

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[4/3] bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((item) => (
            <div key={item.id} className="group relative bg-white rounded-xl border border-border/50 overflow-hidden shadow-sm">
              <div className="relative aspect-[4/3]">
                <Image src={item.src} alt={item.alt} fill className="object-cover" sizes="250px" />
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-dark/70 text-white text-[9px] font-bold uppercase rounded">
                  {item.category}
                </span>
                {item.isVideo && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 bg-red-600 text-white text-[9px] font-bold uppercase rounded flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    Video
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="text-xs text-text-muted truncate">{item.alt}</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => openEdit(item)} className="text-primary text-[10px] font-bold hover:underline">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="text-accent text-[10px] font-bold hover:underline disabled:opacity-50"
                  >
                    {deletingId === item.id ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {images.length === 0 && (
            <div className="col-span-full py-16 text-center border border-dashed border-border rounded-2xl">
              <p className="text-sm font-bold text-dark">No gallery photos yet.</p>
              <p className="text-xs text-text-muted mt-1">Upload photos to show on the gallery page and homepage.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
