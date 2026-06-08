"use client";

import { useState, useEffect, useCallback } from "react";

interface Subscriber {
  email: string;
  name?: string;
  subscribedAt: string;
  status: "active" | "unsubscribed";
}

export default function ManageNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deletingEmail, setDeletingEmail] = useState<string | null>(null);

  const fetchSubscribers = useCallback(async () => {
    try {
      const res = await fetch("/api/newsletter");
      if (!res.ok) throw new Error("Failed to fetch newsletter subscribers");
      const data = await res.json();
      setSubscribers(data);
    } catch (err) {
      console.error("Could not load subscribers:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const handleDelete = async (email: string) => {
    if (!confirm(`Are you sure you want to remove ${email} from the newsletter list?`)) return;
    setDeletingEmail(email);
    try {
      const res = await fetch(`/api/newsletter/${encodeURIComponent(email)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete subscriber");
      setSubscribers((prev) => prev.filter((sub) => sub.email !== email));
    } catch (err) {
      console.error("Failed to delete subscriber:", err);
      alert("Failed to delete subscriber. Please try again.");
    } finally {
      setDeletingEmail(null);
    }
  };

  const handleExport = () => {
    const headers = ["Email", "Name", "Subscribed At", "Status"];
    const rows = subscribers.map((sub) => [
      sub.email,
      sub.name || "",
      sub.subscribedAt.split("T")[0],
      sub.status,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredSubscribers = subscribers.filter((sub) => {
    const matchesSearch =
      sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.name && sub.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "All" || sub.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const activeCount = subscribers.filter((s) => s.status === "active").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-border/50">
        <div>
          <h2 className="text-xl font-bold text-dark font-[family-name:var(--font-heading)]">
            Newsletter Subscribers
          </h2>
          <p className="text-xs text-text-light">
            Manage your newsletter audience, monitor registrations, and export subscribers.
            {activeCount > 0 && (
              <span className="ml-2 bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                {activeCount} active
              </span>
            )}
            {subscribers.length > 0 && (
              <span className="ml-2 bg-dark/5 text-dark-muted px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                {subscribers.length} total
              </span>
            )}
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={subscribers.length === 0}
          className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-border/50 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <input
          type="text"
          placeholder="Search by email or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:max-w-xs px-3 py-2 rounded-lg border border-border text-xs focus:border-primary outline-none"
        />
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <label htmlFor="subscriber-status-filter" className="sr-only">Filter by Status</label>
          <select
            id="subscriber-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 rounded-lg border border-border text-xs bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Unsubscribed">Unsubscribed</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-border/50 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-[10px] font-bold uppercase tracking-wider text-text-light">
                  <th className="py-3 pr-4">Email Address</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Date Subscribed</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light text-xs font-semibold text-text-muted">
                {filteredSubscribers.map((sub) => (
                  <tr key={sub.email} className="hover:bg-surface/20 transition-colors">
                    <td className="py-4 pr-4 font-bold text-dark">{sub.email}</td>
                    <td className="py-4 px-4">{sub.name || <span className="text-text-light/50 italic">—</span>}</td>
                    <td className="py-4 px-4">
                      {sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : "N/A"}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          sub.status === "active"
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "bg-gray-100 text-text-light border border-border"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-4 pl-4 text-right flex items-center justify-end gap-2">
                      <a
                        href={`mailto:${sub.email}`}
                        className="text-[11px] border border-border hover:border-primary hover:text-primary px-3 py-1.5 rounded-lg font-bold transition-all text-text-muted cursor-pointer"
                      >
                        Email
                      </a>
                      <button
                        onClick={() => handleDelete(sub.email)}
                        disabled={deletingEmail === sub.email}
                        className="text-[11px] border border-accent/20 hover:border-accent text-accent/70 hover:text-accent px-3 py-1.5 rounded-lg font-bold transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {deletingEmail === sub.email ? "Removing..." : "Remove"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredSubscribers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-sm font-bold text-dark">No subscribers found</p>
                <p className="text-xs text-text-muted mt-1">
                  {subscribers.length === 0
                    ? "No one has subscribed to your newsletter yet."
                    : "Try resetting your search query or status filter."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
