import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Header as HeaderType } from '@/payload-types'
import { getLocale } from '@/i18n/getLocale'

const defaultHeaderData: HeaderType = {
  id: 0,
  navItems: [],
  updatedAt: '',
  createdAt: '',
}

export async function Header() {
  const locale = await getLocale()
  const headerData = await getCachedGlobal('header', 1, locale)()

  return <HeaderClient data={headerData ?? defaultHeaderData} locale={locale} />
}
