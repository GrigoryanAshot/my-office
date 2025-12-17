import { Metadata } from 'next';
import HomePage from './home/page';

export const metadata: Metadata = {
  title: 'My-Office.am',
  description: 'My-Office.am - Office Furniture',
};

export default function Home() {
  return <HomePage />;
}
