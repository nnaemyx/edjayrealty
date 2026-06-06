import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getBlogPosts } from "../../lib/db";

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

  // Generate fallback detailed rich text content based on the post slug
  const getRichContent = () => {
    switch (post.slug) {
      case "why-invest-in-nigerian-real-estate":
        return (
          <>
            <p>
              Investing in Nigerian real estate continues to be one of the most reliable vehicles for wealth creation and capital preservation. As the country's population expands rapidly, the demand for housing, commercial spaces, and agricultural lands climbs at unprecedented rates.
            </p>
            <h3>1. High Capital Appreciation Potential</h3>
            <p>
              Unlike developed economies where real estate appreciation averages 3-5% annually, prime locations in Nigeria—specifically fast-developing hubs in Anambra (like Awka) and the Federal Capital Territory (Abuja)—frequently experience appreciation rates between <strong>25% to 40% annually</strong>. Buying land in these corridors is not just a purchase; it is a rapid multiplier of wealth.
            </p>
            <blockquote>
              &ldquo;Don&apos;t wait to buy land. Buy land and wait. The best time to buy was yesterday; the second best time is today.&rdquo;
            </blockquote>
            <h3>2. Hedge Against Inflation</h3>
            <p>
              With shifting currency values and economic pressures, placing capital in liquid cash can lead to erosion of buying power. Real estate is a tangible asset that inherently acts as a hedge. The value of properties adapts and outpaces inflationary surges, protecting your purchasing power.
            </p>
            <h3>3. Cash Flow through Rental and Resale</h3>
            <p>
              Whether you plan to develop a multi-family residential building, list commercial shops, or simply hold undeveloped land to sell to developers later, real estate offers multiple cash exit strategies.
            </p>
            <p>
              Before investing, ensure you are buying from verified agencies. Platforms like <strong>Edjay Realty</strong> ensure every property is fully registered with dispute-free documentation, saving you from legal bottlenecks and bad deals.
            </p>
          </>
        );

      case "land-ownership-guide-nigeria":
        return (
          <>
            <p>
              Navigating land ownership in Nigeria requires a solid understanding of the legal frameworks, title types, and government regulations. A mistake in verification can lead to substantial financial loss. Here is your comprehensive guide to getting it right.
            </p>
            <h3>1. The Land Use Act of 1978</h3>
            <p>
              The Land Use Act vests all lands within a state in the Governor of that state, who holds it in trust for the common benefit of all citizens. Therefore, land ownership is granted via a leasehold system, usually for a period of 99 years.
            </p>
            <h3>2. Essential Land Titles to Know</h3>
            <ul>
              <li>
                <strong>Certificate of Occupancy (C of O):</strong> The most important document issued directly by the State Governor to confirm ownership. A piece of land can only have one C of O.
              </li>
              <li>
                <strong>Deed of Assignment:</strong> The legal document that transfers ownership from the seller (assignor) to the buyer (assignee). Always request this.
              </li>
              <li>
                <strong>Survey Plan:</strong> Details the exact boundary dimensions and coordinates of the land, mapped by a licensed surveyor.
              </li>
              <li>
                <strong>Governor&apos;s Consent:</strong> Required when a land with an existing C of O is sold to another person. The governor must consent to the transfer.
              </li>
            </ul>
            <h3>3. Verification Checklist</h3>
            <p>
              Before paying for any property, run a search at the Land Registry to verify the title, confirm that the land is not under government acquisition (e.g. agricultural or forest reserves), and conduct a physical inspection.
            </p>
          </>
        );

      case "top-locations-real-estate-investment":
        return (
          <>
            <p>
              Location remains the absolute number one rule in real estate investment. Buying cheap land in an isolated area with zero economic activity will yield slow returns compared to buying strategic plots in fast-developing corridors.
            </p>
            <h3>1. Awka, Anambra State</h3>
            <p>
              As the state capital, Awka is experiencing a massive real estate boom. Areas like <strong>Amansea</strong> (close to Nnamdi Azikiwe University) and <strong>Agu-Awka</strong> (prestige residential hub) are top picks. With the state government actively backing estate development, these areas have seen values double in under three years.
            </p>
            <h3>2. Lugbe, Abuja (FCT)</h3>
            <p>
              Positioned along the Airport Road, Lugbe has transformed into a high-demand satellite town. Its proximity to the city center and the international airport makes it highly sought-after by civil servants and commercial developers.
            </p>
            <h3>3. Onitsha-Owerri Road Corridor</h3>
            <p>
              A major commercial artery in the Southeast. Land here is prime for logistics hubs, warehouse yards, and commercial plazas due to the massive trade traffic passing through daily.
            </p>
            <p>
              Edjay Realty currently manages premium estates in all these strategic zones. Check out our <strong>Genesis City Estate</strong> or <strong>The Asset City</strong> in Lugbe to start your investment journey.
            </p>
          </>
        );

      default:
        return (
          <p>
            Real estate remains the ultimate vehicle for securing generational wealth. Stay tuned as we update our blog with more news, advice, and market insights.
          </p>
        );
    }
  };

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
                  getRichContent()
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
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
