import { cookies } from 'next/headers';

export default async function TestCookieRead() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  return (
    <div>
      <h1>Server Cookies</h1>
      <pre>{JSON.stringify(allCookies, null, 2)}</pre>
    </div>
  );
} 