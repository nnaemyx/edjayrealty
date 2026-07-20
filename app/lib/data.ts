export interface Estate {
  id: string;
  name: string;
  location: string;
  state: string;
  description: string;
  shortDescription: string;
  priceRange: string;
  priceFrom: number;
  image: string;
  images: string[];
  plotSizes: string[];
  features: string[];
  amenities: string[];
  totalPlots: number;
  availablePlots: number;
  status: "available" | "selling-fast" | "sold-out" | "coming-soon";
  paymentPlans: PaymentPlan[];
  faqs: FAQ[];
  videoUrls?: string[];
}

export interface PaymentPlan {
  name: string;
  duration: string;
  initialDeposit: string;
  monthlyPayment?: string;
  discount?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
  investmentType: string;
}

export interface BlogPost {
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

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
  isVideo?: boolean;
  videoUrl?: string;
}

export const estates: Estate[] = [
  {
    id: "genesis-city",
    name: "Genesis City Estate",
    location: "Amansea, Awka",
    state: "Anambra",
    description:
      "Genesis City Estate is a premium residential development strategically located in Amansea, Awka, the capital of Anambra State. This estate offers an unparalleled opportunity to own land in one of the fastest-growing cities in Southeast Nigeria. With excellent road networks, proximity to major institutions like Nnamdi Azikiwe University, and a rapidly appreciating land value, Genesis City Estate is the perfect investment for forward-thinking individuals.",
    shortDescription:
      "Premium residential estate in the heart of Awka, Anambra State with excellent infrastructure and high appreciation potential.",
    priceRange: "₦1.5M - ₦5M",
    priceFrom: 1500000,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    ],
    plotSizes: ["300sqm", "450sqm", "600sqm", "900sqm"],
    features: [
      "Perimeter Fencing",
      "Paved Road Network",
      "Drainage System",
      "Electricity Infrastructure",
      "Gate House & Security",
      "Green Areas",
    ],
    amenities: [
      "24/7 Security",
      "Good Road Network",
      "Close to University",
      "Near Major Markets",
      "Water Supply",
      "Recreational Areas",
    ],
    totalPlots: 200,
    availablePlots: 67,
    status: "selling-fast",
    paymentPlans: [
      {
        name: "Outright Payment",
        duration: "Immediate",
        initialDeposit: "100%",
        discount: "10% discount",
      },
      {
        name: "3 Months Plan",
        duration: "3 months",
        initialDeposit: "70%",
        monthlyPayment: "Balance spread over 3 months",
      },
      {
        name: "6 Months Plan",
        duration: "6 months",
        initialDeposit: "50%",
        monthlyPayment: "Balance spread over 6 months",
      },
      {
        name: "12 Months Plan",
        duration: "12 months",
        initialDeposit: "30%",
        monthlyPayment: "Balance spread over 12 months",
      },
    ],
    faqs: [
      {
        question: "What documents will I receive?",
        answer:
          "You will receive a Deed of Assignment, Survey Plan, Receipt of Purchase, and a Certificate of Occupancy (C of O) processing.",
      },
      {
        question: "Can I visit the site before purchasing?",
        answer:
          "Yes! We encourage site inspections. You can book a free inspection through our website or contact our sales team.",
      },
      {
        question: "Is the land government approved?",
        answer:
          "Yes, Genesis City Estate has fulfilled the requirements and is undergoing documentation for grant of approval by the Anambra State Government.",
      },
    ],
  },
  {
    id: "prime-city",
    name: "Prime City Estate",
    location: "Agu-Awka, Awka",
    state: "Anambra",
    description:
      "Prime City Estate is a luxurious development project situated in the prestigious Agu-Awka area. This estate is designed for individuals who desire a blend of urban sophistication and serene living. With its strategic location along major arterial roads, Prime City Estate provides easy access to commercial centers, healthcare facilities, and educational institutions.",
    shortDescription:
      "Luxurious estate development in Agu-Awka with modern infrastructure and premium amenities for discerning investors.",
    priceRange: "₦2M - ₦8M",
    priceFrom: 2000000,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    ],
    plotSizes: ["450sqm", "600sqm", "900sqm"],
    features: [
      "Perimeter Fencing",
      "Interlocked Roads",
      "Underground Drainage",
      "Solar-Powered Street Lights",
      "Gate House & Security",
      "Landscaped Gardens",
    ],
    amenities: [
      "24/7 Security",
      "Shopping Complex",
      "Recreational Center",
      "Children's Playground",
      "Water Treatment Plant",
      "Power Supply",
    ],
    totalPlots: 150,
    availablePlots: 42,
    status: "selling-fast",
    paymentPlans: [
      {
        name: "Outright Payment",
        duration: "Immediate",
        initialDeposit: "100%",
        discount: "10% discount",
      },
      {
        name: "3 Months Plan",
        duration: "3 months",
        initialDeposit: "70%",
        monthlyPayment: "Balance spread over 3 months",
      },
      {
        name: "6 Months Plan",
        duration: "6 months",
        initialDeposit: "50%",
        monthlyPayment: "Balance spread over 6 months",
      },
    ],
    faqs: [
      {
        question: "What is the title of the land?",
        answer:
          "The estate has a registered survey and is currently processing the Certificate of Occupancy (C of O).",
      },
      {
        question: "Are there building regulations?",
        answer:
          "Yes, there are building guidelines to maintain the estate's premium standard. Our team will provide you with the building code upon purchase.",
      },
    ],
  },
  {
    id: "the-asset-city",
    name: "The Asset City",
    location: "Lugbe, Abuja",
    state: "FCT",
    description:
      "The Asset City is a flagship estate development located in Lugbe, one of Abuja's fastest-growing satellite towns. Positioned along the Airport Road corridor, this estate enjoys proximity to Nnamdi Azikiwe International Airport, major shopping malls, and government establishments. The Asset City is designed to deliver world-class living standards with comprehensive infrastructure development.",
    shortDescription:
      "Flagship estate in Abuja's Lugbe with airport proximity and world-class infrastructure for maximum investment returns.",
    priceRange: "₦5M - ₦15M",
    priceFrom: 5000000,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    ],
    plotSizes: ["500sqm", "600sqm", "900sqm", "1200sqm"],
    features: [
      "Perimeter Fencing & Gatehouse",
      "Asphalt Road Network",
      "Central Water System",
      "Underground Power Lines",
      "Fiber Optic Connectivity",
      "CCTV Surveillance",
    ],
    amenities: [
      "24/7 Armed Security",
      "Commercial Hub",
      "Gym & Fitness Center",
      "Swimming Pool",
      "Children's Park",
      "Event Center",
    ],
    totalPlots: 300,
    availablePlots: 156,
    status: "available",
    paymentPlans: [
      {
        name: "Outright Payment",
        duration: "Immediate",
        initialDeposit: "100%",
        discount: "15% discount",
      },
      {
        name: "6 Months Plan",
        duration: "6 months",
        initialDeposit: "50%",
        monthlyPayment: "Balance spread over 6 months",
      },
      {
        name: "12 Months Plan",
        duration: "12 months",
        initialDeposit: "30%",
        monthlyPayment: "Balance spread over 12 months",
      },
    ],
    faqs: [
      {
        question: "Is this estate in the Abuja Master Plan?",
        answer:
          "The Asset City is located in Lugbe, which falls within the Abuja Metropolitan Area and benefits from the city's ongoing infrastructure development.",
      },
      {
        question: "What is the expected ROI?",
        answer:
          "Based on current market trends, properties in Lugbe have appreciated by an average of 25-40% annually over the past 5 years.",
      },
    ],
  },
  {
    id: "royal-gardens",
    name: "Royal Gardens Estate",
    location: "Onitsha-Owerri Road",
    state: "Anambra",
    description:
      "Royal Gardens Estate is a serene residential community offering affordable plots in a strategic location along the Onitsha-Owerri Road. Perfect for families and investors looking for value-driven opportunities with high growth potential.",
    shortDescription:
      "Affordable residential estate along Onitsha-Owerri Road with family-friendly amenities and strong growth potential.",
    priceRange: "₦800K - ₦3M",
    priceFrom: 800000,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    ],
    plotSizes: ["300sqm", "450sqm", "600sqm"],
    features: [
      "Perimeter Fencing",
      "Graded Roads",
      "Drainage System",
      "Street Lights",
      "Gate House",
    ],
    amenities: [
      "Security Post",
      "Community Hall",
      "Playground",
      "Water Borehole",
    ],
    totalPlots: 180,
    availablePlots: 98,
    status: "available",
    paymentPlans: [
      {
        name: "Outright Payment",
        duration: "Immediate",
        initialDeposit: "100%",
        discount: "5% discount",
      },
      {
        name: "6 Months Plan",
        duration: "6 months",
        initialDeposit: "50%",
        monthlyPayment: "Balance spread over 6 months",
      },
    ],
    faqs: [
      {
        question: "How do I get started?",
        answer:
          "Simply contact our sales team or fill the inquiry form. We'll guide you through the entire process from site inspection to documentation.",
      },
    ],
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Chukwuemeka Obi",
    role: "Business Owner",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    content:
      "Investing with Edjay Realty was one of the best decisions I've made. The process was transparent, documentation was thorough, and my land has appreciated significantly in just 2 years.",
    rating: 5,
    investmentType: "Genesis City Estate",
  },
  {
    id: "2",
    name: "Adaeze Nwankwo",
    role: "Diaspora Investor",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    content:
      "As someone living abroad, I was initially skeptical. But Edjay Realty made everything seamless — from virtual inspections to secure payment processing. I now own 3 plots!",
    rating: 5,
    investmentType: "Prime City Estate",
  },
  {
    id: "3",
    name: "Ibrahim Musa",
    role: "Civil Servant",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    content:
      "The flexible payment plans made it possible for me to invest within my budget. The team is professional and always available to answer questions.",
    rating: 5,
    investmentType: "The Asset City",
  },
  {
    id: "4",
    name: "Ngozi Eze",
    role: "Medical Doctor",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    content:
      "I was looking for a reliable real estate company and Edjay Realty exceeded my expectations. The estate is well-planned and the infrastructure development is impressive.",
    rating: 5,
    investmentType: "Genesis City Estate",
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "why-invest-in-nigerian-real-estate",
    title: "Why You Should Invest in Nigerian Real Estate in 2025",
    excerpt:
      "Nigeria's real estate market continues to show strong growth potential. Discover why now is the perfect time to invest.",
    content: "",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    author: "Edjay Realty",
    authorImage: "",
    date: "2025-01-15",
    category: "Investment",
    readTime: "5 min read",
  },
  {
    slug: "land-ownership-guide-nigeria",
    title: "Complete Guide to Land Ownership in Nigeria",
    excerpt:
      "Understanding land titles, C of O, and proper documentation is crucial. Here's everything you need to know.",
    content: "",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
    author: "Edjay Realty",
    authorImage: "",
    date: "2025-02-10",
    category: "Guide",
    readTime: "8 min read",
  },
  {
    slug: "top-locations-real-estate-investment",
    title: "Top 5 Locations for Real Estate Investment in Nigeria",
    excerpt:
      "From Abuja to Anambra, discover the hottest real estate investment destinations with the highest ROI.",
    content: "",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    author: "Edjay Realty",
    authorImage: "",
    date: "2025-03-05",
    category: "Market Trends",
    readTime: "6 min read",
  },
];

export const galleryImages: GalleryImage[] = [
  { id: "1", src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80", alt: "Estate entrance gate", category: "Estates" },
  { id: "2", src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80", alt: "Modern estate housing", category: "Estates" },
  { id: "3", src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80", alt: "Residential property", category: "Estates" },
  { id: "4", src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80", alt: "Road construction", category: "Construction" },
  { id: "5", src: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80", alt: "Building foundation", category: "Construction" },
  { id: "6", src: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80", alt: "Luxury villa", category: "Estates" },
  { id: "7", src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80", alt: "Modern architecture", category: "Estates" },
  { id: "8", src: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80", alt: "Property handover", category: "Events" },
  { id: "9", src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80", alt: "City skyline", category: "Estates" },
  { id: "10", src: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&q=80", alt: "Property inspection", category: "Events" },
  { id: "11", src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80", alt: "Estate aerial view", category: "Estates" },
  { id: "12", src: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=600&q=80", alt: "Estate pool area", category: "Estates" },
];

export const teamMembers: TeamMember[] = [
  {
    name: "Edjay Okonkwo",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
    bio: "With over 10 years of experience in Nigerian real estate, Edjay founded the company with a vision to make property investment accessible and trustworthy.",
  },
  {
    name: "Amara Chukwu",
    role: "Head of Sales",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80",
    bio: "Amara leads our sales team with passion and expertise, helping clients find the perfect investment opportunities.",
  },
  {
    name: "Obinna Eze",
    role: "Head of Operations",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80",
    bio: "Obinna ensures smooth estate development and client satisfaction across all our projects.",
  },
  {
    name: "Chidinma Okoro",
    role: "Legal Advisor",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80",
    bio: "Chidinma handles all legal documentation, ensuring every transaction is secure and properly documented.",
  },
];

export const stats = {
  propertiesSold: 850,
  happyClients: 1200,
  estatesManaged: 4,
  investmentVolume: 2500000000,
};

export const whyChooseUs = [
  {
    icon: "shield",
    title: "Verified Properties",
    description: "Every property is thoroughly verified with proper documentation and government approval status.",
  },
  {
    icon: "file",
    title: "Trusted Documentation",
    description: "Receive complete documentation including Deed of Assignment, Survey Plan, and C of O processing.",
  },
  {
    icon: "calendar",
    title: "Flexible Payment Plans",
    description: "Choose from multiple payment options — outright, 3, 6, or 12-month installment plans.",
  },
  {
    icon: "headphones",
    title: "Professional Support",
    description: "Our dedicated team provides end-to-end support from inquiry to property handover.",
  },
  {
    icon: "lock",
    title: "Secure Transactions",
    description: "All transactions are processed through secure banking channels with proper receipts.",
  },
  {
    icon: "trending",
    title: "High Appreciation",
    description: "Our estates are strategically located in high-growth areas with 25-40% annual appreciation.",
  },
];

export const affiliatePackages = [
  {
    name: "Basic Partner",
    commission: "5%",
    features: [
      "5% commission on every sale",
      "Marketing materials provided",
      "Dedicated support line",
      "Monthly performance reports",
    ],
    requirements: [
      "Valid government-issued ID",
      "Active social media presence",
      "Completed training program",
    ],
  },
  {
    name: "Pro Partner",
    commission: "10-15%",
    features: [
      "10-15% commission on every sale",
      "Priority access to new estates",
      "Personal branding support",
      "Quarterly bonus incentives",
      "VIP event invitations",
      "Dedicated account manager",
    ],
    requirements: [
      "Minimum 5 successful referrals",
      "Proven track record in sales",
      "Completed advanced training",
      "Active for at least 3 months",
    ],
  },
];
