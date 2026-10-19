import type { Metadata } from 'next'

import { LegalPage, legalMetadata } from '@/components/Legal/LegalPage'

export default function PrivacyPage() {
  return <LegalPage slug="privacy" />
}

export function generateMetadata(): Promise<Metadata> {
  return legalMetadata('privacy')
}
