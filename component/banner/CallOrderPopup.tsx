import React, { useState } from 'react';

interface CallOrderPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const CallOrderPopup: React.FC<CallOrderPopupProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send form');
      }

      setIsSubmitted(true);
      // Close the popup after 3 seconds
      setTimeout(() => {
        onClose();
        setIsSubmitted(false);
        setFormData({ name: '', phone: '' });
      }, 3000);
    } catch (err) {
      setError('Սխալ է տեղի ունեցել: Խնդրում ենք փորձել կրկին');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto'
      }}
    >
      <div className="tf__popup_content" style={{
        backgroundColor: '#fff',
        padding: '15px',
        borderRadius: '8px',
        maxWidth: '350px',
        width: '90%',
        position: 'relative',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
        height: '400px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        pointerEvents: 'auto'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            fontSize: '20px',
            color: '#666',
            padding: '5px',
            lineHeight: '1',
            zIndex: 1
          }}
        >
          ✕
        </button>
        {isSubmitted ? (
          <div style={{
            textAlign: 'center',
            padding: '20px'
          }}>
            <h3 style={{
              fontSize: '18px',
              color: '#333',
              marginBottom: '10px'
            }}>
              Շնորհակալություն
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#666',
              lineHeight: '1.5'
            }}>
              Մեր մասնագետը կարճ ժամանակում կզանգահարի Ձեզ
            </p>
          </div>
        ) : (
          <>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#333',
              margin: '0 0 15px 0',
              textAlign: 'center'
            }}>Պատվիրել զանգ</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Անուն"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '13px',
                  marginBottom: '10px'
                }}
                required
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Հեռախոս"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '13px',
                  marginBottom: '10px'
                }}
                required
              />
              {error && (
                <p style={{
                  color: 'red',
                  fontSize: '12px',
                  marginBottom: '10px',
                  textAlign: 'center'
                }}>
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#4a90e2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1
                }}
              >
                {isLoading ? 'Ուղարկվում է...' : 'Ուղարկել'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default CallOrderPopup; 