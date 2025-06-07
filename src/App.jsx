import React, { useEffect, useState } from 'react';
import './App.css';

const API_URL = 'https://cryptominerbot-1.onrender.com';

let telegramId = 'unknown';
try {
  const initData = window.Telegram?.WebApp?.initDataUnsafe;
  if (initData?.user?.id) {
    telegramId = initData.user.id.toString();
  }
} catch (err) {
  console.warn('Telegram init error:', err);
}

function App() {
  const [balance, setBalance] = useState(null);
  const [message, setMessage] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [lastMined, setLastMined] = useState(null);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  const handleAction = async (endpoint) => {
    try {
      const res = await fetch(`${API_URL}/${endpoint}?telegram_id=${telegramId}`, {
        method: 'POST',
      });
      const data = await res.json();
      setMessage(data.message || '✅ Success');
      if (data.balance !== undefined) setBalance(data.balance);
      if (data.last_mined) setLastMined(new Date(data.last_mined));
    } catch (err) {
      setMessage('❌ Failed to perform action');
    }
  };

  const handleBalance = async () => {
    try {
      const res = await fetch(`${API_URL}/balance?telegram_id=${telegramId}`);
      const data = await res.json();
      setBalance(data.balance);
      if (data.last_mined) setLastMined(new Date(data.last_mined));
    } catch (err) {
      setMessage('⚠️ Could not fetch balance');
    }
  };

  const handleLinkWallet = async () => {
    try {
      const res = await fetch(`${API_URL}/link-wallet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegram_id: telegramId, wallet_address: walletAddress }),
      });
      const data = await res.json();
      setMessage(data.message || '✅ Wallet linked');
    } catch (err) {
      setMessage('❌ Failed to link wallet');
    }
  };

  // === Cooldown Timer ===
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastMined) {
        const now = new Date();
        const diff = (now - lastMined) / 1000; // in seconds
        const cooldown = 300; // 5 mins
        const remaining = Math.max(0, cooldown - diff);
        setCooldownRemaining(remaining);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lastMined]);

  return (
    <div className="App">
      <h1>JOHEC</h1>
      <p>🆔 Telegram ID: {telegramId}</p>

      <button onClick={() => handleAction('register')}>
        <span>📝</span> Register
      </button>

      <button onClick={() => handleAction('mine')} disabled={cooldownRemaining > 0}>
        <span>⛏️</span> Mine
      </button>
      {cooldownRemaining > 0 && (
        <p className="cooldown">⏳ Wait {Math.ceil(cooldownRemaining)}s</p>
      )}

      <button onClick={() => handleAction('spin')}>
        <span>🎰</span> Spin
      </button>

      <button onClick={() => handleAction('quest')}>
        <span>🎯</span> Quest
      </button>

      <button onClick={handleBalance}>
        <span>💰</span> Check Balance
      </button>

      <div>
        <input
          type="text"
          placeholder="Enter wallet address"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
        />
        <button onClick={handleLinkWallet}>
          <span>🔗</span> Link Wallet
        </button>
      </div>

      {message && <p className="status">{message}</p>}
      {balance !== null && <p className="status success">Wallet Balance: {balance} coins</p>}
    </div>
  );
}

export default App;
