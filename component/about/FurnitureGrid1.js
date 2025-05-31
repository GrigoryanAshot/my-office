import styles from './FurnitureGrid.module.css';
import Link from 'next/link';

export default function FurnitureGrid({ furniture }) {
  return (
    <div style={{ marginTop: '50px' }}>
      <p className={styles.description1}>Կահույք</p>
      <div className={styles.grid}>
        {furniture.map((item) => (
          <div key={item.id} className={styles.card}>
            <Link href={`/furniture/${item.id}`}> {/* Dynamic Route */}
              <img src={item.imageUrl} alt={item.name} className={styles.image} />
            </Link>
            <h3 className={styles.price}>{item.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}