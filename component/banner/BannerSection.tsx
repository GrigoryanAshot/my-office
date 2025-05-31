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
              <ul className="d-flex flex-wrap align-items-center">
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
          <div className="col-xl-5 col-lg-4">
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
                  {/* Title at top left, black with white shadow */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    padding: '20px',
                    color: 'black',
                    fontWeight: 'bold',
                    fontSize: '1.5rem',
                    textShadow: '0 2px 8px #fff',
                    zIndex: 2,
                    pointerEvents: 'none'
                  }}>
                    {slide.title}
                  </div>
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
