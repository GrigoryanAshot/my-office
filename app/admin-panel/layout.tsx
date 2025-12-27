export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Nested layouts should not include <html> or <body> tags
  // Only the root layout (app/layout.tsx) should have those
  return <>{children}</>
} 