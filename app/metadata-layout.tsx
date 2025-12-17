import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My-Office.am',
  description: 'My-Office.am - Office Furniture',
};

export default function MetadataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 