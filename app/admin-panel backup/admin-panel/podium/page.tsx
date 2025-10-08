"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import "@/public/css/all.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-toastify/dist/ReactToastify.css";
import "@/public/css/style.css";
import "./page.css";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavbarSection from '@/component/navbar/NavbarSection';
import FooterSection from '@/component/footer/FooterSection';
import ScrollToTopButton from '@/component/utils/ScrollToTopButton';

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

export default function PodiumAdminPanel() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [newItem, setNewItem] = useState<Item>({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    images: [],
    type: '',
    url: '',
    isAvailable: true
  });
  const [customType, setCustomType] = useState('');
  const [showCustomTypeInput, setShowCustomTypeInput] = useState(false);
  const [activeAction, setActiveAction] = useState<'add' | 'edit' | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/podium');
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      const data = await response.json();
      setItems(data.items || []);
      
      // Extract unique types
      const uniqueTypes = Array.from(new Set((data.items || []).map((item: Item) => item.type))) as string[];
      setTypes(uniqueTypes);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  const handleSaveItem = async () => {
    const itemToSave = selectedItem
      ? {
          ...selectedItem,
          imageUrl: selectedItem.imageUrl || '',
          images: selectedItem.images || [],
          url: selectedItem.url || `/other/podium/${selectedItem.id}`,
          isAvailable: typeof selectedItem.isAvailable === 'boolean' ? selectedItem.isAvailable : true,
          type: selectedItem.type
        }
      : {
          ...newItem,
          id: items.length > 0 ? Math.max(...items.map(i => i.id || 0)) + 1 : 1,
          imageUrl: newItem.imageUrl || '',
          images: newItem.images || [],
          url: `/other/podium/${items.length > 0 ? Math.max(...items.map(i => i.id || 0)) + 1 : 1}`,
          isAvailable: true,
          type: newItem.type
        };

    try {
      const response = await fetch('/api/podium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: selectedItem ? items.map(item => item.id === selectedItem.id ? itemToSave : item) : [...items, itemToSave] })
      });

      if (!response.ok) {
        throw new Error('Failed to save items');
      }

      await fetchItems();
      setSelectedItem(null);
      setNewItem({
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

  const handleDeleteItem = async (id: number | undefined) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch('/api/podium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: items.filter(item => item.id !== id) })
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      await fetchItems();
      setSelectedItem(null);
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item. Please try again.');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'sub' = 'main') => {
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

      if (type === 'main') {
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
                        // Add the new type to the types array if it doesn't exist
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
                onChange={e => handleImageUpload(e, 'main')}
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
                  onChange={e => handleImageUpload(e, 'sub')}
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
            }}>Ամբիոնների կառավարում</h1>
            <button
              onClick={() => router.push('/admin-panel')}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ff4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Վերադառնալ
            </button>
          </div>

          <div style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {activeAction === 'add' || (activeAction === 'edit' && selectedItem) ? renderEditForm() : renderAdminGrid()}
          </div>
        </div>
      </main>
      <FooterSection />
      <ScrollToTopButton style="" />
    </div>
  );
} 