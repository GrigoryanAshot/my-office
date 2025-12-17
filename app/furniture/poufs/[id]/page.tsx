import { redirect } from 'next/navigation';

export default async function Page({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = await paramsPromise;
  redirect(`/softfurniture/poufs/${params.id}`);
} 