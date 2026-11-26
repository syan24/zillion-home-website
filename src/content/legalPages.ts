/**
 * First-version Privacy Policy and Terms of Service.
 * The wording is the client review copy. Admin edits on the Pages documents
 * are the public source of truth after seed. Do not add facts here that are
 * not already in this copy.
 */

export type LegalSlug = 'privacy' | 'terms'

export type LegalSection = {
  heading: string
  paragraphs: readonly string[]
}

export type LegalPageCopy = {
  title: string
  slug: LegalSlug
  metaTitle: string
  metaDescription: string
  eyebrow: string
  heading: string
  description: string
  sections: readonly LegalSection[]
}

export type LegalFallbackPage = {
  metaTitle: string
  metaDescription: string
  eyebrow: string
  heading: string
  intro: string
  sectionHeading: string
  body: string
}

const privacyEn: LegalPageCopy = {
  title: 'Privacy Policy',
  slug: 'privacy',
  metaTitle: 'Privacy Policy',
  metaDescription:
    'How Zillion Home collects and uses personal information when you use this website, submit an enquiry, or use site safety tools.',
  eyebrow: 'Legal',
  heading: 'Privacy Policy',
  description:
    'This policy explains how Zillion Home handles personal information when you use this website, enquire about a project, or use our site safety tools. Please read it together with our Terms of Service.',
  sections: [
    {
      heading: 'Last updated',
      paragraphs: [
        'This policy was last updated on 26 November 2026. We may change it from time to time. The current version will be published on this page.',
      ],
    },
    {
      heading: 'Who we are',
      paragraphs: [
        'Zillion Home is a Melbourne-based registered builder. We deliver residential construction and renovations, commercial fit-outs, and custom joinery, and we work across Melbourne and surrounding areas in Victoria, Australia.',
        'This policy is issued by Zillion Home. If you need our legal entity name, ABN, or a postal address, please ask us through the enquiry form on this website and we will provide them.',
      ],
    },
    {
      heading: 'What we collect',
      paragraphs: [
        'We collect the information you choose to give us, and some technical information that is created when you use the website.',
        'When you submit an enquiry, we may collect your name, mobile number, email address, project address or suburb, project type (residential construction and renovation, commercial fit-out, or custom joinery), scope of work, approximate budget, expected timeline, a description of your project, and any photos, drawings, or documents you upload (such as PDF, PNG, JPG, or DWG files). By submitting the form, you agree to this policy and consent to being contacted about your enquiry.',
        'If you are given access to a project\'s site safety pages, we may collect your name and mobile number, your trade or induction selections, acknowledgements that you have reviewed SWMS documents, sign-in and sign-out records, and any incident, hazard, or toolbox information you submit. We use this for work health and safety on the relevant site.',
        'If you contact us in another way, for example in person or by phone, we may keep the details you give us so we can respond and, if you become a client, plan and deliver the work.',
        'When you use the website, our hosting provider may record technical information in server logs, such as your IP address, browser and device type, the pages you view, and the date and time of your visit. We also store a language-preference cookie so the site can show English or Chinese, and we may use essential cookies or on-device storage (for example to keep an enquiry in progress in your browser). We do not currently use a separate third-party advertising or analytics tracker on this website. If that changes, we will update this policy.',
      ],
    },
    {
      heading: 'Why we collect it',
      paragraphs: [
        'We use personal information to respond to enquiries and discuss your project; to prepare quotes and, if you engage us, to deliver residential, commercial, or joinery work; to meet legal, insurance, and work health and safety obligations; to operate, secure, and improve the website; and to show the site in your preferred language.',
        'We do not sell your personal information.',
      ],
    },
    {
      heading: 'How we share it',
      paragraphs: [
        'We may share personal information with our staff and contractors who need it to respond or to deliver the work; with service providers who host the website, store files, or send email on our behalf; with professional advisers and insurers; and with regulators or law enforcement where the law requires it, or with another party if you ask us to.',
        'Uploaded enquiry files may be stored with our hosting provider so our team can review them.',
      ],
    },
    {
      heading: 'Overseas disclosure',
      paragraphs: [
        'This website and some file storage are provided by third-party hosts that may store or process information outside Australia, including in the United States. By using the site or submitting an enquiry, you understand that your information may be disclosed overseas in this way.',
      ],
    },
    {
      heading: 'Retention and security',
      paragraphs: [
        'We keep enquiry, project, and site safety records for as long as we need them to respond, deliver any work, meet legal, insurance, or safety obligations, and resolve disputes. We then delete or de-identify the information when we no longer need it, unless the law requires us to keep it.',
        'We take reasonable steps to protect personal information, but no website or file transfer is completely secure. Please avoid sending information you do not need to include.',
      ],
    },
    {
      heading: 'Your rights and how to contact us',
      paragraphs: [
        'You may ask us to access or correct the personal information we hold about you, or to discuss how we handle it, through the enquiry form on this website. We will respond as required by applicable Australian privacy law.',
        'If you are not satisfied with how we have handled your information, you may contact the Office of the Australian Information Commissioner at https://www.oaic.gov.au.',
      ],
    },
    {
      heading: 'Cookies',
      paragraphs: [
        'We use a language-preference cookie and may use essential cookies or on-device storage needed for the site to work. You can control cookies in your browser. Turning them off may affect language preference or form progress.',
      ],
    },
  ],
}

const termsEn: LegalPageCopy = {
  title: 'Terms of Service',
  slug: 'terms',
  metaTitle: 'Terms of Service',
  metaDescription:
    'Terms for using the Zillion Home website. Project work is agreed separately in a written quote or contract.',
  eyebrow: 'Legal',
  heading: 'Terms of Service',
  description:
    'These terms apply to your use of the Zillion Home website. They do not, by themselves, create a contract for building, renovation, fit-out, or joinery work.',
  sections: [
    {
      heading: 'Last updated',
      paragraphs: [
        'These terms were last updated on 26 November 2026. We may update them by publishing a new version on this page. If you continue to use the website after a change, you accept the updated terms.',
      ],
    },
    {
      heading: 'Who we are',
      paragraphs: [
        'Zillion Home is a Melbourne-based registered builder offering residential construction and renovation, commercial fit-out, and custom joinery in Melbourne and surrounding areas in Victoria, Australia.',
        'If you need our legal entity name, ABN, or a postal address, please ask us through the enquiry form on this website.',
      ],
    },
    {
      heading: 'Using the website',
      paragraphs: [
        'You may browse this website for information about our company, projects, and services. You must not misuse the site, attempt to access areas you have not been invited to use (including site safety pages), upload unlawful or harmful content, or interfere with the site\'s operation.',
      ],
    },
    {
      heading: 'Information on the site',
      paragraphs: [
        'Project photos, descriptions, and service information are for general information only. They are examples of our work and are not a specification, guarantee, or offer for a particular project. We may update the site without notice and do not warrant that all information is complete or current.',
      ],
    },
    {
      heading: 'Enquiries',
      paragraphs: [
        'Submitting an enquiry is a request for us to contact you. It does not reserve a start date, fix a price, or form a construction or joinery contract. We will use the details you provide to respond and discuss next steps.',
        'You must make sure the information and files you submit are accurate, and that you have the right to share them with us.',
      ],
    },
    {
      heading: 'Project work',
      paragraphs: [
        'Residential construction and renovation, commercial fit-out, and custom joinery are provided only under a separate written agreement, which will set out scope, price, programme, variations, and other conditions. Until that agreement is in place, we are not obliged to start or complete any works.',
      ],
    },
    {
      heading: 'Site safety tools',
      paragraphs: [
        'Some pages on this website, including SWMS and related site safety tools, are for authorised site workers and project teams. Access is by a project link or token we provide. Those pages are not a public service. If you use them, you must provide accurate identity details, follow the instructions on the page, and only use the access you have been given.',
      ],
    },
    {
      heading: 'Intellectual property',
      paragraphs: [
        'The website design, text, and images are owned by Zillion Home or used with permission. You may not copy, reproduce, or use them for commercial purposes without our written consent, except for ordinary browsing or sharing a page link.',
        'Files you upload in an enquiry remain your material. You give us permission to use them to review your enquiry and, if you engage us, to plan and deliver the work.',
      ],
    },
    {
      heading: 'Liability',
      paragraphs: [
        'To the extent permitted by the Australian Consumer Law and other applicable law, we are not liable for loss arising merely from your use of, or inability to use, the website, or from reliance on general information published on it. Nothing in these terms limits any rights you cannot exclude under the Australian Consumer Law.',
      ],
    },
    {
      heading: 'Governing law',
      paragraphs: [
        'These terms are governed by the laws of Victoria, Australia. The courts of Victoria have non-exclusive jurisdiction over disputes about these terms or your use of the website.',
      ],
    },
    {
      heading: 'Contact',
      paragraphs: ['Questions about these terms can be sent through the enquiry form on this website.'],
    },
  ],
}

const privacyZh: LegalPageCopy = {
  title: '隐私政策',
  slug: 'privacy',
  metaTitle: '隐私政策',
  metaDescription:
    'Zillion Home 如何在您使用本网站、提交项目咨询或使用工地安全工具时收集和使用个人信息。',
  eyebrow: '法律信息',
  heading: '隐私政策',
  description:
    '本政策说明 Zillion Home 在您使用本网站、咨询项目或使用工地安全工具时如何处理个人信息。请一并阅读我们的服务条款。',
  sections: [
    {
      heading: '更新日期',
      paragraphs: ['本政策最近更新日期为 2026年11月26日。我们可能会不时修订本政策，现行版本将发布在本页面。'],
    },
    {
      heading: '我们是谁',
      paragraphs: [
        'Zillion Home 是一家位于墨尔本的注册建筑商，提供住宅施工与翻新、商业装修和定制木作，服务范围覆盖墨尔本及周边地区（澳大利亚维多利亚州）。',
        '本政策由 Zillion Home 发布。如需我们的法律实体名称、ABN 或通讯地址，请通过本网站的咨询表单向我们询问，我们会提供相关信息。',
      ],
    },
    {
      heading: '我们收集哪些信息',
      paragraphs: [
        '我们会收集您主动提供的信息，以及您使用网站时产生的部分技术信息。',
        '当您提交项目咨询时，我们可能收集：姓名、手机号码、电子邮箱、项目地址或郊区、项目类型（住宅施工与翻新、商业装修或定制木作）、工程范围、大致预算、预期时间、项目说明，以及您上传的照片、图纸或文件（例如 PDF、PNG、JPG 或 DWG）。提交表单即表示您同意本政策，并同意我们就该咨询与您联系。',
        '如果您获准使用某个项目的工地安全页面，我们可能收集您的姓名和手机号码、工种或入场培训选项、您已审阅 SWMS 文件的确认记录、签到和签退记录，以及您提交的事故、隐患或工具箱会议信息。这些信息用于相关工地的工作健康与安全。',
        '如果您通过其他方式联系我们（例如当面或电话），我们可能保存您提供的信息，以便回复，并在您成为客户后用于项目规划与实施。',
        '当您使用本网站时，网站托管服务商可能在服务器日志中记录技术信息，例如 IP 地址、浏览器和设备类型、浏览的页面以及访问时间。我们还会保存语言偏好 cookie，以便网站显示英文或中文，并可能使用网站运行所需的必要 cookie 或设备本地存储（例如在您的浏览器中保存未完成的咨询）。我们目前未在本网站使用单独的第三方广告或分析跟踪工具。如情况有变，我们会更新本政策。',
      ],
    },
    {
      heading: '我们为何收集这些信息',
      paragraphs: [
        '我们使用个人信息是为了：回复咨询并讨论您的项目；准备报价，并在您委托我们后交付住宅、商业或木作工程；履行法律、保险以及工作健康与安全义务；运营、保护和改进网站；以及按您的语言偏好显示网站。',
        '我们不会出售您的个人信息。',
      ],
    },
    {
      heading: '我们如何共享信息',
      paragraphs: [
        '我们可能将个人信息提供给：需要这些信息以便回复或实施工程的员工和承包商；负责托管网站、存储文件或代为发送邮件的服务提供商；专业顾问和保险公司；以及法律要求时的监管机构或执法部门，或在您要求时提供给其他方。',
        '您在咨询中上传的文件可能存储在我们的托管服务商处，以便团队审阅。',
      ],
    },
    {
      heading: '境外披露',
      paragraphs: [
        '本网站及部分文件存储由第三方托管服务商提供，这些服务商可能在澳大利亚境外（包括美国）存储或处理信息。使用本网站或提交咨询，即表示您理解您的信息可能以此方式被披露至境外。',
      ],
    },
    {
      heading: '保存期限与安全',
      paragraphs: [
        '我们会在为回复咨询、实施工程、履行法律、保险或安全义务以及处理争议所需要的期限内，保存咨询、项目和工地安全记录。此后，除非法律要求继续保存，我们会在不再需要时删除或去标识化相关信息。',
        '我们会采取合理措施保护个人信息，但任何网站或文件传输都无法保证绝对安全。请避免发送您不必提供的信息。',
      ],
    },
    {
      heading: '您的权利与联系方式',
      paragraphs: [
        '您可以通过本网站的咨询表单，要求查阅或更正我们持有的关于您的个人信息，或与我们讨论信息处理方式。我们将根据适用的澳大利亚隐私法律作出回应。',
        '如果您对我们处理个人信息的方式不满意，可以向澳大利亚信息专员办公室（OAIC）投诉：https://www.oaic.gov.au。',
      ],
    },
    {
      heading: 'Cookie',
      paragraphs: [
        '我们使用语言偏好 cookie，并可能使用网站运行所需的必要 cookie 或设备本地存储。您可以在浏览器中管理 cookie。关闭 cookie 可能影响语言偏好或表单进度。',
      ],
    },
  ],
}

const termsZh: LegalPageCopy = {
  title: '服务条款',
  slug: 'terms',
  metaTitle: '服务条款',
  metaDescription: '使用 Zillion Home 网站的条款。具体工程项目将另行以书面报价或合同约定。',
  eyebrow: '法律信息',
  heading: '服务条款',
  description: '本条款适用于您对本网站的使用。本条款本身并不构成建筑、翻新、装修或木作工程合同。',
  sections: [
    {
      heading: '更新日期',
      paragraphs: [
        '本条款最近更新日期为 2026年11月26日。我们可能通过在本页面发布新版本来更新条款。若您在条款更新后继续使用本网站，即表示您接受更新后的条款。',
      ],
    },
    {
      heading: '我们是谁',
      paragraphs: [
        'Zillion Home 是一家位于墨尔本的注册建筑商，在墨尔本及周边地区（澳大利亚维多利亚州）提供住宅施工与翻新、商业装修和定制木作。',
        '如需我们的法律实体名称、ABN 或通讯地址，请通过本网站的咨询表单向我们询问。',
      ],
    },
    {
      heading: '使用本网站',
      paragraphs: [
        '您可以浏览本网站，了解我们的公司、项目和服务信息。您不得滥用本网站，不得试图进入未经授权的区域（包括工地安全页面），不得上传违法或有害内容，也不得干扰网站运行。',
      ],
    },
    {
      heading: '网站上的信息',
      paragraphs: [
        '项目照片、说明和服务介绍仅供一般参考，属于我们过往或示例工程，并不构成针对特定项目的规格、保证或要约。我们可能不经通知更新网站内容，也不保证所有信息完整或最新。',
      ],
    },
    {
      heading: '项目咨询',
      paragraphs: [
        '提交咨询是请我们与您联系，并不预订开工日期、锁定价格，也不构成施工或木作合同。我们将使用您提供的信息回复并讨论后续步骤。',
        '您须确保提交的信息和文件准确，并且您有权与我们分享这些材料。',
      ],
    },
    {
      heading: '工程项目',
      paragraphs: [
        '住宅施工与翻新、商业装修和定制木作仅在另行签署的书面协议下提供。该协议将约定范围、价格、工期、变更及其他条件。在该协议订立之前，我们没有义务开始或完成任何工程。',
      ],
    },
    {
      heading: '工地安全工具',
      paragraphs: [
        '本网站的部分页面（包括 SWMS 及相关工地安全工具）仅供获授权的现场工人和项目团队使用，需通过我们提供的项目链接或令牌访问。这些页面不是对公众开放的服务。如您使用这些页面，必须提供准确的身份信息，遵守页面上的指示，并且只使用已获准的访问权限。',
      ],
    },
    {
      heading: '知识产权',
      paragraphs: [
        '本网站的设计、文字和图片由 Zillion Home 所有，或经许可使用。除正常浏览或分享页面链接外，未经我们书面同意，不得为商业目的复制、转载或使用这些内容。',
        '您在咨询中上传的文件仍归您所有。您授权我们使用这些文件审阅您的咨询，并在您委托我们后用于项目规划与实施。',
      ],
    },
    {
      heading: '责任',
      paragraphs: [
        '在澳大利亚消费者法及其他适用法律允许的范围内，我们不对仅因您使用或无法使用本网站，或依赖网站上一般信息而产生的损失承担责任。本条款不影响您根据澳大利亚消费者法不可排除的任何权利。',
      ],
    },
    {
      heading: '适用法律',
      paragraphs: [
        '本条款受澳大利亚维多利亚州法律管辖。与本条款或您使用本网站有关的争议，维多利亚州法院拥有非排他管辖权。',
      ],
    },
    {
      heading: '联系我们',
      paragraphs: ['如对本条款有疑问，请通过本网站的咨询表单与我们联系。'],
    },
  ],
}

const legalPages = {
  en: { privacy: privacyEn, terms: termsEn },
  zh: { privacy: privacyZh, terms: termsZh },
} as const

export function legalPageCopy(locale: 'en' | 'zh') {
  return legalPages[locale]
}

export function pageLayoutIsEmpty(layout: unknown) {
  return !Array.isArray(layout) || layout.length === 0
}

export function legalPageDocument(copy: LegalPageCopy) {
  return {
    title: copy.title,
    slug: copy.slug,
    generateSlug: false as const,
    _status: 'published' as const,
    hero: { type: 'none' as const },
    layout: [
      {
        blockType: 'pageIntro' as const,
        layout: 'text' as const,
        eyebrow: copy.eyebrow,
        heading: copy.heading,
        description: copy.description,
      },
      ...copy.sections.map((section) => ({
        blockType: 'proseSection' as const,
        heading: section.heading,
        body: section.paragraphs.join('\n\n'),
      })),
    ],
    meta: {
      title: copy.metaTitle,
      description: copy.metaDescription,
    },
  }
}

export function legalPageDefinitions(locale: 'en' | 'zh') {
  const copy = legalPageCopy(locale)
  return (['privacy', 'terms'] as const).map((slug) => ({
    slug,
    data: legalPageDocument(copy[slug]),
  }))
}

function fallbackBody(sections: readonly LegalSection[]) {
  return sections
    .map((section, index) => {
      const text = section.paragraphs.join('\n\n')
      return index === 0 ? text : `${section.heading}\n\n${text}`
    })
    .join('\n\n')
}

function toFallback(copy: LegalPageCopy): LegalFallbackPage {
  return {
    metaTitle: copy.metaTitle,
    metaDescription: copy.metaDescription,
    eyebrow: copy.eyebrow,
    heading: copy.heading,
    intro: copy.description,
    sectionHeading: copy.sections[0]?.heading || copy.heading,
    body: fallbackBody(copy.sections),
  }
}

export function legalFallbackCopy(locale: 'en' | 'zh'): {
  privacy: LegalFallbackPage
  terms: LegalFallbackPage
} {
  const copy = legalPageCopy(locale)
  return {
    privacy: toFallback(copy.privacy),
    terms: toFallback(copy.terms),
  }
}
