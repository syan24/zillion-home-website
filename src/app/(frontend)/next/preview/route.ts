import configPromise from '@payload-config'
import { createLocalReq, getPayload } from 'payload'
import { getSafeRedirect } from 'payload/shared'
import { draftMode, cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { isSiteLocale, localeCookie } from '@/i18n/config'

export const dynamic = 'force-dynamic'

export async function GET(request: Request): Promise<Response> {
  const payload = await getPayload({ config: configPromise })
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')
  const previewSecret = searchParams.get('previewSecret')
  const locale = searchParams.get('locale')
  const expectedSecret = process.env.PREVIEW_SECRET

  if (!expectedSecret || previewSecret !== expectedSecret) {
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  if (!path) {
    return new Response('Insufficient search params', { status: 404 })
  }

  const safePath = getSafeRedirect({ fallbackTo: '', redirectTo: path })

  if (!safePath) {
    return new Response('This endpoint can only be used for relative previews', { status: 500 })
  }

  let user

  try {
    const req = await createLocalReq({}, payload)
    user = (
      await payload.auth({
        headers: request.headers,
        req,
      })
    ).user
  } catch (error) {
    payload.logger.error({ err: error }, 'Error verifying token for live preview')
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  const draft = await draftMode()

  if (!user) {
    draft.disable()
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  if (isSiteLocale(locale)) {
    const store = await cookies()
    store.set(localeCookie, locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })
  }

  draft.enable()
  redirect(safePath)
}
