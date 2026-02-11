export const siteConfig = {
  name: "koelnr",
  tagline: "Doorstep Car Care, Done Right",
  description:
    "Professional doorstep car wash services in Ludhiana. Subscriptions for daily care, on-demand washes when you need them.",
  phone: "+91 98765 43210",
  email: "hello@koelnr.in",
  address: "Ludhiana, Punjab, India",
  serviceSlots: {
    morning: ["6:00 – 8:00 AM", "8:00 – 10:00 AM", "10:00 – 11:30 AM"],
    evening: ["4:00 – 6:00 PM", "6:00 – 8:00 PM"],
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/#services" },
    { label: "Pricing", href: "/#pricing" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ],
  hero: {
    headline: "Your Car, Washed at Your Doorstep",
    subheadline:
      "Subscribe for daily care or book on-demand — premium car wash delivered to your parking spot in Ludhiana.",
    cta: { label: "Subscribe Now", href: "/dashboard/subscriptions" },
    ctaSecondary: { label: "View Services", href: "/#services" },
    image: "/images/car-wash-hero.webp",
  },
  services: [
    {
      title: "Basic Wash",
      description:
        "Low-water / waterless exterior clean, glass wipe, light shine, and tyre face wipe. 15–20 min, 1-person crew.",
      icon: "Droplets",
      image: "/images/basic-clean.webp",
    },
    {
      title: "Pressure Wash",
      description:
        "Foam + pressure rinse, full drying, tyre and rim scrub. 25–35 min, 2-person crew.",
      icon: "Waves",
      image: "/images/pressure-washing.webp",
    },
    {
      title: "Interior Refresh",
      description:
        "Vacuum, dashboard & panel wipe, mats shake, and air freshener. 15–20 min, 2-person crew.",
      icon: "SprayCan",
      image: "/images/interior-1.webp",
    },
    {
      title: "Deep Interior",
      description:
        "Full shampoo and extraction as needed — condition and size dependent. 60–120 min, 2-person crew.",
      icon: "Sparkles",
      image: "/images/interior-2.webp",
    },
  ],
  subscriptions: [
    {
      name: "Smart 3D",
      schedule: "3 days/week",
      inclusions: "3 wash-days + 1 Pressure Wash upgrade per week",
      washDays: "~13/month",
      hatchSedan: { perWash: "₹193", monthly: "₹2,499" },
      suvMuv: { perWash: "₹223", monthly: "₹2,899" },
      highlighted: false,
    },
    {
      name: "Pro 6D",
      schedule: "Mon–Sat (Sun off)",
      inclusions: "6 wash-days + 3 Pressure Wash upgrades per week",
      washDays: "~26/month",
      hatchSedan: { perWash: "₹193", monthly: "₹4,999" },
      suvMuv: { perWash: "₹219", monthly: "₹5,699" },
      highlighted: true,
    },
    {
      name: "Elite 6D",
      schedule: "Mon–Sat (Sun off)",
      inclusions:
        "6 wash-days + 3 Pressure Wash upgrades + 3 Interior Refresh per week",
      washDays: "~26/month",
      hatchSedan: { perWash: "₹269", monthly: "₹6,999" },
      suvMuv: { perWash: "₹308", monthly: "₹7,999" },
      highlighted: false,
    },
  ],
  subscriberAddons: [
    { name: "Extra Pressure Wash", hatchSedan: "₹399", suvMuv: "₹449" },
    { name: "Extra Interior Refresh", hatchSedan: "₹249", suvMuv: "₹299" },
    { name: "Deep Interior", hatchSedan: "₹1,199+", suvMuv: "₹1,199+" },
    {
      name: "Tyre Dressing / Polish Finish",
      hatchSedan: "₹199–₹399",
      suvMuv: "₹199–₹399",
    },
  ],
  onDemand: {
    exterior: [
      {
        name: "Basic Exterior (low-water)",
        hatchSedan: "₹299",
        suvMuv: "₹349",
      },
      { name: "Foam Exterior", hatchSedan: "₹399", suvMuv: "₹449" },
      { name: "Pressure Wash + Dry", hatchSedan: "₹549", suvMuv: "₹649" },
    ],
    interior: [
      { name: "Interior Refresh", hatchSedan: "₹249", suvMuv: "₹299" },
      { name: "Deep Interior", hatchSedan: "₹1,199+", suvMuv: "₹1,399+" },
    ],
    combos: [
      { name: "Foam + Interior Refresh", hatchSedan: "₹599", suvMuv: "₹699" },
      {
        name: "Pressure + Interior Refresh",
        hatchSedan: "₹749",
        suvMuv: "₹899",
      },
    ],
  },
  policies: [
    "Water and power must be provided by the customer.",
    "Heavy mud / extreme dirt requires a Pressure Wash (or paid upgrade) — Basic Wash covers dust and light dirt only.",
    "Quality issues reported on the same day qualify for a free redo.",
    "Subscription customers pick a primary slot; reschedules are subject to capacity.",
  ],
  about: {
    headline: "Doorstep Car Care, Built for Ludhiana",
    description:
      "Koelnr is a doorstep services business launching with car washing and expanding into adjacent service categories. We bring professional car care to your parking spot — no driving, no waiting. Subscribe for daily maintenance or book on-demand whenever you need a deep clean.",
    stats: [
      { value: "5", label: "Service Slots Daily" },
      { value: "3", label: "Subscription Plans" },
      { value: "100%", label: "Doorstep Service" },
      { value: "2-Person", label: "Trained Crews" },
    ],
    image: "/images/car-wash-hero.webp",
  },
  testimonials: [
    {
      name: "Rajveer S.",
      text: "Haven't visited a car wash in months. Koelnr shows up every morning and my car is spotless before I leave for work.",
      rating: 5,
    },
    {
      name: "Priya M.",
      text: "The subscription is so worth it. Pressure wash upgrades keep my SUV looking showroom-ready.",
      rating: 5,
    },
    {
      name: "Arjun K.",
      text: "Booked a deep interior on-demand — the crew was on time, thorough, and super professional.",
      rating: 5,
    },
  ],
  footer: {
    copyright: `© ${new Date().getFullYear()} Koelnr. All rights reserved.`,
    socials: [
      { label: "Instagram", href: "#" },
      { label: "WhatsApp", href: "#" },
      { label: "Google Maps", href: "#" },
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;
