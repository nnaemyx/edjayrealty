"use client";

import { useState } from "react";
import { Estate } from "../lib/data";
import EstateCard from "../components/EstateCard";

interface EstatesListingProps {
  estates: Estate[];
}

export default function EstatesListing({ estates }: EstatesListingProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Filter logic
  const filteredEstates = estates.filter((estate) => {
    const matchesSearch =
      estate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      estate.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesState = selectedState === "All" || estate.state === selectedState;
    const matchesStatus = selectedStatus === "All" || estate.status === selectedStatus;

    return matchesSearch && matchesState && matchesStatus;
  });

  // Extract unique states & statuses for dropdown filters
  const statesList = ["All", ...Array.from(new Set(estates.map((e) => e.state)))];
  const statusList = ["All", "available", "selling-fast", "coming-soon", "sold-out"];

  return (
    <div className="min-h-screen bg-surface/40 pt-28 pb-20">
      {/* Page Header */}
      <section className="bg-dark text-white py-16 relative overflow-hidden mb-12">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/15 rounded-full blur-[100px] pointer-events-none" />
        </div>
        <div className="container mx-auto relative z-10 text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary-light mb-3">
            Investment Portfolios
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-[family-name:var(--font-heading)] mb-4">
            Our Premium Estates
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Browse our list of verified properties in prime, fast-developing locations in Anambra and Abuja. Secured futures begin here.
          </p>
        </div>
      </section>

      {/* Filter and Grid Container */}
      <div className="container mx-auto">
        {/* Search & Filter Bar */}
        <div className="bg-white p-6 rounded-2xl border border-border/50 shadow-lg shadow-gray-100/50 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:max-w-md">
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-text-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by estate name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm placeholder:text-gray-300"
            />
          </div>

          {/* Filters Select */}
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            {/* Filter by State */}
            <div className="flex-1 sm:flex-initial">
              <label htmlFor="state-filter" className="sr-only">Filter by State</label>
              <select
                id="state-filter"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full sm:w-44 px-4 py-3 rounded-xl border border-border focus:border-primary outline-none text-sm bg-white font-medium text-text-muted"
              >
                <option disabled value="">State</option>
                {statesList.map((state) => (
                  <option key={state} value={state}>
                    {state === "All" ? "All States" : state}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Status */}
            <div className="flex-1 sm:flex-initial">
              <label htmlFor="status-filter" className="sr-only">Filter by Status</label>
              <select
                id="status-filter"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full sm:w-44 px-4 py-3 rounded-xl border border-border focus:border-primary outline-none text-sm bg-white font-medium text-text-muted"
              >
                <option disabled value="">Status</option>
                {statusList.map((status) => (
                  <option key={status} value={status}>
                    {status === "All"
                      ? "All Statuses"
                      : status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Estates Grid */}
        {filteredEstates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEstates.map((estate) => (
              <EstateCard key={estate.id} estate={estate} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border/50 py-16 px-6 text-center shadow-sm">
            <svg className="w-16 h-16 mx-auto mb-4 text-text-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-xl font-bold text-dark mb-1">No Estates Found</h3>
            <p className="text-text-muted text-sm max-w-sm mx-auto">
              We couldn&apos;t find any properties matching your current search queries or filters. Try resetting them.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedState("All");
                setSelectedStatus("All");
              }}
              className="mt-6 bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
