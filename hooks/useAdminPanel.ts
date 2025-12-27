import { useState, useEffect, ChangeEvent } from 'react';

interface FurnitureItem {
  id: string | number;
  name: string;
  description: string;
  price: string;
  oldPrice?: string;
  imageUrl: string;
  images: string[];
  type: string;
  typeId?: string | number | null;
  url: string;
  isAvailable: boolean;
  seoKeywords?: string; // SEO keywords/tools
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
    oldPrice: '',
    imageUrl: '',
    images: [],
    type: '',
    url: '',
    isAvailable: true,
    seoKeywords: ''
  });
  const [newType, setNewType] = useState('');
  const [uploading, setUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{name?: boolean; price?: boolean}>({});

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

  // Utility function to safely POST items/types
  async function safePost(apiEndpoint: string, items: any[], types: any[]) {
    // Allow sending empty arrays when explicitly deleting types
    // This prevents the issue where the last type cannot be deleted
    await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, types })
    });
  }

  const handleSaveItem = async () => {
    // Validate required fields
    const itemToValidate = selectedItem || newItem;
    
    const errors: {name?: boolean; price?: boolean} = {};
    
    if (!itemToValidate.name.trim()) {
      errors.name = true;
    }
    
    if (!itemToValidate.price.trim()) {
      errors.price = true;
    }
    
    setValidationErrors(errors);
    
    if (errors.name || errors.price) {
      if (errors.name) {
        alert('Խնդրում ենք մուտքագրել ապրանքի անվանումը');
      }
      if (errors.price) {
        alert('Խնդրում ենք մուտքագրել ապրանքի գինը');
      }
      return;
    }
    
    // Check if we have an image URL from either the selected item or new item
    const hasImageUrl = selectedItem?.imageUrl || newItem.imageUrl;
    
    // If we're editing an existing item and it already has an image, allow saving
    if (selectedItem && selectedItem.imageUrl) {
      // Allow saving existing item with existing image
    } else if (!hasImageUrl) {
      // Only require image for new items or when editing without existing image
      alert('Please upload a photo before saving.');
      return;
    }

    try {
      // Special handling for wardrobes endpoint (Prisma-based)
      if (apiEndpoint.includes('wardrobes')) {
        const itemToSave = selectedItem || newItem;
        
        // Find the type ID if we have a type name
        let typeId = null;
        if (itemToSave.type) {
          const typeObj = types.find(t => 
            (typeof t === 'string' && t === itemToSave.type) ||
            (typeof t === 'object' && t && 'name' in t && t.name === itemToSave.type)
          );
          if (typeObj && typeof typeObj === 'object' && 'id' in typeObj) {
            typeId = typeObj.id;
          }
        }

        const requestBody = {
          id: itemToSave.id, // Include ID for updates
          name: itemToSave.name,
          description: itemToSave.description,
          image: itemToSave.imageUrl, // Map imageUrl to image for Prisma
          price: itemToSave.price,
          oldPrice: itemToSave.oldPrice, // Add oldPrice field
          images: itemToSave.images,
          isAvailable: itemToSave.isAvailable,
          url: itemToSave.url,
          type: itemToSave.type, // Send type name for API to resolve
          typeId: typeId,
          seoKeywords: itemToSave.seoKeywords || '' // Add SEO keywords
        };
        
        console.log('Sending wardrobe data to API:', {
          endpoint: apiEndpoint,
          method: selectedItem ? 'PUT' : 'POST',
          requestBody
        });
        
        // Use PUT for editing existing items, POST for creating new items
        const method = selectedItem ? 'PUT' : 'POST';
        const saveResponse = await fetch(apiEndpoint, {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });
        
        if (!saveResponse.ok) {
          const errorText = await saveResponse.text();
          console.error('Admin Panel: Save response error:', errorText);
          throw new Error(`Failed to save item: ${errorText}`);
        }
        
        // Refetch data after saving
        try {
          const refetch = await fetch(apiEndpoint);
          if (refetch.ok) {
            const data = await refetch.json();
            console.log('Refetched wardrobe data after saving:', data);
            setItems(data.items || []);
            setTypes(data.types || []);
          }
        } catch (e) { 
          console.error('Error refetching wardrobe data:', e);
        }
        
        setSelectedItem(null);
        setNewItem({
          id: '',
          name: '',
          description: '',
          price: '',
          oldPrice: '',
          imageUrl: '',
          images: [],
          type: '',
          url: '',
          isAvailable: true,
          seoKeywords: ''
        });
        setActiveAction(null);
        return;
      }

      // Default handling for Redis-based endpoints
      const itemToSave = selectedItem || {
        ...newItem,
        id: (() => {
          const numericIds = items
            .map((item: FurnitureItem) => typeof item.id === 'number' ? item.id : parseInt(String(item.id)) || 0)
            .filter((id: number) => !isNaN(id));
          return Math.max(0, ...numericIds) + 1;
        })(),
        url: apiEndpoint.includes('chairs')
          ? `/furniture/chairs/${(() => {
              const numericIds = items
                .map((item: FurnitureItem) => typeof item.id === 'number' ? item.id : parseInt(String(item.id)) || 0)
                .filter((id: number) => !isNaN(id));
              return Math.max(0, ...numericIds) + 1;
            })()}`
          : `${apiEndpoint.split('/').pop()}/${(() => {
              const numericIds = items
                .map((item: FurnitureItem) => typeof item.id === 'number' ? item.id : parseInt(String(item.id)) || 0)
                .filter((id: number) => !isNaN(id));
              return Math.max(0, ...numericIds) + 1;
            })()}`
      };

      const itemWithImage = {
        ...itemToSave,
        imageUrl: selectedItem?.imageUrl || newItem.imageUrl
      };

      const updatedTypes = [...types];
      if (itemWithImage.type && !updatedTypes.includes(itemWithImage.type)) {
        updatedTypes.push(itemWithImage.type);
      }

      const updatedItems = selectedItem
        ? items.map((item: FurnitureItem) => 
            item.id === selectedItem.id ? itemWithImage : item
          )
        : [...items, itemWithImage];

      const requestBody = {
        items: updatedItems,
        types: updatedTypes
      };
      
      // Debug: Log the description of the item being saved
      const itemBeingSaved = selectedItem || itemWithImage;
      console.log('Item being saved description:', JSON.stringify(itemBeingSaved.description));
      console.log('Item being saved description length:', itemBeingSaved.description.length);
      console.log('Item being saved description includes newlines:', itemBeingSaved.description.includes('\n'));
      
      console.log('Sending data to API:', {
        endpoint: apiEndpoint,
        requestBody,
        updatedItemsCount: updatedItems.length,
        updatedTypesCount: updatedTypes.length
      });
      
      const saveResponse = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      if (!saveResponse.ok) {
        const errorText = await saveResponse.text();
        console.error('Admin Panel: Save response error:', errorText);
        throw new Error(`Failed to save item: ${errorText}`);
      }
      // Update local state immediately
      setItems(updatedItems);
      setTypes(updatedTypes);
      
      // Sync to sale slider (will add if has oldPrice, remove if doesn't)
      const savedItem = selectedItem || itemWithImage;
      await syncToSaleSlider(savedItem);
      
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
        isAvailable: true,
        seoKeywords: ''
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
      console.log('Attempting to delete item with ID:', id, 'Type:', typeof id);
      
      // Special handling for wardrobes endpoint (Prisma-based)
      if (apiEndpoint.includes('wardrobes')) {
        const response = await fetch(apiEndpoint, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'deleteItem', itemId: id })
        });
        
        if (!response.ok) {
          const errorData = await response.text();
          console.error('Failed to delete wardrobe item:', errorData);
          throw new Error(`Failed to delete item: ${errorData}`);
        }
        
        // Find the item being deleted for sale slider sync
        const deletedItem = items.find(item => {
          const itemIdStr = String(item.id);
          const itemIdNum = Number(item.id);
          const deleteIdStr = String(id);
          const deleteIdNum = Number(id);
          return itemIdStr === deleteIdStr || itemIdNum === deleteIdNum;
        });

        // Remove from sale slider if the deleted item was there
        if (deletedItem) {
          await removeFromSaleSlider(deletedItem);
        }

        // Refetch data after deleting item
        try {
          const refetchResponse = await fetch(apiEndpoint);
          if (refetchResponse.ok) {
            const refetchData = await refetchResponse.json();
            setItems(refetchData.items || []);
            setTypes(refetchData.types || []);
            console.log('Refetched wardrobe data after delete:', refetchData);
          }
        } catch (refetchError) {
          console.error('Error refetching wardrobe data after delete:', refetchError);
        }
        
        console.log('Wardrobe item deleted successfully:', id);
        return;
      }

      // Default handling for JSON-based endpoints (like takht)
      console.log('Using default delete handling for endpoint:', apiEndpoint);
      
      const response = await fetch(apiEndpoint, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: id })
      });
      
      console.log('Delete response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Failed to delete item:', errorData);
        throw new Error(`Failed to delete item: ${errorData}`);
      }
      
      const deleteResult = await response.json();
      console.log('Delete result:', deleteResult);
      
      // Find the item being deleted for sale slider sync
      const deletedItem = items.find(item => {
        const itemIdStr = String(item.id);
        const itemIdNum = Number(item.id);
        const deleteIdStr = String(id);
        const deleteIdNum = Number(id);
        return itemIdStr === deleteIdStr || itemIdNum === deleteIdNum;
      });

      // Remove the item from local state
      const updatedItems = items.filter(item => {
        const itemIdStr = String(item.id);
        const itemIdNum = Number(item.id);
        const deleteIdStr = String(id);
        const deleteIdNum = Number(id);
        return itemIdStr !== deleteIdStr && itemIdNum !== deleteIdNum;
      });
      
      console.log('Updated items after delete:', updatedItems);
      setItems(updatedItems);

      // Remove from sale slider if the deleted item was there
      if (deletedItem) {
        await removeFromSaleSlider(deletedItem);
      }
      
      // LOGGING: Show items before POST
      console.log('Items before POST after delete:', updatedItems);
      // Immediately POST updated items/types (awaited)
      await safePost(apiEndpoint, updatedItems, types);
      // LOGGING: Confirm POST was sent
      console.log('POSTed to backend:', { items: updatedItems, types });
      // Re-fetch data after deleting item (awaited)
      try {
        const refetchResponse = await fetch(apiEndpoint);
        if (refetchResponse.ok) {
          const refetchData = await refetchResponse.json();
          setItems(refetchData.items || []);
          setTypes(refetchData.types || []);
          // LOGGING: Show data after re-fetch
          console.log('Re-fetched data after POST:', refetchData);
        }
      } catch (refetchError) {
        console.error('Error refetching data after deleting item:', refetchError);
      }
      console.log('Item deleted successfully:', id);
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

      // Special handling for podium endpoint (add type)
      if (apiEndpoint.includes('podium')) {
        // Use the same logic as tables/sofas: POST full updated items/types, then re-fetch
        const updatedTypes = [...types, newType.trim()];
        await safePost(apiEndpoint, items, updatedTypes);
        setTypes(updatedTypes);
        setNewType('');
        // Re-fetch data after adding type
        try {
          const refetchResponse = await fetch(apiEndpoint);
          if (refetchResponse.ok) {
            const refetchData = await refetchResponse.json();
            setItems(refetchData.items || []);
            setTypes(refetchData.types || []);
          }
        } catch (refetchError) {
          console.error('Error refetching data after adding type:', refetchError);
        }
        return;
      }

      // Special handling for chests endpoint (add type)
      if (apiEndpoint.includes('chests')) {
        const updatedTypes = [...types, newType.trim()];
        await safePost(apiEndpoint, items, updatedTypes);
        setTypes(updatedTypes);
        setNewType('');
        // Re-fetch data after adding type
        try {
          const refetchResponse = await fetch(apiEndpoint);
          if (refetchResponse.ok) {
            const refetchData = await refetchResponse.json();
            setItems(refetchData.items || []);
            setTypes(refetchData.types || []);
          }
        } catch (refetchError) {
          console.error('Error refetching data after adding type:', refetchError);
        }
        return;
      }

      // Special handling for shelving endpoint
      if (apiEndpoint.includes('shelving')) {
        const updatedTypes = [...types, newType.trim()];
        await safePost(apiEndpoint, items, updatedTypes);
        setTypes(updatedTypes);
        setNewType('');
        // Re-fetch data after adding type
        try {
          const refetchResponse = await fetch(apiEndpoint);
          if (refetchResponse.ok) {
            const refetchData = await refetchResponse.json();
            setItems(refetchData.items || []);
            setTypes(refetchData.types || []);
          }
        } catch (refetchError) {
          console.error('Error refetching data after adding type:', refetchError);
        }
        return;
      }

      // Special handling for sofas endpoint (add type)
      if (apiEndpoint.includes('sofas')) {
        // Use the same logic as tables2: POST full updated items/types, then re-fetch
        const updatedTypes = [...types, newType.trim()];
        await safePost(apiEndpoint, items, updatedTypes);
        setTypes(updatedTypes);
        setNewType('');
        // Re-fetch data after adding type
        try {
          const refetchResponse = await fetch(apiEndpoint);
          if (refetchResponse.ok) {
            const refetchData = await refetchResponse.json();
            setItems(refetchData.items || []);
            setTypes(refetchData.types || []);
          }
        } catch (refetchError) {
          console.error('Error refetching data after adding type:', refetchError);
        }
        return;
      }

      // Special handling for hangers endpoint (add type)
      if (apiEndpoint.includes('hangers')) {
        // Use the same logic as tables2/sofas: POST full updated items/types, then re-fetch
        const updatedTypes = [...types, newType.trim()];
        await safePost(apiEndpoint, items, updatedTypes);
        setTypes(updatedTypes);
        setNewType('');
        // Re-fetch data after adding type
        try {
          const refetchResponse = await fetch(apiEndpoint);
          if (refetchResponse.ok) {
            const refetchData = await refetchResponse.json();
            setItems(refetchData.items || []);
            setTypes(refetchData.types || []);
          }
        } catch (refetchError) {
          console.error('Error refetching data after adding type:', refetchError);
        }
        return;
      }

      // Default handling for other endpoints (including tables2, chairs, etc.)
      const updatedTypes = [...types, newType.trim()];
      await safePost(apiEndpoint, items, updatedTypes);
      setTypes(updatedTypes);
      setNewType('');
      // Refetch data after adding type
      try {
        const refetchResponse = await fetch(apiEndpoint);
        if (refetchResponse.ok) {
          const refetchData = await refetchResponse.json();
          setItems(refetchData.items || []);
          setTypes(refetchData.types || []);
        }
      } catch (refetchError) {
        console.error('Error refetching data after adding type:', refetchError);
      }
      return;
    } catch (err) {
      console.error('Error adding type:', err);
      alert(err instanceof Error ? err.message : 'Failed to add type');
    }
  };

  const clearValidationError = (field: 'name' | 'price') => {
    setValidationErrors(prev => ({ ...prev, [field]: false }));
  };

  // Function to sync sale items to sale slider
  const syncToSaleSlider = async (item: FurnitureItem) => {
    try {
      // Get current sale slider items
      const saleResponse = await fetch('/api/sale-slider');
      if (!saleResponse.ok) {
        console.error('Failed to fetch sale slider items');
        return;
      }
      const saleData = await saleResponse.json();
      const currentSaleItems = saleData.items || [];

      // Determine source and link based on API endpoint
      const source = apiEndpoint.includes('tables') ? 'tables' : 
                    apiEndpoint.includes('chairs') ? 'chairs' :
                    apiEndpoint.includes('sofas') ? 'sofas' :
                    apiEndpoint.includes('armchairs') ? 'armchairs' :
                    apiEndpoint.includes('poufs') ? 'poufs' :
                    apiEndpoint.includes('takht') ? 'takht' : 'unknown';
      const link = apiEndpoint.includes('tables') ? `/furniture/tables/${item.id}` :
                  apiEndpoint.includes('chairs') ? `/furniture/chairs/${item.id}` :
                  apiEndpoint.includes('sofas') ? `/softfurniture/sofas/${item.id}` :
                  apiEndpoint.includes('armchairs') ? `/softfurniture/armchairs/${item.id}` :
                  apiEndpoint.includes('poufs') ? `/softfurniture/poufs/${item.id}` :
                  apiEndpoint.includes('takht') ? `/furniture/takht/${item.id}` : '';

      // Check if item already exists in sale slider
      const existingIndex = currentSaleItems.findIndex((saleItem: any) => 
        saleItem.id === item.id && saleItem.source === source
      );

      // If item has oldPrice, add/update it in sale slider
      if (item.oldPrice && item.oldPrice.trim()) {
        // Create sale slider item
        const saleItem = {
          id: item.id,
          imageUrl: item.imageUrl,
          title: item.name,
          description: item.description,
          price: item.price,
          link: link,
          source: source, // Track where this item came from
          originalItem: item // Keep reference to original item
        };

        let updatedSaleItems;
        if (existingIndex >= 0) {
          // Update existing item
          updatedSaleItems = [...currentSaleItems];
          updatedSaleItems[existingIndex] = saleItem;
        } else {
          // Add new item
          updatedSaleItems = [...currentSaleItems, saleItem];
        }

        // Save to sale slider
        const saveResponse = await fetch('/api/sale-slider', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: updatedSaleItems, types: [] })
        });

        if (saveResponse.ok) {
          console.log('Successfully synced item to sale slider:', item.name);
        } else {
          console.error('Failed to sync item to sale slider');
        }
      } else {
        // If item doesn't have oldPrice, remove it from sale slider
        if (existingIndex >= 0) {
          const updatedSaleItems = currentSaleItems.filter((_: any, index: number) => index !== existingIndex);
          
          const saveResponse = await fetch('/api/sale-slider', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: updatedSaleItems, types: [] })
          });

          if (saveResponse.ok) {
            console.log('Successfully removed item from sale slider:', item.name);
          } else {
            console.error('Failed to remove item from sale slider');
          }
        }
      }
    } catch (error) {
      console.error('Error syncing to sale slider:', error);
    }
  };

  const removeFromSaleSlider = async (deletedItem: FurnitureItem) => {
    try {
      // Get current sale slider items
      const saleResponse = await fetch('/api/sale-slider');
      if (!saleResponse.ok) {
        console.error('Failed to fetch sale slider items');
        return;
      }
      const saleData = await saleResponse.json();
      const currentSaleItems = saleData.items || [];

      // Determine source based on API endpoint
      const source = apiEndpoint.includes('tables') ? 'tables' : 
                    apiEndpoint.includes('chairs') ? 'chairs' :
                    apiEndpoint.includes('sofas') ? 'sofas' :
                    apiEndpoint.includes('armchairs') ? 'armchairs' :
                    apiEndpoint.includes('poufs') ? 'poufs' :
                    apiEndpoint.includes('takht') ? 'takht' :
                    apiEndpoint.includes('chests') ? 'chests' :
                    apiEndpoint.includes('stands') ? 'stands' :
                    apiEndpoint.includes('wardrobes') ? 'wardrobes' :
                    apiEndpoint.includes('wall-decor') ? 'wall-decor' :
                    apiEndpoint.includes('whiteboard') ? 'whiteboard' :
                    apiEndpoint.includes('hangers') ? 'hangers' : 'unknown';

      // Find and remove the item from sale slider
      const updatedSaleItems = currentSaleItems.filter((saleItem: any) => 
        !(saleItem.id === deletedItem.id && saleItem.source === source)
      );

      // Only update if there was actually an item to remove
      if (updatedSaleItems.length !== currentSaleItems.length) {
        const saveResponse = await fetch('/api/sale-slider', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: updatedSaleItems, types: [] })
        });

        if (saveResponse.ok) {
          console.log('Successfully removed item from sale slider:', deletedItem.name);
        } else {
          console.error('Failed to remove item from sale slider');
        }
      }
    } catch (error) {
      console.error('Error removing from sale slider:', error);
    }
  };

  const handleDeleteType = async (typeToDelete: string) => {
    try {
      // Special handling for wardrobes endpoint
      if (apiEndpoint.includes('wardrobes')) {
        const response = await fetch(apiEndpoint, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'deleteType', typeName: typeToDelete })
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error('Failed to delete wardrobe type:', errorData);
          throw new Error(`Failed to delete type: ${errorData}`);
        }

        // Refetch data after deleting type
        try {
          const refetchResponse = await fetch(apiEndpoint);
          if (refetchResponse.ok) {
            const refetchData = await refetchResponse.json();
            setItems(refetchData.items || []);
            setTypes(refetchData.types || []);
            console.log('Refetched wardrobe data after delete type:', refetchData);
          }
        } catch (refetchError) {
          console.error('Error refetching wardrobe data after delete type:', refetchError);
        }

        console.log('Wardrobe type deleted successfully:', typeToDelete);
        return;
      }

      // Special handling for podium endpoint (delete type)
      if (apiEndpoint.includes('podium')) {
        // Use the same logic as tables/sofas: DELETE, then POST full updated items/types, then re-fetch
        const updatedTypes = types.filter(t => t !== typeToDelete);
        const updatedItems = items.map(item =>
          item.type === typeToDelete ? { ...item, type: '' } : item
        );
        const response = await fetch(apiEndpoint, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ typeName: typeToDelete })
        });
        if (!response.ok) {
          const errorData = await response.text();
          console.error('Failed to delete type:', errorData);
          throw new Error(`Failed to delete type: ${errorData}`);
        }
        // Immediately POST updated items/types (awaited)
        console.log('POSTing updated items/types after DELETE:', { items: updatedItems, types: updatedTypes });
        await safePost(apiEndpoint, updatedItems, updatedTypes);
        // Re-fetch data after deleting type (awaited)
        try {
          const refetchResponse = await fetch(apiEndpoint);
          if (refetchResponse.ok) {
            const refetchData = await refetchResponse.json();
            setItems(refetchData.items || []);
            setTypes(refetchData.types || []);
            console.log('Re-fetched data after POST:', refetchData);
          }
        } catch (refetchError) {
          console.error('Error refetching data after deleting type:', refetchError);
        }
        return;
      }

      // Special handling for chests endpoint (delete type)
      if (apiEndpoint.includes('chests')) {
        // Delete type: send DELETE, then POST updated items/types, then re-fetch
        const updatedTypes = types.filter(t => t !== typeToDelete);
        const updatedItems = items.map(item =>
          item.type === typeToDelete ? { ...item, type: '' } : item
        );
        const response = await fetch(apiEndpoint, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ typeName: typeToDelete })
        });
        if (!response.ok) {
          const errorData = await response.text();
          console.error('Failed to delete type:', errorData);
          throw new Error(`Failed to delete type: ${errorData}`);
        }
        // Immediately POST updated items/types
        await safePost(apiEndpoint, updatedItems, updatedTypes);
        // Re-fetch data after deleting type
        try {
          const refetchResponse = await fetch(apiEndpoint);
          if (refetchResponse.ok) {
            const refetchData = await refetchResponse.json();
            setItems(refetchData.items || []);
            setTypes(refetchData.types || []);
          }
        } catch (refetchError) {
          console.error('Error refetching data after deleting type:', refetchError);
        }
        return;
      }

      // Special handling for shelving endpoint (delete type)
      if (apiEndpoint.includes('shelving')) {
        // Delete type: send DELETE, then POST updated items/types, then re-fetch
        const updatedTypes = types.filter(t => t !== typeToDelete);
        const updatedItems = items.map(item =>
          item.type === typeToDelete ? { ...item, type: '' } : item
        );
        const response = await fetch(apiEndpoint, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ typeName: typeToDelete })
        });
        if (!response.ok) {
          const errorData = await response.text();
          console.error('Failed to delete type:', errorData);
          throw new Error(`Failed to delete type: ${errorData}`);
        }
        // Immediately POST updated items/types
        await safePost(apiEndpoint, updatedItems, updatedTypes);
        // Re-fetch data after deleting type
        try {
          const refetchResponse = await fetch(apiEndpoint);
          if (refetchResponse.ok) {
            const refetchData = await refetchResponse.json();
            setItems(refetchData.items || []);
            setTypes(refetchData.types || []);
          }
        } catch (refetchError) {
          console.error('Error refetching data after deleting type:', refetchError);
        }
        return;
      }

      // Special handling for sofas endpoint (delete type)
      if (apiEndpoint.includes('sofas')) {
        // Use the same logic as tables2: DELETE, then POST full updated items/types, then re-fetch
        const updatedTypes = types.filter(t => t !== typeToDelete);
        const updatedItems = items.map(item =>
          item.type === typeToDelete ? { ...item, type: '' } : item
        );
        const response = await fetch(apiEndpoint, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ typeName: typeToDelete })
        });
        if (!response.ok) {
          const errorData = await response.text();
          console.error('Failed to delete type:', errorData);
          throw new Error(`Failed to delete type: ${errorData}`);
        }
        // Immediately POST updated items/types (awaited)
        console.log('POSTing updated items/types after DELETE:', { items: updatedItems, types: updatedTypes });
        await safePost(apiEndpoint, updatedItems, updatedTypes);
        // Re-fetch data after deleting type (awaited)
        try {
          const refetchResponse = await fetch(apiEndpoint);
          if (refetchResponse.ok) {
            const refetchData = await refetchResponse.json();
            setItems(refetchData.items || []);
            setTypes(refetchData.types || []);
            console.log('Re-fetched data after POST:', refetchData);
          }
        } catch (refetchError) {
          console.error('Error refetching data after deleting type:', refetchError);
        }
        return;
      }

      // Special handling for hangers endpoint (delete type)
      if (apiEndpoint.includes('hangers')) {
        // Use the same logic as tables2/sofas: DELETE, then POST full updated items/types, then re-fetch
        const updatedTypes = types.filter(t => t !== typeToDelete);
        const updatedItems = items.map(item =>
          item.type === typeToDelete ? { ...item, type: '' } : item
        );
        const response = await fetch(apiEndpoint, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ typeName: typeToDelete })
        });
        if (!response.ok) {
          const errorData = await response.text();
          console.error('Failed to delete type:', errorData);
          throw new Error(`Failed to delete type: ${errorData}`);
        }
        // Immediately POST updated items/types (awaited)
        await safePost(apiEndpoint, updatedItems, updatedTypes);
        // Re-fetch data after deleting type (awaited)
        try {
          const refetchResponse = await fetch(apiEndpoint);
          if (refetchResponse.ok) {
            const refetchData = await refetchResponse.json();
            setItems(refetchData.items || []);
            setTypes(refetchData.types || []);
          }
        } catch (refetchError) {
          console.error('Error refetching data after deleting type:', refetchError);
        }
        return;
      }

      // Special handling for takht endpoint (delete type)
      if (apiEndpoint.includes('takht')) {
        // Delete type: send DELETE, then POST updated items/types, then re-fetch
        const updatedTypes = types.filter(t => t !== typeToDelete);
        const updatedItems = items.map(item =>
          item.type === typeToDelete ? { ...item, type: '' } : item
        );
        const response = await fetch(apiEndpoint, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ typeName: typeToDelete })
        });
        if (!response.ok) {
          const errorData = await response.text();
          console.error('Failed to delete type:', errorData);
          throw new Error(`Failed to delete type: ${errorData}`);
        }
        // Immediately POST updated items/types
        await safePost(apiEndpoint, updatedItems, updatedTypes);
        // Re-fetch data after deleting type
        try {
          const refetchResponse = await fetch(apiEndpoint);
          if (refetchResponse.ok) {
            const refetchData = await refetchResponse.json();
            setItems(refetchData.items || []);
            setTypes(refetchData.types || []);
          }
        } catch (refetchError) {
          console.error('Error refetching data after deleting type:', refetchError);
        }
        return;
      }

      // Special handling for walldecor endpoint (delete type)
      if (apiEndpoint.includes('walldecor')) {
        // Delete type: send DELETE, then POST updated items/types, then re-fetch
        const updatedTypes = types.filter(t => t !== typeToDelete);
        const updatedItems = items.map(item =>
          item.type === typeToDelete ? { ...item, type: '' } : item
        );
        const response = await fetch(apiEndpoint, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ typeName: typeToDelete })
        });
        if (!response.ok) {
          const errorData = await response.text();
          console.error('Failed to delete type:', errorData);
          throw new Error(`Failed to delete type: ${errorData}`);
        }
        // Immediately POST updated items/types
        await safePost(apiEndpoint, updatedItems, updatedTypes);
        // Re-fetch data after deleting type
        try {
          const refetchResponse = await fetch(apiEndpoint);
          if (refetchResponse.ok) {
            const refetchData = await refetchResponse.json();
            setItems(refetchData.items || []);
            setTypes(refetchData.types || []);
          }
        } catch (refetchError) {
          console.error('Error refetching data after deleting type:', refetchError);
        }
        return;
      }

      // Special handling for tables endpoint
      if (apiEndpoint.includes('tables')) {
        // Delete type: send DELETE, then POST updated items/types
        const updatedTypes = types.filter(t => t !== typeToDelete);
        const updatedItems = items.map(item =>
          item.type === typeToDelete ? { ...item, type: '' } : item
        );
        const response = await fetch(apiEndpoint, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ typeName: typeToDelete })
        });
        if (!response.ok) {
          const errorData = await response.text();
          console.error('Failed to delete type:', errorData);
          throw new Error(`Failed to delete type: ${errorData}`);
        }
        // Immediately POST updated items/types
        await safePost(apiEndpoint, updatedItems, updatedTypes);
        // Re-fetch from backend to get the correct state
        const refetch = await fetch(apiEndpoint);
        if (refetch.ok) {
          const data = await refetch.json();
          setTypes(data.types || []);
          setItems(data.items || []);
        }
        return;
      }

      // Special handling for chairs endpoint
      if (apiEndpoint.includes('chairs')) {
        // Delete type: send DELETE, then POST updated items/types
        const updatedTypes = types.filter(t => t !== typeToDelete);
        const updatedItems = items.map(item =>
          item.type === typeToDelete ? { ...item, type: '' } : item
        );
        const response = await fetch(apiEndpoint, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ typeName: typeToDelete })
        });
        if (!response.ok) {
          const errorData = await response.text();
          console.error('Failed to delete type:', errorData);
          throw new Error(`Failed to delete type: ${errorData}`);
        }
        // Immediately POST updated items/types
        await safePost(apiEndpoint, updatedItems, updatedTypes);
        // Re-fetch from backend to get the correct state
        const refetch = await fetch(apiEndpoint);
        if (refetch.ok) {
          const data = await refetch.json();
          setTypes(data.types || []);
          setItems(data.items || []);
        }
        return;
      }

      // Special handling for poufs endpoint (delete type)
      if (apiEndpoint.includes('poufs')) {
        // Delete type: send DELETE, then POST updated items/types, then re-fetch
        const updatedTypes = types.filter(t => t !== typeToDelete);
        const updatedItems = items.map(item =>
          item.type === typeToDelete ? { ...item, type: '' } : item
        );
        const response = await fetch(apiEndpoint, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ typeName: typeToDelete })
        });
        if (!response.ok) {
          const errorData = await response.text();
          console.error('Failed to delete type:', errorData);
          throw new Error(`Failed to delete type: ${errorData}`);
        }
        // Immediately POST updated items/types
        await safePost(apiEndpoint, updatedItems, updatedTypes);
        // Re-fetch data after deleting type
        try {
          const refetchResponse = await fetch(apiEndpoint);
          if (refetchResponse.ok) {
            const refetchData = await refetchResponse.json();
            setItems(refetchData.items || []);
            setTypes(refetchData.types || []);
          }
        } catch (refetchError) {
          console.error('Error refetching data after deleting type:', refetchError);
        }
        return;
      }

      // Special handling for stands endpoint (delete type)
      if (apiEndpoint.includes('stands')) {
        // Delete type: send DELETE, then POST updated items/types, then re-fetch
        const updatedTypes = types.filter(t => t !== typeToDelete);
        const updatedItems = items.map(item =>
          item.type === typeToDelete ? { ...item, type: '' } : item
        );
        const response = await fetch(apiEndpoint, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ typeName: typeToDelete })
        });
        if (!response.ok) {
          const errorData = await response.text();
          console.error('Failed to delete type:', errorData);
          throw new Error(`Failed to delete type: ${errorData}`);
        }
        // Immediately POST updated items/types
        await safePost(apiEndpoint, updatedItems, updatedTypes);
        // Re-fetch data after deleting type
        try {
          const refetchResponse = await fetch(apiEndpoint);
          if (refetchResponse.ok) {
            const refetchData = await refetchResponse.json();
            setItems(refetchData.items || []);
            setTypes(refetchData.types || []);
          }
        } catch (refetchError) {
          console.error('Error refetching data after deleting type:', refetchError);
        }
        return;
      }

      // Special handling for whiteboard endpoint (delete type)
      if (apiEndpoint.includes('whiteboard')) {
        // Use the same logic as tables/sofas: DELETE, then POST full updated items/types, then re-fetch
        const updatedTypes = types.filter(t => t !== typeToDelete);
        const updatedItems = items.map(item =>
          item.type === typeToDelete ? { ...item, type: '' } : item
        );
        const response = await fetch(apiEndpoint, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ typeName: typeToDelete })
        });
        if (!response.ok) {
          const errorData = await response.text();
          console.error('Failed to delete type:', errorData);
          throw new Error(`Failed to delete type: ${errorData}`);
        }
        // Immediately POST updated items/types (awaited)
        console.log('POSTing updated items/types after DELETE:', { items: updatedItems, types: updatedTypes });
        await safePost(apiEndpoint, updatedItems, updatedTypes);
        // Re-fetch data after deleting type (awaited)
        try {
          const refetchResponse = await fetch(apiEndpoint);
          if (refetchResponse.ok) {
            const refetchData = await refetchResponse.json();
            setItems(refetchData.items || []);
            setTypes(refetchData.types || []);
            console.log('Re-fetched data after POST:', refetchData);
          }
        } catch (refetchError) {
          console.error('Error refetching data after deleting type:', refetchError);
        }
        return;
      }

      // Default handling for other endpoints (including tables2, chairs, etc.)
      const updatedTypes = types.filter(t => t !== typeToDelete);
      const updatedItems = items.map(item =>
        item.type === typeToDelete ? { ...item, type: '' } : item
      );
      await safePost(apiEndpoint, updatedItems, updatedTypes);
      setTypes(updatedTypes);
      setItems(updatedItems);
      // Refetch data after deleting type
      try {
        const refetchResponse = await fetch(apiEndpoint);
        if (refetchResponse.ok) {
          const refetchData = await refetchResponse.json();
          setItems(refetchData.items || []);
          setTypes(refetchData.types || []);
        }
      } catch (refetchError) {
        console.error('Error refetching data after deleting type:', refetchError);
      }
      return;
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
    validationErrors,
    clearValidationError,
    handleImageUpload,
    handleSaveItem,
    handleDeleteItem,
    handleAddType,
    handleDeleteType
  };
}; 