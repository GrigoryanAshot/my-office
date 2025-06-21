import { cookies } from 'next/headers';

export default async function MinimalCookieRead() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  return (
    <div>
      <h1>Minimal Server Cookies</h1>
      <pre>{JSON.stringify(allCookies, null, 2)}</pre>
    </div>
  );
} 