export function adminEmail (): string {
  const email = process.env.ADMIN_EMAIL

  if (!email) {
    throw new Error('ADMIN_EMAIL is not set')
  }

  return email
}
