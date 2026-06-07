import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getBlogPosts } from "../../lib/db";
import NewsletterForm from "../../components/NewsletterForm";

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Get related posts (excluding active post)
  const allPosts = await getBlogPosts();
  const relatedPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 2);


  return (
    <div className="min-h-screen bg-surface/30 pt-20">
      {/* ---------------- ARTICLE HERO ---------------- */}
      <section className="relative h-[45vh] min-h-[350px] flex items-end pb-10 bg-dark">
        <div className="absolute inset-0 z-0">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent" />
        </div>

        <div className="container mx-auto relative z-10 text-white">
          <div className="max-w-4xl">
            {/* Back to Blog */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-white/75 hover:text-primary-light text-xs font-semibold uppercase tracking-wider mb-6 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Blog</span>
            </Link>

            {/* Category and Date */}
            <div className="flex items-center gap-3 text-xs text-white/80 font-medium mb-4">
              <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {post.category}
              </span>
              <span>&bull;</span>
              <span>{post.date}</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-[family-name:var(--font-heading)] leading-tight">
              {post.title}
            </h1>
          </div>
        </div>
      </section>

      {/* ---------------- ARTICLE CONTENT & SIDEBAR ---------------- */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Rich Text Content */}
            <article className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-10 border border-border/50 shadow-sm prose prose-zinc max-w-none">
              <div className="flex items-center justify-between pb-6 border-b border-border-light mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                    ER
                  </div>
                  <div>
                    <p className="text-sm font-bold text-dark">{post.author}</p>
                    <p className="text-[10px] text-text-light">Editorial Author</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-text-light font-semibold bg-surface px-3 py-1 rounded-md">
                    {post.readTime}
                  </span>
                </div>
              </div>

              {/* Dynamic Markup */}
              <div className="article-body space-y-6 text-text-muted leading-relaxed">
                {post.content ? (
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                ) : (
                  <p className="italic text-text-light">This blog post has no content preview available.</p>
                )}
              </div>

              {/* Share Box */}
              <div className="mt-12 pt-8 border-t border-border-light flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-text-light">
                  Share this article
                </span>
                <div className="flex gap-2">
                  {["Twitter", "Facebook", "LinkedIn"].map((platform) => (
                    <button
                      key={platform}
                      className="px-4 py-2 border border-border hover:border-primary hover:text-primary rounded-xl text-xs font-semibold transition-all text-text-muted"
                    >
                      {platform}
                    </button>
                  ))}
                </div>
              </div>
            </article>

            {/* Right Column: Sidebar (Related Posts & CTA) */}
            <aside className="lg:col-span-4 space-y-8">
              {/* Related posts */}
              {relatedPosts.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-border/50 shadow-sm">
                  <h3 className="text-lg font-bold font-[family-name:var(--font-heading)] text-dark mb-5 pb-3 border-b border-border-light">
                    Related Articles
                  </h3>
                  <div className="space-y-5">
                    {relatedPosts.map((rPost) => (
                      <Link
                        key={rPost.slug}
                        href={`/blog/${rPost.slug}`}
                        className="group block"
                      >
                        <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden mb-2.5 border border-border-light bg-gray-50">
                          <Image
                            src={rPost.image}
                            alt={rPost.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 30vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-103"
                          />
                        </div>
                        <span className="text-[10px] text-primary font-bold uppercase tracking-wider">
                          {rPost.category}
                        </span>
                        <h4 className="text-sm font-bold text-dark group-hover:text-primary transition-colors leading-snug mt-1">
                          {rPost.title}
                        </h4>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Premium Investment CTA Banner */}
              <div className="bg-dark text-white rounded-2xl p-6 sm:p-8 border border-white/5 shadow-xl relative overflow-hidden text-center">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none" />
                <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-3">
                  Ready to invest?
                </h3>
                <p className="text-xs text-gray-300 mb-6 leading-relaxed">
                  Browse our portfolio of high appreciation estates and lock in your plot today.
                </p>
                <Link
                  href="/estates"
                  className="w-full bg-primary hover:bg-primary-light text-white text-center py-3 rounded-xl font-bold block transition-all shadow-md"
                >
                  Explore Estates
                </Link>
              </div>

              {/* Newsletter CTA Widget */}
              <div className="bg-gradient-to-br from-surface to-surface-alt border border-border/50 rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-bold font-[family-name:var(--font-heading)] text-dark mb-2">
                  Stay in the Loop
                </h3>
                <p className="text-xs text-text-muted mb-4 leading-relaxed">
                  Subscribe to our newsletter to receive the latest real estate updates and investment opportunities.
                </p>
                <NewsletterForm />
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
