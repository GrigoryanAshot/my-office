'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import FooterSection from '@/component/footer/FooterSection';
import NavbarSection from '@/component/navbar/NavbarSection';
import ScrollToTopButton from '@/component/utils/ScrollToTopButton';
import { furnitureData } from '@/component/Lists/furniture/livingRoom';

export default function FurnitureDetail() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const params = useParams();
  if (!params?.id) {
    return (
      <div className="home_3">
        <NavbarSection style="" logo="/images/logo.png" />
        <main style={{ 
          paddingTop: '100px',
          minHeight: '100vh',
          backgroundColor: '#fff'
        }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto',
            padding: '0 20px'
          }}>
            <h1>Ապրանքը չի գտնվել</h1>
          </div>
        </main>
        <FooterSection />
        <ScrollToTopButton style="" />
      </div>
    );
  }

  const id = parseInt(params.id as string);
  const item = furnitureData.find(item => item.id === id);

  if (!item) {
    return (
      <div className="home_3">
        <NavbarSection style="" logo="/images/logo.png" />
        <main style={{ 
          paddingTop: '100px',
          minHeight: '100vh',
          backgroundColor: '#fff'
        }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto',
            padding: '0 20px'
          }}>
            <h1>Ապրանքը չի գտնվել</h1>
          </div>
        </main>
        <FooterSection />
        <ScrollToTopButton style="" />
      </div>
    );
  }

  return (
    <div className="home_3">
      <NavbarSection style="" logo="/images/logo.png" />
      <main style={{ 
        paddingTop: '100px',
        minHeight: '100vh',
        backgroundColor: '#fff'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            alignItems: 'start'
          }}>
            <div>
              <div style={{
                borderRadius: '16px',
                cursor: 'pointer',
                marginBottom: '20px',
                maxWidth: '500px',
                margin: '0 auto 20px'
              }}>
                <img 
                  src={item.images[selectedImage]} 
                  alt={item.name} 
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '400px',
                    objectFit: 'contain',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setIsModalOpen(true)}
                />
              </div>
              <div style={{
                display: 'flex',
                gap: '10px',
                overflowX: 'auto',
                padding: '10px 0',
                scrollbarWidth: 'thin'
              }}>
                {item.images.map((image, index) => (
                  <div
                    key={index}
                    style={{
                      flex: '0 0 100px',
                      height: '100px',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: selectedImage === index ? '2px solid #4a90e2' : '2px solid transparent',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image}
                      alt={`${item.name} - ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h1 style={{
                fontSize: '32px',
                marginBottom: '20px',
                color: '#1a1a1a'
              }}>{item.name}</h1>
              <p style={{
                fontSize: '24px',
                color: '#4a90e2',
                marginBottom: '20px'
              }}>{item.price}</p>
              <p style={{
                fontSize: '18px',
                color: '#64748b',
                marginBottom: '30px'
              }}>{item.description}</p>
            </div>
          </div>
        </div>
      </main>
      <FooterSection />
      <ScrollToTopButton style="" />

      {/* Modal/Lightbox */}
      {isModalOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div style={{
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <img 
              src={item.images[selectedImage]} 
              alt={item.name} 
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain'
              }}
            />
            <div style={{
              display: 'flex',
              gap: '10px',
              marginTop: '20px',
              padding: '10px'
            }}>
              {item.images.map((image, index) => (
                <div
                  key={index}
                  style={{
                    width: '60px',
                    height: '60px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    border: selectedImage === index ? '2px solid #4a90e2' : '2px solid transparent',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(index);
                  }}
                >
                  <img
                    src={image}
                    alt={`${item.name} - ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              ))}
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(false);
              }}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '10px'
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 