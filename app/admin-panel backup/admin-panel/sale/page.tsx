"use client";

import React, { useEffect, useState, ChangeEvent } from 'react';
import NavbarSection from '@/component/navbar/NavbarSection';
import FooterSection from '@/component/footer/FooterSection';
import ScrollToTopButton from '@/component/utils/ScrollToTopButton';

interface SaleSliderItem {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  price: string;
  link: string;
}

const defaultItem: SaleSliderItem = {
  id: 0,
  imageUrl: '',
  title: '',
  description: '',
  price: '',
  link: '',
};

export default function SaleSliderAdminPage() {
  const [items, setItems] = useState<SaleSliderItem[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<SaleSliderItem>(defaultItem);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/sale-slider');
        if (!response.ok) throw new Error('Failed to fetch sale slider items');
        const data = await response.json();
        setItems(data.items || []);
      } catch (err) {
        setError('Չհաջողվեց բեռնել տվյալները');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'furniture_upload');
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dpbsyoxw8'}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setEditItem(prev => ({ ...prev, imageUrl: data.secure_url }));
    } catch (err) {
      alert('Image upload failed');
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditItem(items[index]);
  };

  const handleSave = async () => {
    if (editingIndex === null) return;
    const updatedItems = [...items];
    updatedItems[editingIndex] = editItem;
    setItems(updatedItems);
    setEditingIndex(null);
    setEditItem(defaultItem);
    // Save to API
    try {
      await fetch('/api/sale-slider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updatedItems }),
      });
    } catch (err) {
      alert('Չհաջողվեց պահպանել փոփոխությունները');
    }
  };

  const handleAdd = () => {
    const newItem = { ...defaultItem, id: Date.now() };
    setItems([...items, newItem]);
    setEditingIndex(items.length);
    setEditItem(newItem);
  };

  const handleDelete = (index: number) => {
    if (!window.confirm('Վստա՞հ եք, որ ցանկանում եք ջնջել այս նկարը')) return;
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    setEditingIndex(null);
    setEditItem(defaultItem);
    // Save to API
    fetch('/api/sale-slider', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: updatedItems }),
    });
  };

  return (
    <div>
      <NavbarSection style="" logo="/images/logo.png" />
      <div style={{ maxWidth: 1200, margin: '120px auto 40px auto', padding: 24 }}>
        <h1 style={{ marginBottom: 32 }}>Ակցիայի ապրանքների սլայդեր</h1>
        {loading ? (
          <div>Բեռնվում է...</div>
        ) : error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 32 }}>
              {items.map((item, idx) => (
                <div key={item.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, width: 270, background: '#fafafa', position: 'relative' }}>
                  {editingIndex === idx ? (
                    <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
                      <div style={{ marginBottom: 8 }}>
                        <input type="file" accept="image/*" onChange={handleImageUpload} />
                        {editItem.imageUrl && <img src={editItem.imageUrl} alt="preview" style={{ width: '100%', borderRadius: 6, marginTop: 8 }} />}
                      </div>
                      <input
                        type="text"
                        value={editItem.title}
                        onChange={e => setEditItem(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Վերնագիր"
                        style={{ width: '100%', marginBottom: 8, padding: 6 }}
                      />
                      <textarea
                        value={editItem.description}
                        onChange={e => setEditItem(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Նկարագրություն"
                        style={{ width: '100%', marginBottom: 8, padding: 6 }}
                      />
                      <input
                        type="text"
                        value={editItem.price}
                        onChange={e => setEditItem(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="Գին"
                        style={{ width: '100%', marginBottom: 8, padding: 6 }}
                      />
                      <input
                        type="text"
                        value={editItem.link}
                        onChange={e => setEditItem(prev => ({ ...prev, link: e.target.value }))}
                        placeholder="Հղում (optional)"
                        style={{ width: '100%', marginBottom: 8, padding: 6 }}
                      />
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button type="button" onClick={() => setEditingIndex(null)} style={{ background: '#aaa', color: 'white', border: 'none', borderRadius: 4, padding: '6px 16px' }}>Չեղարկել</button>
                        <button type="submit" style={{ background: '#2196F3', color: 'white', border: 'none', borderRadius: 4, padding: '6px 16px' }}>Պահպանել</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <img src={item.imageUrl} alt={item.title} style={{ width: '100%', borderRadius: 6, marginBottom: 8 }} />
                      <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{item.title}</div>
                      <div style={{ color: '#666', marginBottom: 4 }}>{item.description}</div>
                      <div style={{ color: '#2196F3', marginBottom: 4 }}>{item.price}</div>
                      <div style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>{item.link}</div>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button onClick={() => handleEdit(idx)} style={{ background: '#2196F3', color: 'white', border: 'none', borderRadius: 4, padding: '6px 16px' }}>Խմբագրել</button>
                        <button onClick={() => handleDelete(idx)} style={{ background: '#f44336', color: 'white', border: 'none', borderRadius: 4, padding: '6px 16px' }}>Ջնջել</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
              <button onClick={handleAdd} style={{ width: 270, height: 320, border: '2px dashed #bbb', borderRadius: 8, background: '#f5f5f5', color: '#888', fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                + Ավելացնել
              </button>
            </div>
          </>
        )}
      </div>
      <FooterSection />
      <ScrollToTopButton style="" />
    </div>
  );
} 