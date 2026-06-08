import clientPromise, { getDatabaseName } from "./mongodb";
import {
  estates as mockEstates,
  testimonials as mockTestimonials,
  blogPosts as mockBlogPosts,
  galleryImages as mockGalleryImages,
  teamMembers as mockTeamMembers,
  stats as mockStats,
  whyChooseUs as mockWhyChooseUs,
  affiliatePackages as mockAffiliatePackages,
  Estate,
  BlogPost,
  Testimonial,
  GalleryImage,
  TeamMember,
} from "./data";

export interface Plot {
  id: string;
  name: string;
  estate: string;
  size: string;
  price: number;
  status: string;
}

export interface BuyInquiryDetails {
  propertyDetail: {
    estate: string;
    propertyTemplate: string;
    units: number;
    paymentPlan: string;
    paymentPackage: string;
    landPurpose: string;
    propertyLocation: string;
    plotSize: string;
    referralCode?: string;
  };
  applicantDetail: {
    title: string;
    firstName: string;
    lastName: string;
    otherName?: string;
    gender: string;
    maritalStatus: string;
    birthDate: string;
    nationality: string;
    motherMaidenName: string;
    occupation: string;
    phone: string;
    email: string;
    meansOfIdentification: string;
    meansOfIdentificationFile?: string;
    address?: string;
  };
  nokDetail: {
    title: string;
    firstName: string;
    lastName: string;
    otherName?: string;
    phone: string;
    email: string;
    relationship: string;
  };
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  estate: string;
  date: string;
  status: string;
  type?: "contact" | "buy-now";
  buyDetails?: BuyInquiryDetails;
}

const mockPlots: Plot[] = [
  { id: "plot-101", name: "Block A, Plot 3", estate: "Genesis City Estate", size: "600sqm", price: 3000000, status: "Sold" },
  { id: "plot-102", name: "Block C, Plot 14", estate: "Genesis City Estate", size: "450sqm", price: 2250000, status: "Available" },
  { id: "plot-103", name: "Block B, Plot 8", estate: "Prime City Estate", size: "900sqm", price: 8000000, status: "Reserved" },
  { id: "plot-104", name: "Block H, Plot 2", estate: "The Asset City, Abuja", size: "500sqm", price: 5000000, status: "Available" },
  { id: "plot-105", name: "Block E, Plot 11", estate: "The Asset City, Abuja", size: "600sqm", price: 6000000, status: "Sold" },
  { id: "plot-106", name: "Block A, Plot 22", estate: "Royal Gardens Estate", size: "600sqm", price: 3000000, status: "Available" },
];

const mockInquiries: Inquiry[] = [
  {
    id: "ld-201",
    name: "Emeka Nelson",
    email: "emeka.nelson@example.com",
    phone: "+234 803 111 2222",
    message: "Hi, I'm interested in buying 2 plots at Genesis City Estate outright. Please let me know how to start.",
    estate: "Genesis City Estate",
    date: "2026-06-04",
    status: "New",
  },
  {
    id: "ld-202",
    name: "Dr. Chioma Nwachukwu",
    email: "chioma.n@example.com",
    phone: "+234 809 333 4444",
    message: "I live in the US. Can we schedule a virtual walkthrough of The Asset City Abuja? Block H specifically.",
    estate: "The Asset City, Abuja",
    date: "2026-06-03",
    status: "Contacted",
  },
  {
    id: "ld-203",
    name: "Olanrewaju Kolawole",
    email: "kola.olan@example.com",
    phone: "+234 812 555 6666",
    message: "Do you have flexible payment options for Prime City Estate? I'd like to pay over 12 months.",
    estate: "Prime City Estate",
    date: "2026-06-01",
    status: "New",
  },
  {
    id: "ld-204",
    name: "Princess Kalu",
    email: "princess.k@example.com",
    phone: "+234 705 777 8888",
    message: "Confirmed receipt of my land deed survey for Royal Gardens. Thanks a lot Edjay team!",
    estate: "Royal Gardens Estate",
    date: "2026-05-28",
    status: "Closed",
  },
  {
    id: "ld-205",
    name: "Hassan Danjuma",
    email: "hassan@danjuma.org",
    phone: "+234 901 222 3333",
    message: "Interested in the affiliate program. I have a group of buyers interested in investing.",
    estate: "Affiliate Inquiry",
    date: "2026-05-25",
    status: "Contacted",
  },
];

async function getDb() {
  if (!clientPromise) {
    return null;
  }
  try {
    const client = await clientPromise;
    return client.db(getDatabaseName());
  } catch (error) {
    console.error(
      "MongoDB connection failed. Check Atlas Network Access (IP whitelist) and your MONGODB_URI.",
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

// Default empty stats fallback
export const defaultStats = {
  happyClients: 0,
  propertiesSold: 0,
  yearFounded: 0,
  ongoingProjects: 0,
  estatesManaged: 0,
  investmentVolume: 0,
};

// ---------------- ESTATES CRUD ----------------

export async function getEstates(): Promise<Estate[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    const items = await db.collection("estates").find({}).toArray();
    return items.map((item: any) => {
      const { _id, ...rest } = item;
      return { id: item._id, ...rest } as Estate;
    });
  } catch (error) {
    console.error("Failed to fetch estates from Mongo.", error);
    return [];
  }
}

export async function getEstateById(id: string): Promise<Estate | null> {
  try {
    const db = await getDb();
    if (!db) return null;
    const item = await db.collection("estates").findOne({ _id: id } as any);
    if (!item) return null;
    const { _id, ...rest } = item;
    return { id: String(item._id), ...rest } as unknown as Estate;
  } catch (error) {
    console.error(`Failed to fetch estate ${id} from Mongo.`, error);
    return null;
  }
}

export async function saveEstate(estate: Estate): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");
  await db.collection("estates").replaceOne(
    { _id: estate.id } as any,
    { ...estate, _id: estate.id } as any,
    { upsert: true }
  );
}

export async function deleteEstate(id: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");
  await db.collection("estates").deleteOne({ _id: id } as any);
}

// ---------------- PROPERTIES (PLOTS) CRUD ----------------

export async function getProperties(): Promise<Plot[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    const items = await db.collection("properties").find({}).toArray();
    return items.map((item: any) => {
      const { _id, ...rest } = item;
      return { id: item._id, ...rest } as Plot;
    });
  } catch (error) {
    console.error("Failed to fetch properties from Mongo.", error);
    return [];
  }
}

export async function saveProperty(property: Plot): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");
  await db.collection("properties").replaceOne(
    { _id: property.id } as any,
    { ...property, _id: property.id } as any,
    { upsert: true }
  );
}

export async function deleteProperty(id: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");
  await db.collection("properties").deleteOne({ _id: id } as any);
}

// ---------------- BLOG POSTS CRUD ----------------

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    const items = await db.collection("blog").find({}).toArray();
    return items.map((item: any) => {
      const { _id, ...rest } = item;
      return { slug: item._id, ...rest } as BlogPost;
    });
  } catch (error) {
    console.error("Failed to fetch blog posts from Mongo.", error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const db = await getDb();
    if (!db) return null;
    const item = await db.collection("blog").findOne({ _id: slug } as any);
    if (!item) return null;
    const { _id, ...rest } = item;
    return { slug: String(item._id), ...rest } as unknown as BlogPost;
  } catch (error) {
    console.error(`Failed to fetch blog post ${slug} from Mongo.`, error);
    return null;
  }
}

export async function saveBlogPost(post: BlogPost): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");
  await db.collection("blog").replaceOne(
    { _id: post.slug } as any,
    { ...post, _id: post.slug } as any,
    { upsert: true }
  );
}

export async function deleteBlogPost(slug: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");
  await db.collection("blog").deleteOne({ _id: slug } as any);
}

// ---------------- INQUIRIES (LEADS) CRUD ----------------

export async function getInquiries(): Promise<Inquiry[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    const items = await db.collection("inquiries").find({}).sort({ date: -1 }).toArray();
    return items.map((item: any) => {
      const { _id, ...rest } = item;
      return { id: item._id, ...rest } as Inquiry;
    });
  } catch (error) {
    console.error("Failed to fetch inquiries from Mongo.", error);
    return [];
  }
}

export async function saveInquiry(inquiry: Inquiry): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");
  await db.collection("inquiries").replaceOne(
    { _id: inquiry.id } as any,
    { ...inquiry, _id: inquiry.id } as any,
    { upsert: true }
  );
}

export async function deleteInquiry(id: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");
  await db.collection("inquiries").deleteOne({ _id: id } as any);
}

// ---------------- OTHER DYNAMIC TABLES ----------------

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    const items = await db.collection("testimonials").find({}).toArray();
    return items.map((item: any) => {
      const { _id, ...rest } = item;
      return { id: item._id, ...rest } as Testimonial;
    });
  } catch (error) {
    return [];
  }
}

export async function saveTestimonial(testimonial: Testimonial): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");
  await db.collection("testimonials").replaceOne(
    { _id: testimonial.id } as any,
    { ...testimonial, _id: testimonial.id } as any,
    { upsert: true }
  );
}

export async function deleteTestimonial(id: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");
  await db.collection("testimonials").deleteOne({ _id: id } as any);
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    const items = await db.collection("gallery").find({}).toArray();
    return items.map((item: any) => {
      const { _id, ...rest } = item;
      return { id: item._id, ...rest } as GalleryImage;
    });
  } catch (error) {
    return [];
  }
}

export async function saveGalleryImage(image: GalleryImage): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");
  await db.collection("gallery").replaceOne(
    { _id: image.id } as any,
    { ...image, _id: image.id } as any,
    { upsert: true }
  );
}

export async function deleteGalleryImage(id: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");
  await db.collection("gallery").deleteOne({ _id: id } as any);
}

export async function saveStats(stats: typeof defaultStats): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");
  await db.collection("stats").replaceOne(
    { _id: "company-stats" } as any,
    { ...stats, _id: "company-stats" } as any,
    { upsert: true }
  );
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    const items = await db.collection("team").find({}).toArray();
    return items.map((item: any) => {
      const { _id, ...rest } = item;
      return rest as TeamMember;
    });
  } catch (error) {
    return [];
  }
}

export async function getStats(): Promise<typeof defaultStats> {
  try {
    const db = await getDb();
    if (!db) return defaultStats;
    const item = await db.collection("stats").findOne({ _id: "company-stats" } as any);
    if (!item) return defaultStats;
    const { _id, ...rest } = item;
    return rest as typeof defaultStats;
  } catch (error) {
    return defaultStats;
  }
}

export async function getWhyChooseUs(): Promise<typeof mockWhyChooseUs> {
  try {
    const db = await getDb();
    if (!db) return mockWhyChooseUs;
    const items = await db.collection("whyChooseUs").find({}).toArray();
    if (items.length === 0) {
      return mockWhyChooseUs;
    }
    return items.map((item: any) => {
      const { _id, ...rest } = item;
      return rest;
    }) as any;
  } catch (error) {
    return mockWhyChooseUs;
  }
}

export async function getAffiliatePackages(): Promise<typeof mockAffiliatePackages> {
  try {
    const db = await getDb();
    if (!db) return [];
    const items = await db.collection("affiliatePackages").find({}).toArray();
    return items.map((item: any) => {
      const { _id, ...rest } = item;
      return rest;
    }) as any;
  } catch (error) {
    return [];
  }
}
