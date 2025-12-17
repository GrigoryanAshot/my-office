"use client";

import NavbarSection from '@/component/navbar/NavbarSection';
import FooterSection from '@/component/footer/FooterSection';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Redis } from '@upstash/redis';

// DEBUG: Check if new code is running
console.log("ADMIN PANEL JS LOADED - NEW VERSION");

export default function AdminPanel() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Call logout API to clear verification
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'myofficearmenia@gmail.com' }),
      });
      
      // Redirect to main page
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect to main page even if logout API fails
      router.push('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <NavbarSection style="" logo="/images/logo.png" />
      <div style={{ height: '500px', marginTop: '20px', marginBottom: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        {/* Logout button */}
        <div style={{ position: 'absolute', top: '100px', right: '20px' }}>
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            style={{ 
              padding: '8px 16px', 
              fontSize: '14px', 
              backgroundColor: '#dc3545', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: isLoggingOut ? 'not-allowed' : 'pointer',
              opacity: isLoggingOut ? 0.7 : 1
            }}
          >
            {isLoggingOut ? 'Դուրս գալիս...' : 'Դուրս գալ'}
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <button 
            style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}
            onClick={() => setSelectedCategory(selectedCategory === 'Սեղաններ և աթոռներ' ? null : 'Սեղաններ և աթոռներ')}
          >
            Սեղաններ և աթոռներ
          </button>
          <button 
            style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}
            onClick={() => setSelectedCategory(selectedCategory === 'Փափուկ կահույք' ? null : 'Փափուկ կահույք')}
          >
            Փափուկ կահույք
          </button>
          <button 
            style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}
            onClick={() => setSelectedCategory(selectedCategory === 'Պահարաններ և ավելին' ? null : 'Պահարաններ և ավելին')}
          >
            Պահարաններ և ավելին
          </button>
          <button 
            style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}
            onClick={() => setSelectedCategory(selectedCategory === 'Այլ' ? null : 'Այլ')}
          >
            Այլ
          </button>
          <button 
            style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}
            onClick={() => router.push('/admin-panel/sale')}
          >
            Ակցիայի ապրանքներ
          </button>
        </div>
        {selectedCategory === 'Սեղաններ և աթոռներ' && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <button 
              style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}
              onClick={() => router.push('/admin-panel/tables')}
            >
              Սեղաններ
            </button>
            <button 
              style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}
              onClick={() => router.push('/admin-panel/chairs')}
            >
              Աթոռներ
            </button>
          </div>
        )}
        {selectedCategory === 'Փափուկ կահույք' && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <button 
              style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}
              onClick={() => router.push('/admin-panel/sofas')}
            >
              Բազմոցներ
            </button>
            <button 
              style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}
              onClick={() => router.push('/admin-panel/armchairs')}
            >
              Բազկաթոռներ
            </button>
            <button 
              style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}
              onClick={() => router.push('/admin-panel/poufs')}
            >
              Պուֆիկներ
            </button>
            <button 
              style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}
              onClick={() => router.push('/admin-panel/takht')}
            >
              Թախտեր
            </button>
          </div>
        )}
        {selectedCategory === 'Պահարաններ և ավելին' && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <button 
              style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}
              onClick={() => router.push('/admin-panel/wardrobes')}
            >
              Պահարաններ
            </button>
            <button 
              style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}
              onClick={() => router.push('/admin-panel/shelving')}
            >
              Դարակաշարեր
            </button>
            <button 
              style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}
              onClick={() => router.push('/admin-panel/chests')}
            >
              Տումբաներ և կոմոդներ
            </button>
            <button 
              style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}
              onClick={() => router.push('/admin-panel/stands')}
            >
              Տակդիրներ
            </button>
          </div>
        )}
        {selectedCategory === 'Այլ' && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <button 
              style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}
              onClick={() => router.push('/admin-panel/walldecor')}
            >
              Պատի դեկորներ
            </button>
            <button 
              style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}
              onClick={() => router.push('/admin-panel/hangers')}
            >
              Կախիչներ
            </button>
            <button 
              style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}
              onClick={() => router.push('/admin-panel/podium')}
            >
              Ամբիոն
            </button>
            <button 
              style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}
              onClick={() => router.push('/admin-panel/whiteboard')}
            >
              Գրատախտակ
            </button>
          </div>
        )}
      </div>
      <FooterSection />
    </>
  );
} 