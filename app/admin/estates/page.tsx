"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

interface Estate {
  id: string;
  name: string;
  location: string;
  state: string;
  description: string;
  shortDescription: string;
  priceRange: string;
  priceFrom: number;
  image: string;
  images: string[];
  plotSizes: string[];
  features: string[];
  amenities: string[];
  totalPlots: number;
  availablePlots: number;
  status: string;
  paymentPlans: any[];
  faqs: any[];
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80";

const emptyForm = {
  name: "",
  location: "",
  state: "Anambra",
  priceRange: "",
  priceFrom: "",
  plotSizes: "300sqm, 450sqm, 600sqm",
  status: "available",
  shortDescription: "",
  totalPlots: "100",
  availablePlots: "100",
};

export default function ManageEstatesPage() {
  const [estatesList, setEstatesList] = useState<Estate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEstate, setEditingEstate] = useState<Estate | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);

  const [mainImage, setMainImage] = useState<string>("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const galleryImagesInputRef = useRef<HTMLInputElement>(null);

  const fetchEstates = useCallback(async () => {
    try {
      const res = await fetch("/api/estates");
      if (!res.ok) throw new Error("Failed to fetch estates");
      const data = await res.json();
      setEstatesList(data);
    } catch (err) {
      console.error("Could not load estates:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEstates();
  }, [fetchEstates]);

  const openEdit = (estate: Estate) => {
    setEditingEstate(estate);
    setFormData({
      name: estate.name,
      location: estate.location,
      state: estate.state,
      priceRange: estate.priceRange,
      priceFrom: String(estate.priceFrom),
      plotSizes: estate.plotSizes.join(", "),
      status: estate.status,
      shortDescription: estate.shortDescription || estate.description,
      totalPlots: String(estate.totalPlots),
      availablePlots: String(estate.availablePlots),
    });
    setMainImage(estate.image || "");
    setGalleryImages(estate.images || []);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeForm = () => {
    setShowAddForm(false);
    setEditingEstate(null);
    setFormData(emptyForm);
    setMainImage("");
    setGalleryImages([]);
    setError(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Image Upload Handlers
  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMain(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Main image upload failed");
      const data = await res.json();
      setMainImage(data.url);
    } catch (err: any) {
      alert(err.message || "Failed to upload main image");
    } finally {
      setUploadingMain(false);
    }
  };

  const handleGalleryImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingGallery(true);
    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        if (!res.ok) throw new Error(`Upload failed for file ${i + 1}`);
        const data = await res.json();
        urls.push(data.url);
      }
      setGalleryImages((prev) => [...prev, ...urls]);
    } catch (err: any) {
      alert(err.message || "Failed to upload gallery images");
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (indexToRemove: number) => {
    setGalleryImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const estatePayload: Estate = {
      id: editingEstate ? editingEstate.id : formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: formData.name,
      location: formData.location,
      state: formData.state,
      description: formData.shortDescription,
      shortDescription: formData.shortDescription,
      priceRange: formData.priceRange,
      priceFrom: parseFloat(formData.priceFrom) || 1000000,
      image: mainImage || DEFAULT_IMAGE,
      images: galleryImages.length > 0 ? galleryImages : [mainImage || DEFAULT_IMAGE],
      plotSizes: formData.plotSizes.split(",").map((s) => s.trim()),
      features: editingEstate?.features || ["Perimeter Fencing", "Gate House"],
      amenities: editingEstate?.amenities || ["Security", "Road Network"],
      totalPlots: parseInt(formData.totalPlots) || 100,
      availablePlots: parseInt(formData.availablePlots) || 100,
      status: formData.status as any,
      paymentPlans: editingEstate?.paymentPlans || [],
      faqs: editingEstate?.faqs || [],
    };

    try {
      const res = await fetch("/api/estates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(estatePayload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save estate");
      }

      if (editingEstate) {
        setEstatesList((prev) =>
          prev.map((e) => (e.id === estatePayload.id ? estatePayload : e))
        );
      } else {
        setEstatesList((prev) => [estatePayload, ...prev]);
      }
      closeForm();
    } catch (err: any) {
      setError(err.message || "Failed to save estate. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/estates?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setEstatesList((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Failed to delete estate:", err);
      alert("Failed to delete estate. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center pb-4 border-b border-border/50">
        <div>
          <h2 className="text-xl font-bold text-dark font-[family-name:var(--font-heading)]">
            Estates Directory
          </h2>
          <p className="text-xs text-text-light">
            Manage your land developments, project states, pricing, and status.
            {!loading && (
              <span className="ml-2 font-bold text-primary">
                {estatesList.length} total
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => (showAddForm ? closeForm() : setShowAddForm(true))}
          className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
        >
          {showAddForm ? "✕ Cancel" : "+ Create New Estate"}
        </button>
      </div>

      {/* Add/Edit Estate Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl border border-border/50 shadow-md space-y-4 max-w-2xl animate-scale-in"
        >
          <h3 className="text-base font-bold text-dark font-[family-name:var(--font-heading)]">
            {editingEstate ? `Edit: ${editingEstate.name}` : "New Estate Specifications"}
          </h3>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="estate-name" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
                Estate Name
              </label>
              <input type="text" id="estate-name" name="name" required value={formData.name}
                onChange={handleInputChange} placeholder="e.g. Genesis City Phase 2"
                className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:border-primary outline-none" />
            </div>
            <div>
              <label htmlFor="estate-location" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
                Location Address
              </label>
              <input type="text" id="estate-location" name="location" required value={formData.location}
                onChange={handleInputChange} placeholder="e.g. Amansea, Awka"
                className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:border-primary outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="estate-state" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
                State
              </label>
              <select id="estate-state" name="state" value={formData.state} onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-xl border border-border text-xs bg-white">
                <option value="Anambra">Anambra</option>
                <option value="FCT">FCT (Abuja)</option>
                <option value="Enugu">Enugu</option>
                <option value="Lagos">Lagos</option>
                <option value="Delta">Delta</option>
                <option value="Rivers">Rivers</option>
              </select>
            </div>
            <div>
              <label htmlFor="estate-price-range" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
                Price Range Text
              </label>
              <input type="text" id="estate-price-range" name="priceRange" required value={formData.priceRange}
                onChange={handleInputChange} placeholder="e.g. ₦1.8M – ₦6M"
                className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:border-primary outline-none" />
            </div>
            <div>
              <label htmlFor="estate-price-from" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
                Starting Price (₦)
              </label>
              <input type="number" id="estate-price-from" name="priceFrom" required value={formData.priceFrom}
                onChange={handleInputChange} placeholder="e.g. 1800000"
                className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:border-primary outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="estate-plot-sizes" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
                Plot Sizes (comma-separated)
              </label>
              <input type="text" id="estate-plot-sizes" name="plotSizes" required value={formData.plotSizes}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:border-primary outline-none" />
            </div>
            <div>
              <label htmlFor="estate-status" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
                Status Badge
              </label>
              <select id="estate-status" name="status" value={formData.status} onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-xl border border-border text-xs bg-white">
                <option value="available">Available</option>
                <option value="selling-fast">Selling Fast</option>
                <option value="coming-soon">Coming Soon</option>
                <option value="sold-out">Sold Out</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="estate-total-plots" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
                Total Plots
              </label>
              <input type="number" id="estate-total-plots" name="totalPlots" value={formData.totalPlots}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:border-primary outline-none" />
            </div>
            <div>
              <label htmlFor="estate-avail-plots" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
                Available Plots
              </label>
              <input type="number" id="estate-avail-plots" name="availablePlots" value={formData.availablePlots}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:border-primary outline-none" />
            </div>
          </div>

          {/* Image Upload Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-border-light pt-4">
            {/* Main Thumbnail Input */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-2">
                Main Thumbnail Image
              </label>
              <div className="flex items-center gap-4">
                <div
                  className="w-20 h-14 rounded-lg bg-gray-100 border-2 border-dashed border-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary transition-colors relative"
                  onClick={() => mainImageInputRef.current?.click()}
                >
                  {mainImage ? (
                    <Image
                      src={mainImage}
                      alt="Thumbnail Preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <svg className="w-5 h-5 text-text-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    </svg>
                  )}
                </div>
                <input
                  ref={mainImageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  className="hidden"
                />
                <div>
                  <button
                    type="button"
                    onClick={() => mainImageInputRef.current?.click()}
                    className="text-primary text-xs font-bold hover:underline cursor-pointer"
                  >
                    {uploadingMain ? "Uploading..." : mainImage ? "Change Image" : "Upload Image"}
                  </button>
                  <p className="text-[10px] text-text-light mt-0.5">Primary thumbnail listed on search.</p>
                </div>
              </div>
            </div>

            {/* Multiple Gallery Images Input */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-2">
                Gallery Images (Carousel)
              </label>
              <div className="flex items-center gap-4">
                <div
                  className="w-20 h-14 rounded-lg bg-gray-100 border-2 border-dashed border-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary transition-colors"
                  onClick={() => galleryImagesInputRef.current?.click()}
                >
                  <svg className="w-5 h-5 text-text-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <input
                  ref={galleryImagesInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryImagesChange}
                  className="hidden"
                />
                <div>
                  <button
                    type="button"
                    onClick={() => galleryImagesInputRef.current?.click()}
                    className="text-primary text-xs font-bold hover:underline cursor-pointer"
                  >
                    {uploadingGallery ? "Uploading..." : "Upload Gallery Images"}
                  </button>
                  <p className="text-[10px] text-text-light mt-0.5">Select one or more photo files.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery Previews Grid */}
          {galleryImages.length > 0 && (
            <div className="space-y-1.5 pt-2">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-text-light">
                Gallery Uploads ({galleryImages.length})
              </span>
              <div className="flex flex-wrap gap-3 p-3 bg-surface rounded-xl border border-border/50 max-h-48 overflow-y-auto">
                {galleryImages.map((imgUrl, index) => (
                  <div key={index} className="relative w-16 h-12 rounded-lg overflow-hidden border border-border bg-white group shadow-sm flex-shrink-0">
                    <Image
                      src={imgUrl}
                      alt={`Gallery preview ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold text-xs cursor-pointer"
                      title="Remove image"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label htmlFor="estate-desc" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
              Short Description
            </label>
            <textarea id="estate-desc" name="shortDescription" required rows={3} value={formData.shortDescription}
              onChange={handleInputChange} placeholder="Provide a brief summary of the estate project..."
              className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:border-primary outline-none resize-none" />
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={closeForm}
              className="flex-1 border border-border text-text-muted font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer hover:border-primary hover:text-primary">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer disabled:opacity-60">
              {submitting ? "Saving…" : editingEstate ? "Save Changes" : "Create Estate"}
            </button>
          </div>
        </form>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-8 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-6" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 mb-4">
              <div className="w-12 h-9 bg-gray-200 rounded-lg" />
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="h-2 bg-gray-100 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Estates Table */}
      {!loading && (
        <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-[10px] font-bold uppercase tracking-wider text-text-light bg-surface/30">
                  <th className="py-4 px-6">Layout Detail</th>
                  <th className="py-4 px-4">Location</th>
                  <th className="py-4 px-4">Pricing</th>
                  <th className="py-4 px-4">Plot Sizes</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Plots</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light text-xs font-semibold text-text-muted">
                {estatesList.map((estate) => (
                  <tr key={estate.id} className="hover:bg-surface/10 transition-colors">
                    {/* Layout detail */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-9 rounded-lg overflow-hidden border border-border/50 bg-gray-50 flex-shrink-0">
                          <Image
                            src={estate.image || DEFAULT_IMAGE}
                            alt={estate.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-dark">{estate.name}</p>
                          <p className="text-[10px] text-text-light">{estate.state} State</p>
                        </div>
                      </div>
                    </td>
                    {/* Location */}
                    <td className="py-4 px-4">{estate.location}</td>
                    {/* Pricing */}
                    <td className="py-4 px-4 font-bold text-dark">{estate.priceRange}</td>
                    {/* Plot sizes */}
                    <td className="py-4 px-4 text-text-light">{estate.plotSizes.join(", ")}</td>
                    {/* Status */}
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider ${
                          estate.status === "available"
                            ? "bg-primary/10 text-primary"
                            : estate.status === "selling-fast"
                            ? "bg-gold/20 text-gold"
                            : estate.status === "coming-soon"
                            ? "bg-accent/10 text-accent"
                            : "bg-gray-100 text-text-light"
                        }`}
                      >
                        {estate.status.replace(/-/g, " ")}
                      </span>
                    </td>
                    {/* Plots counter */}
                    <td className="py-4 px-4 text-text-light">
                      {estate.availablePlots} / {estate.totalPlots}
                    </td>
                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => openEdit(estate)}
                          className="text-primary hover:underline font-bold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(estate.id, estate.name)}
                          disabled={deletingId === estate.id}
                          className="text-accent hover:underline font-bold disabled:opacity-50"
                        >
                          {deletingId === estate.id ? "…" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {estatesList.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-sm font-bold text-dark">No estates yet.</p>
                <p className="text-xs text-text-muted mt-1">Click "Create New Estate" to add your first estate.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
