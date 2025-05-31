import { redirect } from 'next/navigation';

export default function WindowsRedirect() {
  redirect('/wardrobesandmore');
  return null;
}
