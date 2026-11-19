import { ourProcessSteps } from '@/content/processSteps'

export const marketingImages = {
  heroHouse: {
    file: 'hero-house.jpg',
    alt: 'Modern house at dusk',
    src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=75',
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
    eyebrow: 'Builders & Joiners · Est. Melbourne',
    headline: 'Built from the ground up.',
    description:
      'Residential construction, renovation, commercial fit-out and custom joinery — delivered by one team, with precision and care.',
    image: image('heroHouse', 'Modern house at dusk'),
    badgePrimary: 'Residential',
    badgeSecondary: 'Commercial',
    badgeMuted: 'Joinery',
    links: [] as { label: string; href: string; variant: 'enquiry' }[],
  },
  serviceCards: {
    variant: 'pair' as const,
    eyebrow: 'Your project, your starting point',
    heading: 'Every great project starts somewhere.',
    headingAccent: 'starts somewhere.',
    body: "Whether you have detailed plans or are starting with an idea, we're here to help you take the next step towards construction.",
    cards: [
      {
        image: image('featureInterior', 'Material samples and joinery finishes'),
        title: 'Starting with an Idea?',
        subtitle: '',
        description:
          'No plans yet? We can help explore design options, develop practical solutions and coordinate the documentation needed to move your building or joinery project forward.',
        href: '',
      },
      {
        image: image(
          'trustQualified',
          'Drawings and construction plans',
          'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1000&q=80',
        ),
        title: 'Already Have Plans?',
        subtitle: '',
        description:
          'Share your drawings with us. We can review the proposed scope, discuss construction requirements and help you plan the next steps towards bringing your project to life.',
        href: '',
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
    ],
  },
  process: {
    variant: 'split' as const,
    eyebrow: '',
    heading: 'A considered approach, from start to finish.',
    body: 'A successful build is about more than individual trades. We consider how construction, building services, interiors and custom joinery work together, helping to identify requirements early and keep every part of the project connected.',
    trustEyebrow: 'Why Zillion Home',
    trustHeading: 'Built with the bigger picture in mind.',
    trustItems: [
      {
        title: 'A Broader Perspective',
        description:
          'Our experience across construction, fit-outs and custom joinery allows us to consider the project as a whole, not just individual elements.',
      },
      {
        title: 'Thinking Ahead',
        description:
          'By understanding how different stages affect one another, we can plan for what comes next and minimise unnecessary adjustments along the way.',
      },
      {
        title: 'Clearer Accountability',
        description:
          'A coordinated approach means fewer gaps in communication, clearer responsibilities and a more straightforward experience for our clients.',
      },
    ],
    steps: ourProcessSteps,
  },
  categories: {
    eyebrow: 'More than spaces',
    heading: 'We build better living,\nworking and business spaces.',
    items: [
      { title: 'Residential Construction & Renovation' },
      { title: 'Commercial Fit-out' },
      { title: 'Custom Joinery' },
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
    heading: 'Building with care & precision.',
    headingAccent: 'care',
    description: 'A Melbourne builder bringing construction, interiors and joinery together under one team.',
    image: image('trustQuality', 'Construction team at work'),
  },
  prose: {
    eyebrow: 'Who We Are',
    heading: 'A builder, not a design studio',
    body: "We are first and foremost builders. From the ground up, we manage construction, coordinate trades, and deliver projects on time and on budget. Custom joinery is coordinated with the construction work, so cabinetry can be planned with the rest of the project.\n\nWhether you're planning a home renovation, a commercial fit-out, or custom joinery for your space, we bring the same level of care and professionalism to every project.",
  },
  trust: {
    variant: 'checklist' as const,
    eyebrow: 'Trust & Qualifications',
    heading: 'Qualified, insured,',
    headingAccent: 'ready to build',
    body: 'Zillion Home is a registered builder operating across Melbourne and surrounding areas. We maintain appropriate insurances and comply with all relevant building codes and regulations.\n\nCustom cabinetry is coordinated with the same care as our construction work, so the details stay consistent across the project.',
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
    heading: 'Homes, workplaces &',
    headingAccent: 'bespoke joinery.',
    description:
      'Three core services — residential construction and renovation, commercial fit-out, and custom joinery — delivered by one building team.',
    image: image('serviceInterior', 'Interior fit-out'),
  },
  details: {
    services: [
      {
        anchor: 'residential',
        title: 'Residential Construction & Renovation',
        subtitle: '',
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
        enquireLabel: 'View Related Project',
      },
      {
        anchor: 'commercial',
        title: 'Commercial Fit-out',
        subtitle: '',
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
        enquireLabel: 'View Related Project',
      },
      {
        anchor: 'joinery',
        title: 'Custom Joinery & Cabinetry',
        subtitle: '',
        description:
          'Made-to-order cabinetry tailored to each project, with flexibility in dimensions, layouts, materials and finishes, including 2PAC painted and laminate options. It suits standalone joinery projects and larger renovations.',
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
        enquireLabel: 'View Related Project',
      },
    ],
  },
  process: {
    variant: 'centered' as const,
    eyebrow: '',
    heading: 'A considered approach, from start to finish.',
    body: 'A successful build is about more than individual trades. We consider how construction, building services, interiors and custom joinery work together, helping to identify requirements early and keep every part of the project connected.',
    steps: ourProcessSteps,
  },
  joinery: {
    variant: 'darkCopy' as const,
    eyebrow: 'made for your space',
    heading: 'Made to order,',
    headingAccent: 'made for your space.',
    body: 'Every space is different. Our made-to-order cabinetry is tailored to each project, offering flexibility in dimensions, layouts, materials and finishes, including 2PAC painted and laminate options. From specifications to installation, we coordinate the details to suit both standalone joinery projects and larger renovations.\n\nGreat joinery starts long before installation. By considering construction and cabinetry together, we ensure the details are planned from the very beginning.',
    image: image('trustJoinery', 'Joinery workshop'),
    links: [{ label: 'Enquire about Custom Joinery →', href: '/enquiry', variant: 'enquiry' as const }],
  },
  cta: {
    tone: 'dark' as const,
    heading: 'Ready to discuss your project?',
    body: "Tell us about your requirements and we'll help you understand how we can bring your vision to life.",
    links: [enquiryLink],
  },
  metaTitle: 'Our Services',
  metaDescription:
    'Residential construction and renovation, commercial fit-out, and custom joinery. Melbourne builder for homes and businesses.',
}

export type NavSeedLink = { label: string; href: string; children?: { label: string; href: string }[] }

export const headerNav: { primary: NavSeedLink[]; secondary: NavSeedLink[] } = {
  primary: [
    { label: 'Home', href: '/' },
    {
      label: 'Our Services',
      href: '/services',
      children: [
        { label: 'Residential', href: '/services#residential' },
        { label: 'Commercial', href: '/services#commercial' },
        { label: 'Custom Joinery', href: '/services#joinery' },
      ],
    },
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
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Enquiry', href: '/enquiry' },
  ],
}
