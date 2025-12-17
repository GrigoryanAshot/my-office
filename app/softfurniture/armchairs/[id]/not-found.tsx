import Link from 'next/link';
import NavbarSection from '@/component/navbar/NavbarSection';
import FooterSection from '@/component/footer/FooterSection';
import ScrollToTopButton from '@/component/utils/ScrollToTopButton';
import styles from './TableDetail.module.css';

export default function NotFound() {
  return (
    <>
      <NavbarSection style="" logo="/images/logo.png" />
      <div className={styles.wrapper}>
        <div className={styles.errorContainer}>
          <h2 className={styles.errorTitle}>Ապրանքը չի գտնվել</h2>
          <p className={styles.errorMessage}>
            Ցավոք, մենք չենք կարող գտնել այս ապրանքը: Խնդրում ենք ստուգել URL-ը կամ վերադառնալ գլխավոր էջ:
          </p>
          <Link href="/softfurniture/armchairs" className={styles.backButton}>
            Վերադառնալ բազկաթոռների էջ
          </Link>
        </div>
      </div>
      <FooterSection />
      <ScrollToTopButton style="" />
    </>
  );
}

