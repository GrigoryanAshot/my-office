"use client";
import Link from 'next/link';
import styles from '@/component/about/FurnitureGrid.module.css';
import NavbarSection from '@/component/navbar/NavbarSection';
import FooterSection from '@/component/footer/FooterSection';
import ScrollToTopButton from '@/component/utils/ScrollToTopButton';

interface FurnitureItem {
  id: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  images: string[];
  type: string;
  url: string;
  isAvailable: boolean;
}

const categories = [
  {
    id: 'windows_wardrobes',
    name: 'Պահարաններ',
    url: '/wardrobesandmore/wardrobes',
    imageUrl: 'https://res.cloudinary.com/dpbsyoxw8/image/upload/v1747646123/furniture/dinoc8tezhdvvppfihgm.png',
  },
  {
    id: 'windows_shelving',
    name: 'Դարակաշարեր',
    url: '/wardrobesandmore/shelving',
    imageUrl: 'https://res.cloudinary.com/dpbsyoxw8/image/upload/v1747646136/furniture/ajbs1jxmjrtuuqje7uka.jpg',
  },
  {
    id: 'windows_chests',
    name: 'Տումբաներ և Կոմոդներ',
    url: '/wardrobesandmore/chests',
    imageUrl: 'https://res.cloudinary.com/dpbsyoxw8/image/upload/v1747646145/furniture/os0fc92gchpddfet5cs1.jpg',
  },
  {
    id: 'windows_windows_takhtir',
    name: 'Տակդիրներ',
    url: '/wardrobesandmore/stands',
    imageUrl: 'https://res.cloudinary.com/dpbsyoxw8/image/upload/v1748443026/furniture/olk3h3frhd0juyf1jxtg.jpg',
  },
];

export default function WardrobesAndMorePage() {
  return (
    <>
      <NavbarSection style="" logo="images/logo.png" />
      <div className={styles.categoryTitle}>Պահարաններ և ավելին</div>
      <section className={styles.mainContainer}>
        <div className={styles.mainCategoriesGrid} style={{ justifyContent: 'center' }}>
          {categories.map((category) => (
            <Link href={category.url} key={category.id} className={styles.card}>
              <img src={category.imageUrl} alt={category.name} className={styles.image} />
              <div className={styles.price}>{category.name}</div>
            </Link>
          ))}
        </div>
      </section>
      <FooterSection />
      <ScrollToTopButton style="" />
    </>
  );
} 