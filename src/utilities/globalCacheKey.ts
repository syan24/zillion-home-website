/**
 * Key for a Payload global read through `unstable_cache`.
 *
 * Those entries have no TTL. On Vercel they survive the next deploy.
 * The demo seed writes header and footer with `disableRevalidate`, so
 * `revalidateTag('global_footer')` does not run, and a later seed that
 * finds the label already correct does not write the global at all.
 * The deployment id makes each deploy a cache miss and read Postgres
 * after `seed:demo:deploy`. Locale stays in the key so English and
 * Chinese do not share an entry. Admin saves still use the
 * `global_${slug}` tag for the current deployment.
 */
export function globalCacheKey(
  slug: string,
  depth: number,
  locale: string,
  deploymentId: string | null | undefined = process.env.VERCEL_DEPLOYMENT_ID,
): string[] {
  const scope = deploymentId?.trim() || 'local'
  return [slug, String(depth), locale, scope]
}
