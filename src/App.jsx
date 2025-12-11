import { useState } from 'react'
import { useFediInjection } from '@fedibtc/ui'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const { status, error, webln, authenticatedMember } = useFediInjection();
  const [balance, setBalance] = useState(null);
  const [balanceError, setBalanceError] = useState(null);

  const getBalance = async () => {
    setBalanceError(null);
    if (!webln) {
      setBalanceError("WebLN not ready");
      return;
    }

    try {
      // Safe check for getBalance
      if (typeof webln.getBalance === 'function') {
        const res = await webln.getBalance();
        setBalance(res.balance);
      } else {
        setBalanceError("Balance fetching not supported by this wallet.");
      }
    } catch (err) {
      console.error("Balance error", err);
      setBalanceError(err.message || String(err));
    }
  }

  // Loading state handling
  if (status === 'loading') {
    return (
      <div className="card">
        <p>Loading Fedi context...</p>
      </div>
    );
  }

  // Error state handling from the Provider
  if (status === 'error') {
    return (
      <div className="card">
        <p style={{ color: 'red' }}>Fedi Injection Error: {error?.message}</p>
      </div>
    );
  }

  return (
    <>
      <h1>Dreams App</h1>
      <div className="card">
        <p>
          Welcome to the Dreams Fedi Mod.
        </p>

        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h3>Wallet Connection</h3>

          {authenticatedMember ? (
            <div>
              <p style={{ color: 'green', fontWeight: 'bold' }}>
                Connected as: {authenticatedMember.name || authenticatedMember.username || "Unknown User"}
              </p>

              {balance !== null ? (
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{balance} sats</p>
              ) : (
                <div>
                  <p>{balanceError && <span style={{ color: 'red' }}>{balanceError}</span>}</p>
                  <button onClick={getBalance}>Check Balance</button>
                </div>
              )}
            </div>
          ) : (
            <p>Waiting for authentication...</p>
          )}
        </div>
      </div>
    </>
  )
}

export default App
