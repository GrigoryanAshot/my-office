import React from 'react';

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface CategoriesProps {
  categories: Category[];
}

const Categories: React.FC<CategoriesProps> = ({ categories }) => {
  return (
    <div className="metal-categories">
      {categories.map((category) => (
        <div key={category.id} className="category-item">
          <img src={category.image} alt={category.name} />
          <h3>{category.name}</h3>
          <p>{category.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Categories;

export const categories = [
  {
    id: "1",
    name: "Մետաղյա դեկորներ",
    description: "Մետաղյա պատի դեկորներ",
    image: "/images/categories/metal-decor.jpg"
  },
  {
    id: "2",
    name: "Փայտյա դեկորներ",
    description: "Փայտյա պատի դեկորներ",
    image: "/images/categories/wood-decor.jpg"
  }
]; 