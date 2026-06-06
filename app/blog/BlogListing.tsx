"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "../lib/data";

interface BlogListingProps {
  blogPosts: BlogPost[];
}

export default function BlogListing({ blogPosts }: BlogListingProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Investment", "Guide", "Market Trends"];

  // Filter blog posts
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Pick the first post as the "Featured Post" (only if no active search/category filters)
  const isFiltering = searchQuery !== "" || selectedCategory !== "All";
  const featuredPost = !isFiltering && blogPosts.length > 0 ? blogPosts[0] : null;
  const listPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts;

  return (
    <div className="min-h-screen bg-surface/30 pt-28 pb-20">
      {/* ---------------- HEADER BANNER ---------------- */}
      <section className="bg-dark text-white py-16 relative overflow-hidden mb-12">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/15 rounded-full blur-[100px] pointer-events-none" />
        </div>
        <div className="container mx-auto relative z-10 text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary-light mb-3">
            Real Estate Insights
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-[family-name:var(--font-heading)] mb-4">
            The Edjay Realty Blog
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Stay informed with market updates, land buying guides, legal document checklists, and local investment trends.
          </p>
        </div>
      </section>

      {/* ---------------- MAIN CONTAINER ---------------- */}
      <div className="container mx-auto">
        {/* Search & Category Filter Section */}
        <div className="bg-white p-6 rounded-2xl border border-border/50 shadow-lg shadow-gray-150/10 mb-10 flex flex-col md:flex-row gap-5 items-center justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-250 ${
                  selectedCategory === cat
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "bg-surface hover:bg-gray-200 text-text-muted"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:max-w-xs">
            <svg className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-border focus:border-primary outline-none text-xs font-semibold placeholder:text-gray-300 bg-surface/50"
            />
          </div>
        </div>

        {/* ---------------- FEATURED POST ---------------- */}
        {featuredPost && (
          <section className="mb-12">
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="group bg-white rounded-2xl overflow-hidden border border-border/60 shadow-md hover:shadow-xl hover:border-primary/10 transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-0"
            >
              {/* Image Column */}
              <div className="relative aspect-[16/9] lg:aspect-auto lg:col-span-7 bg-gray-100 min-h-[300px]">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-101"
                />
                <span className="absolute top-4 left-4 bg-accent text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-md">
                  Featured Article
                </span>
              </div>

              {/* Content Column */}
              <div className="p-8 lg:p-12 lg:col-span-5 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-xs text-text-light font-semibold mb-4">
                  <span className="text-primary font-bold uppercase tracking-wider bg-primary/5 px-2.5 py-1 rounded-md">
                    {featuredPost.category}
                  </span>
                  <span>&bull;</span>
                  <span>{featuredPost.date}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold font-[family-name:var(--font-heading)] text-dark leading-tight mb-4 group-hover:text-primary transition-colors">
                  {featuredPost.title}
                </h2>

                <p className="text-text-muted text-sm sm:text-base leading-relaxed mb-6">
                  {featuredPost.excerpt}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-border-light mt-auto">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                      ER
                    </div>
                    <div>
                      <p className="text-xs font-bold text-dark">{featuredPost.author}</p>
                      <p className="text-[10px] text-text-light">Editorial Team</p>
                    </div>
                  </div>
                  <span className="text-xs text-text-light font-semibold bg-surface px-2.5 py-1 rounded-md">
                    {featuredPost.readTime}
                  </span>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* ---------------- POSTS GRID ---------------- */}
        {listPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-border/60 shadow-sm hover:shadow-md hover:border-primary/10 transition-all duration-300 flex flex-col h-full"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-103"
                  />
                  <span className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                    {post.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <span className="block text-[10px] text-text-light font-semibold mb-2.5">
                    {post.date}
                  </span>
                  <h3 className="text-lg font-bold font-[family-name:var(--font-heading)] text-dark leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-text-muted text-xs leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-border-light mt-auto">
                    <span className="text-[10px] text-text-light font-semibold">
                      By {post.author}
                    </span>
                    <span className="text-[10px] text-text-light font-semibold bg-surface px-2 py-0.5 rounded">
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border/50 py-16 px-6 text-center shadow-sm">
            <svg className="w-16 h-16 mx-auto mb-4 text-text-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <h3 className="text-xl font-bold text-dark mb-1">No Articles Found</h3>
            <p className="text-text-muted text-sm max-w-sm mx-auto">
              We couldn&apos;t find any blog posts matching your search query or category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-6 bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
            >
              Reset Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
