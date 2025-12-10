import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if WebLN is injected
    if (typeof window.webln !== 'undefined') {
      // Optional: We could try to auto-connect here, but a button is safer/better UX
    } else {
      setError("WebLN not detected. Are you in the Fedi app?");
    }
  }, []);

  const connectWallet = async () => {
    setError(null);
    if (typeof window.webln !== 'undefined') {
      try {
        await window.webln.enable();
        const balanceResponse = await window.webln.getBalance();
        setBalance(balanceResponse.balance);
      } catch (err) {
        console.error("WebLN error:", err);
        // Show the specific error message
        setError(`Failed to connect: ${err.message || JSON.stringify(err)}`);
      }
    } else {
      setError("WebLN not detected.");
    }
  };

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
          ) : (
            <div>
              {error && <p style={{ color: 'red', wordBreak: 'break-word' }}>{error}</p>}
              <button onClick={connectWallet}>Connect Wallet</button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default App
