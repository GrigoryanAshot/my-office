import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "My-Office.am",
  description: "My-Office.am",
}

export default function LivingRoomLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 