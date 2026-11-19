export type NavLinkFields = {
  type?: 'reference' | 'custom' | null
  url?: string | null
  label?: string | null
  newTab?: boolean | null
  reference?: unknown
}

export type NavItemRecord = {
  id?: string | null
  link?: NavLinkFields | null
  children?: NavItemRecord[] | null
}

export const coreServiceHrefs = [
  '/services#residential',
  '/services#commercial',
  '/services#joinery',
] as const

export function navHref(item: NavItemRecord) {
  return item.link?.url?.trim() || ''
}

export function isInteriorHref(href: string | null | undefined) {
  return Boolean(href && href.includes('#interior'))
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

export function asNavItems(value: unknown): NavItemRecord[] {
  if (!Array.isArray(value)) return []
  return value.filter(isRecord).map((item) => {
    const link = isRecord(item.link) ? (item.link as NavLinkFields) : undefined
    return {
      id: typeof item.id === 'string' ? item.id : undefined,
      link,
      children: Array.isArray(item.children) ? asNavItems(item.children) : undefined,
    }
  })
}

function dropInterior(items: NavItemRecord[]): NavItemRecord[] {
  return items
    .filter((item) => !isInteriorHref(navHref(item)))
    .map((item) =>
      item.children?.length ? { ...item, children: dropInterior(item.children) } : item,
    )
}

function sameNav(left: NavItemRecord[], right: NavItemRecord[]) {
  return JSON.stringify(left) === JSON.stringify(right)
}

/**
 * Turns the old flat Residential / Commercial / Joinery / Interior row into
 * an Our Services dropdown. A menu that already has dropdown children, or
 * that does not contain all three core service links, is left in place
 * except for Interior Fit-out links.
 */
export function alignHeaderNav(items: NavItemRecord[] | null | undefined, locale: 'en' | 'zh') {
  const source = items || []
  const cleaned = dropInterior(source)
  if (cleaned.some((item) => item.children?.length)) {
    return { changed: !sameNav(source, cleaned), items: cleaned }
  }

  const services = coreServiceHrefs.map((href) => cleaned.find((item) => navHref(item) === href))
  if (services.some((item) => !item)) {
    return { changed: !sameNav(source, cleaned), items: cleaned }
  }

  const serviceHrefs = new Set<string>(coreServiceHrefs)
  const rest = cleaned.filter((item) => !serviceHrefs.has(navHref(item)))
  const parent: NavItemRecord = {
    link: {
      type: 'custom',
      url: '/services',
      label: locale === 'zh' ? '我们的服务' : 'Our Services',
      newTab: false,
    },
    children: services.map((item) => ({
      link: {
        type: item?.link?.type === 'reference' ? 'reference' : 'custom',
        url: item?.link?.url,
        label: item?.link?.label,
        newTab: item?.link?.newTab,
        reference: item?.link?.reference,
      },
    })),
  }
  const homeIndex = rest.findIndex((item) => navHref(item) === '/' || navHref(item) === '')
  const next = [...rest]
  next.splice(homeIndex >= 0 ? homeIndex + 1 : 0, 0, parent)
  return { changed: true, items: next }
}

export function withoutInteriorLinks<T extends { link?: { url?: string | null } | null }>(items: T[]) {
  const next = items.filter((item) => !isInteriorHref(item.link?.url))
  return { changed: next.length !== items.length, items: next }
}
