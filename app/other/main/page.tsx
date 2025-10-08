import FooterSection from '@/component/footer/FooterSection';
import NavbarSection from '@/component/navbar/NavbarSection';
import ScrollToTopButton from '@/component/utils/ScrollToTopButton';
import SaleSlider from '@/component/slider/SaleSlider';
import { getActivity, getBlog, getCategory, getEvent, getFaq, getTestimonial, getWork } from '@/sanity/sanity.query';
import { ActivityType, BlogType, CategoryType, EventType, FaqType, TestimonialType, WorkType } from '@/types';
import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: "My-Office.am",
  description: "My-Office.am - Office Furniture",
}
export default async function Home() {
  const faqData: FaqType[] = await getFaq();
  const blogData: BlogType[] = await getBlog();
  const categoryData: CategoryType[] = await getCategory();
  const eventData: EventType[] = await getEvent();
  const workData: WorkType[] = await getWork();
  const testimonialData: TestimonialType[] = await getTestimonial();
  const activityData: ActivityType[] = await getActivity();
  return (
    <>
      <NavbarSection style="" logo="/images/logo.png" />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 40, marginBottom: 40 }}>
        <SaleSlider />
      </div>
      <FooterSection />
      <ScrollToTopButton style="" />
    </>
  );
}
