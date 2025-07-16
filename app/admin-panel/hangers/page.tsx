"use client";
import React, { useState, useEffect, ChangeEvent } from 'react';
import NavbarSection from '@/component/navbar/NavbarSection';
import FooterSection from '@/component/footer/FooterSection';
import ScrollToTopButton from '@/component/utils/ScrollToTopButton';

interface HangerItem {
  id: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  images: string[];
  isAvailable: boolean;
  url: string;
  type: string;
}

export default function AdminHangersPage() {
  const [items, setItems] = useState<HangerItem[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [newType, setNewType] = useState('');
  const [newItem, setNewItem] = useState<HangerItem | null>(null);
  const [editItem, setEditItem] = useState<HangerItem | null>(null);
  const [action, setAction] = useState<'add' | 'edit' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/metal_metal_hangers');
      const data = await res.json();
      setItems(data.items || []);
      setTypes(data.types || []);
    } catch (e) {
      setError('Չհաջողվեց բեռնել տվյալները');
    } finally {
      setLoading(false);
    }
  };

  const saveItemsAndTypes = async (itemsToSave: HangerItem[], typesToSave: string[]) => {
    await fetch('/api/metal_metal_hangers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: itemsToSave, types: typesToSave }),
    });
  };

  const handleAddType = async () => {
    if (newType && !types.includes(newType)) {
      const updatedTypes = [...types, newType];
      await saveItemsAndTypes(items, updatedTypes);
      setTypes(updatedTypes);
      setNewType('');
    }
  };

  const handleDeleteType = async (typeToDelete: string) => {
    if (!window.confirm('Վստա՞հ եք, որ ցանկանում եք ջնջել այս տեսակը')) return;
    try {
      await fetch('/api/metal_metal_hangers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ typeName: typeToDelete }),
      });
      // Re-fetch types and items after deletion
      await fetchData();
    } catch (error) {
      setError('Չհաջողվեց ջնջել տեսակը');
    }
  };

  const handleAddItem = () => {
    const nextId = Math.max(0, ...items.map(item => item.id)) + 1;
    setNewItem({
      id: nextId,
      name: '',
      description: '',
      price: '',
      imageUrl: '',
      images: [],
      isAvailable: true,
      url: `/other/hangers/${nextId}`,
      type: '',
    });
    setAction('add');
  };

  const handleEditItem = (item: HangerItem) => {
    setEditItem(item);
    setAction('edit');
  };

  const handleDeleteItem = async (id: number) => {
    if (window.confirm('Դուք վստա՞հ եք, որ ցանկանում եք ջնջել այս ապրանքը')) {
      try {
        const updatedItems = items.filter(item => item.id !== id);
        await saveItemsAndTypes(updatedItems, types);
        setItems(updatedItems);
      } catch (error) {
        setError('Չհաջողվեց ջնջել ապրանքը');
      }
    }
  };

  const handleSaveItem = async () => {
    try {
      let updatedItems: HangerItem[];
      if (action === 'add' && newItem) {
        if (!newItem.price || isNaN(parseInt(newItem.price.replace(/[^0-9]/g, '')))) {
          setError('Գինը պետք է լինի թիվ');
          return;
        }
        const itemWithUrl = { ...newItem, url: `/other/hangers/${newItem.id}` };
        updatedItems = [...items, itemWithUrl];
      } else if (action === 'edit' && editItem) {
        if (!editItem.price || isNaN(parseInt(editItem.price.replace(/[^0-9]/g, '')))) {
          setError('Գինը պետք է լինի թիվ');
          return;
        }
        const itemWithUrl = { ...editItem, url: `/other/hangers/${editItem.id}` };
        updatedItems = items.map(item => item.id === editItem.id ? itemWithUrl : item);
      } else {
        return;
      }
      await saveItemsAndTypes(updatedItems, types);
      setItems(updatedItems);
      setAction(null);
      setNewItem(null);
      setEditItem(null);
      setError(null);
    } catch (error) {
      setError('Չհաջողվեց պահպանել ապրանքը');
    }
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>, isMainImage: boolean = true) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'furniture_upload');
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dpbsyoxw8'}/image/upload`,
        { method: 'POST', body: formData }
      );
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      const imageUrl = data.secure_url;
      if (action === 'add' && newItem) {
        if (isMainImage) setNewItem({ ...newItem, imageUrl });
        else setNewItem({ ...newItem, images: [...newItem.images, imageUrl] });
      } else if (action === 'edit' && editItem) {
        if (isMainImage) setEditItem({ ...editItem, imageUrl });
        else setEditItem({ ...editItem, images: [...editItem.images, imageUrl] });
      }
    } catch (error) {
      setError('Չհաջողվեց վերբեռնել նկարը');
    }
  };

  return (
    <div>
      <NavbarSection style="" logo="/images/logo.png" />
      <div className="admin-panel-wrapper">
        <div className="admin-panel-header">
          <h1>Կախիչների կառավարում</h1>
          <p>Այստեղ կարող եք ավելացնել, խմբագրել և ջնջել կախիչներ</p>
        </div>
        <div className="admin-type-management">
          <h3>Տեսակների կառավարում</h3>
          <div className="admin-type-input-row">
            <input
              type="text"
              value={newType}
              onChange={e => setNewType(e.target.value)}
              placeholder="Նոր տեսակ"
              className="admin-type-input"
            />
            <button onClick={handleAddType} className="admin-type-add-btn">Ավելացնել տեսակ</button>
          </div>
          <ul className="admin-type-list">
            {types.map(type => (
              <li key={type} className="admin-type-list-item">
                <span>{type}</span>
                <button onClick={() => handleDeleteType(type)} style={{ marginLeft: 8, color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>✕</button>
              </li>
            ))}
          </ul>
        </div>
        {!action && (
          <button onClick={handleAddItem} className="admin-add-btn">Ավելացնել նոր կախիչ</button>
        )}
        {action && (
          <div className="admin-form-container">
            <h2 className="admin-form-title">{editItem ? 'Խմբագրել կախիչ' : 'Ավելացնել նոր կախիչ'}</h2>
            <form onSubmit={e => { e.preventDefault(); handleSaveItem(); }}>
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label>Անվանում</label>
                  <input
                    type="text"
                    value={action === 'edit' ? editItem?.name || '' : newItem?.name || ''}
                    onChange={e => {
                      if (action === 'edit' && editItem) setEditItem({ ...editItem, name: e.target.value });
                      if (action === 'add' && newItem) setNewItem({ ...newItem, name: e.target.value });
                    }}
                    className="admin-form-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Տեսակ</label>
                  <select
                    value={action === 'edit' ? editItem?.type || '' : newItem?.type || ''}
                    onChange={e => {
                      if (action === 'edit' && editItem) setEditItem({ ...editItem, type: e.target.value });
                      if (action === 'add' && newItem) setNewItem({ ...newItem, type: e.target.value });
                    }}
                    className="admin-form-input"
                  >
                    <option value="">Ընտրեք տեսակ</option>
                    {types.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Նկարագրություն</label>
                  <textarea
                    value={action === 'edit' ? editItem?.description || '' : newItem?.description || ''}
                    onChange={e => {
                      if (action === 'edit' && editItem) setEditItem({ ...editItem, description: e.target.value });
                      if (action === 'add' && newItem) setNewItem({ ...newItem, description: e.target.value });
                    }}
                    className="admin-form-textarea"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Գին</label>
                  <input
                    type="text"
                    value={action === 'edit' ? editItem?.price || '' : newItem?.price || ''}
                    onChange={e => {
                      if (action === 'edit' && editItem) setEditItem({ ...editItem, price: e.target.value });
                      if (action === 'add' && newItem) setNewItem({ ...newItem, price: e.target.value });
                    }}
                    className="admin-form-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Հիմնական նկար</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="mainImageUpload"
                      onChange={e => handleImageUpload(e, true)}
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
                    {(action === 'edit' ? editItem?.imageUrl : newItem?.imageUrl) && (
                      <img
                        src={action === 'edit' ? editItem?.imageUrl : newItem?.imageUrl}
                        alt="Main Preview"
                        style={{ maxWidth: '80px', maxHeight: '80px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    )}
                  </div>
                </div>
                <div className="admin-form-group">
                  <label>Լրացուցիչ նկարներ (գալերեա)</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {(action === 'edit' ? editItem?.images : newItem?.images)?.map((img, idx) => (
                      <div key={idx} style={{ position: 'relative' }}>
                        <img
                          src={img}
                          alt={`Sub Preview ${idx+1}`}
                          style={{ maxWidth: '60px', maxHeight: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (action === 'edit' && editItem) setEditItem({ ...editItem, images: editItem.images.filter((_, i) => i !== idx) });
                            if (action === 'add' && newItem) setNewItem({ ...newItem, images: newItem.images.filter((_, i) => i !== idx) });
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
                        onChange={e => handleImageUpload(e, false)}
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
                <div className="admin-form-group">
                  <label>Առկա է</label>
                  <input
                    type="checkbox"
                    checked={action === 'edit' ? editItem?.isAvailable : newItem?.isAvailable}
                    onChange={e => {
                      if (action === 'edit' && editItem) setEditItem({ ...editItem, isAvailable: e.target.checked });
                      if (action === 'add' && newItem) setNewItem({ ...newItem, isAvailable: e.target.checked });
                    }}
                    style={{ marginRight: '10px' }}
                  />
                  <span>{(action === 'edit' ? editItem?.isAvailable : newItem?.isAvailable) ? 'Այո' : 'Ոչ'}</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setNewItem(null);
                      setEditItem(null);
                      setAction(null);
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
        )}
        <div className="admin-items-list">
          {loading ? (
            <div>Բեռնվում է...</div>
          ) : error ? (
            <div style={{ color: 'red' }}>{error}</div>
          ) : items.length === 0 ? (
            <div>Ապրանքներ չկան</div>
          ) : (
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
                      onClick={() => handleEditItem(item)}
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
            </div>
          )}
        </div>
      </div>
      <FooterSection />
      <ScrollToTopButton style="" />
    </div>
  );
} 