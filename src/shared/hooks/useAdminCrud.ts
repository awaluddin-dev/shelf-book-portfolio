import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface UseAdminCrudOptions {
  apiUrl: string;
  dataKey?: string; // Optional nested key for data (e.g., 'workExperience', 'skills')
  onFetchSuccess?: (data: any) => void;
  formatPayload?: (formData: any) => any;
}

export function useAdminCrud(options: UseAdminCrudOptions) {
  const { apiUrl, dataKey, onFetchSuccess, formatPayload } = options;
  const router = useRouter();
  
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      
      let finalData = data;
      if (dataKey) {
          finalData = data.data?.[dataKey] || data[dataKey] || (Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []));
      } else {
          finalData = data.data || data;
          finalData = Array.isArray(finalData) ? finalData : [];
      }
      
      setItems(finalData);
      if (onFetchSuccess) onFetchSuccess(data);
    } catch {
      setToastMessage({ message: `Failed to fetch data from ${apiUrl}`, type: 'error' });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') {
      router.push('/admin/login');
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleSave = async (formData: any, customId?: string, overrideUrl?: string, overrideMethod?: string) => {
    setIsProcessing(true);
    try {
      const id = customId || editingItem?.id;
      const url = overrideUrl || (id ? `${apiUrl}/${id}` : apiUrl);
      const method = overrideMethod || (id ? 'PATCH' : 'POST');
      
      const payload = formatPayload ? formatPayload(formData) : formData;
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error('Failed to save');
      
      setToastMessage({ message: `Successfully ${id ? 'updated' : 'added'} item`, type: 'success' });
      setShowModal(false);
      setEditingItem(null);
      fetchData();
    } catch {
      setToastMessage({ message: 'Failed to save item', type: 'error' });
    }
    setIsProcessing(false);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDelete = async (id: string, deleteUrlOverride?: string) => {
    setIsProcessing(true);
    if (!confirm('Are you sure you want to delete this item?')) {
        setIsProcessing(false);
        return;
    }
    
    try {
      const url = deleteUrlOverride || `${apiUrl}/${id}`;
      const res = await fetch(url, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      if (!res.ok) throw new Error('Failed to delete');
      
      setToastMessage({ message: 'Successfully deleted item', type: 'success' });
      fetchData();
    } catch {
      setToastMessage({ message: 'Failed to delete item', type: 'error' });
    }
    setIsProcessing(false);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openAddModal = (initialData: any, customSetFormData?: (data: any) => void) => {
    setEditingItem(null);
    if (customSetFormData) customSetFormData(initialData);
    setShowModal(true);
  };

  const openEditModal = (item: any, customSetFormData?: (data: any) => void) => {
    setEditingItem(item);
    if (customSetFormData) customSetFormData(item);
    setShowModal(true);
  };

  return {
    items,
    setItems,
    loading,
    isProcessing,
    toastMessage,
    showModal,
    setShowModal,
    editingItem,
    setEditingItem,
    handleSave,
    handleDelete,
    openAddModal,
    openEditModal,
    fetchData,
    router,
    setToastMessage
  };
}
