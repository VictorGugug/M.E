export function assetUrl(path: string): string {
  const base = (import.meta as unknown as { env: { BASE_URL: string } }).env.BASE_URL || "/"
  return `${base}${path.replace(/^\//, "")}`
}
