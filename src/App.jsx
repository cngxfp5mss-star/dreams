import { useState, useEffect } from 'react'
import { useFediInjectionContext } from '@fedibtc/ui'
import './App.css'

function App() {
  const context = useFediInjectionContext()
  const { status, error, webln, authenticatedMember, fedi } = context
  const [balance, setBalance] = useState(null)
  const [loading, setLoading] = useState(false)
  const [balanceError, setBalanceError] = useState(null)
  const [weblnInfo, setWeblnInfo] = useState(null)

  useEffect(() => {
    const fetchBalance = async () => {
      if (!webln || !authenticatedMember) {
        return
      }

      setLoading(true)
      setBalanceError(null)

      try {
        // Try webln.getInfo() which typically returns balance
        if (typeof webln.getInfo === 'function') {
          const info = await webln.getInfo()
          setWeblnInfo(info)

          // Check various possible balance properties
          if (info) {
            if (typeof info.balance === 'number') {
              setBalance(info.balance)
              return
            }
            if (info.methods?.includes('balance') && typeof info.balance === 'number') {
              setBalance(info.balance)
              return
            }
          }
        }

        setBalanceError('No balance API found')
      } catch (err) {
        setBalanceError(err.message || String(err))
      } finally {
        setLoading(false)
      }
    }

    fetchBalance()
  }, [webln, authenticatedMember, fedi])

  if (status === 'loading' || status === 'checking_injections') {
    return <div className="container">Loading...</div>
  }

  if (status === 'error') {
    return <div className="container error">Error: {error?.message}</div>
  }

  if (!authenticatedMember) {
    return <div className="container">Waiting for authentication...</div>
  }

  return (
    <div className="container">
      <h1>Dreams</h1>
      <div className="user-info">
        <p className="username">
          {authenticatedMember.name || authenticatedMember.username || 'User'}
        </p>
        <p className="balance">
          {loading
            ? 'Loading balance...'
            : balance !== null
              ? `${balance} sats`
              : balanceError
                ? `Error: ${balanceError}`
                : 'Balance unavailable'}
        </p>
      </div>

      <div className="debug-info">
        <h3>Debug Info</h3>
        <div className="debug-section">
          <strong>Status:</strong> {status}
        </div>
        <div className="debug-section">
          <strong>All Context Properties:</strong>
          <pre>{JSON.stringify(Object.keys(context), null, 2)}</pre>
        </div>
        <div className="debug-section">
          <strong>WebLN available:</strong> {webln ? 'Yes' : 'No'}
        </div>
        {webln && (
          <>
            <div className="debug-section">
              <strong>WebLN own keys:</strong>
              <pre>{JSON.stringify(Object.keys(webln), null, 2)}</pre>
            </div>
            <div className="debug-section">
              <strong>WebLN methods check:</strong>
              <pre>{JSON.stringify({
                hasGetInfo: typeof webln.getInfo === 'function',
                hasGetBalance: typeof webln.getBalance === 'function',
                hasEnable: typeof webln.enable === 'function',
                hasSendPayment: typeof webln.sendPayment === 'function'
              }, null, 2)}</pre>
            </div>
          </>
        )}
        <div className="debug-section">
          <strong>Fedi available:</strong> {fedi ? 'Yes' : 'No'}
        </div>
        {fedi && (
          <>
            <div className="debug-section">
              <strong>Fedi own keys:</strong>
              <pre>{JSON.stringify(Object.keys(fedi), null, 2)}</pre>
            </div>
            <div className="debug-section">
              <strong>Fedi methods check:</strong>
              <pre>{JSON.stringify({
                hasGetActiveFederation: typeof fedi.getActiveFederation === 'function',
                hasGenerateEcash: typeof fedi.generateEcash === 'function',
                hasReceiveEcash: typeof fedi.receiveEcash === 'function',
                hasGetAuthenticatedMember: typeof fedi.getAuthenticatedMember === 'function'
              }, null, 2)}</pre>
            </div>
          </>
        )}
        {weblnInfo && (
          <div className="debug-section">
            <strong>WebLN getInfo() result:</strong>
            <pre>{JSON.stringify(weblnInfo, null, 2)}</pre>
          </div>
        )}
        <div className="debug-section">
          <strong>Authenticated Member:</strong>
          <pre>{JSON.stringify(authenticatedMember, null, 2)}</pre>
        </div>
        {balanceError && (
          <div className="debug-section error">
            <strong>Balance Error:</strong> {balanceError}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
