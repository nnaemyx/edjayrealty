"use client";

import { useState, useEffect, useCallback } from "react";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  estate: string;
  date: string;
  status: string;
}

export default function ManageInquiriesPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch("/api/inquiries");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setLeads(data);
    } catch (err) {
      console.error("Could not load inquiries:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    const lead = leads.find((l) => l.id === id);
    if (!lead) return;
    // Optimistic UI update
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
    );
    setSavingId(id);
    try {
      const res = await fetch("/api/inquiries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update");
    } catch (err) {
      console.error("Failed to update inquiry status:", err);
      // Revert on failure
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: lead.status } : l))
      );
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/inquiries?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setLeads((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error("Failed to delete inquiry:", err);
      alert("Failed to delete inquiry. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleExport = () => {
    const headers = ["ID", "Name", "Email", "Phone", "Estate", "Date", "Status", "Message"];
    const rows = leads.map((l) => [
      l.id, l.name, l.email, l.phone, l.estate, l.date, l.status,
      `"${l.message.replace(/"/g, '""')}"`,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery);
    const matchesStatus = selectedStatus === "All" || lead.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const newCount = leads.filter((l) => l.status === "New").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-border/50">
        <div>
          <h2 className="text-xl font-bold text-dark font-[family-name:var(--font-heading)]">
            Leads &amp; Customer Inquiries
          </h2>
          <p className="text-xs text-text-light">
            Monitor incoming client messages, update statuses, and export your leads database.
            {newCount > 0 && (
              <span className="ml-2 bg-gold/20 text-gold px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                {newCount} new {newCount === 1 ? "lead" : "leads"}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={handleExport}
          className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
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
          placeholder="Search by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:max-w-xs px-3 py-2 rounded-lg border border-border text-xs focus:border-primary outline-none"
        />
        <div className="w-full sm:w-auto">
          <label htmlFor="admin-status-filter" className="sr-only">Filter by Status</label>
          <select
            id="admin-status-filter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 rounded-lg border border-border text-xs bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-border/50 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      )}

      {/* Leads Listing */}
      {!loading && (
        <div className="space-y-4">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white p-6 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              {/* Top row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border-light">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-text-light font-bold uppercase">{lead.id}</span>
                  <span className="text-text-light/50">&bull;</span>
                  <span className="text-[10px] text-text-light font-medium">{lead.date}</span>
                </div>

                {/* Status Update Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-text-light">Status:</span>
                  <select
                    aria-label="Update lead status"
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                    disabled={savingId === lead.id}
                    className={`px-3 py-1 rounded text-[10px] font-bold uppercase outline-none border cursor-pointer transition-opacity ${
                      savingId === lead.id ? "opacity-50" : ""
                    } ${
                      lead.status === "New"
                        ? "bg-gold/10 text-gold border-gold/30"
                        : lead.status === "Contacted"
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-gray-100 text-text-light border-border"
                    }`}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Closed">Closed</option>
                  </select>
                  {savingId === lead.id && (
                    <span className="text-[10px] text-text-light animate-pulse">Saving…</span>
                  )}
                </div>
              </div>

              {/* Middle Row: Content */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Contact info column */}
                <div className="md:col-span-4 space-y-1">
                  <h4 className="font-bold text-dark text-base font-[family-name:var(--font-heading)]">
                    {lead.name}
                  </h4>
                  <p className="text-xs text-text-muted">{lead.email}</p>
                  <p className="text-xs text-text-light font-semibold">{lead.phone}</p>
                  <div className="pt-2">
                    <span className="inline-block text-[10px] bg-surface text-primary font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-border/30">
                      Target: {lead.estate}
                    </span>
                  </div>
                </div>

                {/* Message content column */}
                <div className="md:col-span-8 bg-surface/30 p-4 rounded-xl border border-border-light/50">
                  <p className="text-xs leading-relaxed text-text-muted italic">
                    &ldquo;{lead.message}&rdquo;
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => handleDelete(lead.id)}
                  disabled={deletingId === lead.id}
                  className="text-xs border border-accent/20 hover:border-accent text-accent/70 hover:text-accent px-3.5 py-1.5 rounded-lg font-semibold transition-all disabled:opacity-50"
                >
                  {deletingId === lead.id ? "Deleting…" : "Delete Lead"}
                </button>
                <div className="flex gap-3">
                  <a
                    href={`mailto:${lead.email}`}
                    className="text-xs border border-border hover:border-primary hover:text-primary px-3.5 py-1.5 rounded-lg font-semibold transition-all text-text-muted"
                  >
                    Send Email
                  </a>
                  <a
                    href={`https://wa.me/${lead.phone.replace(/[^0-9]+/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-primary hover:bg-primary-dark text-white px-3.5 py-1.5 rounded-lg font-semibold transition-all"
                  >
                    Chat WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ))}

          {filteredLeads.length === 0 && !loading && (
            <div className="bg-white rounded-2xl border border-border/50 py-16 px-6 text-center shadow-sm">
              <h3 className="text-lg font-bold text-dark">No inquiries found</h3>
              <p className="text-text-muted text-xs mt-1">
                {leads.length === 0
                  ? "No inquiries submitted yet. Leads from your contact form will appear here."
                  : "Try resetting the status filter or search parameters."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
