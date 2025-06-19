import { cookies } from 'next/headers';

export default function MinimalCookieRead() {
  const allCookies = cookies().getAll();
  return (
    <div>
      <h1>Minimal Server Cookies</h1>
      <pre>{JSON.stringify(allCookies, null, 2)}</pre>
    </div>
  );
} 