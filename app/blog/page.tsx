import { getBlogPosts } from "../lib/db";
import BlogListing from "./BlogListing";

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return <BlogListing blogPosts={posts} />;
}
