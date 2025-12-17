import styles from './FurnitureGrid.module.css';
import Link from 'next/link';

export default function FurnitureGrid({ furniture }) {
  return (
    <div style={{ marginTop: '50px' }}>
      {/* Display only the first item's headName */}
      {furniture.length > -1 && (
        <p className={styles.description1}>{furniture[0].headName}</p>
      )}

      <div className={styles.grid}>
        {furniture.map((item) => (
          <div key={item.id} className={styles.card}>
            <Link href={item.url}> {/* Dynamic Route */}
              <img src={item.imageUrl} alt={item.name} className={styles.image} />
            </Link>
            <h3 className={styles.price}>{item.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}