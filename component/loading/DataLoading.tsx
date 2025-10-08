import React from "react";

interface DataLoadingProps {
  showNavbar?: boolean;
  showFooter?: boolean;
  showScrollToTop?: boolean;
}

const DataLoading: React.FC<DataLoadingProps> = ({ 
  showNavbar = true, 
  showFooter = true, 
  showScrollToTop = true 
}) => {
  return (
    <>
      {showNavbar && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          zIndex: 1000,
          backgroundColor: 'white',
          borderBottom: '1px solid #eee',
          padding: '10px 0'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px'
          }}>
            {/* Logo removed to prevent brief appearance during loading */}
          </div>
        </div>
      )}
      
      <div className="loading-container" style={{ 
        height: showNavbar ? 'calc(100vh - 60px)' : '100vh',
        marginTop: showNavbar ? '60px' : '0'
      }}>

        <div className="loader"></div>
      </div>
      
      {showFooter && (
        <div style={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          zIndex: 1000,
          backgroundColor: 'white',
          borderTop: '1px solid #eee',
          padding: '10px 0',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, color: '#666' }}>© 2024 My-Office.am. Բոլոր իրավունքները պաշտպանված են:</p>
        </div>
      )}
      
      {showScrollToTop && (
        <div style={{
          position: 'fixed',
          bottom: showFooter ? '60px' : '20px',
          right: '20px',
          zIndex: 1001,
          width: '40px',
          height: '40px',
          backgroundColor: '#ff6b35',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'white',
          fontSize: '18px'
        }}>
          ↑
        </div>
      )}
    </>
  );
};

export default DataLoading; 