"use client";
import React, { useState, useEffect } from "react";
import Navlink from "./Navlink";
import SubNavlink from "./SubNavlink";
import { useAppSelector } from "@/redux/hooks";
import Link from "next/link";
import CallOrderPopup from "../banner/CallOrderPopup";
import { Category } from "../Lists/furniture/categories";

type Props = {
  position: string;
  btnPosition: boolean;
  navRef?: React.RefObject<HTMLDivElement>;
};

type CategoryType = 'furniture' | 'doors' | 'windows' | 'metal';

interface CategoriesState {
  furniture: Record<string, Category>;
  doors: Record<string, Category>;
  windows: Record<string, Category>;
  metal: Record<string, Category>;
}

interface CategoriesUpdateEvent extends CustomEvent {
  detail: {
    categories: Record<string, Category>;
  };
}

const NavigationSection = ({ position, btnPosition, navRef }: Props) => {
  const isMobileNavOpen = useAppSelector(state => state.mobileNav.isMobileNavOpen);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [categories, setCategories] = useState<CategoriesState>({
    furniture: {},
    doors: {},
    windows: {},
    metal: {}
  });

  // Load categories from API on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        console.log('NavigationSection: Loading categories...');
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error(`Failed to load categories: ${response.status} ${response.statusText}`);
        }
        const data = await response.json() as Record<string, Category>;
        console.log('NavigationSection: Categories loaded successfully:', Object.keys(data));
        
        // Group categories by type
        const groupedCategories: CategoriesState = {
          furniture: Object.fromEntries(
            Object.entries(data).filter(([key]) => key.startsWith('furniture_') || key === 'furniture')
          ) as Record<string, Category>,
          doors: Object.fromEntries(
            Object.entries(data).filter(([key]) => key.startsWith('doors_') || key === 'doors')
          ) as Record<string, Category>,
          windows: Object.fromEntries(
            Object.entries(data).filter(([key]) => key.startsWith('windows_') || key === 'windows')
          ) as Record<string, Category>,
          metal: Object.fromEntries(
            Object.entries(data).filter(([key]) => key.startsWith('metal_') || key === 'metal')
          ) as Record<string, Category>
        };
        
        console.log('NavigationSection: Grouped categories:', {
          furniture: Object.keys(groupedCategories.furniture),
          doors: Object.keys(groupedCategories.doors),
          windows: Object.keys(groupedCategories.windows),
          metal: Object.keys(groupedCategories.metal)
        });
        
        setCategories(groupedCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
        // Set default categories to prevent UI errors
        setCategories({
          furniture: {},
          doors: {},
          windows: {},
          metal: {}
        });
      }
    };

    loadCategories();
  }, []);


  // Listen for category updates
  useEffect(() => {
    const handleCategoriesUpdate = (event: CategoriesUpdateEvent) => {
      const updatedCategories = event.detail.categories;
      setCategories(prev => ({
        ...prev,
        furniture: Object.fromEntries(
          Object.entries(updatedCategories).filter(([key]) => key.startsWith('furniture_') || key === 'furniture')
        ) as Record<string, Category>,
        doors: Object.fromEntries(
          Object.entries(updatedCategories).filter(([key]) => key.startsWith('doors_') || key === 'doors')
        ) as Record<string, Category>,
        windows: Object.fromEntries(
          Object.entries(updatedCategories).filter(([key]) => key.startsWith('windows_') || key === 'windows')
        ) as Record<string, Category>,
        metal: Object.fromEntries(
          Object.entries(updatedCategories).filter(([key]) => key.startsWith('metal_') || key === 'metal')
        ) as Record<string, Category>
      }));
    };

    window.addEventListener('categoriesUpdated', handleCategoriesUpdate as EventListener);
    return () => {
      window.removeEventListener('categoriesUpdated', handleCategoriesUpdate as EventListener);
    };
  }, []);

  const handleCallOrderClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPopupOpen(true);
  };

  const handleMobileCategoryClick = (e: React.MouseEvent) => {
    // Only prevent navigation on mobile view
    if (isMobileNavOpen) {
      e.preventDefault();
      // Toggle the dropdown by adding/removing a class
      const target = e.currentTarget as HTMLElement;
      const dropdown = target.nextElementSibling as HTMLElement;
      if (dropdown) {
        dropdown.classList.toggle('mobile-dropdown-open');
      }
    }
  };



  // Sort categories by order
  const getSortedCategories = (categoryType: CategoryType) => {
    return Object.entries(categories[categoryType])
      .filter(([key]) => key.includes('_'))
      .sort(([, a], [, b]) => (a.order || 0) - (b.order || 0));
  };

  return (
    <div ref={navRef} className={`collapse navbar-collapse ${isMobileNavOpen ? "show" : ""}`} id="navbarNav">
      <ul className={`navbar-nav ${position}`}>
        {/* Սեղաններ և աթոռներ */}
        <li className="nav-item">
          <Link className="nav-link nav-category-item" href="/furniture" onClick={handleMobileCategoryClick}>
            {categories.furniture.furniture?.name || 'Սեղաններ և աթոռներ'} <i className="fa fa-angle-down"></i>
          </Link>
          <ul className="tf__droap_menu">
            {getSortedCategories('furniture').map(([key, category]) => (
              <li key={key}>
                <SubNavlink href={category.url}>{category.name}</SubNavlink>
              </li>
            ))}
          </ul>
        </li>

        {/* Փափուկ կահույք */}
        <li className="nav-item">
          <Link className="nav-link nav-category-item" href="/softfurniture" onClick={handleMobileCategoryClick}>
            {categories.doors.doors?.name || 'Փափուկ կահույք'} <i className="fa fa-angle-down"></i>
          </Link>
          <ul className="tf__droap_menu">
            {getSortedCategories('doors').map(([key, category]) => (
              category.url !== '/other/sofas' && (
                <li key={key}>
                  <SubNavlink href={category.url}>{category.name}</SubNavlink>
                </li>
              )
            ))}
          </ul>
        </li>

        {/* Պահարաններ և ավելին */}
        <li className="nav-item">
          <Link className="nav-link nav-category-item" href="/wardrobesandmore" onClick={handleMobileCategoryClick}>
            {categories.windows.windows?.name || 'Պահարաններ և ավելին'} <i className="fa fa-angle-down"></i>
          </Link>
          <ul className="tf__droap_menu">
            {getSortedCategories('windows').map(([key, category]) => (
              <li key={key}>
                <SubNavlink href={category.url}>{category.name}</SubNavlink>
              </li>
            ))}
          </ul>
        </li>

        {/* Այլ */}
        <li className="nav-item">
          <Link className="nav-link nav-category-item" href="/other" onClick={handleMobileCategoryClick}>
            {categories.metal.metal?.name || 'Այլ'} <i className="fa fa-angle-down"></i>
          </Link>
          <ul className="tf__droap_menu">
            {getSortedCategories('metal').map(([key, category]) => (
              <li key={key}>
                <SubNavlink href={category.url}>{category.name}</SubNavlink>
              </li>
            ))}
          </ul>
        </li>

        {/* Contact Page */}
        <li className="nav-item">
          <Navlink href="/contact">Կապ մեզ հետ</Navlink>
        </li>

        {/* Optional Button */}
        {btnPosition ? null : (
          <li className="nav-item">
            <button 
              className="nav-link common_btn" 
              onClick={handleCallOrderClick}
            >
              Պատվիրել Զանգ
            </button>
          </li>
        )}
      </ul>

      {btnPosition ? (
        <a className="common_btn_2 ms-auto" href="#">learn more</a>
      ) : null}

      <CallOrderPopup 
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)}
      />
    </div>
  );
};

export default NavigationSection;