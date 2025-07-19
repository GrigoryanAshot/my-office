"use client";
import { toggleVideoOpen } from "@/redux/features/videoSlice";
import { useAppDispatch } from "@/redux/hooks";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import CallOrderPopup from "./CallOrderPopup";
import { useRouter } from "next/navigation";
import styles from './BannerSection.module.css';

interface BannerItem {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  price: string;
  link: string;
}

const BannerSection = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [slides, setSlides] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch('/api/sale-slider');
        const data = await response.json();
        setSlides(data.items || []);
      } catch (e) {
        setSlides([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 3000);

      return () => clearInterval(timer);
    }
  }, [slides.length]);

  const handleVideoShow = () => {
    dispatch(toggleVideoOpen());
  };

  const handleCallOrderClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPopupOpen(true);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handleSlideClick = (slideId: number) => {
    router.push(`/banner/${slideId}`);
  };

  if (loading) {
    return (
      <section className="tf__banner" style={{ marginTop: '-1px', paddingTop: '30px' }}>
        <div className="container tf__banner-container">
          <div className="row">
            <div className="col-12 text-center">
              <h2>Բեռնվում է...</h2>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="tf__banner" style={{ marginTop: '-1px', paddingTop: '30px' }}>
        <div className="container tf__banner-container">
          <div className="row">
            <div className="col-xl-7 col-lg-8">
              <div className="tf__banner_text wow fadeInUp">
                <h1>
                  անվճար <span>չափագրում</span>
                </h1>
                <h1>
                  անվճար <span>3D մոդելավորում</span>
                </h1>
                <h1>
                  անվճար <span>տեղափոխում</span>
                </h1>
                <h1>
                  անվճար <span>տեղադրում</span>
                </h1>
                <p>
                  Պատվերներն իրականացվում են հաշված օրերի ընթացքում
                </p>
                <ul className="d-flex flex-wrap align-items-center" id="banner-button">
                  <li>
                    <button 
                      className="common_btn" 
                      onClick={handleCallOrderClick}
                    >
                      պատվիրել զանգ
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="tf__banner" style={{ marginTop: '-1px', paddingTop: '30px' }}>
      <div className="container tf__banner-container">
        <div className="row">
          <div className="col-xl-7 col-lg-8">
            <div className="tf__banner_text wow fadeInUp banner-text-mobile" style={{
              padding: '20px 0',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%'
            }}>
              <div className="banner-headings-mobile" style={{ marginBottom: '20px' }}>
                <h1 className="banner-heading-mobile" style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                  fontWeight: '700',
                  margin: '0 0 8px 0',
                  lineHeight: '1.1',
                  color: '#333'
                }}>
                  անվճար <span style={{ color: '#ff6b35' }}>չափագրում</span>
                </h1>
                <h1 className="banner-heading-mobile" style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                  fontWeight: '700',
                  margin: '0 0 8px 0',
                  lineHeight: '1.1',
                  color: '#333'
                }}>
                  անվճար <span style={{ color: '#ff6b35' }}>3D մոդելավորում</span>
                </h1>
                <h1 className="banner-heading-mobile" style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                  fontWeight: '700',
                  margin: '0 0 8px 0',
                  lineHeight: '1.1',
                  color: '#333'
                }}>
                  անվճար <span style={{ color: '#ff6b35' }}>տեղափոխում</span>
                </h1>
                <h1 className="banner-heading-mobile" style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                  fontWeight: '700',
                  margin: '0 0 15px 0',
                  lineHeight: '1.1',
                  color: '#333'
                }}>
                  անվճար <span style={{ color: '#ff6b35' }}>տեղադրում</span>
                </h1>
              </div>
              
              <p className="banner-description-mobile" style={{
                fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                color: '#666',
                marginBottom: '25px',
                lineHeight: '1.5',
                fontWeight: '400'
              }}>
                Պատվերներն իրականացվում են հաշված օրերի ընթացքում
              </p>
              
              <div className="banner-button-container-mobile">
                <button 
                  className="common_btn banner-button-mobile" 
                  onClick={handleCallOrderClick}
                  style={{
                    fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                    padding: '12px 25px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  պատվիրել զանգ
                </button>
              </div>
            </div>
          </div>
          <div className="col-xl-5 col-lg-4" style={{ position: 'relative' }}>
            {/* Sale sticker overlay - parent level */}
            <div className="sale-sticker-mobile" style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              zIndex: 20,
              pointerEvents: 'none'
            }}>
              <Image
                src="/images/sale.png"
                alt="Sale"
                width={0}
                height={0}
                sizes="100%"
                style={{
                  width: 'auto',
                  height: 'auto',
                  minWidth: '40px',
                  maxWidth: '150px',
                  filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.4))'
                }}
              />
            </div>
            <div className="banner_slider" style={{
              position: 'relative',
              width: '100%',
              height: '400px',
              overflow: 'hidden',
              borderRadius: '10px',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
              marginTop: '0'
            }}>
              {/* Navigation Arrows */}
              <button
                onClick={handlePrevSlide}
                className="banner_nav_btn prev"
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  background: 'rgba(255, 255, 255, 0.7)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <button
                onClick={handleNextSlide}
                className="banner_nav_btn next"
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  background: 'rgba(255, 255, 255, 0.7)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }}
              >
                <i className="fas fa-chevron-right"></i>
              </button>

              {/* Slides */}
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`banner_slide ${index === currentSlide ? 'active' : ''}`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    transition: 'all 0.5s ease-in-out',
                    opacity: index === currentSlide ? 1 : 0,
                    transform: `translateX(${(index - currentSlide) * 100}%)`,
                    cursor: 'pointer'
                  }}
                  onClick={() => handleSlideClick(slide.id)}
                >
                  <Image
                    src={slide.imageUrl}
                    alt={slide.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="banner_slide_image"
                    style={{
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                    priority={index === 0}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/placeholder.jpg';
                    }}
                  />
                  {/* Full banner gradient overlay */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 70%)',
                    zIndex: 1,
                    pointerEvents: 'none'
                  }} />

                  {/* Title hidden on main page - only show price */}
                  {/* Price at bottom right with unique class */}
                  <div className={styles['banner-price-bottom-right']}>
                    {slide.price} դրամ
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <CallOrderPopup 
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)} 
      />
    </section>
  );
};

export default BannerSection;
