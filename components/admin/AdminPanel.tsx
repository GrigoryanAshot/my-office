import React from 'react';
import { useAdminPanel } from '@/hooks/useAdminPanel';
import NavbarSection from '@/component/navbar/NavbarSection';

interface AdminPanelProps {
  title: string;
  description: string;
  apiEndpoint: string;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ title, description, apiEndpoint }) => {
  const {
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
    validationErrors,
    clearValidationError,
    handleImageUpload,
    handleSaveItem,
    handleDeleteItem,
    handleAddType,
    handleDeleteType
  } = useAdminPanel(apiEndpoint);

  return (
    <div>
      <NavbarSection style="" logo="/images/logo.png" />
      <div style={{ padding: '40px', marginTop: '200px' }}>
        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <h1 style={{ margin: 0 }}>{title}</h1>
          <p style={{ margin: '10px 0 0 0', color: '#6c757d' }}>{description}</p>
        </div>
        {/* Type management */}
        <div style={{ marginBottom: 24 }}>
          <h3>Տեսակների կառավարում</h3>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input
              type="text"
              value={newType}
              onChange={e => setNewType(e.target.value)}
              placeholder="Նոր տեսակ"
              style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
            <button onClick={handleAddType} style={{ padding: '8px 16px', background: '#2196F3', color: 'white', border: 'none', borderRadius: 4 }}>Ավելացնել տեսակ</button>
          </div>
          {(!types || types.length === 0) && (
            <div style={{ color: 'red', marginBottom: 8 }}>Տեսակներ չկան (No types found)</div>
          )}
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {types.map(type => {
              if (typeof type === 'string') {
                return (
                  <li key={type} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span>{type}</span>
                    <button onClick={() => handleDeleteType(type)} style={{ background: '#dc3545', color: 'white', border: 'none', borderRadius: 4, padding: '2px 8px', fontSize: 12 }}>Ջնջել</button>
                  </li>
                );
              } else if (type && typeof type === 'object' && 'id' in type && 'name' in type) {
                return (
                  <li key={type.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span>{type.name}</span>
                    <button onClick={() => handleDeleteType(type.name)} style={{ background: '#dc3545', color: 'white', border: 'none', borderRadius: 4, padding: '2px 8px', fontSize: 12 }}>Ջնջել</button>
                  </li>
                );
              } else {
                return null;
              }
            })}
          </ul>
        </div>
        {!activeAction && (
          <button
            onClick={() => setActiveAction('add')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              marginBottom: '20px',
              cursor: 'pointer'
            }}
          >
            Ավելացնել նոր ապրանք
          </button>
        )}
        {activeAction && (
          <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginBottom: '20px' }}>{selectedItem ? 'Խմբագրել ապրանք' : 'Ավելացնել նոր ապրանք'}</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveItem(); }}>
              <div style={{ display: 'grid', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Անվանում:</label>
                  <input
                    type="text"
                    value={selectedItem?.name || newItem.name}
                    onChange={(e) => {
                      selectedItem 
                        ? setSelectedItem({ ...selectedItem, name: e.target.value })
                        : setNewItem({ ...newItem, name: e.target.value });
                      clearValidationError('name');
                    }}
                    style={{ 
                      width: '100%', 
                      padding: '8px', 
                      borderRadius: '4px', 
                      border: validationErrors.name ? '1px solid #dc3545' : '1px solid #ddd' 
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Նկարագրություն:</label>
                  <textarea
                    value={selectedItem?.description || newItem.description}
                    onChange={(e) => selectedItem 
                      ? setSelectedItem({ ...selectedItem, description: e.target.value })
                      : setNewItem({ ...newItem, description: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', minHeight: '100px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Հին գին:</label>
                  <input
                    type="text"
                    value={selectedItem?.oldPrice || newItem.oldPrice || ''}
                    onChange={(e) => selectedItem 
                      ? setSelectedItem({ ...selectedItem, oldPrice: e.target.value })
                      : setNewItem({ ...newItem, oldPrice: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    placeholder="Լրացրեք հին գինը (ըստ ցանկության)"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Գին:</label>
                  <input
                    type="text"
                    value={selectedItem?.price || newItem.price}
                    onChange={(e) => {
                      selectedItem 
                        ? setSelectedItem({ ...selectedItem, price: e.target.value })
                        : setNewItem({ ...newItem, price: e.target.value });
                      clearValidationError('price');
                    }}
                    style={{ 
                      width: '100%', 
                      padding: '8px', 
                      borderRadius: '4px', 
                      border: validationErrors.price ? '1px solid #dc3545' : '1px solid #ddd' 
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Հիմնական նկար:</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, true)}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                    {uploading && <span style={{ color: '#2196F3' }}>Ներբեռնում...</span>}
                    {(selectedItem?.imageUrl || newItem.imageUrl) && (
                      <img 
                        src={selectedItem?.imageUrl || newItem.imageUrl} 
                        alt="preview" 
                        style={{ marginTop: 8, maxWidth: 200, borderRadius: 8 }} 
                      />
                    )}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Լրացուցիչ նկարներ (գալերեա):</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {(selectedItem?.images || newItem.images)?.map((img, idx) => (
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
                              setSelectedItem({ 
                                ...selectedItem, 
                                images: selectedItem.images.filter((_, i) => i !== idx) 
                              });
                            } else {
                              setNewItem({ 
                                ...newItem, 
                                images: newItem.images.filter((_, i) => i !== idx) 
                              });
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
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, false)}
                      style={{ display: 'none' }}
                      id="subImageUpload"
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
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Տեսակ:</label>
                  <select
                    value={selectedItem?.type || newItem.type}
                    onChange={(e) => selectedItem 
                      ? setSelectedItem({ ...selectedItem, type: e.target.value })
                      : setNewItem({ ...newItem, type: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  >
                    <option value="">Ընտրեք տեսակ</option>
                    {types.map(type => {
                      if (typeof type === 'string') {
                        return (
                          <option key={type} value={type}>{type}</option>
                        );
                      } else if (type && typeof type === 'object' && 'id' in type && 'name' in type) {
                        return (
                          <option key={type.id} value={type.name}>{type.name}</option>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Առկայություն:</label>
                  <input
                    type="checkbox"
                    checked={selectedItem?.isAvailable ?? newItem.isAvailable}
                    onChange={(e) => selectedItem 
                      ? setSelectedItem({ ...selectedItem, isAvailable: e.target.checked })
                      : setNewItem({ ...newItem, isAvailable: e.target.checked })}
                    style={{ marginRight: '10px' }}
                  />
                  <span>Առկա է</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedItem(null);
                      setNewItem({
                        id: '',
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
                    style={{ padding: '8px 16px', backgroundColor: '#9e9e9e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Չեղարկել
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '8px 16px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Պահպանել
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
        {!activeAction && items.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Նկար</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Անվանում</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Տեսակ</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Գին</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Առկայություն</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Գործողություններ</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="admin-table-thumb"
                          style={{
                            width: '200px',
                            height: '200px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            display: 'block'
                          }}
                        />
                      ) : (
                        <span style={{ color: '#aaa' }}>No photo</span>
                      )}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{item.name}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                      Տեսակ: {typeof item.type === 'object' && item.type !== null && 'name' in item.type ? (item.type as { name: string }).name : item.type}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{item.price}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                      {item.isAvailable ? 'Առկա է' : 'Պատվիրել'}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setActiveAction('edit');
                        }}
                        style={{ padding: '6px 12px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' }}
                      >
                        Խմբագրել
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Ջնջել
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel; 