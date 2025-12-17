import "bootstrap/dist/css/bootstrap.min.css";
import "@/public/css/all.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-toastify/dist/ReactToastify.css";
import "../public/css/style.css";
import { ToastContainer } from 'react-toastify';
import { Providers } from "@/redux/provider";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import AdminKeyPressWrapper from '@/component/AdminKeyPressWrapper';
import GlobalAdminShortcut from '@/component/GlobalAdminShortcut';
import PerformanceMonitor from '@/components/performance/PerformanceMonitor';
// import GlobalAdminShortcut from '@/component/GlobalAdminShortcut';

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap', // Show fallback font immediately, swap when loaded
  preload: true,
  variable: '--font-inter',
  // Optimize font loading
  adjustFontFallback: true,
  fallback: ['system-ui', 'arial'],
});

export const metadata = {
  metadataBase: new URL('https://www.my-office.am'),
  title: {
    default: 'Premium Office Furniture in Armenia | My Office',
    template: '%s | My Office Armenia'
  },
  description: {
    default: 'Discover high-quality office furniture in Armenia. Modern, ergonomic, and custom designs for your workspace. Free delivery across Yerevan and Armenia.',
    ar: 'Բացահայտեք բարձրորակ գրասենյակային կահույք Հայաստանում: Ժամանակակից, էրգոնոմիկ և անհատական դիզայն ձեր աշխատատեղի համար: Անվճար առաքում Երևանում և Հայաստանում:'
  },
  keywords: [
    'office furniture Armenia',
    'Armenian office furniture',
    'modern office furniture Yerevan',
    'ergonomic furniture Armenia',
    'custom office furniture Armenia',
    'workspace furniture Armenia',
    'office chairs Armenia',
    'կահույք Հայաստան',
    'գրասենյակային կահույք Երևան',
    'ժամանակակից կահույք',
    'էրգոնոմիկ կահույք',
    'անհատական կահույք'
  ],
  authors: [{ name: 'My Office' }],
  creator: 'My Office',
  publisher: 'My Office',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: ['en_US', 'hy_AM'],
    alternateLocale: ['hy_AM', 'en_US'],
    url: 'https://www.my-office.am',
    siteName: 'My Office Armenia',
    title: 'Premium Office Furniture in Armenia | My Office',
    description: 'Discover high-quality office furniture in Armenia. Modern, ergonomic, and custom designs for your workspace. Free delivery across Yerevan and Armenia.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'My Office Armenia Showroom'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium Office Furniture in Armenia | My Office',
    description: 'Discover high-quality office furniture in Armenia. Modern, ergonomic, and custom designs for your workspace.',
    images: ['/images/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
    yandex: 'your-yandex-verification',
  },
  alternates: {
    canonical: 'https://www.my-office.am',
    languages: {
      'en-US': 'https://www.my-office.am/en',
      'hy-AM': 'https://www.my-office.am/hy',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Font optimization - preconnect early for faster font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Load fonts with display=swap to prevent FOIT (Flash of Invisible Text) */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600;700;800;900&family=Rubik:wght@300;400;500;600;700;800;900&display=swap" 
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="alternate" hrefLang="en" href="https://www.my-office.am/en" />
        <link rel="alternate" hrefLang="hy" href="https://www.my-office.am/hy" />
        <link rel="alternate" hrefLang="x-default" href="https://www.my-office.am" />
      </head>
      <body className={inter.className}>
        <Providers>
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          }>
            <PerformanceMonitor />
            <AdminKeyPressWrapper />
            <GlobalAdminShortcut />
            {children}
          </Suspense>
          <ToastContainer 
            position="top-right" 
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Providers>
      </body> 
    </html>
  );
}
