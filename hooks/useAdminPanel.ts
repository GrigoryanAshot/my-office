import { useState, useEffect, ChangeEvent } from 'react';

interface FurnitureItem {
  id: string | number;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  images: string[];
  type: string;
  typeId?: string | number | null;
  url: string;
  isAvailable: boolean;
}

interface TypeObject {
  id: string | number;
  name: string;
  [key: string]: any;
}

interface AdminPanelData {
  items: FurnitureItem[];
  types: (string | TypeObject)[];
}

const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'furniture_upload';
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dpbsyoxw8';

export const useAdminPanel = (apiEndpoint: string) => {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<FurnitureItem | null>(null);
  const [items, setItems] = useState<FurnitureItem[]>([]);
  const [types, setTypes] = useState<(string | TypeObject)[]>([]);
  const [newItem, setNewItem] = useState<FurnitureItem>({
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
        console.log('Initial data loaded:', data);
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

      // --- Wardrobes special handling ---
      if (apiEndpoint.includes('wardrobes')) {
        // Find the type object by name
        let typeId = null;
        const typeName = selectedItem?.type || newItem.type;
        if (Array.isArray(currentTypes)) {
          const foundType = currentTypes.find((t: any) => {
            if (typeof t === 'string') return t === typeName;
            if (t && typeof t === 'object' && 'name' in t) return t.name === typeName;
            return false;
          });
          if (foundType && typeof foundType === 'object' && 'id' in foundType) {
            typeId = foundType.id;
          }
        }
        if (!typeId) {
          alert('Please select a valid type.');
          return;
        }
        const itemToSave = selectedItem || {
          ...newItem,
          url: `/windows/wardrobes/new`
        };
        const itemWithImage = {
          name: itemToSave.name,
          description: itemToSave.description,
          image: selectedItem?.imageUrl || newItem.imageUrl,
          typeId: typeId,
          price: itemToSave.price,
          images: itemToSave.images,
          isAvailable: itemToSave.isAvailable,
          url: itemToSave.url
        };
        const saveResponse = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemWithImage)
        });
        if (!saveResponse.ok) {
          const errorText = await saveResponse.text();
          console.error('Admin Panel: Save response error:', errorText);
          throw new Error(`Failed to save item: ${errorText}`);
        }
        // Refetch items and types after saving
        try {
          const refetch = await fetch(apiEndpoint);
          if (refetch.ok) {
            const data = await refetch.json();
            console.log('Refetched data after saving:', data);
            setItems(data.items || []);
            setTypes(data.types || []);
          }
        } catch (e) { 
          console.error('Error refetching data:', e);
        }
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
        return;
      }
      // --- End wardrobes special handling ---

      const itemToSave = selectedItem || {
        ...newItem,
        id: (() => {
          const numericIds = currentItems
            .map((item: FurnitureItem) => typeof item.id === 'number' ? item.id : parseInt(String(item.id)) || 0)
            .filter((id: number) => !isNaN(id));
          return Math.max(0, ...numericIds) + 1;
        })(),
        url: apiEndpoint.includes('chairs')
          ? `/furniture/chairs/${(() => {
              const numericIds = currentItems
                .map((item: FurnitureItem) => typeof item.id === 'number' ? item.id : parseInt(String(item.id)) || 0)
                .filter((id: number) => !isNaN(id));
              return Math.max(0, ...numericIds) + 1;
            })()}`
          : `${apiEndpoint.split('/').pop()}/${(() => {
              const numericIds = currentItems
                .map((item: FurnitureItem) => typeof item.id === 'number' ? item.id : parseInt(String(item.id)) || 0)
                .filter((id: number) => !isNaN(id));
              return Math.max(0, ...numericIds) + 1;
            })()}`
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
        throw new Error(`Failed to save item: ${errorText}`);
      }
      // Refetch items and types after saving
      try {
        const refetch = await fetch(apiEndpoint);
        if (refetch.ok) {
          const data = await refetch.json();
          console.log('Refetched data after saving:', data);
          setItems(data.items || []);
          setTypes(data.types || []);
        }
      } catch (e) { 
        console.error('Error refetching data:', e);
      }
      setItems(updatedItems);
      setTypes(updatedTypes);
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
    } catch (error) {
      console.error('Admin Panel: Error saving item:', error);
      alert(error instanceof Error ? error.message : 'Failed to save item. Please try again.');
    }
  };

  const handleDeleteItem = async (id: string | number) => {
    if (!window.confirm('Դուք վստա՞հ եք, որ ցանկանում եք ջնջել այս ապրանքը:')) {
      return;
    }

    try {
      // Special handling for wardrobes endpoint
      if (apiEndpoint.includes('wardrobes')) {
        const response = await fetch(`${apiEndpoint}/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          const errorData = await response.text();
          console.error('Failed to delete wardrobe:', errorData);
          throw new Error(`Failed to delete wardrobe: ${errorData}`);
        }
        
        // Remove the item from local state
        setItems(prevItems => prevItems.filter(item => item.id !== id));
        return;
      }

      // Default handling for other endpoints (file-based)
      let latestItems: FurnitureItem[] = [];
      let latestTypes: (string | TypeObject)[] = [];
      try {
        const response = await fetch(apiEndpoint);
        if (response.ok) {
          const data = await response.json();
          latestItems = data.items || [];
          latestTypes = data.types || [];
        }
      } catch (e) { /* fallback to local state if fetch fails */ }
      
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

    // Check if type already exists
    const typeExists = types.some(t => {
      if (typeof t === 'string') return t === newType.trim();
      if (t && typeof t === 'object' && 'name' in t) return t.name === newType.trim();
      return false;
    });

    if (typeExists) {
      alert('This type already exists');
      return;
    }

    try {
      // Special handling for wardrobes endpoint
      if (apiEndpoint.includes('wardrobes')) {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newType.trim() })
        });
        if (!response.ok) {
          const errorData = await response.text();
          console.error('Failed to add type:', errorData);
          throw new Error(`Failed to add type: ${errorData}`);
        }
        const data = await response.json();
        if (data.type) {
          setTypes([...types, data.type]);
        }
        setNewType('');
        return;
      }

      // Special handling for podium endpoint
      if (apiEndpoint.includes('podium')) {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ typeName: newType.trim() })
        });
        if (!response.ok) {
          const errorData = await response.text();
          console.error('Failed to add type:', errorData);
          throw new Error(`Failed to add type: ${errorData}`);
        }
        const data = await response.json();
        if (data.success) {
          // Refetch data to get the updated types list
          try {
            const refetchResponse = await fetch(apiEndpoint);
            if (refetchResponse.ok) {
              const refetchData = await refetchResponse.json();
              setItems(refetchData.items || []);
              setTypes(refetchData.types || []);
            }
          } catch (refetchError) {
            console.error('Error refetching data after adding type:', refetchError);
            // Fallback: manually add the type to the state
            setTypes([...types, newType.trim()]);
          }
        }
        setNewType('');
        return;
      }

      // Special handling for chests endpoint
      if (apiEndpoint.includes('chests')) {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ typeName: newType.trim() })
        });
        if (!response.ok) {
          const errorData = await response.text();
          console.error('Failed to add type:', errorData);
          throw new Error(`Failed to add type: ${errorData}`);
        }
        const data = await response.json();
        if (data.success) {
          // Refetch data to get the updated types list
          try {
            const refetchResponse = await fetch(apiEndpoint);
            if (refetchResponse.ok) {
              const refetchData = await refetchResponse.json();
              setItems(refetchData.items || []);
              setTypes(refetchData.types || []);
            }
          } catch (refetchError) {
            console.error('Error refetching data after adding type:', refetchError);
            // Fallback: manually add the type to the state
            setTypes([...types, newType.trim()]);
          }
        }
        setNewType('');
        return;
      }

      // Special handling for shelving endpoint
      if (apiEndpoint.includes('shelving')) {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ typeName: newType.trim() })
        });
        if (!response.ok) {
          const errorData = await response.text();
          console.error('Failed to add type:', errorData);
          throw new Error(`Failed to add type: ${errorData}`);
        }
        const data = await response.json();
        if (data.success) {
          // Refetch data to get the updated types list
          try {
            const refetchResponse = await fetch(apiEndpoint);
            if (refetchResponse.ok) {
              const refetchData = await refetchResponse.json();
              setItems(refetchData.items || []);
              setTypes(refetchData.types || []);
            }
          } catch (refetchError) {
            console.error('Error refetching data after adding type:', refetchError);
            // Fallback: manually add the type to the state
            setTypes([...types, newType.trim()]);
          }
        }
        setNewType('');
        return;
      }

      // Default handling for other endpoints
      const updatedTypes = [...types, newType.trim()];
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: items, types: updatedTypes })
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
    try {
      // Special handling for wardrobes endpoint
      if (apiEndpoint.includes('wardrobes')) {
        // Find the type object by name
        const typeObject = types.find(t => {
          if (typeof t === 'string') return t === typeToDelete;
          if (t && typeof t === 'object' && 'name' in t) return t.name === typeToDelete;
          return false;
        });

        if (!typeObject) {
          throw new Error('Type not found');
        }

        // Get the type ID, handling both string and object types
        const typeId = typeof typeObject === 'string' ? typeObject : typeObject.id;

        // Remove the type from the types array
        const updatedTypes = types.filter(t => {
          if (typeof t === 'string') return t !== typeToDelete;
          if (t && typeof t === 'object' && 'name' in t) return t.name !== typeToDelete;
          return true;
        });

        // Update items that had this type
        const updatedItems = items.map(item => {
          if (item.type === typeToDelete) {
            return {
              id: item.id,
              name: item.name,
              description: item.description,
              price: item.price,
              imageUrl: item.imageUrl,
              images: item.images,
              type: '',
              typeId: null,
              url: item.url,
              isAvailable: item.isAvailable
            };
          }
          return {
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            imageUrl: item.imageUrl,
            images: item.images,
            type: item.type,
            typeId: item.typeId,
            url: item.url,
            isAvailable: item.isAvailable
          };
        });

        // Prepare API request data
        const apiItems = updatedItems.map(item => ({
          name: item.name,
          description: item.description,
          image: item.imageUrl,
          typeId: item.typeId,
          price: item.price,
          images: item.images,
          isAvailable: item.isAvailable,
          url: item.url
        }));

        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: apiItems,
            types: updatedTypes.map(t => {
              if (typeof t === 'string') return t;
              if (t && typeof t === 'object' && 'name' in t) return t.name;
              return '';
            }),
            action: 'deleteType',
            typeName: typeToDelete
          })
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error('Failed to delete type:', errorData);
          throw new Error(`Failed to delete type: ${errorData}`);
        }

        setTypes(updatedTypes);
        setItems(updatedItems);
        return;
      }

      // Special handling for podium endpoint
      if (apiEndpoint.includes('podium')) {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'deleteType',
            typeName: typeToDelete
          })
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error('Failed to delete type:', errorData);
          throw new Error(`Failed to delete type: ${errorData}`);
        }

        // Update local state
        const updatedTypes = types.filter(t => t !== typeToDelete);
        const updatedItems = items.map(item =>
          item.type === typeToDelete ? { ...item, type: '' } : item
        );

        setTypes(updatedTypes);
        setItems(updatedItems);
        return;
      }

      // Special handling for chests endpoint
      if (apiEndpoint.includes('chests')) {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'deleteType',
            typeName: typeToDelete
          })
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error('Failed to delete type:', errorData);
          throw new Error(`Failed to delete type: ${errorData}`);
        }

        // Update local state
        const updatedTypes = types.filter(t => t !== typeToDelete);
        const updatedItems = items.map(item =>
          item.type === typeToDelete ? { ...item, type: '' } : item
        );

        setTypes(updatedTypes);
        setItems(updatedItems);
        return;
      }

      // Special handling for shelving endpoint
      if (apiEndpoint.includes('shelving')) {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'deleteType',
            typeName: typeToDelete
          })
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error('Failed to delete type:', errorData);
          throw new Error(`Failed to delete type: ${errorData}`);
        }

        // Update local state
        const updatedTypes = types.filter(t => t !== typeToDelete);
        const updatedItems = items.map(item =>
          item.type === typeToDelete ? { ...item, type: '' } : item
        );

        setTypes(updatedTypes);
        setItems(updatedItems);
        return;
      }

      // Default handling for other endpoints
      const updatedTypes = types.filter(t => t !== typeToDelete);
      const updatedItems = items.map(item =>
        item.type === typeToDelete ? { ...item, type: '' } : item
      );

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updatedItems, types: updatedTypes })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Failed to delete type:', errorData);
        throw new Error(`Failed to delete type: ${errorData}`);
      }

      setTypes(updatedTypes);
      setItems(updatedItems);
    } catch (err) {
      console.error('Error deleting type:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete type');
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