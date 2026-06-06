"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

interface Achievement {
  label: string;
  value: string;
}

interface CeoForm {
  sectionLabel: string;
  name: string;
  role: string;
  tagline: string;
  image: string;
  bioParagraph1: string;
  bioParagraph2: string;
  achievements: Achievement[];
}

const emptyForm: CeoForm = {
  sectionLabel: "Meet The Founder",
  name: "",
  role: "Founder & CEO",
  tagline: "",
  image: "",
  bioParagraph1: "",
  bioParagraph2: "",
  achievements: [
    { label: "", value: "" },
    { label: "", value: "" },
    { label: "", value: "" },
    { label: "", value: "" },
  ],
};

export default function ManageCeoPage() {
  const [form, setForm] = useState<CeoForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/ceo");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setForm({
        sectionLabel: data.sectionLabel || "Meet The Founder",
        name: data.name || "",
        role: data.role || "Founder & CEO",
        tagline: data.tagline || "",
        image: data.image || "",
        bioParagraph1: data.bioParagraph1 || "",
        bioParagraph2: data.bioParagraph2 || "",
        achievements:
          data.achievements?.length >= 4
            ? data.achievements.slice(0, 4)
            : [
                ...(data.achievements || []),
                ...Array(Math.max(0, 4 - (data.achievements?.length || 0))).fill({ label: "", value: "" }),
              ],
      });
    } catch (err) {
      console.error("Could not load CEO profile:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSuccess(false);
  };

  const handleAchievementChange = (index: number, field: "label" | "value", value: string) => {
    setForm((prev) => {
      const achievements = [...prev.achievements];
      achievements[index] = { ...achievements[index], [field]: value };
      return { ...prev, achievements };
    });
    setSuccess(false);
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
      setForm((prev) => ({ ...prev, image: data.url }));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/ceo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          achievements: form.achievements.filter((a) => a.label || a.value),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save");
      }
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save CEO profile.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border p-8 animate-pulse max-w-3xl">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="pb-4 border-b border-border/50">
        <h2 className="text-xl font-bold text-dark font-[family-name:var(--font-heading)]">
          Meet The CEO Section
        </h2>
        <p className="text-xs text-text-light">
          Edit the CEO photo, name, bio, and achievement stats shown on the homepage.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-border/50 shadow-md space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg">{error}</div>
        )}
        {success && (
          <div className="bg-primary/10 border border-primary/20 text-primary text-xs p-3 rounded-lg font-semibold">
            CEO section saved! Changes are live on the homepage.
          </div>
        )}

        {/* CEO Image */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-2">
            CEO Photo
          </label>
          <div className="flex items-start gap-4">
            <div
              className="relative w-28 h-36 rounded-xl bg-gray-100 border-2 border-dashed border-border overflow-hidden cursor-pointer hover:border-primary transition-colors flex-shrink-0"
              onClick={() => fileInputRef.current?.click()}
            >
              {form.image ? (
                <Image src={form.image} alt="CEO preview" fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-text-light text-xs text-center px-2">
                  Click to upload
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-primary text-xs font-bold hover:underline"
              >
                {uploading ? "Uploading..." : form.image ? "Change Photo" : "Upload Photo"}
              </button>
              <p className="text-[10px] text-text-light mt-1">Portrait photo for the homepage CEO section.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sectionLabel" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
              Section Label
            </label>
            <input
              type="text"
              id="sectionLabel"
              name="sectionLabel"
              value={form.sectionLabel}
              onChange={handleChange}
              placeholder="e.g. Meet The Founder"
              className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:border-primary outline-none"
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
              Role Badge
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              placeholder="e.g. Founder & CEO"
              className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:border-primary outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="name" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
            CEO Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Full name"
            className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:border-primary outline-none"
          />
        </div>

        <div>
          <label htmlFor="tagline" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
            Tagline
          </label>
          <input
            type="text"
            id="tagline"
            name="tagline"
            value={form.tagline}
            onChange={handleChange}
            placeholder="e.g. We bank the future"
            className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:border-primary outline-none"
          />
        </div>

        <div>
          <label htmlFor="bioParagraph1" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
            Bio — Paragraph 1
          </label>
          <textarea
            id="bioParagraph1"
            name="bioParagraph1"
            rows={4}
            value={form.bioParagraph1}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:border-primary outline-none resize-none"
          />
        </div>

        <div>
          <label htmlFor="bioParagraph2" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
            Bio — Paragraph 2
          </label>
          <textarea
            id="bioParagraph2"
            name="bioParagraph2"
            rows={4}
            value={form.bioParagraph2}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:border-primary outline-none resize-none"
          />
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-text-light mb-3">
            Achievement Stats (4 boxes)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {form.achievements.map((achievement, index) => (
              <div key={index} className="flex gap-2 p-3 bg-surface rounded-xl border border-border/40">
                <input
                  type="text"
                  value={achievement.value}
                  onChange={(e) => handleAchievementChange(index, "value", e.target.value)}
                  placeholder="10+"
                  className="w-16 px-2 py-1.5 rounded-lg border border-border text-xs font-bold text-center focus:border-primary outline-none"
                />
                <input
                  type="text"
                  value={achievement.label}
                  onChange={(e) => handleAchievementChange(index, "label", e.target.value)}
                  placeholder="Label"
                  className="flex-1 px-2 py-1.5 rounded-lg border border-border text-xs focus:border-primary outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || uploading}
          className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white font-bold px-8 py-3 rounded-xl text-sm transition-all disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Save CEO Section"}
        </button>
      </form>
    </div>
  );
}
