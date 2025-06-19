import { cookies } from 'next/headers';

export default function TestCookieRead() {
  const allCookies = cookies().getAll();
  return (
    <div>
      <h1>Server Cookies</h1>
      <pre>{JSON.stringify(allCookies, null, 2)}</pre>
    </div>
  );
} 