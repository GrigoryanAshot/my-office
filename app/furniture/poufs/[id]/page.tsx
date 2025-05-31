import { redirect } from 'next/navigation';

export default function Page({ params }: { params: { id: string } }) {
  redirect(`/softfurniture/poufs/${params.id}`);
  return null;
} 