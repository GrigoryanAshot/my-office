import styles from './FurnitureGrid.module.css';

export default function FurnitureGrid({ furniture }) {
  return (
    <div className={styles.grid}>
      {furniture.map((item) => (
        <div key={item.id} className={styles.card}>
          <img src={item.imageUrl} alt={item.name} className={styles.image} />
          <h3 className={styles.price}>{item.name}</h3>
          <p>{item.price}</p>
        </div>
      ))}
    </div>
  );
}