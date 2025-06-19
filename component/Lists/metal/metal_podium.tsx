import React from 'react';

interface FurnitureItem {
  id: number;
  name: string;
  url: string;
  imageUrl: string;
  price: string;
  description: string;
  type: string;
  isAvailable: boolean;
}

const MetalPodium: React.FC<{ id: string }> = ({ id }) => {
  return (
    <div>
      <h1>Metal Podium Details</h1>
      <p>Podium ID: {id}</p>
      {/* Add your podium details here */}
    </div>
  );
};

export default MetalPodium;

export const furnitureData: FurnitureItem[] = [];

export const categories = []; 