import { categories } from './categories';

export const furnitureData = Object.entries(categories)
  .sort(([, a], [, b]) => a.order - b.order)
  .map(([key, category]) => ({
    id: category.id,
    name: category.name,
    url: category.url,
    headName:"Սեղաններ և աթոռներ",
    imageUrl: "https://i.ibb.co/Q8GzZJJ/3d2c5838-8981-4957-97f3-56589bd32d17.jpg",
    description: `Նկարագիր ${category.name.toLowerCase()}`,
    price: '100000'
  }));