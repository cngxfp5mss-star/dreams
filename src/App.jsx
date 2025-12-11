import { useState, useEffect } from 'react'
import { useFediInjectionContext } from '@fedibtc/ui'
import './App.css'

function App() {
  const { status, error, webln, authenticatedMember } = useFediInjectionContext()
  const [balance, setBalance] = useState(null)
  const [loading, setLoading] = useState(false)
  const [balanceError, setBalanceError] = useState(null)

  useEffect(() => {
    const fetchBalance = async () => {
      if (!webln || !authenticatedMember) {
        console.log('Cannot fetch balance:', { webln: !!webln, authenticatedMember: !!authenticatedMember })
        return
      }

      console.log('WebLN object:', webln)
      console.log('WebLN methods:', Object.keys(webln))

      setLoading(true)
      setBalanceError(null)

      try {
        if (typeof webln.getBalance === 'function') {
          console.log('Calling webln.getBalance()...')
          const res = await webln.getBalance()
          console.log('Balance response:', res)
          setBalance(res.balance)
        } else {
          const errorMsg = 'getBalance is not available on webln'
          console.error(errorMsg)
          setBalanceError(errorMsg)
        }
      } catch (err) {
        console.error('Failed to fetch balance:', err)
        setBalanceError(err.message || String(err))
      } finally {
        setLoading(false)
      }
    }

    fetchBalance()
  }, [webln, authenticatedMember])

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
          <strong>WebLN available:</strong> {webln ? 'Yes' : 'No'}
        </div>
        {webln && (
          <div className="debug-section">
            <strong>WebLN methods:</strong>
            <pre>{JSON.stringify(Object.keys(webln), null, 2)}</pre>
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
