'use client';

import { useState } from 'react';

export default function MigrateDataPage() {
  const [migrationStatus, setMigrationStatus] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  const migrationEndpoints = [
    'migrate-chests-to-redis',
    'migrate-armchairs-to-redis',
    'migrate-stands-to-redis',
    'migrate-wall-decor-to-redis',
    'migrate-whiteboard-to-redis',
    'migrate-hangers-to-redis',
    'migrate-sofas-to-redis',
    'migrate-takht-to-redis'
  ];

  const triggerMigration = async (endpoint: string) => {
    try {
      const response = await fetch(`/api/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      setMigrationStatus(prev => ({
        ...prev,
        [endpoint]: {
          success: response.ok,
          data: data,
          timestamp: new Date().toISOString()
        }
      }));
    } catch (error) {
      setMigrationStatus(prev => ({
        ...prev,
        [endpoint]: {
          success: false,
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString()
        }
      }));
    }
  };

  const triggerAllMigrations = async () => {
    setIsLoading(true);
    setMigrationStatus({});
    
    for (const endpoint of migrationEndpoints) {
      await triggerMigration(endpoint);
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setIsLoading(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Data Migration Tool</h1>
      <p>This page will migrate all your data from JSON files to Redis.</p>
      
      <button 
        onClick={triggerAllMigrations}
        disabled={isLoading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: isLoading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          marginBottom: '20px'
        }}
      >
        {isLoading ? 'Migrating...' : 'Migrate All Data to Redis'}
      </button>

      <div style={{ marginTop: '20px' }}>
        <h2>Migration Status:</h2>
        {migrationEndpoints.map(endpoint => (
          <div key={endpoint} style={{ 
            margin: '10px 0', 
            padding: '10px', 
            border: '1px solid #ddd',
            borderRadius: '5px',
            backgroundColor: migrationStatus[endpoint]?.success ? '#d4edda' : 
                           migrationStatus[endpoint] ? '#f8d7da' : '#f8f9fa'
          }}>
            <h3>{endpoint}</h3>
            {migrationStatus[endpoint] ? (
              <div>
                <p><strong>Status:</strong> {migrationStatus[endpoint].success ? '✅ Success' : '❌ Failed'}</p>
                <p><strong>Time:</strong> {migrationStatus[endpoint].timestamp}</p>
                {migrationStatus[endpoint].data && (
                  <details>
                    <summary>Response Data</summary>
                    <pre style={{ 
                      backgroundColor: '#f8f9fa', 
                      padding: '10px', 
                      overflow: 'auto',
                      fontSize: '12px'
                    }}>
                      {JSON.stringify(migrationStatus[endpoint].data, null, 2)}
                    </pre>
                  </details>
                )}
                {migrationStatus[endpoint].error && (
                  <p style={{ color: 'red' }}><strong>Error:</strong> {migrationStatus[endpoint].error}</p>
                )}
              </div>
            ) : (
              <p>⏳ Waiting to migrate...</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 