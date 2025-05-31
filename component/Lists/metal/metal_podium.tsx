import React from 'react';

interface MetalPodiumProps {
  id: string;
  // Add other props as needed
}

const MetalPodium: React.FC<MetalPodiumProps> = ({ id }) => {
  return (
    <div>
      <h1>Metal Podium Details</h1>
      <p>Podium ID: {id}</p>
      {/* Add your podium details here */}
    </div>
  );
};

export default MetalPodium; 