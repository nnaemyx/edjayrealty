"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatCurrency } from "../lib/utils";

interface DashboardStats {
  estatesCount: number;
  propertiesCount: number;
  newInquiriesCount: number;
  totalInquiriesCount: number;
  investmentVolume: number;
  propertiesSold: number;
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  estate: string;
  date: string;
  status: string;
}

interface Estate {
  id: string;
  name: string;
  availablePlots: number;
  totalPlots: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    estatesCount: 0,
    propertiesCount: 0,
    newInquiriesCount: 0,
    totalInquiriesCount: 0,
    investmentVolume: 0,
    propertiesSold: 0,
  });
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);
  const [estates, setEstates] = useState<Estate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [estatesRes, inquiriesRes, propertiesRes] = await Promise.all([
          fetch("/api/estates"),
          fetch("/api/inquiries"),
          fetch("/api/properties"),
        ]);

        const [estatesData, inquiriesData, propertiesData] = await Promise.all([
          estatesRes.ok ? estatesRes.json() : [],
          inquiriesRes.ok ? inquiriesRes.json() : [],
          propertiesRes.ok ? propertiesRes.json() : [],
        ]);

        const newLeads = inquiriesData.filter((i: Inquiry) => i.status === "New").length;
        const soldPlots = propertiesData.filter((p: any) => p.status === "Sold").length;
        const totalValue = propertiesData.reduce(
          (sum: number, p: any) => sum + (p.price || 0),
          0
        );

        setStats({
          estatesCount: estatesData.length,
          propertiesCount: propertiesData.length,
          newInquiriesCount: newLeads,
          totalInquiriesCount: inquiriesData.length,
          investmentVolume: totalValue,
          propertiesSold: soldPlots,
        });

        setEstates(estatesData.slice(0, 4));
        setRecentInquiries(inquiriesData.slice(0, 5));
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ---------------- STATS GRID ---------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Estates",
            value: loading ? "—" : stats.estatesCount,
            desc: "Active residential layouts",
            color: "text-primary bg-primary/10 border-primary/10",
            icon: (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            ),
          },
          {
            title: "Sold Plots",
            value: loading ? "—" : `${stats.propertiesSold}`,
            desc: "Completed allocations",
            color: "text-accent bg-accent/10 border-accent/10",
            icon: (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
          },
          {
            title: "New Inquiries",
            value: loading ? "—" : stats.newInquiriesCount,
            desc: `${loading ? "—" : stats.totalInquiriesCount} total leads`,
            color: "text-gold bg-gold/15 border-gold/15",
            icon: (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            ),
          },
          {
            title: "Portfolio Value",
            value: loading ? "—" : formatCurrency(stats.investmentVolume),
            desc: "Sum of all plot valuations",
            color: "text-dark bg-dark/5 border-dark/10",
            icon: (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1" />
              </svg>
            ),
          },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl border border-border/50 shadow-sm flex items-center justify-between"
          >
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-text-light mb-1">
                {card.title}
              </span>
              <span className="block text-2xl font-extrabold font-[family-name:var(--font-heading)] text-dark mb-1">
                {card.value}
              </span>
              <span className="block text-xs text-text-muted font-medium">{card.desc}</span>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* ---------------- ANALYTICS & QUICK ACTIONS ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales distribution by estate */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-border/50 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-border-light pb-4">
            <h3 className="font-bold text-base text-dark font-[family-name:var(--font-heading)]">
              Plot Availability by Estate
            </h3>
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold uppercase">
              Live data
            </span>
          </div>

          <div className="space-y-4">
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-1.5 animate-pulse">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="w-full h-3 bg-gray-100 rounded-full" />
                </div>
              ))
            ) : estates.length > 0 ? (
              estates.map((estate, i) => {
                const percentage = estate.totalPlots > 0
                  ? Math.round((estate.availablePlots / estate.totalPlots) * 100)
                  : 0;
                const colors = ["bg-primary", "bg-primary", "bg-accent", "bg-gold"];
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-text-muted">
                      <span>{estate.name}</span>
                      <span>
                        {estate.availablePlots} / {estate.totalPlots} available ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-3 bg-surface rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colors[i % colors.length]} rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-text-light text-center py-4">No estates data to display.</p>
            )}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-border/50 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-dark font-[family-name:var(--font-heading)] border-b border-border-light pb-4 mb-4">
              Quick Shortcuts
            </h3>
            <div className="space-y-2.5">
              <Link
                href="/admin/estates"
                className="flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:border-primary/20 hover:bg-surface/20 transition-all font-semibold text-xs text-text-muted"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span>Create New Estate Layout</span>
              </Link>
              <Link
                href="/admin/blog"
                className="flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:border-primary/20 hover:bg-surface/20 transition-all font-semibold text-xs text-text-muted"
              >
                <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <span>Publish New Blog Post</span>
              </Link>
              <Link
                href="/admin/inquiries"
                className="flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:border-primary/20 hover:bg-surface/20 transition-all font-semibold text-xs text-text-muted"
              >
                <div className="w-8 h-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <span>
                  View Leads
                  {!loading && stats.newInquiriesCount > 0 && (
                    <span className="ml-1 bg-gold text-white text-[9px] px-1.5 py-0.5 rounded-full font-extrabold">
                      {stats.newInquiriesCount}
                    </span>
                  )}
                </span>
              </Link>
              <Link
                href="/admin/properties"
                className="flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:border-primary/20 hover:bg-surface/20 transition-all font-semibold text-xs text-text-muted"
              >
                <div className="w-8 h-8 rounded-lg bg-dark/5 text-dark flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <span>Register Plot/Block</span>
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t border-border-light mt-6 text-center text-[10px] text-text-light font-semibold">
            Logged in as: admin@edjayrealty.com
          </div>
        </div>
      </div>

      {/* ---------------- RECENT INQUIRIES ---------------- */}
      <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-6">
        <div className="flex justify-between items-center border-b border-border-light pb-4 mb-5">
          <h3 className="font-bold text-base text-dark font-[family-name:var(--font-heading)]">
            Recent Client Inquiries
          </h3>
          <Link
            href="/admin/inquiries"
            className="text-xs text-primary font-bold hover:underline"
          >
            View All Leads
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="h-3 bg-gray-200 rounded flex-1" />
                <div className="h-3 bg-gray-100 rounded w-24" />
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-[10px] font-bold uppercase tracking-wider text-text-light">
                  <th className="py-3 pr-4">Lead Name</th>
                  <th className="py-3 px-4">Contact Detail</th>
                  <th className="py-3 px-4">Interested In</th>
                  <th className="py-3 px-4">Inquiry Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light text-xs font-semibold text-text-muted">
                {recentInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-surface/20 transition-colors">
                    <td className="py-4 pr-4 font-bold text-dark">{inq.name}</td>
                    <td className="py-4 px-4 leading-normal">
                      <p>{inq.email}</p>
                      <p className="text-text-light">{inq.phone}</p>
                    </td>
                    <td className="py-4 px-4">{inq.estate}</td>
                    <td className="py-4 px-4">{inq.date}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          inq.status === "New"
                            ? "bg-gold/20 text-gold"
                            : inq.status === "Contacted"
                            ? "bg-primary/10 text-primary"
                            : "bg-gray-100 text-text-light"
                        }`}
                      >
                        {inq.status}
                      </span>
                    </td>
                    <td className="py-4 pl-4 text-right">
                      <Link
                        href="/admin/inquiries"
                        className="text-primary hover:text-primary-dark font-bold underline"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {recentInquiries.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm font-bold text-dark">No inquiries yet.</p>
                <p className="text-xs text-text-muted mt-1">Leads from your contact form will appear here.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
