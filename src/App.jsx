import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (typeof window.webln !== 'undefined') {
        try {
          await window.webln.enable();
          const balanceResponse = await window.webln.getBalance();
          setBalance(balanceResponse.balance);
        } catch (err) {
          console.error("WebLN error:", err);
          setError("Failed to connect to wallet.");
        }
      } else {
        setError("WebLN not detected. Are you in the Fedi app?");
      }
    };

    fetchBalance();
  }, []);

  return (
    <>
      <h1>Dreams App</h1>
      <div className="card">
        <p>
          Welcome to the Dreams Fedi Mod.
        </p>
        
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h3>Wallet Balance</h3>
            {balance !== null ? (
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{balance} sats</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <p>Loading balance...</p>
            )}
        </div>
      </div>
    </>
  )
}

export default App
