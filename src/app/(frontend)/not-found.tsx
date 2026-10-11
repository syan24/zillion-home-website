import Link from 'next/link'
import React from 'react'

import { Button } from '@/components/ui/button'
import { getLocale } from '@/i18n/getLocale'
import { getMessages } from '@/i18n/messages'

export default async function NotFound() {
  const copy = getMessages(await getLocale()).notFound

  return (
    <div className="container py-28">
      <div className="prose max-w-none">
        <h1 style={{ marginBottom: 0 }}>404</h1>
        <p className="mb-4">{copy.body}</p>
      </div>
      <Button asChild variant="default">
        <Link href="/">{copy.home}</Link>
      </Button>
    </div>
  )
}
