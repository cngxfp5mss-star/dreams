import { useState, useEffect } from 'react'
import { useFediInjectionContext } from '@fedibtc/ui'
import './App.css'

function App() {
  const { status, error, webln, authenticatedMember } = useFediInjectionContext()
  const [balance, setBalance] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchBalance = async () => {
      if (!webln || !authenticatedMember) return

      setLoading(true)
      try {
        if (typeof webln.getBalance === 'function') {
          const res = await webln.getBalance()
          setBalance(res.balance)
        }
      } catch (err) {
        console.error('Failed to fetch balance:', err)
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
          {loading ? 'Loading balance...' : balance !== null ? `${balance} sats` : 'Balance unavailable'}
        </p>
      </div>
    </div>
  )
}

export default App
