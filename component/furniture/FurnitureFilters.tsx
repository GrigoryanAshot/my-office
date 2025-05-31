import { useState } from 'react';
import styles from './FurnitureFilters.module.css';

interface FurnitureFiltersProps {
  onFilterChange: (filters: {
    style: string;
    minPrice: number;
    maxPrice: number;
  }) => void;
}

const furnitureStyles = [
  { value: '', label: 'Բոլոր ոճերը' },
  { value: 'Loft ոճի կահույք', label: 'Loft ոճի կահույք' },
  { value: 'Փափուկ կահույք', label: 'Փափուկ կահույք' },
  { value: 'Բազմոց', label: 'Բազմոց' },
  { value: 'Բազկաթոռ', label: 'Բազկաթոռ' }
];

export default function FurnitureFilters({ onFilterChange }: FurnitureFiltersProps) {
  const [selectedStyle, setSelectedStyle] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleFilterClick = () => {
    onFilterChange({
      style: selectedStyle,
      minPrice: minPrice ? parseFloat(minPrice) : 0,
      maxPrice: maxPrice ? parseFloat(maxPrice) : Infinity,
    });
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterGroup} data-label="Ոճ">
        <select
          value={selectedStyle}
          onChange={(e) => setSelectedStyle(e.target.value)}
          className={styles.filterSelect}
        >
          {furnitureStyles.map((style) => (
            <option key={style.value} value={style.value}>
              {style.label}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.filterGroup} data-label="Գնային տիրույթ">
        <input
          type="number"
          placeholder="Նվազագույն գին"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className={styles.filterInput}
        />
        <input
          type="number"
          placeholder="Առավելագույն գին"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className={styles.filterInput}
        />
      </div>
      <button 
        onClick={handleFilterClick}
        className={styles.filterButton}
      >
        Ֆիլտրել
      </button>
    </div>
  );
} 