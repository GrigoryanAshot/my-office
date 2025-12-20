import { Metadata } from 'next';
import { Suspense, lazy } from 'react';
import BannerSection from '@/component/banner/BannerSection';
import NavbarSection from '@/component/navbar/NavbarSection';
import MainCategoriesGrid from '@/component/categories/MainCategoriesGrid';

// Lazy load non-critical components for better initial page load
const FooterSection = lazy(() => import('@/component/footer/FooterSection'));
const ScrollToTopButton = lazy(() => import('@/component/utils/ScrollToTopButton'));
const HomePageSeoText = lazy(() => import('@/component/home/HomePageSeoText'));
const CallButton = lazy(() => import('@/component/utils/CallButton'));

// Metadata is now handled in app/page.tsx

// Loading fallback for banner
function BannerLoading() {
  return (
    <section className="tf__banner" style={{ marginTop: '-1px', paddingTop: '30px', minHeight: '400px' }}>
      <div className="container tf__banner-container">
        <div className="row">
          <div className="col-xl-7 col-lg-8">
            <div className="tf__banner_text" style={{ padding: '20px 0' }}>
              <p style={{ fontSize: 'clamp(1rem, 2.8vw, 1.2rem)', color: '#333', marginBottom: '15px' }}>
                բարձրորակ և հարմարավետ գրասենյակային կահույք
              </p>
              <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: '700', margin: '0 0 8px 0' }}>
                անվճար <span style={{ color: '#ff6b35' }}>չափագրում</span>
              </h1>
              <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: '700', margin: '0 0 8px 0' }}>
                անվճար <span style={{ color: '#ff6b35' }}>3D մոդելավորում</span>
              </h1>
              <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: '700', margin: '0 0 8px 0' }}>
                անվճար <span style={{ color: '#ff6b35' }}>տեղափոխում</span>
              </h1>
              <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: '700', margin: '0 0 15px 0' }}>
                անվճար <span style={{ color: '#ff6b35' }}>տեղադրում</span>
              </h1>
              <p style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)', color: '#666', marginBottom: '25px' }}>
                Պատվերներն իրականացվում են հաշված օրերի ընթացքում
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <NavbarSection style="" logo="images/logo.png" />
      <Suspense fallback={<BannerLoading />}>
        <BannerSection />
      </Suspense>
      <MainCategoriesGrid />
      <Suspense fallback={null}>
        <CallButton />
      </Suspense>
      <Suspense fallback={null}>
        <HomePageSeoText />
      </Suspense>
      <Suspense fallback={null}>
        <FooterSection />
      </Suspense>
      <Suspense fallback={null}>
        <ScrollToTopButton style="" />
      </Suspense>
    </>
  );
}