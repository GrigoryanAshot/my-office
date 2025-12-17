"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import "@/public/css/all.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-toastify/dist/ReactToastify.css";
import "@/public/css/style.css";
import "./page.css";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import NavbarSection from '@/component/navbar/NavbarSection';
import FooterSection from '@/component/footer/FooterSection';
import ScrollToTopButton from '@/component/utils/ScrollToTopButton';
import { Category } from '@/component/Lists/furniture/categories';
import Link from 'next/link';

interface Item {
  id?: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  images: string[];
  type: string;
  url: string;
  isAvailable: boolean;
}

interface FurnitureItem extends Item {
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

// Utility function to delete a type from a given API route
async function deleteType(apiRoute: string, typeName: string) {
  const response = await fetch(apiRoute, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ typeName }),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || 'Failed to delete type');
  }
  return result;
}

// Utility function to fetch items and types from a given API route
async function fetchItemsAndTypes(apiRoute: string) {
  const response = await fetch(apiRoute);
  const data = await response.json();
  return {
    items: data.items || [],
    types: data.types || [],
  };
}

export default function AdminPanelClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('furniture');
  const [activeAction, setActiveAction] = useState<'add' | 'edit' | 'delete' | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Record<string, Category>>({});
  const [isManagingCategories, setIsManagingCategories] = useState(false);
  const [newCategory, setNewCategory] = useState<{ key: string; name: string }>({ key: '', name: '' });
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
  const [furnitureData, setFurnitureData] = useState<Item[]>([]);
  const [customType, setCustomType] = useState('');
  const [showCustomTypeInput, setShowCustomTypeInput] = useState(false);
  const [types, setTypes] = useState<string[]>([]);

  // Load categories from API on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Failed to load categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    loadCategories();
  }, []);

  // Load items and types from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/items');
        if (!response.ok) {
          throw new Error('Failed to fetch items');
        }
        const data = await response.json();
        // Always set types from backend, not derived from items
        setFurnitureData(data.items || []);
        setTypes(data.types || []);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    fetchData();
  }, []);

  // Map subcategory keys to their API routes
  const apiRouteMap: Record<string, string> = {
    'sofas': '/api/sofas',
    'chests': '/api/chests',
    'armchairs': '/api/armchairs',
    'tables': '/api/tables2',
    'poufs': '/api/poufs',
    'rugs': '/api/rugs',
    'beds': '/api/beds',
    'blankets': '/api/blankets',
    'carpets': '/api/carpets',
    'curtains': '/api/curtains',
    'cushions': '/api/cushions',
    'doors': '/api/doors',
    'flooring': '/api/flooring',
    'hangers': '/api/hangers',
    'lamps': '/api/lamps',
    'mattresses': '/api/mattresses',
    'mirrors': '/api/mirrors',
    'paintings': '/api/paintings',
    'pillows': '/api/pillows',
    'plants': '/api/plants',
    'podium': '/api/podium',
    'sale': '/api/sale-slider',
    'shelving': '/api/shelving',
    'stands': '/api/stands',
    'takht': '/api/takht',
    'throws': '/api/throws',
    'tiles': '/api/tiles',
    'vases': '/api/vases',
    'walldecor': '/api/wall-decor',
    'wallpapers': '/api/wallpapers',
    'wardrobes': '/api/wardrobes',
    'whiteboard': '/api/whiteboard',
    'windows': '/api/windows',
    // Add more as needed
  };

  // Replace useEffect for subcategory data loading
  useEffect(() => {
    if (!selectedCategory) return;
    // Extract subcategory key (e.g., 'sofas' from 'doors_sofas')
    let subKey = selectedCategory.split('_').pop();
    if (!subKey) return;
    const apiRoute = apiRouteMap[subKey];
    if (!apiRoute) return;
    fetchItemsAndTypes(apiRoute).then(({ items, types }) => {
      setItems(items);
      setTypes(types); // Always use backend types
    });
  }, [selectedCategory]);

  // Update handleDeleteItem to persist to API
  const handleSaveItem = async () => {
    if (!selectedCategory) return;
    const itemToSave = selectedItem
      ? {
          ...selectedItem,
          imageUrl: selectedItem.imageUrl || '',
          images: selectedItem.images || [],
          url: selectedItem.url || `/furniture/tables/${selectedItem.id}`,
          isAvailable: typeof selectedItem.isAvailable === 'boolean' ? selectedItem.isAvailable : true,
          type: selectedItem.type
        }
      : {
          ...newItem,
          id: items.length > 0 ? Math.max(...items.map(i => i.id || 0)) + 1 : 1,
          imageUrl: newItem.imageUrl || '',
          images: newItem.images || [],
          url: `/furniture/tables/${items.length > 0 ? Math.max(...items.map(i => i.id || 0)) + 1 : 1}`,
          isAvailable: true,
          type: newItem.type
        };

    const updatedItems = selectedItem
      ? items.map(item => item.id === selectedItem.id ? itemToSave : item)
      : [...items, itemToSave];

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updatedItems })
      });

      if (!response.ok) {
        throw new Error('Failed to save items');
      }

      // Re-fetch items
      const fetchResponse = await fetch('/api/items');
      const data = await fetchResponse.json();
      setItems(data.items || []);
      setFurnitureData(data.items || []);
      
      // Reset form
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
      console.error('Error saving item:', error);
      alert('Failed to save item. Please try again.');
    }
  };

  // Update handleDeleteItem to persist to API
  const handleDeleteItem = async (id: number | undefined) => {
    if (!selectedCategory) return;
    const updatedItems = items.filter(item => item.id !== id);
    await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: updatedItems })
    });
    // Re-fetch items
    fetch('/api/items')
      .then(res => res.json())
      .then(data => {
        setItems(data.items || []);
        setFurnitureData(data.items || []);
      });
    setSelectedItem(null);
  };

  const handleSaveCategoryEdit = async () => {
    if (editingCategory && newCategory.name) {
      const updatedCategories = { ...categories };
      delete updatedCategories[editingCategory];
      
      let baseUrl = '';
      let prefix = '';
      switch (activeTab) {
        case 'furniture':
          baseUrl = '/furniture';
          prefix = 'furniture_';
          break;
        case 'doors':
          baseUrl = '/doors';
          prefix = 'doors_';
          break;
        case 'windows':
          baseUrl = '/windows';
          prefix = 'windows_';
          break;
        case 'metal':
          baseUrl = '/other';
          prefix = 'metal_';
          break;
      }

      const categoryKey = `${prefix}${newCategory.key}`;
      updatedCategories[categoryKey] = {
        id: categoryKey,
        name: newCategory.name,
        url: `${baseUrl}/${newCategory.key}`,
        imageUrl: uploadedImage || categories[editingCategory]?.imageUrl || '',
        order: categories[editingCategory]?.order || Object.keys(updatedCategories).length + 1
      };
      
      try {
        const response = await fetch('/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ categories: updatedCategories }),
        });

        if (!response.ok) {
          throw new Error('Failed to save categories');
        }

        setCategories(updatedCategories);
        setEditingCategory(null);
        setNewCategory({ key: '', name: '' });
        setUploadedImage(null);

        window.dispatchEvent(new CustomEvent('categoriesUpdated', { 
          detail: { categories: updatedCategories }
        }));
      } catch (error) {
        console.error('Error saving categories:', error);
        alert('Failed to save categories. Please try again.');
      }
    }
  };

  const handleAddCategory = async () => {
    if (newCategory.key && newCategory.name) {
      let baseUrl = '';
      let prefix = '';
      switch (activeTab) {
        case 'furniture':
          baseUrl = '/furniture';
          prefix = 'furniture_';
          break;
        case 'doors':
          baseUrl = '/doors';
          prefix = 'doors_';
          break;
        case 'windows':
          baseUrl = '/windows';
          prefix = 'windows_';
          break;
        case 'metal':
          baseUrl = '/other';
          prefix = 'metal_';
          break;
      }

      const categoryKey = `${prefix}${newCategory.key}`;
      const updatedCategories = {
        ...categories,
        [categoryKey]: {
          id: categoryKey,
          name: newCategory.name,
          url: `${baseUrl}/${newCategory.key}`,
          imageUrl: uploadedImage || '',
          order: Object.keys(categories).length + 1
        }
      };

      try {
        const response = await fetch('/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ categories: updatedCategories }),
        });

        if (!response.ok) {
          throw new Error('Failed to save categories');
        }

        setCategories(updatedCategories);
        setNewCategory({ key: '', name: '' });
        setUploadedImage(null);

        window.dispatchEvent(new CustomEvent('categoriesUpdated', { 
          detail: { categories: updatedCategories }
        }));
      } catch (error) {
        console.error('Error saving categories:', error);
        alert('Failed to save categories. Please try again.');
      }
    }
  };

  const handleDeleteCategory = async (key: string) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }

    const updatedCategories = { ...categories };
    delete updatedCategories[key];

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categories: updatedCategories }),
      });

      if (!response.ok) {
        throw new Error('Failed to save categories');
      }

      setCategories(updatedCategories);

      window.dispatchEvent(new CustomEvent('categoriesUpdated', { 
        detail: { categories: updatedCategories }
      }));
    } catch (error) {
      console.error('Error saving categories:', error);
      alert('Failed to save categories. Please try again.');
    }
  };

  const handleEditCategory = (key: string) => {
    setEditingCategory(key);
    setNewCategory({ key, name: categories[key].name });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isCategory: boolean = false, type: 'main' | 'sub' = 'main') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      const cloudinaryUrl = data.url;

      if (isCategory) {
        if (editingCategory) {
          setCategories(prev => ({
            ...prev,
            [editingCategory]: {
              ...prev[editingCategory],
              imageUrl: cloudinaryUrl
            }
          }));
        }
        setUploadedImage(cloudinaryUrl);
      } else if (type === 'main') {
        if (selectedItem) {
          setSelectedItem(prev => ({ ...prev!, imageUrl: cloudinaryUrl }));
        } else {
          setNewItem(prev => ({ ...prev, imageUrl: cloudinaryUrl }));
        }
      } else if (type === 'sub') {
        if (selectedItem) {
          setSelectedItem(prev => ({ ...prev!, images: [...(prev?.images || []), cloudinaryUrl] }));
        } else {
          setNewItem(prev => ({ ...prev, images: [...(prev.images || []), cloudinaryUrl] }));
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, key: string) => {
    e.dataTransfer.setData('text/plain', key);
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = '#e3f2fd';
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.backgroundColor = 'white';
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, targetKey: string) => {
    e.preventDefault();
    const sourceKey = e.dataTransfer.getData('text/plain');
    e.currentTarget.style.backgroundColor = 'white';
    
    if (sourceKey === targetKey) return;

    const sourceCategory = categories[sourceKey];
    const targetCategory = categories[targetKey];
    const sourceOrder = sourceCategory.order;
    const targetOrder = targetCategory.order;
    if (!sourceOrder || !targetOrder) return;

    const updatedCategories = { ...categories };

    // Get all categories sorted by order
    const sortedCategories = Object.entries(categories)
      .sort(([, a], [, b]) => {
        const orderA = typeof a.order === 'number' ? a.order : 0;
        const orderB = typeof b.order === 'number' ? b.order : 0;
        return orderA - orderB;
      })
      .map(([key]) => key);

    // Find indices of source and target
    const sourceIndex = sortedCategories.indexOf(sourceKey);
    const targetIndex = sortedCategories.indexOf(targetKey);

    // Remove the source item from its current position
    sortedCategories.splice(sourceIndex, 1);
    // Insert it at the target position
    sortedCategories.splice(targetIndex, 0, sourceKey);

    // Update all orders based on new positions
    sortedCategories.forEach((key, index) => {
      updatedCategories[key] = {
        ...categories[key],
        order: index + 1
      };
    });

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categories: updatedCategories }),
      });

      if (!response.ok) {
        throw new Error('Failed to save categories');
      }

      setCategories(updatedCategories);
    } catch (error) {
      console.error('Error saving categories:', error);
      alert('Failed to save categories. Please try again.');
    }
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = '1';
  };

  const renderCategoryManagement = () => {
    const filteredCategories = Object.entries(categories).filter(([key, category]) => {
      switch (activeTab) {
        case 'furniture':
          return key.startsWith('furniture_');
        case 'doors':
          return key.startsWith('doors_');
        case 'windows':
          return key.startsWith('windows_');
        case 'metal':
          return key.startsWith('metal_');
        default:
          return false;
      }
    });

    const mainCategoryName = (() => {
      switch (activeTab) {
        case 'furniture':
          return 'Սեղաններ և աթոռներ';
        case 'doors':
          return 'Փափուկ կահույք';
        case 'windows':
          return 'Պահարաններ և ավելին';
        case 'metal':
          return 'Այլ';
        default:
          return '';
      }
    })();

    return (
      <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>{mainCategoryName} - Կատեգորիաների կառավարում</h3>
          <button
            onClick={() => setIsManagingCategories(false)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#9e9e9e',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Վերադառնալ
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ marginBottom: '10px' }}>Ավելացնել նոր կատեգորիա</h4>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Կոդ (օր. tables)"
              value={newCategory.key || ''}
              onChange={(e) => setNewCategory(prev => ({ ...prev, key: e.target.value }))}
              style={{
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                flex: 1
              }}
            />
            <input
              type="text"
              placeholder="Անվանում (օր. Սեղաններ)"
              value={newCategory.name || ''}
              onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
              style={{
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                flex: 1
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, true)}
                ref={fileInputRef}
                style={{ display: 'none' }}
                id="imageUpload"
              />
              <label
                htmlFor="imageUpload"
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                Նկար ավելացնել
              </label>
              {uploadedImage && (
                <img 
                  src={uploadedImage} 
                  alt="Preview" 
                  style={{ 
                    maxWidth: '50px', 
                    maxHeight: '50px',
                    objectFit: 'cover',
                    borderRadius: '4px'
                  }} 
                />
              )}
            </div>
            <button
              onClick={editingCategory ? handleSaveCategoryEdit : handleAddCategory}
              style={{
                padding: '8px 16px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {editingCategory ? 'Պահպանել' : 'Ավելացնել'}
            </button>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '15px'
        }}>
          {filteredCategories
            .sort(([, a], [, b]) => {
              const orderA = typeof a.order === 'number' ? a.order : 0;
              const orderB = typeof b.order === 'number' ? b.order : 0;
              return orderA - orderB;
            })
            .map(([key, category]) => (
              <div
                key={key}
                draggable
                onDragStart={(e) => handleDragStart(e, key)}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, key)}
                onDragEnd={handleDragEnd}
                style={{
                  padding: '15px',
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'move',
                  transition: 'all 0.2s ease'
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold' }}>{category.name}</div>
                  <div style={{ color: '#666', fontSize: '0.9em' }}>Կոդ: {key}</div>
                  <div style={{ color: '#666', fontSize: '0.9em' }}>Հերթականություն: {category.order}</div>
                  {category.imageUrl && (
                    <img 
                      src={category.imageUrl} 
                      alt={category.name}
                      style={{
                        maxWidth: '100px',
                        maxHeight: '100px',
                        objectFit: 'cover',
                        marginTop: '10px',
                        borderRadius: '4px'
                      }}
                    />
                  )}
                </div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button
                    onClick={() => handleEditCategory(key)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#2196F3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                    title="Փոփոխել"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(key)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                    title="Ջնջել"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  };

  const renderCategoryList = () => {
    const filteredCategories = Object.entries(categories).filter(([key, category]) => {
      switch (activeTab) {
        case 'furniture':
          return key.startsWith('furniture_') || key === 'furniture';
        case 'doors':
          return key.startsWith('doors_') || key === 'doors';
        case 'windows':
          return key.startsWith('windows_') || key === 'windows';
        case 'metal':
          return key.startsWith('metal_') || key === 'metal';
        default:
          return false;
      }
    });

    const groupedCategories = filteredCategories.reduce((acc, [key, category]) => {
      const isMainCategory = !key.includes('_');
      if (isMainCategory) {
        acc[key] = {
          main: category,
          subcategories: []
        };
      } else {
        const mainKey = key.split('_')[0];
        if (acc[mainKey]) {
          acc[mainKey].subcategories.push({ key, category });
        }
      }
      return acc;
    }, {} as Record<string, { main: Category; subcategories: { key: string; category: Category }[] }>);

    return (
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0 }}>Ընտրեք կատեգորիան</h3>
          <button
            onClick={() => setIsManagingCategories(true)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4a90e2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Կառավարել կատեգորիաները
          </button>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {Object.entries(groupedCategories).map(([mainKey, { main, subcategories }]) => (
            <div key={mainKey} style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ 
                fontWeight: 'bold', 
                fontSize: '1.2em', 
                marginBottom: '15px',
                padding: '10px',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px'
              }}>
                {main.name}
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '15px',
                paddingLeft: '20px'
              }}>
                {subcategories.map(({ key, category }) => {
                  let adminLink = '#';
                  if (key === 'windows_wardrobes') adminLink = '/admin-panel/wardrobes';
                  else if (key === 'windows_shelving') adminLink = '/admin-panel/shelving';
                  else if (key === 'windows_chests') adminLink = '/admin-panel/chests';
                  else if (key === 'windows_windows_takhtir') adminLink = '/admin-panel/stands';
                  else if (key === 'doors_sofas') adminLink = '/admin-panel/sofas';
                  else if (key === 'doors_armchairs') adminLink = '/admin-panel/armchairs';
                  else if (key === 'doors_poufs') adminLink = '/admin-panel/poufs';
                  else if (key === 'doors_doors_takht') adminLink = '/admin-panel/takht';
                  else if (key === 'furniture_chairs') adminLink = '/admin-panel/chairs';
                  else if (key === 'furniture_tables') adminLink = '/admin-panel/tables';
                  else if (key === 'metal_metal_wall_decor') adminLink = '/admin-panel/walldecor';
                  else if (key === 'metal_metal_hangers') adminLink = '/admin-panel/hangers';
                  else if (key === 'metal_metal_podium') adminLink = '/admin-panel/podium';
                  else if (key === 'metal_Գրատախտակ') adminLink = '/admin-panel/whiteboard';
                  return (
                    <Link href={adminLink} passHref legacyBehavior key={key}>
                      <div
                        style={{
                          padding: '15px',
                          backgroundColor: selectedCategory === key ? '#e3f2fd' : 'white',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          fontWeight: 'bold',
                        }}
                      >
                        {category.name}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAdminGrid = () => (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0 }}>Ապրանքների ցանկ</h3>
        <button
          onClick={() => {
            setActiveAction('add');
            setSelectedItem(null);
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          + Ավելացնել նոր
        </button>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        padding: '10px'
      }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              padding: '15px',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '4px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            <img 
              src={item.imageUrl} 
              alt={item.name}
              style={{
                width: '100%',
                height: '150px',
                objectFit: 'cover',
                borderRadius: '4px',
                marginBottom: '10px'
              }}
            />
            <div style={{ fontWeight: 'bold', marginBottom: '5px', textAlign: 'center' }}>{item.name}</div>
            <div style={{ color: '#666', fontSize: '0.9em', marginBottom: '5px', textAlign: 'center' }}>{item.description}</div>
            <div style={{ color: '#2196F3', marginBottom: '10px' }}>{item.price}</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  setSelectedItem(item);
                  setActiveAction('edit');
                }}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                ✎ Փոփոխել
              </button>
              <button
                onClick={() => handleDeleteItem(item.id)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                🗑️ Ջնջել
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888' }}>Ապրանքներ չկան</div>
        )}
      </div>
    </div>
  );

  const renderEditForm = () => (
    <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2 style={{ marginBottom: '20px' }}>{selectedItem ? 'Խմբագրել ապրանք' : 'Ավելացնել նոր ապրանք'}</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSaveItem();
      }}>
        <div style={{ display: 'grid', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Անվանում</label>
            <input
              type="text"
              value={selectedItem ? selectedItem.name : newItem.name}
              onChange={e => selectedItem
                ? setSelectedItem({ ...selectedItem, name: e.target.value })
                : setNewItem({ ...newItem, name: e.target.value })}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Տեսակ</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {!showCustomTypeInput ? (
                <>
                  <select
                    value={selectedItem ? selectedItem.type : newItem.type}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setShowCustomTypeInput(true);
                      } else {
                        selectedItem
                          ? setSelectedItem({ ...selectedItem, type: e.target.value })
                          : setNewItem({ ...newItem, type: e.target.value });
                      }
                    }}
                    style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  >
                    <option value="">Ընտրեք տեսակ</option>
                    {types.filter(type => type !== 'Բոլորը').map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                    <option value="custom">+ Ավելացնել նոր տեսակ</option>
                  </select>
                </>
              ) : (
                <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                  <input
                    type="text"
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    placeholder="Մուտքագրեք նոր տեսակ"
                    style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                  <button
                    onClick={() => {
                      if (customType.trim()) {
                        const newType = customType.trim();
                        selectedItem
                          ? setSelectedItem({ ...selectedItem, type: newType })
                          : setNewItem({ ...newItem, type: newType });
                        if (!types.includes(newType)) {
                          setTypes(prevTypes => [...prevTypes, newType]);
                        }
                        setShowCustomTypeInput(false);
                        setCustomType('');
                      }
                    }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Ավելացնել
                  </button>
                  <button
                    onClick={() => {
                      setShowCustomTypeInput(false);
                      setCustomType('');
                    }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Չեղարկել
                  </button>
                </div>
              )}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Նկարագրություն</label>
            <textarea
              value={selectedItem ? selectedItem.description : newItem.description}
              onChange={(e) => selectedItem
                ? setSelectedItem({ ...selectedItem, description: e.target.value })
                : setNewItem({ ...newItem, description: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                minHeight: '100px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Գին</label>
            <input
              type="text"
              value={selectedItem ? selectedItem.price : newItem.price}
              onChange={(e) => selectedItem
                ? setSelectedItem({ ...selectedItem, price: e.target.value })
                : setNewItem({ ...newItem, price: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Հիմնական նկար</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                id="mainImageUpload"
                onChange={e => handleImageUpload(e, false, 'main')}
              />
              <label
                htmlFor="mainImageUpload"
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                Ներբեռնել հիմնական նկար
              </label>
              {(selectedItem ? selectedItem.imageUrl : newItem.imageUrl) && (
                <img
                  src={selectedItem ? selectedItem.imageUrl : newItem.imageUrl}
                  alt="Main Preview"
                  style={{ maxWidth: '80px', maxHeight: '80px', objectFit: 'cover', borderRadius: '4px' }}
                />
              )}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Լրացուցիչ նկարներ (գալերեա)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {(selectedItem ? selectedItem.images : newItem.images).map((img, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <img
                    src={img}
                    alt={`Sub Preview ${idx+1}`}
                    style={{ maxWidth: '60px', maxHeight: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedItem) {
                        setSelectedItem({ ...selectedItem, images: selectedItem.images.filter((_, i) => i !== idx) });
                      } else {
                        setNewItem({ ...newItem, images: newItem.images.filter((_, i) => i !== idx) });
                      }
                    }}
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      background: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      lineHeight: '20px',
                      padding: 0
                    }}
                  >×</button>
                </div>
              ))}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="subImageUpload"
                  onChange={e => handleImageUpload(e, false, 'sub')}
                />
                <label
                  htmlFor="subImageUpload"
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'inline-block'
                  }}
                >
                  + Ավելացնել նկար
                </label>
              </div>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Առկա է</label>
            <input
              type="checkbox"
              checked={selectedItem ? selectedItem.isAvailable : newItem.isAvailable}
              onChange={e => selectedItem
                ? setSelectedItem({ ...selectedItem, isAvailable: e.target.checked })
                : setNewItem({ ...newItem, isAvailable: e.target.checked })}
              style={{ marginRight: '10px' }}
            />
            <span>{(selectedItem ? selectedItem.isAvailable : newItem.isAvailable) ? 'Այո' : 'Ոչ'}</span>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => {
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
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#9e9e9e',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Չեղարկել
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Պահպանել
            </button>
          </div>
        </div>
      </form>
    </div>
  );

  const renderActionButtons = () => (
    <div style={{
      display: 'flex',
      gap: '10px',
      marginBottom: '20px'
    }}>
      <button
        onClick={() => {
          setActiveAction('add');
          setSelectedItem(null);
        }}
        style={{
          padding: '8px 16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}
      >
        <span>+</span> Ավելացնել նոր
      </button>
      <button
        onClick={() => {
          setActiveAction('edit');
          setSelectedItem(null);
        }}
        style={{
          padding: '8px 16px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}
      >
        ✎ Փոփոխել
      </button>
      <button
        onClick={() => {
          setActiveAction('delete');
          setSelectedItem(null);
        }}
        style={{
          padding: '8px 16px',
          backgroundColor: '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}
      >
        🗑️ Ջնջել
      </button>
    </div>
  );

  const renderActionContent = () => {
    if (isManagingCategories) {
      return renderCategoryManagement();
    }
    if (!selectedCategory) {
      return renderCategoryList();
    }
    if (activeAction === 'edit' && selectedItem) {
      return renderEditForm();
    }
    if (activeAction === 'add') {
      return renderEditForm();
    }
    return renderAdminGrid();
  };

  // Handler functions
  const handleLogout = () => {
    router.push('/');
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setItems([]);
  };

  return (
    <div className="home_3">
      <NavbarSection style="" logo="/images/logo.png" />
      <main style={{ 
        paddingTop: '100px',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          padding: '20px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px'
          }}>
            <h1 style={{
              fontSize: '24px',
              color: '#333',
              margin: 0
            }}>Admin Panel</h1>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ff4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>

          <div style={{
            display: 'flex',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <button
              onClick={() => {
                setActiveTab('furniture');
                setActiveAction(null);
                setSelectedItem(null);
                setSelectedCategory(null);
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: activeTab === 'furniture' ? '#4a90e2' : '#fff',
                color: activeTab === 'furniture' ? '#fff' : '#333',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Սեղաններ և աթոռներ
            </button>
            <button
              onClick={() => {
                setActiveTab('doors');
                setActiveAction(null);
                setSelectedItem(null);
                setSelectedCategory(null);
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: activeTab === 'doors' ? '#4a90e2' : '#fff',
                color: activeTab === 'doors' ? '#fff' : '#333',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Փափուկ կահույք
            </button>
            <button
              onClick={() => {
                setActiveTab('windows');
                setActiveAction(null);
                setSelectedItem(null);
                setSelectedCategory(null);
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: activeTab === 'windows' ? '#4a90e2' : '#fff',
                color: activeTab === 'windows' ? '#fff' : '#333',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Պահարաններ և ավելին
            </button>
            <button
              onClick={() => {
                setActiveTab('metal');
                setActiveAction(null);
                setSelectedItem(null);
                setSelectedCategory(null);
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: activeTab === 'metal' ? '#4a90e2' : '#fff',
                color: activeTab === 'metal' ? '#fff' : '#333',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Այլ
            </button>
          </div>

          {/* Sale Products Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <button
              onClick={() => window.location.href = '/admin-panel/sale'}
              style={{
                padding: '10px 24px',
                backgroundColor: '#ff914d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                fontSize: '1.1em',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              ակցիայի ապրանքներ
            </button>
          </div>

          <div style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {selectedCategory && renderActionButtons()}
            {renderActionContent()}
          </div>
        </div>
      </main>
      <FooterSection />
      <ScrollToTopButton style="" />
    </div>
  );
} 