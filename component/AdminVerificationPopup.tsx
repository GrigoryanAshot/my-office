'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminVerificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminVerificationPopup: React.FC<AdminVerificationPopupProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'email' | 'verification'>('email');
  const [email, setEmail] = useState('myofficearmenia@gmail.com');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // ==> CLIENT-SIDE DEBUGGING
    console.log('[CLIENT] Attempting to send verification code to /api/send-verification');

    try {
      const response = await fetch('/api/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      // ==> CLIENT-SIDE DEBUGGING
      console.log('[CLIENT] Fetch response received. Status:', response.status, 'OK:', response.ok);
      const responseBody = await response.text(); // Use text() to avoid JSON parse error if body is not JSON
      console.log('[CLIENT] Response body:', responseBody);

      if (!response.ok) {
        let errorMessage = 'Սխալ է տեղի ունեցել: Խնդրում ենք փորձել կրկին';
        try {
          const errorData = JSON.parse(responseBody);
          if (errorData.error) {
            errorMessage = errorData.error;
            // In development, if email is not configured, suggest direct access
            if (process.env.NODE_ENV === 'development' && errorMessage.includes('not configured')) {
              errorMessage += ' (Development mode: You can access /admin-panel directly)';
            }
          }
        } catch {
          // If parsing fails, use default message
        }
        throw new Error(errorMessage);
      }

      setStep('verification');
      setSuccess('Ստուգման կոդը ուղարկվել է Ձեր էլ․ փոստին');
    } catch (err) {
      // ==> CLIENT-SIDE DEBUGGING
      console.error('[CLIENT] An error occurred in handleSendCode:', err);
      const errorMessage = err instanceof Error ? err.message : 'Սխալ է տեղի ունեցել: Խնդրում ենք փորձել կրկին';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          code: verificationCode 
        }),
      });

      if (!response.ok) {
        throw new Error('Invalid verification code');
      }

      setSuccess('Ստուգումը հաջող է: Ուղղորդվում եք ադմին պանել...');
      
      // Redirect to admin panel after 3 seconds to ensure cookie is set
      setTimeout(() => {
        // Force a hard redirect to ensure the cookie is picked up
        window.location.href = '/admin-panel';
        onClose();
      }, 3000);
    } catch (err) {
      setError('Սխալ ստուգման կոդ: Խնդրում ենք փորձել կրկին');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(value);
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

        {step === 'email' ? (
          <>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#333',
              margin: '0 0 15px 0',
              textAlign: 'center'
            }}>Ադմին մուտք</h2>
            <p style={{
              fontSize: '14px',
              color: '#666',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              Ստուգման կոդը կուղարկվի Ձեր էլ․ փոստին
            </p>
            <form onSubmit={handleSendCode}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Էլ․ փոստ"
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
                {isLoading ? 'Ուղարկվում է...' : 'Ուղարկել կոդ'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#333',
              margin: '0 0 15px 0',
              textAlign: 'center'
            }}>Ստուգման կոդ</h2>
            <p style={{
              fontSize: '14px',
              color: '#666',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              Մուտքագրեք 6-նիշանոց կոդը, որը ուղարկվել է {email}
            </p>
            {success && (
              <p style={{
                color: 'green',
                fontSize: '12px',
                marginBottom: '10px',
                textAlign: 'center'
              }}>
                {success}
              </p>
            )}
            <form onSubmit={handleVerifyCode}>
              <input
                type="text"
                value={verificationCode}
                onChange={handleCodeChange}
                placeholder="000000"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px',
                  marginBottom: '10px',
                  textAlign: 'center',
                  letterSpacing: '2px'
                }}
                maxLength={6}
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
                disabled={isLoading || verificationCode.length !== 6}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: verificationCode.length === 6 ? '#4a90e2' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  cursor: (isLoading || verificationCode.length !== 6) ? 'not-allowed' : 'pointer',
                  opacity: (isLoading || verificationCode.length !== 6) ? 0.7 : 1
                }}
              >
                {isLoading ? 'Ստուգվում է...' : 'Ստուգել'}
              </button>
            </form>
            <button
              onClick={() => setStep('email')}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: 'transparent',
                color: '#4a90e2',
                border: 'none',
                fontSize: '12px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Փոխել էլ․ փոստ
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminVerificationPopup; 