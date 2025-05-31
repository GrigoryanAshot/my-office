
import FooterSection from '@/component/footer/FooterSection';
import NavbarSection from '@/component/navbar/NavbarSection';
import ScrollToTopButton from '@/component/utils/ScrollToTopButton';
import FurnitureGrid from "@/component/about/doorsMain"; 
import { furnitureData } from '@/component/Lists/doors/pvcDoors';
import { getActivity, getBlog, getCategory, getEvent, getFaq, getTestimonial, getWork } from '@/sanity/sanity.query';
import { ActivityType, BlogType, CategoryType, EventType, FaqType, TestimonialType, WorkType } from '@/types';
import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: "Ջերմ Օջախ Գրուպ",
  description: "Developed by Ashot Grigoryan",
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
      <FurnitureGrid furniture={furnitureData} />
      <FooterSection />
      <ScrollToTopButton style="" />
    </>
  );
}
