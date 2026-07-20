"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { formatCurrency } from "../../lib/utils";

interface Estate {
  id: string;
  name: string;
}

interface Plot {
  id: string;
  name: string;
  estate: string;
  size: string;
  price: number;
  status: string;
  image?: string;
  images?: string[];
  videoUrls?: string[];
}

const emptyForm = {
  name: "",
  estate: "",
  size: "600sqm",
  price: "",
  status: "Available",
  videoUrls: "",
};

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80";

export default function ManagePropertiesPage() {
  const [plotsList, setPlotsList] = useState<Plot[]>([]);
  const [estatesList, setEstatesList] = useState<Estate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPlot, setEditingPlot] = useState<Plot | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEstate, setSelectedEstate] = useState("All");
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);

  const [mainImage, setMainImage] = useState<string>("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const galleryImagesInputRef = useRef<HTMLInputElement>(null);

  const fetchData = useCallback(async () => {
    try {
      const [propsRes, estatesRes] = await Promise.all([
        fetch("/api/properties"),
        fetch("/api/estates"),
      ]);
      if (!propsRes.ok) throw new Error("Failed to fetch properties");
      if (!estatesRes.ok) throw new Error("Failed to fetch estates");
      const [plots, estates] = await Promise.all([propsRes.json(), estatesRes.json()]);
      setPlotsList(plots);
      setEstatesList(estates);
      if (estates.length > 0 && !emptyForm.estate) {
        setFormData((prev) => ({ ...prev, estate: estates[0].name }));
      }
    } catch (err) {
      console.error("Could not load data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openEdit = (plot: Plot) => {
    setEditingPlot(plot);
    setFormData({
      name: plot.name,
      estate: plot.estate,
      size: plot.size,
      price: String(plot.price),
      status: plot.status,
      videoUrls: plot.videoUrls?.join("\n") || "",
    });
    setMainImage(plot.image || "");
    setGalleryImages(plot.images || []);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeForm = () => {
    setShowAddForm(false);
    setEditingPlot(null);
    setFormData({ ...emptyForm, estate: estatesList[0]?.name || "", videoUrls: "" });
    setMainImage("");
    setGalleryImages([]);
    setError(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

    const plotPayload: Plot = {
      id: editingPlot ? editingPlot.id : `plot-${Date.now()}`,
      name: formData.name,
      estate: formData.estate,
      size: formData.size,
      price: parseFloat(formData.price) || 1500000,
      status: formData.status,
      image: mainImage || "",
      images: galleryImages.length > 0 ? galleryImages : (mainImage ? [mainImage] : []),
      videoUrls: formData.videoUrls.split("\n").map((v) => v.trim()).filter(Boolean),
    };

    try {
      const res = await fetch("/api/properties", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plotPayload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save property");
      }

      if (editingPlot) {
        setPlotsList((prev) =>
          prev.map((p) => (p.id === plotPayload.id ? plotPayload : p))
        );
      } else {
        setPlotsList((prev) => [plotPayload, ...prev]);
      }
      closeForm();
    } catch (err: any) {
      setError(err.message || "Failed to save. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/properties?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setPlotsList((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete property:", err);
      alert("Failed to delete property. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredPlots = plotsList.filter((plot) => {
    const matchesSearch =
      plot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plot.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEstate = selectedEstate === "All" || plot.estate === selectedEstate;
    return matchesSearch && matchesEstate;
  });

  const availableCount = plotsList.filter((p) => p.status === "Available").length;
  const soldCount = plotsList.filter((p) => p.status === "Sold").length;
  const reservedCount = plotsList.filter((p) => p.status === "Reserved").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-border/50">
        <div>
          <h2 className="text-xl font-bold text-dark font-[family-name:var(--font-heading)]">
            Individual Plots &amp; Properties
          </h2>
          <p className="text-xs text-text-light">
            Manage individual block details, specific coordinates, prices, and reservation status.
          </p>
          {!loading && (
            <div className="flex gap-3 mt-1.5">
              <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded">{availableCount} Available</span>
              <span className="text-[10px] bg-gold/10 text-gold font-bold px-2 py-0.5 rounded">{reservedCount} Reserved</span>
              <span className="text-[10px] bg-gray-100 text-text-light font-bold px-2 py-0.5 rounded">{soldCount} Sold</span>
            </div>
          )}
        </div>
        <button
          onClick={() => (showAddForm ? closeForm() : setShowAddForm(true))}
          className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
        >
          {showAddForm ? "✕ Cancel" : "+ Register Plot"}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl border border-border/50 shadow-md space-y-4 max-w-2xl animate-scale-in"
        >
          <h3 className="text-base font-bold text-dark font-[family-name:var(--font-heading)]">
            {editingPlot ? `Edit: ${editingPlot.name}` : "Register New Plot/Block"}
          </h3>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="plot-block-name" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
                Plot/Block Name
              </label>
              <input type="text" id="plot-block-name" name="name" required value={formData.name}
                onChange={handleInputChange} placeholder="e.g. Block D, Plot 15"
                className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:border-primary outline-none" />
            </div>
            <div>
              <label htmlFor="plot-estate-select" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
                Parent Estate
              </label>
              <select id="plot-estate-select" name="estate" value={formData.estate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-xl border border-border text-xs bg-white text-text-muted font-semibold">
                {estatesList.map((e) => (
                  <option key={e.id} value={e.name}>{e.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="plot-size-select" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
                Size
              </label>
              <select id="plot-size-select" name="size" value={formData.size} onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-xl border border-border text-xs bg-white text-text-muted">
                <option value="300sqm">300sqm</option>
                <option value="450sqm">450sqm</option>
                <option value="500sqm">500sqm</option>
                <option value="600sqm">600sqm</option>
                <option value="900sqm">900sqm</option>
                <option value="1200sqm">1200sqm</option>
              </select>
            </div>
            <div>
              <label htmlFor="plot-price-input" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
                Sales Valuation (₦)
              </label>
              <input type="number" id="plot-price-input" name="price" required value={formData.price}
                onChange={handleInputChange} placeholder="e.g. 3500000"
                className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:border-primary outline-none" />
            </div>
            <div>
              <label htmlFor="plot-status-select" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
                Status
              </label>
              <select id="plot-status-select" name="status" value={formData.status} onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-xl border border-border text-xs bg-white text-text-muted">
                <option value="Available">Available</option>
                <option value="Reserved">Reserved</option>
                <option value="Sold">Sold</option>
              </select>
            </div>
          </div>

          {/* Image & Video Upload Fields */}
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
                  <p className="text-[10px] text-text-light mt-0.5">Primary thumbnail representation.</p>
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
                  <p className="text-[10px] text-text-light mt-0.5">Select photo files.</p>
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
            <label htmlFor="plot-videos" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
              YouTube Video URLs (one per line)
            </label>
            <textarea
              id="plot-videos"
              name="videoUrls"
              rows={3}
              value={formData.videoUrls}
              onChange={handleInputChange}
              placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:border-primary outline-none resize-none"
            />
            <p className="text-[10px] text-text-light mt-1">Paste YouTube links highlighting this specific property/plot walkthrough.</p>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={closeForm}
              className="flex-1 border border-border text-text-muted font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer hover:border-primary hover:text-primary">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer disabled:opacity-60">
              {submitting ? "Saving…" : editingPlot ? "Save Changes" : "Register Plot"}
            </button>
          </div>
        </form>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-border/50 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <input
          type="text"
          placeholder="Search by Plot Name or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:max-w-xs px-3 py-2 rounded-lg border border-border text-xs focus:border-primary outline-none"
        />
        <div className="w-full sm:w-auto">
          <label htmlFor="admin-estate-filter" className="sr-only">Filter by Estate</label>
          <select
            id="admin-estate-filter"
            value={selectedEstate}
            onChange={(e) => setSelectedEstate(e.target.value)}
            className="w-full sm:w-56 px-3 py-2 rounded-lg border border-border text-xs bg-white"
          >
            <option value="All">All Estates</option>
            {estatesList.map((e) => (
              <option key={e.id} value={e.name}>{e.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-8 animate-pulse space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 bg-gray-100 rounded" />
          ))}
        </div>
      )}

      {/* Properties Table */}
      {!loading && (
        <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-[10px] font-bold uppercase tracking-wider text-text-light bg-surface/30">
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-4">Plot / Block Name</th>
                  <th className="py-4 px-4">Parent Estate</th>
                  <th className="py-4 px-4">Size</th>
                  <th className="py-4 px-4">Valuation</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light text-xs font-semibold text-text-muted">
                {filteredPlots.map((plot) => (
                  <tr key={plot.id} className="hover:bg-surface/10 transition-colors">
                    <td className="py-4 px-6 text-text-light font-bold">{plot.id}</td>
                    <td className="py-4 px-4 text-dark font-bold">{plot.name}</td>
                    <td className="py-4 px-4">{plot.estate}</td>
                    <td className="py-4 px-4 text-text-light">{plot.size}</td>
                    <td className="py-4 px-4 font-bold text-dark">{formatCurrency(plot.price)}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          plot.status === "Available"
                            ? "bg-primary/10 text-primary"
                            : plot.status === "Reserved"
                            ? "bg-gold/20 text-gold"
                            : "bg-gray-100 text-text-light line-through"
                        }`}
                      >
                        {plot.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => openEdit(plot)}
                          className="text-primary hover:underline font-bold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(plot.id, plot.name)}
                          disabled={deletingId === plot.id}
                          className="text-accent hover:underline font-bold disabled:opacity-50"
                        >
                          {deletingId === plot.id ? "…" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredPlots.length === 0 && !loading && (
              <div className="py-16 text-center">
                <p className="text-sm font-bold text-dark">
                  {plotsList.length === 0 ? "No plots registered yet." : "No results match your filters."}
                </p>
                <p className="text-xs text-text-muted mt-1">
                  {plotsList.length === 0
                    ? 'Click "+ Register Plot" to add your first property record.'
                    : "Try adjusting the search or estate filter."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
