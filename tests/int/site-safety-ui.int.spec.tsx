import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'

import { SiteSafetyMenu } from '@/components/SWMS/SiteSafetyMenu'
import { readWorkerIdentity, writeWorkerIdentity } from '@/lib/swms/workerSession'
import { SwmsReviewDialog } from '@/components/SWMS/SwmsReviewDialog'
import type { WorkerSWMS } from '@/lib/swms/loadWorkerSWMS'
import { SITE_SAFETY_MENU } from '@/lib/swms/siteSafety'

const swms: WorkerSWMS = {
  token: 'project-token-0123456789abcd',
  title: 'Construction Works SWMS',
  projectName: 'Rosebery Residence',
  projectNameZh: '',
  projectAddress: '12 Smith Street, Rosebery NSW 2018',
  versionId: 1,
  versionLabel: 'v1.0',
  sections: [],
  acknowledgementText: 'I agree',
  enabledTrades: ['electrical-mechanical'],
  documents: [],
}

describe('worker identity snapshot', () => {
  it('returns the same object until the stored name or phone changes', () => {
    writeWorkerIdentity('stable-token', { name: 'Browser Worker', phone: '0499 111 222' })
    const first = readWorkerIdentity('stable-token')
    const second = readWorkerIdentity('stable-token')
    expect(second).toBe(first)
    writeWorkerIdentity('stable-token', { name: 'Browser Worker', phone: '0499 111 223' })
    expect(readWorkerIdentity('stable-token')).not.toBe(first)
  })
})

describe('site safety menu landing', () => {
  it('shows the project and the six menu items after a QR landing', () => {
    render(<SiteSafetyMenu swms={swms} />)
    expect(screen.getByRole('heading', { name: 'Rosebery Residence' })).toBeTruthy()
    expect(screen.getByText('12 Smith Street, Rosebery NSW 2018')).toBeTruthy()
    for (const item of SITE_SAFETY_MENU) {
      const link = screen.getByRole('link', { name: new RegExp(item.en) })
      expect(link.getAttribute('href')).toBe(`/swms/${swms.token}/${item.slug}`)
    }
  })
})

describe('SWMS scroll-to-bottom confirm', () => {
  it('shows the acknowledgement only after the last page is scrolled into view', () => {
    const onConfirm = vi.fn()
    render(
      <SwmsReviewDialog
        title="SWMS - Working at heights"
        mode="confirm"
        previewPages={[
          { id: '1', label: 'Page 1', height: 800 },
          { id: '2', label: 'Last page', height: 800 },
        ]}
        onClose={() => undefined}
        onConfirm={onConfirm}
      />,
    )

    expect(screen.queryByRole('checkbox')).toBeNull()
    const confirm = screen.getByRole('button', { name: /Confirm & Close/ })
    expect(confirm).toHaveProperty('disabled', true)

    const scroller = screen.getByTestId('swms-pdf-scroll')
    Object.defineProperty(scroller, 'clientHeight', { configurable: true, value: 400 })
    Object.defineProperty(scroller, 'scrollHeight', { configurable: true, value: 1600 })
    scroller.scrollTop = 0
    fireEvent.scroll(scroller)
    expect(screen.queryByRole('checkbox')).toBeNull()

    scroller.scrollTop = 1200
    fireEvent.scroll(scroller)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeTruthy()
    fireEvent.click(checkbox)
    fireEvent.click(screen.getByRole('button', { name: /Confirm & Close/ }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })
})
