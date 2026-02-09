const PLACEHOLDER_BASE = "https://placehold.harshsandhu.com/api/img";

function img(w: number, h: number, bg = "0a0a0a", fg = "fafafa") {
  return `${PLACEHOLDER_BASE}?w=${w}&h=${h}&bg=${bg}&fg=${fg}`;
}

export const siteConfig = {
  name: "Koelnr",
  tagline: "Premium Car Wash & Detailing",
  description:
    "Professional car wash services in Cologne. From quick exterior washes to full detailing — we make your car shine like new.",
  phone: "+49 221 123 4567",
  email: "info@koelnr.de",
  address: "Hohenzollernring 42, 50672 Köln",
  hours: {
    weekdays: "08:00 – 20:00",
    saturday: "09:00 – 18:00",
    sunday: "Closed",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/#services" },
    { label: "Pricing", href: "/#pricing" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ],
  hero: {
    headline: "Your Car Deserves the Best Care",
    subheadline:
      "Premium hand wash & detailing in the heart of Cologne. Drive in dirty, drive out stunning.",
    cta: { label: "Book Now", href: "/#contact" },
    ctaSecondary: { label: "View Services", href: "/#services" },
    image: img(1400, 600, "1a1a2e", "e0e0e0"),
  },
  services: [
    {
      title: "Exterior Wash",
      description:
        "Thorough hand wash, wheel cleaning, and tire dressing for a spotless finish.",
      icon: "Droplets",
      image: img(600, 400, "1e3a5f", "a0c4e8"),
    },
    {
      title: "Interior Cleaning",
      description:
        "Deep vacuum, dashboard polish, leather conditioning, and odor removal.",
      icon: "SprayCan",
      image: img(600, 400, "2d4a22", "b5d6a7"),
    },
    {
      title: "Full Detailing",
      description:
        "Complete interior & exterior restoration including paint correction and ceramic coating.",
      icon: "Sparkles",
      image: img(600, 400, "4a1942", "d4a0cc"),
    },
    {
      title: "Express Wash",
      description:
        "Quick 15-minute exterior wash for when you're on the go. No appointment needed.",
      icon: "Zap",
      image: img(600, 400, "3d2b1f", "d4b896"),
    },
  ],
  pricing: [
    {
      name: "Express",
      price: "€19",
      description: "Quick exterior refresh",
      features: [
        "Exterior hand wash",
        "Wheel rinse",
        "Window cleaning",
        "Air dry",
      ],
      highlighted: false,
    },
    {
      name: "Premium",
      price: "€49",
      description: "Our most popular package",
      features: [
        "Full exterior hand wash",
        "Interior vacuum",
        "Dashboard wipe",
        "Tire dressing",
        "Air freshener",
      ],
      highlighted: true,
    },
    {
      name: "Detailing",
      price: "€129",
      description: "Complete restoration",
      features: [
        "Everything in Premium",
        "Paint correction",
        "Leather conditioning",
        "Engine bay cleaning",
        "Ceramic spray coating",
      ],
      highlighted: false,
    },
  ],
  about: {
    headline: "Cologne's Trusted Car Care Since 2018",
    description:
      "At Koelnr, we believe every car tells a story — and it should look its best while doing it. Our team of certified detailing professionals uses only eco-friendly products and proven techniques to deliver results that speak for themselves.",
    stats: [
      { value: "15K+", label: "Cars Washed" },
      { value: "4.9", label: "Google Rating" },
      { value: "7+", label: "Years Experience" },
      { value: "100%", label: "Eco-Friendly" },
    ],
    image: img(800, 500, "1a1a2e", "c0c0c0"),
  },
  testimonials: [
    {
      name: "Marco S.",
      text: "Best car wash in Cologne, hands down. My BMW has never looked this good.",
      rating: 5,
    },
    {
      name: "Anna K.",
      text: "The detailing service is incredible. They treated my car like it was their own.",
      rating: 5,
    },
    {
      name: "Thomas R.",
      text: "Quick, affordable, and thorough. I come here every two weeks.",
      rating: 5,
    },
  ],
  footer: {
    copyright: `© ${new Date().getFullYear()} Koelnr. All rights reserved.`,
    socials: [
      { label: "Instagram", href: "#" },
      { label: "Facebook", href: "#" },
      { label: "Google Maps", href: "#" },
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;
