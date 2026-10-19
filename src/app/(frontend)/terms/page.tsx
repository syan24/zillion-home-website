import type { Metadata } from 'next'

import { LegalPage, legalMetadata } from '@/components/Legal/LegalPage'

export default function TermsPage() {
  return <LegalPage slug="terms" />
}

export function generateMetadata(): Promise<Metadata> {
  return legalMetadata('terms')
}
