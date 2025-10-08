import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function WindowsRedirect() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  redirect('/wardrobesandmore');
  return null;
}
