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
    eyebrow: '我们的服务',
    heading: '四项核心能力',
    cards: [
      {
        ...homeContent.serviceCards.cards[0],
        title: '住宅施工与翻新',
        subtitle: '',
        description: '面向住宅的新建、扩建、翻新与改造。',
      },
      {
        ...homeContent.serviceCards.cards[1],
        title: '商业空间装修',
        subtitle: '',
        description: '办公、零售、餐饮及其他商业空间装修。',
      },
      {
        ...homeContent.serviceCards.cards[2],
        title: '定制橱柜与木作',
        subtitle: '',
        description: '厨房、衣柜、浴室柜、电视柜与定制家具。',
      },
      {
        ...homeContent.serviceCards.cards[3],
        title: '室内装修与项目交付',
        subtitle: '',
        description: '从设计协调到最终交付的完整室内工程。',
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
      { ...homeContent.briefs.items[3], title: '室内交付', subtitle: '完整项目交付' },
    ],
  },
  process: {
    ...homeContent.process,
    eyebrow: '我们的方式',
    heading: '每个阶段都清楚。',
    body: '从初次沟通到最终交付，我们协调施工、室内装修与定制木作，把项目管清楚，给出实用做法，并保证做工品质。',
    trustItems: [
      {
        ...homeContent.process.trustItems[0],
        title: '持证并投保',
        description: '注册建筑商，并持有相应保险',
      },
      {
        ...homeContent.process.trustItems[1],
        title: '自有木作能力',
        description: '定制厨房、衣柜、浴室柜等',
      },
      {
        ...homeContent.process.trustItems[2],
        title: '品质与用心',
        description: '实用方案，专业交付',
      },
    ],
    steps: ourProcessStepsZh,
  },
  categories: {
    eyebrow: '不止是空间',
    heading: '我们建造更好的居住、\n工作与商业空间。',
    items: [
      { title: '住宅施工' },
      { title: '翻新' },
      { title: '商业装修' },
      { title: '定制木作' },
      { title: '室内装修与交付' },
    ],
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
    body: '我们首先是建筑商。从施工落地开始，我们管理施工、协调工种，并按时间和预算交付项目。自有木作能力让我们可以从结构工程做到最细的橱柜，都在同一屋檐下完成。\n\n无论是住宅翻新、商业装修，还是空间里的定制木作，每个项目我们都用同样的用心和专业来做。',
  },
  capabilities: {
    eyebrow: '我们做什么',
    heading: '我们的能力',
    items: [
      {
        title: '住宅施工与翻新',
        description: '墨尔本住宅的新建、扩建、翻新与改造。',
      },
      {
        title: '商业空间装修',
        description: '为您的业务定制办公、零售、餐饮与商业空间。',
      },
      {
        title: '定制橱柜与木作',
        description: '厨房、衣柜、浴室柜与定制家具，车间内完成。',
      },
      {
        title: '室内装修与项目交付',
        description: '从设计协调到最终交付的完整室内工程。',
      },
    ],
  },
  trust: {
    ...aboutContent.trust,
    eyebrow: '资质与信任',
    heading: '持证、投保，',
    headingAccent: '可以开工',
    body: 'Zillion Home 是在墨尔本及周边执业的注册建筑商。我们持有相应保险，并遵守相关建筑规范。\n\n自有木作车间让定制橱柜与施工使用同一套品质控制，不外包，也少意外。',
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
    description: '四项核心能力在同一屋檐下。从地基施工到精确橱柜，为住宅和企业提供完整的建造方案。',
  },
  details: {
    services: [
      {
        ...servicesContent.details.services[0],
        title: '住宅施工与翻新',
        subtitle: '',
        description: '从新建到整体翻新，我们用扎实的做工完成住宅项目。',
        features: ['新建住宅', '扩建与加建', '全屋翻新', '结构改造', '厨房与卫生间翻新', '户外生活空间'],
        enquireLabel: '咨询住宅项目',
      },
      {
        ...servicesContent.details.services[1],
        title: '商业空间装修',
        subtitle: '',
        description: '按业务需要完成商业空间。从办公室到零售店，做出好用、体面的环境。',
        features: ['办公室装修', '零售店铺', '餐饮空间', '医疗与保健场所', '仓库与工业空间', '租户改造'],
        enquireLabel: '咨询商业项目',
      },
      {
        ...servicesContent.details.services[2],
        title: '定制橱柜与木作',
        subtitle: '',
        description: '在我们的车间完成定制木作。可以单独做，也可以作为更大项目的一部分，按您的空间来做。',
        features: ['定制厨房', '嵌入式衣柜', '浴室柜', '电视柜', '家庭办公柜', '定制家具'],
        enquireLabel: '咨询定制木作',
      },
      {
        ...servicesContent.details.services[3],
        title: '室内装修与项目交付',
        subtitle: '',
        description: '从设计协调到最终交付的完整室内工程。我们管理整个过程，您可以专注于想要的结果。',
        features: ['设计协调', '项目管理', '工种协调', '品质检查', '进度管理', '交付与资料'],
        enquireLabel: '咨询室内项目',
      },
    ],
  },
  process: {
    ...servicesContent.process,
    eyebrow: '我们如何工作',
    heading: '我们的流程',
    steps: ourProcessStepsZh,
  },
  joinery: {
    ...servicesContent.joinery,
    eyebrow: '自有能力',
    heading: '定制木作，',
    headingAccent: '车间内完成',
    body: '我们的木作车间用与施工相同的品质控制来做定制橱柜。无论是单独的厨房，还是整屋翻新中的木作，都按您的要求制作。\n\n这意味着协调更好、品质一致，整个项目只有一个负责方。',
    links: [{ label: '咨询定制木作 →', href: '/enquiry', variant: 'enquiry' as const }],
  },
  cta: {
    ...servicesContent.cta,
    heading: '准备谈谈您的项目？',
    body: '告诉我们需求，我们会说明可以如何把您的想法做出来。',
    links: [enquiryLink],
  },
  metaTitle: '我们的服务',
  metaDescription: '住宅施工、商业装修、定制木作与室内项目交付。服务墨尔本住宅与企业的建筑商。',
}

export const headerNavZh = {
  primary: [
    { label: '首页', href: headerNav.primary[0].href },
    { label: '住宅施工', href: headerNav.primary[1].href },
    { label: '商业装修', href: headerNav.primary[2].href },
    { label: '定制木作', href: headerNav.primary[3].href },
    { label: '室内交付', href: headerNav.primary[4].href },
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
    { label: '住宅施工', href: footerContent.services[0].href },
    { label: '商业装修', href: footerContent.services[1].href },
    { label: '定制木作', href: footerContent.services[2].href },
    { label: '室内交付', href: footerContent.services[3].href },
  ],
  company: [
    { label: '关于我们', href: footerContent.company[0].href },
    { label: '项目', href: footerContent.company[1].href },
    { label: '咨询', href: footerContent.company[2].href },
  ],
}
