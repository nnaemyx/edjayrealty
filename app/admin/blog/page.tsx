"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  authorImage: string;
  date: string;
  category: string;
  readTime: string;
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80";

const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  category: "Investment",
  readTime: "5 min read",
  author: "Edjay Realty",
};

export default function ManageBlogPage() {
  const [blogList, setBlogList] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [insertingImage, setInsertingImage] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const inlineImageInputRef = useRef<HTMLInputElement>(null);

  const fetchBlogPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/blog");
      if (!res.ok) throw new Error("Failed to fetch blog posts");
      const data = await res.json();
      setBlogList(data);
    } catch (err) {
      console.error("Could not load blog posts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogPosts();
  }, [fetchBlogPosts]);

  const openEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content || "",
      category: post.category,
      readTime: post.readTime,
      author: post.author,
    });
    setThumbnailPreview(post.image || "");
    setThumbnailFile(null);
    setActiveTab("edit");
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeForm = () => {
    setShowAddForm(false);
    setEditingPost(null);
    setFormData(emptyForm);
    setThumbnailFile(null);
    setThumbnailPreview("");
    setActiveTab("edit");
    setError(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ================= Thumbnail Upload =================
  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.url;
  };

  // ================= Formatting Toolbar =================
  const insertTag = (openTag: string, closeTag: string) => {
    const textarea = contentRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    const newContent =
      formData.content.substring(0, start) +
      openTag +
      (selectedText || "text") +
      closeTag +
      formData.content.substring(end);
    setFormData((prev) => ({ ...prev, content: newContent }));
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + openTag.length + (selectedText || "text").length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const toolbarButtons = [
    { label: "B", title: "Bold", action: () => insertTag("<strong>", "</strong>") },
    { label: "I", title: "Italic", action: () => insertTag("<em>", "</em>") },
    { label: "H2", title: "Heading 2", action: () => insertTag("<h2>", "</h2>") },
    { label: "H3", title: "Heading 3", action: () => insertTag("<h3>", "</h3>") },
    { label: "UL", title: "Bullet List", action: () => insertTag("<ul>\n<li>", "</li>\n</ul>") },
    { label: "❝", title: "Blockquote", action: () => insertTag("<blockquote>", "</blockquote>") },
    { label: "¶", title: "Paragraph", action: () => insertTag("<p>", "</p>") },
  ];

  // ================= Inline Image Insert =================
  const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setInsertingImage(true);
    try {
      const url = await uploadFile(file);
      const imgTag = `<img src="${url}" alt="Article image" style="max-width:100%;border-radius:12px;margin:16px 0;" />`;
      const textarea = contentRef.current;
      if (textarea) {
        const pos = textarea.selectionStart;
        const newContent =
          formData.content.substring(0, pos) +
          "\n" + imgTag + "\n" +
          formData.content.substring(pos);
        setFormData((prev) => ({ ...prev, content: newContent }));
      }
    } catch (err) {
      alert("Failed to upload image. Please try again.");
    } finally {
      setInsertingImage(false);
      // Reset input so same file can be selected again
      if (inlineImageInputRef.current) inlineImageInputRef.current.value = "";
    }
  };

  // ================= Submit =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      let imageUrl = editingPost?.image || DEFAULT_IMAGE;
      if (thumbnailFile) {
        setUploadingThumbnail(true);
        imageUrl = await uploadFile(thumbnailFile);
        setUploadingThumbnail(false);
      }

      const postPayload: BlogPost = {
        slug: editingPost
          ? editingPost.slug
          : formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        image: imageUrl,
        author: formData.author || "Edjay Realty",
        authorImage: editingPost?.authorImage || "",
        date: editingPost?.date || new Date().toISOString().split("T")[0],
        category: formData.category,
        readTime: formData.readTime,
      };

      const res = await fetch("/api/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postPayload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save blog post");
      }

      if (editingPost) {
        setBlogList((prev) =>
          prev.map((p) => (p.slug === postPayload.slug ? postPayload : p))
        );
      } else {
        setBlogList((prev) => [postPayload, ...prev]);
      }
      closeForm();
    } catch (err: any) {
      setError(err.message || "Failed to save. Please try again.");
    } finally {
      setSubmitting(false);
      setUploadingThumbnail(false);
    }
  };

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingSlug(slug);
    try {
      const res = await fetch(`/api/blog?slug=${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setBlogList((prev) => prev.filter((p) => p.slug !== slug));
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert("Failed to delete. Please try again.");
    } finally {
      setDeletingSlug(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-border/50">
        <div>
          <h2 className="text-xl font-bold text-dark font-[family-name:var(--font-heading)]">
            Company Blog Manager
          </h2>
          <p className="text-xs text-text-light">
            Compose and edit market research, investment tips, and community guidelines.
            {!loading && (
              <span className="ml-2 font-bold text-primary">
                {blogList.length} articles
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => (showAddForm ? closeForm() : setShowAddForm(true))}
          className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
        >
          {showAddForm ? "✕ Cancel" : "+ Compose Article"}
        </button>
      </div>

      {/* Compose/Edit Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl border border-border/50 shadow-md space-y-4 animate-scale-in"
        >
          <h3 className="text-base font-bold text-dark font-[family-name:var(--font-heading)]">
            {editingPost ? `Edit: ${editingPost.title}` : "Write New Article"}
          </h3>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Thumbnail Image Upload */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-2">
              Thumbnail Image
            </label>
            <div className="flex items-start gap-4">
              <div
                className="w-32 h-20 rounded-xl bg-gray-50 border-2 border-dashed border-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary transition-colors flex-shrink-0"
                onClick={() => thumbnailInputRef.current?.click()}
              >
                {thumbnailPreview ? (
                  <Image
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    width={128}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <svg className="w-6 h-6 mx-auto text-text-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M18 8.25h.008v.008H18V8.25z" />
                    </svg>
                    <span className="text-[9px] text-text-light font-medium mt-1 block">Click to upload</span>
                  </div>
                )}
              </div>
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailSelect}
                className="hidden"
              />
              <p className="text-[10px] text-text-light leading-relaxed mt-1">
                Upload a cover image for your article card. This image will appear on the blog listing page and as the article hero.
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="blog-title-input" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
              Article Title
            </label>
            <input type="text" id="blog-title-input" name="title" required value={formData.title}
              onChange={handleInputChange} placeholder="e.g. 5 Mistakes to Avoid When Buying Land in Awka"
              className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:border-primary outline-none" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="blog-category-select" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
                Category
              </label>
              <select id="blog-category-select" name="category" value={formData.category}
                onChange={handleInputChange} className="w-full px-3 py-2 rounded-xl border border-border text-xs bg-white">
                <option value="Investment">Investment</option>
                <option value="Guide">Guide</option>
                <option value="Market Trends">Market Trends</option>
                <option value="News">News</option>
                <option value="Lifestyle">Lifestyle</option>
              </select>
            </div>
            <div>
              <label htmlFor="blog-readtime-input" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
                Read Time
              </label>
              <input type="text" id="blog-readtime-input" name="readTime" required value={formData.readTime}
                onChange={handleInputChange} placeholder="e.g. 6 min read"
                className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:border-primary outline-none" />
            </div>
            <div>
              <label htmlFor="blog-author-input" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
                Author
              </label>
              <input type="text" id="blog-author-input" name="author" value={formData.author}
                onChange={handleInputChange} placeholder="e.g. Edjay Realty"
                className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:border-primary outline-none" />
            </div>
          </div>

          <div>
            <label htmlFor="blog-excerpt-textarea" className="block text-[10px] font-bold uppercase tracking-wider text-text-light mb-1">
              Short Summary Excerpt
            </label>
            <textarea id="blog-excerpt-textarea" name="excerpt" required rows={2} value={formData.excerpt}
              onChange={handleInputChange} placeholder="Provide a click-worthy excerpt introducing the article..."
              className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:border-primary outline-none resize-none" />
          </div>

          {/* Rich Text Editor Section */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-text-light">
                Full Article Content (HTML)
              </label>
              {/* Tab Switcher */}
              <div className="flex bg-surface rounded-lg overflow-hidden border border-border/50">
                <button
                  type="button"
                  onClick={() => setActiveTab("edit")}
                  className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all ${
                    activeTab === "edit"
                      ? "bg-primary text-white"
                      : "text-text-muted hover:text-dark"
                  }`}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all ${
                    activeTab === "preview"
                      ? "bg-primary text-white"
                      : "text-text-muted hover:text-dark"
                  }`}
                >
                  Preview
                </button>
              </div>
            </div>

            {activeTab === "edit" && (
              <>
                {/* Formatting Toolbar */}
                <div className="flex flex-wrap items-center gap-1.5 p-2 bg-surface/60 border border-border/50 border-b-0 rounded-t-xl">
                  {toolbarButtons.map((btn) => (
                    <button
                      key={btn.label}
                      type="button"
                      onClick={btn.action}
                      title={btn.title}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold text-text-muted hover:bg-white hover:text-primary hover:shadow-sm transition-all border border-transparent hover:border-border/50 cursor-pointer"
                    >
                      {btn.label}
                    </button>
                  ))}
                  <div className="w-px h-5 bg-border/50 mx-1" />
                  {/* Inline Image Upload */}
                  <button
                    type="button"
                    onClick={() => inlineImageInputRef.current?.click()}
                    disabled={insertingImage}
                    title="Insert Image"
                    className="h-8 flex items-center gap-1.5 px-2.5 rounded-lg text-[10px] font-bold text-text-muted hover:bg-white hover:text-primary hover:shadow-sm transition-all border border-transparent hover:border-border/50 cursor-pointer disabled:opacity-50"
                  >
                    {insertingImage ? (
                      <span className="text-[10px]">Uploading…</span>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M18 8.25h.008v.008H18V8.25z" />
                        </svg>
                        <span>Image</span>
                      </>
                    )}
                  </button>
                  <input
                    ref={inlineImageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleInlineImageUpload}
                    className="hidden"
                  />
                </div>
                <textarea
                  ref={contentRef}
                  id="blog-content-textarea"
                  name="content"
                  rows={14}
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="<p>Write your article content here using HTML tags...</p>&#10;&#10;<h2>Section Title</h2>&#10;<p>Your paragraph content goes here.</p>"
                  className="w-full px-3 py-3 rounded-b-xl border border-border text-xs focus:border-primary outline-none resize-y font-mono leading-relaxed"
                />
              </>
            )}

            {activeTab === "preview" && (
              <div className="border border-border rounded-xl p-6 bg-white min-h-[300px]">
                {formData.content ? (
                  <div
                    className="prose prose-zinc max-w-none article-body space-y-4 text-sm text-text-muted leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formData.content }}
                  />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-xs text-text-light">
                      No content to preview yet. Switch to the Edit tab to start writing.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={closeForm}
              className="flex-1 border border-border text-text-muted font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer hover:border-primary hover:text-primary">
              Cancel
            </button>
            <button type="submit" disabled={submitting || uploadingThumbnail}
              className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer disabled:opacity-60">
              {uploadingThumbnail
                ? "Uploading image…"
                : submitting
                ? "Saving…"
                : editingPost
                ? "Save Changes"
                : "Publish Article"}
            </button>
          </div>
        </form>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-8 animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="w-12 h-9 bg-gray-200 rounded-lg flex-shrink-0" />
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-2 bg-gray-100 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Blog Grid Table */}
      {!loading && (
        <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-[10px] font-bold uppercase tracking-wider text-text-light bg-surface/30">
                  <th className="py-4 px-6">Article Info</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Publication Date</th>
                  <th className="py-4 px-4">Read Duration</th>
                  <th className="py-4 px-4">Author</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light text-xs font-semibold text-text-muted">
                {blogList.map((post) => (
                  <tr key={post.slug} className="hover:bg-surface/10 transition-colors">
                    {/* Article Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-9 rounded-lg overflow-hidden border border-border/50 bg-gray-50 flex-shrink-0">
                          <Image
                            src={post.image || DEFAULT_IMAGE}
                            alt={post.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="max-w-xs truncate">
                          <p className="font-bold text-dark truncate">{post.title}</p>
                          <p className="text-[10px] text-text-light truncate">{post.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    {/* Category */}
                    <td className="py-4 px-4">
                      <span className="bg-primary/5 text-primary px-2.5 py-0.5 rounded font-bold">
                        {post.category}
                      </span>
                    </td>
                    {/* Date */}
                    <td className="py-4 px-4">{post.date}</td>
                    {/* Read time */}
                    <td className="py-4 px-4 text-text-light">{post.readTime}</td>
                    {/* Author */}
                    <td className="py-4 px-4 text-dark">{post.author}</td>
                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => openEdit(post)}
                          className="text-primary hover:underline font-bold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post.slug, post.title)}
                          disabled={deletingSlug === post.slug}
                          className="text-accent hover:underline font-bold disabled:opacity-50"
                        >
                          {deletingSlug === post.slug ? "…" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {blogList.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-sm font-bold text-dark">No articles yet.</p>
                <p className="text-xs text-text-muted mt-1">Click &quot;Compose Article&quot; to publish your first blog post.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
