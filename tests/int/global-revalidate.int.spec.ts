import { beforeEach, describe, expect, it, vi } from 'vitest'

const revalidateTag = vi.fn()

vi.mock('next/cache', () => ({
  revalidateTag: (...args: unknown[]) => revalidateTag(...args),
}))

import { revalidateFooter } from '@/Footer/hooks/revalidateFooter'
import { revalidateHeader } from '@/Header/hooks/revalidateHeader'

function payload() {
  return { logger: { info: vi.fn() } }
}

describe('header and footer cache tags', () => {
  beforeEach(() => {
    revalidateTag.mockClear()
  })

  it('invalidates the header tag when an editor saves', () => {
    revalidateHeader({
      doc: { id: 1 },
      req: { payload: payload(), context: {} },
    } as never)
    expect(revalidateTag).toHaveBeenCalledWith('global_header', 'max')
  })

  it('invalidates the footer tag when an editor saves', () => {
    revalidateFooter({
      doc: { id: 1 },
      req: { payload: payload(), context: {} },
    } as never)
    expect(revalidateTag).toHaveBeenCalledWith('global_footer', 'max')
  })

  it('does not invalidate when the seed writes with revalidation disabled', () => {
    revalidateHeader({
      doc: { id: 1 },
      req: { payload: payload(), context: { disableRevalidate: true } },
    } as never)
    revalidateFooter({
      doc: { id: 1 },
      req: { payload: payload(), context: { disableRevalidate: true } },
    } as never)
    expect(revalidateTag).not.toHaveBeenCalled()
  })
})
