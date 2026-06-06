"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

interface Review {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
  investmentType: string;
}

const emptyForm = {
  name: "",
  role: "",
  content: "",
  rating: 5,
  investmentType: "",
};

export default function ManageReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch("/api/testimonials");
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const data = await res.json();
      const mapped = data.map((item: any) => ({
        id: item.id || item._id,
        name: item.name,
        role: item.role,
        content: item.content || item.text || "",
        rating: item.rating,
        image: item.image,
        investmentType: item.investmentType || "",
      }));
      setReviews(mapped);
    } catch (err) {
      console.error("Could not load reviews:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const openEdit = (review: Review) => {
    setEditingReview(review);
    setFormData({
      name: review.name,
      role: review.role,
      content: review.content,
      rating: review.rating,
      investmentType: review.investmentType || "",
    });
    setImagePreview(review.image || "");
    setImageFile(null);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeForm = () => {
    setShowAddForm(false);
    setEditingReview(null);
    setFormData(emptyForm);
    setImageFile(null);
    setImagePreview("");
    setError(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === "rating" ? Number(value) : value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return editingReview?.image || "";
    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append("file", imageFile);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Image upload failed");
      const data = await res.json();
      return data.url;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const imageUrl = await uploadImage();

      const reviewPayload: Review = {
        id: editingReview
          ? editingReview.id
          : `review-${Date.now()}`,
        name: formData.name,
        role: formData.role,
        content: formData.content,
        rating: formData.rating,
        image: imageUrl,
        investmentType: formData.investmentType,
      };

      const res = await fetch("/api/testimonials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewPayload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save review");
      }

      if (editingReview) {
        setReviews((prev) =>
          prev.map((r) => (r.id === reviewPayload.id ? reviewPayload : r))
        );
      } else {
        setReviews((prev) => [reviewPayload, ...prev]);
      }
      closeForm();
    } catch (err: any) {
      setError(err.message || "Failed to save. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete review from "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/testimonials?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Failed to delete review:", err);
      alert("Failed to delete. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredReviews = reviews.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? "text-amber-400" : "text-gray-200"}>
        ★
      </span>
    ));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-border/50">
        <div>
          <h2 className="text-xl font-bold text-dark font-[family-name:var(--font-heading)]">
            Client Reviews Manager
          </h2>
          <p className="text-xs text-text-light">
            Add, edit, and manage client testimonials that appear on the homepage.
            {!loading && (
              <span className="ml-2 font-bold text-primary">
                {reviews.length} reviews
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => (showAddForm ? closeForm() : setShowAddForm(true))}
          className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
        >
          {showAddForm ? "✕ Cancel" : "+ Add Review"}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl border border-border/50 shadow-md space-y-4 max-w-2xl animate-scale-in"
        >
          <h3 className="text-base font-bold text-dark font-[family-name:var(--font-heading)]">
            {editingReview ? `Edit: ${editingReview.name}` : "Add New Client Review"}
          </h3>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Profile Image Upload */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-2">
              Client Photo
            </label>
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-full bg-gray-100 border-2 border-dashed border-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-6 h-6 text-text-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                  </svg>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary text-xs font-bold hover:underline cursor-pointer"
                >
                  {imagePreview ? "Change Photo" : "Upload Photo"}
                </button>
                <p className="text-[10px] text-text-light mt-0.5">
                  JPG, PNG or WebP. Max 5MB.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="review-name" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
                Client Name
              </label>
              <input
                id="review-name"
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Emeka Nelson"
                className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:border-primary outline-none"
              />
            </div>
            <div>
              <label htmlFor="review-role" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
                Role / Designation
              </label>
              <input
                id="review-role"
                type="text"
                name="role"
                required
                value={formData.role}
                onChange={handleInputChange}
                placeholder="e.g. Investor, Business Owner"
                className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:border-primary outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="review-rating" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
                Star Rating
              </label>
              <div className="flex items-center gap-3">
                <select
                  id="review-rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  className="px-3 py-2 rounded-xl border border-border text-xs bg-white"
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>{r} Star{r !== 1 ? "s" : ""}</option>
                  ))}
                </select>
                <div className="text-lg">{renderStars(formData.rating)}</div>
              </div>
            </div>
            <div>
              <label htmlFor="review-investmentType" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
                Investment Type / Estate
              </label>
              <input
                id="review-investmentType"
                type="text"
                name="investmentType"
                value={formData.investmentType}
                onChange={handleInputChange}
                placeholder="e.g. Genesis City Estate"
                className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:border-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="review-content" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
              Review Content
            </label>
            <textarea
              id="review-content"
              name="content"
              required
              rows={4}
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Write the client's testimonial here..."
              className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:border-primary outline-none resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={closeForm}
              className="flex-1 border border-border text-text-muted font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer hover:border-primary hover:text-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer disabled:opacity-60"
            >
              {uploadingImage
                ? "Uploading image…"
                : submitting
                ? "Saving…"
                : editingReview
                ? "Save Changes"
                : "Publish Review"}
            </button>
          </div>
        </form>
      )}

      {/* Search */}
      {!loading && reviews.length > 0 && (
        <div className="relative max-w-xs">
          <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border focus:border-primary outline-none text-xs font-semibold placeholder:text-gray-300 bg-white"
          />
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-8 animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="h-2 bg-gray-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reviews Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl border border-border/50 shadow-sm p-5 hover:shadow-md transition-all group"
            >
              {/* Header: Image + Name */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-border/50 flex-shrink-0">
                  {review.image ? (
                    <Image
                      src={review.image}
                      alt={review.name}
                      width={44}
                      height={44}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-primary text-sm font-bold">
                      {review.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-dark truncate">{review.name}</p>
                  <p className="text-[10px] text-text-light truncate">{review.role}</p>
                </div>
              </div>

              {/* Stars */}
              <div className="text-sm mb-2">{renderStars(review.rating)}</div>

              {/* Quote */}
              <p className="text-xs text-text-muted leading-relaxed line-clamp-3 mb-3">
                &ldquo;{review.content}&rdquo;
              </p>

              {review.investmentType && (
                <div className="mb-4">
                  <span className="text-[10px] text-primary bg-primary/5 px-2 py-0.5 rounded font-bold uppercase">
                    {review.investmentType}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-light text-xs font-bold">
                <button
                  onClick={() => openEdit(review)}
                  className="text-primary hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(review.id, review.name)}
                  disabled={deletingId === review.id}
                  className="text-accent hover:underline disabled:opacity-50"
                >
                  {deletingId === review.id ? "…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && reviews.length === 0 && (
        <div className="bg-white rounded-2xl border border-border/50 shadow-sm py-16 text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-text-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <p className="text-sm font-bold text-dark">No reviews yet.</p>
          <p className="text-xs text-text-muted mt-1">
            Click &quot;Add Review&quot; to create your first client testimonial.
          </p>
        </div>
      )}

      {!loading && reviews.length > 0 && filteredReviews.length === 0 && (
        <div className="bg-white rounded-2xl border border-border/50 shadow-sm py-12 text-center">
          <p className="text-sm font-bold text-dark">No matching reviews found.</p>
          <p className="text-xs text-text-muted mt-1">Try adjusting your search query.</p>
        </div>
      )}
    </div>
  );
}
