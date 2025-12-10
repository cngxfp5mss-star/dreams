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

        // Debugging: Check available methods
        const weblnKeys = Object.keys(window.webln);
        console.log("WebLN keys:", weblnKeys);

        // Try getInfo first as it is documented
        const info = await window.webln.getInfo();
        console.log("WebLN info:", info);

        // Attempt getBalance only if it exists
        let balanceVal = "N/A";
        if (typeof window.webln.getBalance === 'function') {
          const balanceResponse = await window.webln.getBalance();
          balanceVal = balanceResponse.balance;
          setBalance(balanceVal);
        } else {
          // Fallback: Display info to see if we can find balance there
          setError(`getBalance not supported. keys: ${weblnKeys.join(', ')}. Info: ${JSON.stringify(info)}`);
        }

      } catch (err) {
        console.error("WebLN error:", err);
        let errorMessage = "Unknown error";
        if (err instanceof Error) {
          errorMessage = `${err.message}`;
        } else if (typeof err === 'object') {
          try {
            errorMessage = JSON.stringify(err, null, 2);
          } catch (e) {
            errorMessage = "Error object could not be stringified";
          }
        } else {
          errorMessage = String(err);
        }
        setError(errorMessage);
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
              {error && (
                <div style={{ backgroundColor: '#fee', padding: '10px', borderRadius: '5px', margin: '10px 0' }}>
                  <p style={{ color: 'red', fontWeight: 'bold' }}>Error Details:</p>
                  <pre style={{
                    color: 'red',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                    fontSize: '12px',
                    userSelect: 'text' // Ensure user can copy it
                  }}>
                    {error}
                  </pre>
                </div>
              )}
              <button onClick={connectWallet}>Connect Wallet</button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default App
