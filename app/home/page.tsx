import { Metadata } from 'next';
import BannerSection from '@/component/banner/BannerSection';
import FooterSection from '@/component/footer/FooterSection';
import NavbarSection from '@/component/navbar/NavbarSection';
import ScrollToTopButton from '@/component/utils/ScrollToTopButton';
import MainCategoriesGrid from '@/component/categories/MainCategoriesGrid';

export const metadata: Metadata = {
  title: 'My-Office.am',
  description: 'My-Office.am - Office Furniture',
};

export default function HomePage() {
  return (
    <>
      <NavbarSection style="" logo="images/logo.png" />
      <BannerSection />
      <MainCategoriesGrid />
      <FooterSection />
      <ScrollToTopButton style="" />
    </>
  );
}