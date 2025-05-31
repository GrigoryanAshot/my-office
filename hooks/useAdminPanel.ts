import { useState, useEffect, ChangeEvent } from 'react';

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

interface AdminPanelData {
  items: FurnitureItem[];
  types: string[];
}

const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'furniture_upload';
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dpbsyoxw8';

export const useAdminPanel = (apiEndpoint: string) => {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<FurnitureItem | null>(null);
  const [items, setItems] = useState<FurnitureItem[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [newItem, setNewItem] = useState<FurnitureItem>({
    id: 0,
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    images: [],
    type: '',
    url: '',
    isAvailable: true
  });
  const [newType, setNewType] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data: AdminPanelData = await response.json();
        setItems(data.items || []);
        setTypes(data.types || []);
      } catch (error) {
        console.error('Admin Panel: Error loading data:', error);
      }
    };
    fetchData();
  }, [apiEndpoint]);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>, isMainImage: boolean = true) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    try {
      console.log('Starting upload with:', {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET
      });

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      });
      
      if (!res.ok) {
        const errorData = await res.text();
        console.error('Upload failed with status:', res.status);
        console.error('Error response:', errorData);
        throw new Error(`Upload failed: ${errorData}`);
      }
      
      const data = await res.json();
      console.log('Upload successful:', data);
      
      if (selectedItem) {
        if (isMainImage) {
          setSelectedItem({ ...selectedItem, imageUrl: data.secure_url });
        } else {
          setSelectedItem({ ...selectedItem, images: [...selectedItem.images, data.secure_url] });
        }
      } else {
        if (isMainImage) {
          setNewItem({ ...newItem, imageUrl: data.secure_url });
        } else {
          setNewItem({ ...newItem, images: [...newItem.images, data.secure_url] });
        }
      }
    } catch (err) {
      console.error('Upload error details:', err);
      alert('Image upload failed. Please check console for details.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveItem = async () => {
    if (!(selectedItem?.imageUrl || newItem.imageUrl)) {
      alert('Please upload a photo before saving.');
      return;
    }

    try {
      const response = await fetch(apiEndpoint);
      if (!response.ok) {
        throw new Error('Failed to fetch current data');
      }
      const currentData = await response.json();
      const currentItems = currentData.items || [];
      const currentTypes = currentData.types || [];
      
      const itemToSave = selectedItem || {
        ...newItem,
        id: Math.max(0, ...currentItems.map((item: FurnitureItem) => item.id)) + 1,
        url: `${apiEndpoint.split('/').pop()}/${Math.max(0, ...currentItems.map((item: FurnitureItem) => item.id)) + 1}`
      };

      const itemWithImage = {
        ...itemToSave,
        imageUrl: selectedItem?.imageUrl || newItem.imageUrl
      };

      const updatedTypes = [...currentTypes];
      if (itemWithImage.type && !updatedTypes.includes(itemWithImage.type)) {
        updatedTypes.push(itemWithImage.type);
      }

      const updatedItems = selectedItem
        ? currentItems.map((item: FurnitureItem) => 
            item.id === selectedItem.id ? itemWithImage : item
          )
        : [...currentItems, itemWithImage];

      const saveResponse = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: updatedItems,
          types: updatedTypes
        })
      });
      if (!saveResponse.ok) {
        const errorText = await saveResponse.text();
        console.error('Admin Panel: Save response error:', errorText);
        throw new Error('Failed to save item');
      }
      setItems(updatedItems);
      setTypes(updatedTypes);
      setSelectedItem(null);
      setNewItem({
        id: 0,
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        images: [],
        type: '',
        url: '',
        isAvailable: true
      });
      setActiveAction(null);
    } catch (error) {
      console.error('Admin Panel: Error saving item:', error);
      alert('Failed to save item. Please try again.');
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!window.confirm('Դուք վստա՞հ եք, որ ցանկանում եք ջնջել այս ապրանքը:')) {
      return;
    }
    let latestItems: FurnitureItem[] = [];
    let latestTypes: string[] = [];
    try {
      const response = await fetch(apiEndpoint);
      if (response.ok) {
        const data = await response.json();
        latestItems = data.items || [];
        latestTypes = data.types || [];
      }
    } catch (e) { /* fallback to local state if fetch fails */ }
    try {
      const updatedItems = latestItems.filter((item: FurnitureItem) => item.id !== id);
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updatedItems, types: latestTypes })
      });
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
      setItems(updatedItems);
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item. Please try again.');
    }
  };

  const handleAddType = async () => {
    if (!newType.trim()) return;
    if (types.includes(newType.trim())) return;
    const updatedTypes = [...types, newType.trim()];
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, types: updatedTypes })
      });
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Failed to add type:', errorData);
        throw new Error(`Failed to add type: ${errorData}`);
      }
      setTypes(updatedTypes);
      setNewType('');
    } catch (err) {
      console.error('Error adding type:', err);
      alert(err instanceof Error ? err.message : 'Failed to add type');
    }
  };

  const handleDeleteType = async (typeToDelete: string) => {
    const updatedTypes = types.filter(t => t !== typeToDelete);
    const updatedItems = items.map(item =>
      item.type === typeToDelete ? { ...item, type: '' } : item
    );
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updatedItems, types: updatedTypes })
      });
      if (!response.ok) throw new Error('Failed to delete type');
      setTypes(updatedTypes);
      setItems(updatedItems);
    } catch (err) {
      alert('Failed to delete type');
    }
  };

  return {
    activeAction,
    setActiveAction,
    selectedItem,
    setSelectedItem,
    items,
    types,
    newItem,
    setNewItem,
    newType,
    setNewType,
    uploading,
    handleImageUpload,
    handleSaveItem,
    handleDeleteItem,
    handleAddType,
    handleDeleteType
  };
}; 