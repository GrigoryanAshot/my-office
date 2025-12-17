"use client";

import React, { useEffect, useState, ChangeEvent } from 'react';
import NavbarSection from '@/component/navbar/NavbarSection';
import FooterSection from '@/component/footer/FooterSection';
import ScrollToTopButton from '@/component/utils/ScrollToTopButton';
import './page.css';

interface SaleSliderItem {
  id: number;
  imageUrl: string;
  images: string[];
  title: string;
  description: string;
  price: string;
  link: string;
  oldPrice?: string;
}

const defaultItem: SaleSliderItem = {
  id: 0,
  imageUrl: '',
  images: [],
  title: '',
  description: '',
  price: '',
  link: '',
  oldPrice: '',
};

export default function SaleSliderAdminPage() {
  const [items, setItems] = useState<SaleSliderItem[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<SaleSliderItem>(defaultItem);
  const [newItem, setNewItem] = useState<SaleSliderItem>({ ...defaultItem, id: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/sale-slider');
      if (!response.ok) throw new Error('Failed to fetch sale slider items');
      const data = await response.json();
      // This now replaces all items with the new data
      if (Array.isArray(data.items)) {
        setItems(data.items); // Complete replacement
      }
    } catch (err) {
      setError('Չհաջողվեց բեռնել տվյալները');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>, isNew: boolean = false, isMainImage: boolean = true) => {
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
      if (isNew) {
        if (isMainImage) {
          setNewItem(prev => ({ ...prev, imageUrl: data.secure_url }));
        } else {
          setNewItem(prev => ({ ...prev, images: [...prev.images, data.secure_url] }));
        }
      } else {
        if (isMainImage) {
          setEditItem(prev => ({ ...prev, imageUrl: data.secure_url }));
        } else {
          setEditItem(prev => ({ ...prev, images: [...prev.images, data.secure_url] }));
        }
      }
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
    setSaving(true);
    const updatedItems = [...items];
    updatedItems[editingIndex] = editItem;
    setEditingIndex(null);
    setEditItem(defaultItem);
    // Save to API
    try {
      const requestBody = { 
        items: updatedItems,
        types: [] // Add empty types array to match API expectations
      };
      console.log('Saving items:', requestBody);
      const response = await fetch('/api/sale-slider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const responseData = await response.json();
      console.log('Save response:', responseData);
      console.log('Sale slider items saved successfully');
      // Refetch data to ensure consistency
      await fetchItems();
    } catch (err) {
      console.error('Error saving sale slider items:', err);
      alert(`Չհաջողվեց պահպանել փոփոխությունները: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    // Allow adding items with either title or image (or both)
    if (!newItem.title.trim() && !newItem.imageUrl) {
      alert('Խնդրում ենք լրացնել վերնագիր կամ վերբեռնել նկար');
      return;
    }
    
    setSaving(true);
    // Generate sequential ID starting from 1
    const maxId = items.length > 0 ? Math.max(...items.map(item => item.id)) : 0;
    const itemToAdd = { ...newItem, id: maxId + 1 };
    const updatedItems = [...items, itemToAdd];
    setNewItem({ ...defaultItem, id: 0 });
    // Save to API
    try {
      const requestBody = { items: updatedItems, types: [] };
      console.log('Adding items:', requestBody);
      const response = await fetch('/api/sale-slider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const responseData = await response.json();
      console.log('Add response:', responseData);
      console.log('Sale slider item added successfully');
      // Refetch data to ensure consistency
      await fetchItems();
    } catch (err) {
      console.error('Error adding sale slider item:', err);
      alert(`Չհաջողվեց ավելացնել ապրանքը: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (index: number) => {
    if (!window.confirm('Վստա՞հ եք, որ ցանկանում եք ջնջել այս նկարը')) return;
    setDeleting(index);
    const updatedItems = items.filter((_, i) => i !== index);
    setEditingIndex(null);
    setEditItem(defaultItem);
    // LOGGING: Show items before POST
    console.log('Items before POST after delete:', updatedItems);
    // Save to API
    try {
      const requestBody = { items: updatedItems, types: [] };
      console.log('Deleting items:', requestBody);
      const response = await fetch('/api/sale-slider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const responseData = await response.json();
      console.log('Delete response:', responseData);
      console.log('Sale slider item deleted successfully');
      // Refetch data to ensure consistency
      await fetchItems();
    } catch (err) {
      console.error('Error deleting sale slider item:', err);
      alert(`Չհաջողվեց ջնջել ապրանքը: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <NavbarSection style="" logo="/images/logo.png" />
      <div className="sale-admin-container">
        <h1 className="sale-admin-title">Ակցիայի ապրանքների սլայդեր</h1>
        {loading ? (
          <div className="sale-admin-loading">Բեռնվում է...</div>
        ) : error ? (
          <div className="sale-admin-error">{error}</div>
        ) : (
          <>
            <table className="sale-admin-table">
              <thead>
                <tr>
                  <th>Նկար</th>
                  <th>Վերնագիր</th>
                  <th>Նկարագրություն</th>
                  <th>Գին</th>
                  <th>Հին գին</th>
                  <th>Հղում</th>
                  <th>Գործողություններ</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={item.id}>
                    <td>
                      <img src={item.imageUrl} alt={item.title} className="sale-admin-image" />
                    </td>
                    {editingIndex === idx ? (
                      <>
                        <td colSpan={4}>
                          <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="sale-admin-edit-form">
                            <div style={{ marginBottom: '10px' }}>
                              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Հիմնական նկար:</label>
                              <input type="file" accept="image/*" onChange={e => handleImageUpload(e, false, true)} className="sale-admin-input" />
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Լրացուցիչ նկարներ:</label>
                              <input type="file" accept="image/*" onChange={e => handleImageUpload(e, false, false)} className="sale-admin-input" />
                              {editItem.images && editItem.images.length > 0 && (
                                <div style={{ marginTop: '5px' }}>
                                  <label style={{ fontSize: '12px', color: '#666' }}>Ներկա լրացուցիչ նկարներ:</label>
                                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '5px' }}>
                                    {editItem.images.map((img, index) => (
                                      <div key={index} style={{ position: 'relative' }}>
                                        <img src={img} alt={`Additional ${index + 1}`} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                                        <button
                                          type="button"
                                          onClick={() => setEditItem(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))}
                                          style={{
                                            position: 'absolute',
                                            top: '-5px',
                                            right: '-5px',
                                            background: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '20px',
                                            height: '20px',
                                            fontSize: '12px',
                                            cursor: 'pointer'
                                          }}
                                        >
                                          ×
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            <input
                              type="text"
                              value={editItem.title}
                              onChange={e => setEditItem(prev => ({ ...prev, title: e.target.value }))}
                              placeholder="Վերնագիր"
                              className="sale-admin-input"
                            />
                            <input
                              type="text"
                              value={editItem.description}
                              onChange={e => setEditItem(prev => ({ ...prev, description: e.target.value }))}
                              placeholder="Նկարագրություն"
                              className="sale-admin-input"
                            />
                            <input
                              type="text"
                              value={editItem.price}
                              onChange={e => setEditItem(prev => ({ ...prev, price: e.target.value }))}
                              placeholder="Գին"
                              className="sale-admin-input"
                            />
                            <input
                              type="text"
                              value={editItem.oldPrice || ''}
                              onChange={e => setEditItem(prev => ({ ...prev, oldPrice: e.target.value }))}
                              placeholder="Հին գին (optional)"
                              className="sale-admin-input"
                            />
                            <input
                              type="text"
                              value={editItem.link}
                              onChange={e => setEditItem(prev => ({ ...prev, link: e.target.value }))}
                              placeholder="Հղում (optional)"
                              className="sale-admin-input"
                            />
                            <button type="button" onClick={() => setEditingIndex(null)} className="sale-admin-button cancel" disabled={saving}>Չեղարկել</button>
                            <button type="submit" className="sale-admin-button save" disabled={saving}>
                              {saving ? 'Պահպանվում է...' : 'Պահպանել'}
                            </button>
                          </form>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="sale-admin-item-title">{item.title}</td>
                        <td className="sale-admin-item-description">{item.description}</td>
                        <td className="sale-admin-item-price">{item.price}</td>
                        <td className="sale-admin-item-old-price">{item.oldPrice || '-'}</td>
                        <td className="sale-admin-item-link">{item.link}</td>
                        <td>
                          <div className="sale-admin-actions">
                            <button onClick={() => handleEdit(idx)} className="sale-admin-button edit" disabled={saving || deleting !== null}>Խմբագրել</button>
                            <button onClick={() => handleDelete(idx)} className="sale-admin-button delete" disabled={saving || deleting !== null}>
                              {deleting === idx ? 'Ջնջվում է...' : 'Ջնջել'}
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                {/* Add new item form as a table row */}
                <tr className="sale-admin-add-row">
                  <td>
                    {newItem.imageUrl && <img src={newItem.imageUrl} alt="preview" className="sale-admin-image" />}
                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Հիմնական նկար:</label>
                      <input type="file" accept="image/*" onChange={e => handleImageUpload(e, true, true)} className="sale-admin-input" />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Լրացուցիչ նկարներ:</label>
                      <input type="file" accept="image/*" onChange={e => handleImageUpload(e, true, false)} className="sale-admin-input" />
                      {newItem.images && newItem.images.length > 0 && (
                        <div style={{ marginTop: '5px' }}>
                          <label style={{ fontSize: '12px', color: '#666' }}>Ներկա լրացուցիչ նկարներ:</label>
                          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '5px' }}>
                            {newItem.images.map((img, index) => (
                              <div key={index} style={{ position: 'relative' }}>
                                <img src={img} alt={`Additional ${index + 1}`} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                                <button
                                  type="button"
                                  onClick={() => setNewItem(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))}
                                  style={{
                                    position: 'absolute',
                                    top: '-5px',
                                    right: '-5px',
                                    background: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    fontSize: '12px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={newItem.title}
                      onChange={e => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Վերնագիր"
                      className="sale-admin-input"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={newItem.description}
                      onChange={e => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Նկարագրություն"
                      className="sale-admin-input"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={newItem.price}
                      onChange={e => setNewItem(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="Գին"
                      className="sale-admin-input"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={newItem.oldPrice || ''}
                      onChange={e => setNewItem(prev => ({ ...prev, oldPrice: e.target.value }))}
                      placeholder="Հին գին (optional)"
                      className="sale-admin-input"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={newItem.link}
                      onChange={e => setNewItem(prev => ({ ...prev, link: e.target.value }))}
                      placeholder="Հղում (optional)"
                      className="sale-admin-input"
                    />
                  </td>
                  <td>
                    <button onClick={handleAdd} className="sale-admin-button add" disabled={saving || deleting !== null}>
                      {saving ? 'Ավելացվում է...' : '+ Ավելացնել'}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        )}
      </div>
      <FooterSection />
      <ScrollToTopButton style="" />
    </div>
  );
} 