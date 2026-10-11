export const marketingImages = {
  heroHouse: {
    file: 'hero-house.jpg',
    alt: 'Modern residential architecture',
    src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80',
  },
  serviceResidential: {
    file: 'service-residential.jpg',
    alt: 'Residential construction',
    src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80',
  },
  serviceCommercial: {
    file: 'service-commercial.jpg',
    alt: 'Commercial fit-out',
    src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80',
  },
  serviceJoinery: {
    file: 'service-joinery.jpg',
    alt: 'Custom joinery',
    src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80',
  },
  serviceInterior: {
    file: 'service-interior.jpg',
    alt: 'Interior fit-out',
    src: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=80',
  },
  featureInterior: {
    file: 'feature-interior.jpg',
    alt: 'Modern interior with custom joinery',
    src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&q=80',
  },
  trustQualified: {
    file: 'trust-qualified.jpg',
    alt: 'Builder with plans on site',
    src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1000&q=80',
  },
  trustJoinery: {
    file: 'trust-joinery.jpg',
    alt: 'Joinery workshop',
    src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1000&q=80',
  },
  trustQuality: {
    file: 'trust-quality.jpg',
    alt: 'Construction team at work',
    src: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1600&q=75',
  },
} as const

export type MarketingImageKey = keyof typeof marketingImages

export type ImageRef = {
  key: MarketingImageKey
  alt: string
  src: string
}

const image = (key: MarketingImageKey, alt: string, src?: string): ImageRef => ({
  key,
  alt,
  src: src || marketingImages[key].src,
})

const enquiryLink = {
  label: 'Start an Enquiry →',
  href: '/enquiry',
  variant: 'enquiry' as const,
}

export const homeContent = {
  hero: {
    eyebrow: 'Residential / Commercial / Joinery / Interior Fit-out',
    headline: 'Built from the\nground up.',
    description:
      'Residential construction, renovation, commercial fit-out and custom joinery — built with quality, precision and care.',
    image: image('heroHouse', 'Modern residential architecture'),
    badgePrimary: 'Quality',
    badgeSecondary: 'Construction',
    badgeMuted: 'Lasting Value',
    links: [enquiryLink],
  },
  serviceCards: {
    eyebrow: 'Our Services',
    heading: 'Four core capabilities',
    cards: [
      {
        image: image(
          'serviceResidential',
          'Residential Construction & Renovation',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
        ),
        title: 'Residential Construction & Renovation',
        subtitle: '住宅施工与翻新',
        description: 'New builds, extensions, renovations and alterations for residential properties.',
        href: '/services#residential',
      },
      {
        image: image(
          'serviceCommercial',
          'Commercial Fit-out',
          'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
        ),
        title: 'Commercial Fit-out',
        subtitle: '商业空间装修',
        description: 'Office, retail, hospitality and commercial space fit-outs.',
        href: '/services#commercial',
      },
      {
        image: image(
          'serviceJoinery',
          'Custom Joinery & Cabinetry',
          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
        ),
        title: 'Custom Joinery & Cabinetry',
        subtitle: '定制橱柜与木作',
        description: 'Kitchens, wardrobes, vanities, entertainment units and bespoke furniture.',
        href: '/services#joinery',
      },
      {
        image: image(
          'serviceInterior',
          'Interior Fit-out & Project Delivery',
          'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80',
        ),
        title: 'Interior Fit-out & Project Delivery',
        subtitle: '室内装修与项目交付',
        description: 'Complete interior delivery from design coordination to final handover.',
        href: '/services#interior',
      },
    ],
  },
  briefs: {
    variant: 'briefs' as const,
    eyebrow: 'Residential / Commercial / Joinery',
    heading: 'Different briefs.',
    headingAccent: 'Same care.',
    body: 'Zillion Home is a Melbourne-based builder delivering residential construction, renovations, commercial fit-outs and custom joinery. We bring construction, interiors and joinery together under one team, with a clear process and a close eye on every project.',
    image: image('featureInterior', 'Modern interior with custom joinery'),
    items: [
      {
        image: image(
          'serviceResidential',
          'Residential',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&q=80',
        ),
        title: 'Residential',
        subtitle: 'Construction & Renovation',
      },
      {
        image: image(
          'serviceCommercial',
          'Commercial',
          'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&q=80',
        ),
        title: 'Commercial',
        subtitle: 'Fit-out',
      },
      {
        image: image(
          'serviceJoinery',
          'Custom Joinery',
          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=80',
        ),
        title: 'Custom Joinery',
        subtitle: 'Kitchens, Wardrobes & Cabinetry',
      },
      {
        image: image(
          'serviceInterior',
          'Interior Fit-out',
          'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=200&q=80',
        ),
        title: 'Interior Fit-out',
        subtitle: 'Complete Project Delivery',
      },
    ],
  },
  process: {
    variant: 'split' as const,
    eyebrow: 'The Way We Work',
    heading: 'Clarity at every stage.',
    body: 'From initial consultation to final handover, we coordinate construction, interior fit-out and custom joinery to deliver well-managed projects with practical solutions and quality workmanship.',
    trustItems: [
      {
        image: image(
          'trustQualified',
          'Qualified & Insured',
          'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80',
        ),
        title: 'Qualified & Insured',
        description: 'Registered builder with appropriate insurances',
      },
      {
        image: image(
          'trustJoinery',
          'In-house Joinery Capability',
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
        ),
        title: 'In-house Joinery Capability',
        description: 'Custom kitchens, wardrobes, vanities and more',
      },
      {
        image: image(
          'trustQuality',
          'Quality & Care',
          'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=400&q=75',
        ),
        title: 'Quality & Care',
        description: 'Practical solutions, professional delivery',
      },
    ],
    steps: [
      { title: 'Consultation' },
      { title: 'Planning & Coordination' },
      { title: 'Construction / Fit-out' },
      { title: 'Joinery & Finishes' },
      { title: 'Handover' },
    ],
  },
  categories: {
    eyebrow: 'More than spaces',
    heading: 'We build better living,\nworking and business spaces.',
    items: [
      { title: 'Residential Construction' },
      { title: 'Renovation' },
      { title: 'Commercial Fit-out' },
      { title: 'Custom Joinery' },
      { title: 'Interior Fit-out & Delivery' },
    ],
  },
  cta: {
    tone: 'dark' as const,
    heading: 'Ready to start your project?',
    body: "Tell us about your vision and we'll help bring it to life with quality construction, precision joinery and professional project delivery.",
    links: [enquiryLink],
  },
  metaDescription:
    'Residential construction, renovation, commercial fit-out and custom joinery — built with quality, precision and care.',
}

export const aboutContent = {
  intro: {
    layout: 'split' as const,
    eyebrow: 'About Zillion Home',
    heading: 'Building with',
    headingAccent: 'care and precision',
    description:
      'Zillion Home is a Melbourne-based builder bringing construction, interiors and joinery together under one team. We deliver residential and commercial projects with a clear process and close attention to every detail.',
    image: image('trustQuality', 'Construction team at work'),
  },
  prose: {
    eyebrow: 'Who We Are',
    heading: 'A builder, not a design studio',
    body: "We are first and foremost builders. From the ground up, we manage construction, coordinate trades, and deliver projects on time and on budget. Our in-house joinery capability means we can handle everything from structural work to the finest cabinetry details — all under one roof.\n\nWhether you're planning a home renovation, a commercial fit-out, or custom joinery for your space, we bring the same level of care and professionalism to every project.",
  },
  capabilities: {
    eyebrow: 'What We Do',
    heading: 'Our capabilities',
    items: [
      {
        title: 'Residential Construction & Renovation',
        description: 'New builds, extensions, renovations and alterations for homes across Melbourne.',
      },
      {
        title: 'Commercial Fit-out',
        description: 'Office, retail, hospitality and commercial spaces tailored to your business.',
      },
      {
        title: 'Custom Joinery & Cabinetry',
        description: 'Kitchens, wardrobes, vanities, and bespoke furniture crafted in-house.',
      },
      {
        title: 'Interior Fit-out & Project Delivery',
        description: 'Complete interior delivery from design coordination to final handover.',
      },
    ],
  },
  trust: {
    variant: 'checklist' as const,
    eyebrow: 'Trust & Qualifications',
    heading: 'Qualified, insured,',
    headingAccent: 'ready to build',
    body: 'Zillion Home is a registered builder operating across Melbourne and surrounding areas. We maintain appropriate insurances and comply with all relevant building codes and regulations.\n\nOur in-house joinery workshop allows us to deliver custom cabinetry with the same quality control as our construction work — no outsourcing, no surprises.',
    image: image(
      'trustQualified',
      'Builder with plans on site',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1000&q=80',
    ),
    items: [
      {
        title: 'Quality Workmanship',
        subtitle: 'Every project is built to last with attention to detail and precision.',
      },
      {
        title: 'Clear Communication',
        subtitle: 'Regular updates and transparent processes throughout your project.',
      },
      {
        title: 'Practical Solutions',
        subtitle: 'We solve problems efficiently without compromising on quality.',
      },
    ],
  },
  cta: {
    tone: 'dark' as const,
    heading: "Let's build something together",
    body: "Ready to start your project? Get in touch and tell us about your vision. We'll provide guidance and help you take the next steps.",
    links: [
      enquiryLink,
      { label: 'View Our Services', href: '/services', variant: 'outline' as const },
    ],
  },
  metaTitle: 'About Us',
  metaDescription:
    'Melbourne-based builder delivering residential construction, renovations, commercial fit-outs and custom joinery with quality, precision and care.',
}

export const servicesContent = {
  intro: {
    layout: 'text' as const,
    eyebrow: 'Our Services',
    heading: 'Building residential,\ncommercial &',
    headingAccent: 'custom joinery',
    description:
      'Four core capabilities under one roof. From ground-up construction to precision cabinetry, we deliver complete building solutions for homes and businesses.',
  },
  details: {
    services: [
      {
        anchor: 'residential',
        title: 'Residential Construction & Renovation',
        subtitle: '住宅施工与翻新',
        description:
          'From new builds to complete renovations, we deliver residential projects with attention to detail and quality craftsmanship.',
        features: [
          'New home construction',
          'Home extensions and additions',
          'Full house renovations',
          'Structural alterations',
          'Bathroom and kitchen renovations',
          'Outdoor living spaces',
        ],
        image: image(
          'serviceResidential',
          'Residential Construction & Renovation',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80',
        ),
        enquireLabel: 'Enquire about Residential',
      },
      {
        anchor: 'commercial',
        title: 'Commercial Fit-out',
        subtitle: '商业空间装修',
        description:
          'Professional commercial spaces designed for your business needs. From offices to retail, we create functional and impressive environments.',
        features: [
          'Office fit-outs',
          'Retail store construction',
          'Hospitality venues',
          'Medical and healthcare facilities',
          'Warehouse and industrial spaces',
          'Tenant improvements',
        ],
        image: image(
          'serviceCommercial',
          'Commercial Fit-out',
          'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&q=80',
        ),
        enquireLabel: 'Enquire about Commercial',
      },
      {
        anchor: 'joinery',
        title: 'Custom Joinery & Cabinetry',
        subtitle: '定制橱柜与木作',
        description:
          'Bespoke joinery crafted in our workshop. Whether standalone or as part of a larger project, we deliver precision-made cabinetry tailored to your space.',
        features: [
          'Custom kitchens',
          'Built-in wardrobes',
          'Bathroom vanities',
          'Entertainment units',
          'Home office fit-outs',
          'Bespoke furniture pieces',
        ],
        image: image(
          'serviceJoinery',
          'Custom Joinery & Cabinetry',
          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1000&q=80',
        ),
        enquireLabel: 'Enquire about Custom',
      },
      {
        anchor: 'interior',
        title: 'Interior Fit-out & Project Delivery',
        subtitle: '室内装修与项目交付',
        description:
          'Complete interior delivery from design coordination to final handover. We manage the entire process so you can focus on your vision.',
        features: [
          'Design coordination',
          'Project management',
          'Trade coordination',
          'Quality assurance',
          'Timeline management',
          'Handover and documentation',
        ],
        image: image(
          'serviceInterior',
          'Interior Fit-out & Project Delivery',
          'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&q=80',
        ),
        enquireLabel: 'Enquire about Interior',
      },
    ],
  },
  process: {
    variant: 'centered' as const,
    eyebrow: 'How We Work',
    heading: 'Our process',
    steps: [
      { title: 'Consultation', description: 'We meet to understand your project needs' },
      { title: 'Planning', description: 'Detailed planning and design coordination' },
      { title: 'Construction', description: 'Quality construction with regular updates' },
      { title: 'Joinery', description: 'Custom joinery and finishing touches' },
      { title: 'Handover', description: 'Final walkthrough and project completion' },
    ],
  },
  joinery: {
    variant: 'darkCopy' as const,
    eyebrow: 'In-house Capability',
    heading: 'Custom joinery,',
    headingAccent: 'crafted in-house',
    body: "Our joinery workshop allows us to deliver bespoke cabinetry with the same quality control as our construction work. Whether it's a standalone kitchen project or joinery as part of a complete renovation, everything is built to your specifications.\n\nThis means better coordination, consistent quality, and a single point of accountability for your entire project.",
    image: image('trustJoinery', 'Joinery workshop'),
    links: [{ label: 'Enquire about Custom Joinery →', href: '/enquiry', variant: 'enquiry' as const }],
  },
  cta: {
    tone: 'light' as const,
    heading: 'Ready to discuss your project?',
    body: "Tell us about your requirements and we'll help you understand how we can bring your vision to life.",
    links: [enquiryLink],
  },
  metaTitle: 'Our Services',
  metaDescription:
    'Residential construction, commercial fit-out, custom joinery and interior project delivery. Melbourne builder for homes and businesses.',
}

export const headerNav = {
  primary: [
    { label: 'Home', href: '/' },
    { label: 'Residential', href: '/services#residential' },
    { label: 'Commercial', href: '/services#commercial' },
    { label: 'Custom Joinery', href: '/services#joinery' },
    { label: 'Interior Fit-out', href: '/services#interior' },
  ],
  secondary: [
    { label: 'Projects', href: '/projects' },
    { label: 'About Us', href: '/about' },
  ],
}

export const footerContent = {
  blurb:
    'Melbourne-based builder delivering residential construction, renovations, commercial fit-outs and custom joinery.',
  tagline: 'Built from the ground up.',
  location: 'Melbourne, Victoria',
  services: [
    { label: 'Residential Construction', href: '/services#residential' },
    { label: 'Commercial Fit-out', href: '/services#commercial' },
    { label: 'Custom Joinery', href: '/services#joinery' },
    { label: 'Interior Fit-out', href: '/services#interior' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Enquiry', href: '/enquiry' },
  ],
}
