import {
  aboutContent,
  footerContent,
  headerNav,
  homeContent,
  servicesContent,
} from '@/content/marketing'
import { ourProcessStepsZh } from '@/content/processSteps'

const enquiryLink = {
  label: '开始咨询 →',
  href: '/enquiry',
  variant: 'enquiry' as const,
}

export const homeContentZh = {
  ...homeContent,
  hero: {
    ...homeContent.hero,
    eyebrow: '建筑与木作 · 墨尔本',
    headline: '从施工落地开始。',
    description: '住宅施工、翻新、商业装修与定制木作，由同一个团队完成，讲究精度和用心。',
    badgePrimary: '住宅',
    badgeSecondary: '商业',
    badgeMuted: '木作',
    links: [] as { label: string; href: string; variant: 'enquiry' }[],
  },
  serviceCards: {
    ...homeContent.serviceCards,
    eyebrow: '您的项目，您的起点',
    heading: '每个好项目，都从某处开始。',
    headingAccent: '都从某处开始。',
    body: '无论您已有详细图纸，还是只有一个想法，我们都会帮您迈出走向施工的下一步。',
    cards: [
      {
        ...homeContent.serviceCards.cards[0],
        image: { ...homeContent.serviceCards.cards[0].image, alt: '材料与木作饰面' },
        title: '从想法开始？',
        subtitle: '',
        description:
          '还没有图纸？我们可以一起探讨设计方向，整理可行做法，并协调推进建筑或木作项目所需的资料。',
      },
      {
        ...homeContent.serviceCards.cards[1],
        image: { ...homeContent.serviceCards.cards[1].image, alt: '图纸与施工方案' },
        title: '已经有图纸？',
        subtitle: '',
        description: '把图纸交给我们。我们可以审阅拟定的范围，讨论施工要求，并帮您安排把项目落地的下一步。',
      },
    ],
  },
  briefs: {
    ...homeContent.briefs,
    eyebrow: '住宅 / 商业 / 木作',
    heading: '不同的需求。',
    headingAccent: '同样的用心。',
    body: 'Zillion Home 是墨尔本建筑商，承接住宅施工与翻新、商业装修和定制木作。施工、室内与木作由同一团队完成，过程清楚，每个项目都跟到细节。',
    items: [
      { ...homeContent.briefs.items[0], title: '住宅', subtitle: '施工与翻新' },
      { ...homeContent.briefs.items[1], title: '商业', subtitle: '空间装修' },
      { ...homeContent.briefs.items[2], title: '定制木作', subtitle: '厨房、衣柜与橱柜' },
    ],
  },
  process: {
    ...homeContent.process,
    eyebrow: '',
    heading: '从开始到完成，都想在前面。',
    body: '一个顺利的项目，不只是各工种分开来做。我们会把施工、机电、室内和定制木作放在一起考虑，尽早把要求理清，让项目的每个部分保持衔接。',
    trustEyebrow: '为什么选择 Zillion Home',
    trustHeading: '始终把整体放在心里。',
    trustItems: [
      {
        title: '更宽的视角',
        description: '我们同时做施工、装修和定制木作，因此能把项目当作一个整体来看，而不只是单独的部分。',
      },
      {
        title: '提前规划',
        description: '了解不同阶段如何相互影响，我们就能为下一步做准备，并减少过程中不必要的调整。',
      },
      {
        title: '责任更清楚',
        description: '协调推进意味着沟通缺口更少、职责更明确，客户的体验也更直接。',
      },
    ],
    steps: ourProcessStepsZh,
  },
  categories: {
    eyebrow: '不止是空间',
    heading: '我们建造更好的居住、\n工作与商业空间。',
    items: [{ title: '住宅施工与翻新' }, { title: '商业装修' }, { title: '定制木作' }],
  },
  cta: {
    ...homeContent.cta,
    heading: '准备开始您的项目？',
    body: '告诉我们您的想法。我们会用扎实的施工、精确的木作和清楚的项目交付，帮您把它做出来。',
    links: [enquiryLink],
  },
  metaDescription: '住宅施工、翻新、商业装修与定制木作，以品质、精度和用心完成。',
}

export const aboutContentZh = {
  ...aboutContent,
  intro: {
    ...aboutContent.intro,
    eyebrow: '关于 Zillion Home',
    heading: '用心地',
    headingAccent: '把项目做准',
    description:
      'Zillion Home 是墨尔本建筑商，把施工、室内和木作放在同一个团队里。我们承接住宅与商业项目，过程清楚，细节跟到位。',
  },
  prose: {
    eyebrow: '我们是谁',
    heading: '建筑商，不是设计工作室',
    body: '我们首先是建筑商。从施工落地开始，我们管理施工、协调工种，并按时间和预算交付项目。定制木作与施工一起协调，橱柜可以和项目的其他部分一起计划。\n\n无论是住宅翻新、商业装修，还是空间里的定制木作，每个项目我们都用同样的用心和专业来做。',
  },
  trust: {
    ...aboutContent.trust,
    eyebrow: '资质与信任',
    heading: '持证、投保，',
    headingAccent: '可以开工',
    body: 'Zillion Home 是在墨尔本及周边执业的注册建筑商。我们持有相应保险，并遵守相关建筑规范。\n\n定制橱柜与施工用同样的用心来协调，细节在整个项目里保持一致。',
    items: [
      { title: '做工扎实', subtitle: '每个项目都讲究细节和精度，要能用得久。' },
      { title: '沟通清楚', subtitle: '项目过程中定期更新，步骤透明。' },
      { title: '做法实用', subtitle: '高效解决问题，同时不降低品质。' },
    ],
  },
  cta: {
    ...aboutContent.cta,
    heading: '一起把项目做出来',
    body: '准备开始了吗？联系我们，说说您的想法。我们会给出建议，并帮您迈出下一步。',
    links: [enquiryLink, { label: '查看服务', href: '/services', variant: 'outline' as const }],
  },
  metaTitle: '关于我们',
  metaDescription: '墨尔本建筑商，承接住宅施工、翻新、商业装修与定制木作，讲究品质、精度和用心。',
}

export const servicesContentZh = {
  ...servicesContent,
  intro: {
    ...servicesContent.intro,
    eyebrow: '我们的服务',
    heading: '住宅、商业与定制木作',
    headingAccent: '同一团队完成',
    description: '三项核心业务由同一个团队完成：住宅施工与翻新、商业装修和定制木作。',
  },
  details: {
    services: [
      {
        ...servicesContent.details.services[0],
        title: '住宅施工与翻新',
        subtitle: '',
        description: '从新建到整体翻新，我们用扎实的做工完成住宅项目。',
        features: ['新建住宅', '扩建与加建', '全屋翻新', '结构改造', '厨房与卫生间翻新', '户外生活空间'],
        enquireLabel: '查看相关项目',
      },
      {
        ...servicesContent.details.services[1],
        title: '商业空间装修',
        subtitle: '',
        description: '按业务需要完成商业空间。从办公室到零售店，做出好用、体面的环境。',
        features: ['办公室装修', '零售店铺', '餐饮空间', '医疗与保健场所', '仓库与工业空间', '租户改造'],
        enquireLabel: '查看相关项目',
      },
      {
        ...servicesContent.details.services[2],
        title: '定制木作',
        subtitle: '',
        description:
          '按每个项目定制的橱柜，尺寸、布局、材料和饰面都可以调整，包括 2PAC 烤漆和层压板。适合单独的木作项目，也适合更大的翻新。',
        features: ['定制厨房', '嵌入式衣柜', '浴室柜', '电视柜', '家庭办公柜', '定制家具'],
        enquireLabel: '查看相关项目',
      },
    ],
  },
  process: {
    ...servicesContent.process,
    eyebrow: '',
    heading: '从开始到完成，都想在前面。',
    body: '一个顺利的项目，不只是各工种分开来做。我们会把施工、机电、室内和定制木作放在一起考虑，尽早把要求理清，让项目的每个部分保持衔接。',
    steps: ourProcessStepsZh,
  },
  joinery: {
    ...servicesContent.joinery,
    eyebrow: '为您的空间而做',
    heading: '按订单制作，',
    headingAccent: '为您的空间而做。',
    body: '每个空间都不一样。我们的定制橱柜按项目来做，尺寸、布局、材料和饰面都可以调整，包括 2PAC 烤漆和层压板。从图纸到安装，我们会把细节协调好，既适合单独的木作项目，也适合更大的翻新。\n\n好的木作远在安装之前就开始了。把施工和橱柜放在一起考虑，细节从一开始就安排妥当。',
  },
  cta: {
    ...servicesContent.cta,
    heading: '准备谈谈您的项目？',
    body: '告诉我们需求，我们会说明可以如何把您的想法做出来。',
    links: [enquiryLink],
  },
  metaTitle: '我们的服务',
  metaDescription: '住宅施工与翻新、商业装修和定制木作。服务墨尔本住宅与企业的建筑商。',
}

export const headerNavZh = {
  primary: [
    { label: '首页', href: '/' },
    {
      label: '我们的服务',
      href: '/services',
      children: [
        { label: '住宅施工', href: '/services#residential' },
        { label: '商业装修', href: '/services#commercial' },
        { label: '定制木作', href: '/services#joinery' },
      ],
    },
  ],
  secondary: [
    { label: '项目', href: headerNav.secondary[0].href },
    { label: '关于我们', href: headerNav.secondary[1].href },
  ],
}

export const footerContentZh = {
  ...footerContent,
  blurb: '墨尔本建筑商，承接住宅施工与翻新、商业装修和定制木作。',
  tagline: '从施工落地开始。',
  location: '墨尔本，维多利亚州',
  services: [
    { label: '住宅施工与翻新', href: footerContent.services[0].href },
    { label: '商业装修', href: footerContent.services[1].href },
    { label: '定制木作', href: footerContent.services[2].href },
  ],
  company: [
    { label: '关于我们', href: footerContent.company[0].href },
    { label: '项目', href: footerContent.company[1].href },
    { label: '咨询', href: footerContent.company[2].href },
  ],
}
