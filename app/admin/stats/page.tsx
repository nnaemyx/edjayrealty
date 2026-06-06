"use client";

import { useState, useEffect, useCallback } from "react";

interface StatsForm {
  happyClients: string;
  propertiesSold: string;
  estatesManaged: string;
  investmentVolume: string;
}

const emptyStats: StatsForm = {
  happyClients: "0",
  propertiesSold: "0",
  estatesManaged: "0",
  investmentVolume: "0",
};

const statFields = [
  { key: "happyClients" as const, label: "Happy Clients", hint: "Shown with + suffix (e.g. 1200 → 1200+)" },
  { key: "propertiesSold" as const, label: "Properties Sold", hint: "Shown with + suffix" },
  { key: "estatesManaged" as const, label: "Active Estates", hint: "Number of estates managed" },
  { key: "investmentVolume" as const, label: "Investment Volume (₦)", hint: "Raw number — auto-formats to K/M/B on site" },
];

export default function ManageStatsPage() {
  const [formData, setFormData] = useState<StatsForm>(emptyStats);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      setFormData({
        happyClients: String(data.happyClients ?? 0),
        propertiesSold: String(data.propertiesSold ?? 0),
        estatesManaged: String(data.estatesManaged ?? 0),
        investmentVolume: String(data.investmentVolume ?? 0),
      });
    } catch (err) {
      console.error("Could not load stats:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/stats", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          happyClients: Number(formData.happyClients) || 0,
          propertiesSold: Number(formData.propertiesSold) || 0,
          estatesManaged: Number(formData.estatesManaged) || 0,
          investmentVolume: Number(formData.investmentVolume) || 0,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save");
      }
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save stats.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border p-8 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div className="pb-4 border-b border-border/50">
        <h2 className="text-xl font-bold text-dark font-[family-name:var(--font-heading)]">
          Hero Statistics
        </h2>
        <p className="text-xs text-text-light">
          Edit the numbers displayed in the homepage hero stats bar.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-border/50 shadow-md space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg">{error}</div>
        )}
        {success && (
          <div className="bg-primary/10 border border-primary/20 text-primary text-xs p-3 rounded-lg font-semibold">
            Stats saved! Changes are live on the homepage.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {statFields.map((field) => (
            <div key={field.key}>
              <label htmlFor={`stat-${field.key}`} className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
                {field.label}
              </label>
              <input
                type="number"
                id={`stat-${field.key}`}
                name={field.key}
                min="0"
                value={formData[field.key]}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl border border-border text-sm focus:border-primary outline-none"
              />
              <p className="text-[10px] text-text-light mt-1">{field.hint}</p>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white font-bold px-8 py-3 rounded-xl text-sm transition-all disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Save Hero Stats"}
        </button>
      </form>

      <div className="bg-surface/50 border border-border/30 rounded-xl p-4 text-xs text-text-muted">
        <p className="font-semibold text-dark mb-1">Preview labels on homepage:</p>
        <ul className="space-y-0.5">
          <li>• Happy Clients — {formData.happyClients || 0}+</li>
          <li>• Properties Sold — {formData.propertiesSold || 0}+</li>
          <li>• Active Estates — {formData.estatesManaged || 0}</li>
          <li>• Investment Vol (₦) — ₦{Number(formData.investmentVolume || 0).toLocaleString()}</li>
        </ul>
      </div>
    </div>
  );
}
