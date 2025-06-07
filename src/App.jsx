import React, { useEffect, useState } from 'react';
import './App.css';

const API_URL = 'https://cryptominerbot-1.onrender.com';

function App() {
  const [telegramId, setTelegramId] = useState(null);
  const [balance, setBalance] = useState(null);
  const [message, setMessage] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [lastMined, setLastMined] = useState(null);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  // ✅ Load Telegram context
  useEffect(() => {
    try {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.ready();
        const user = window.Telegram.WebApp.initDataUnsafe?.user;
        if (user?.id) {
          const id = user.id.toString();
          setTelegramId(id);
          console.log("✅ Telegram ID loaded:", id);
        } else {
          console.warn("⚠️ No Telegram user in context.");
        }
      } else {
        console.warn("❌ Telegram WebApp object not available.");
      }
    } catch (err) {
      console.error("Telegram init error:", err);
    }
  }, []);

  // === API Actions ===
  const handleAction = async (endpoint) => {
    if (!telegramId) return setMessage('⚠️ Telegram ID not loaded');
    try {
      const res = await fetch(`${API_URL}/${endpoint}?telegram_id=${telegramId}`, {
        method: 'POST',
      });
      const data = await res.json();
      setMessage(data.message || '✅ Success');
      if (data.balance !== undefined) setBalance(data.balance);
      if (data.last_mined) setLastMined(new Date(data.last_mined));
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to perform action');
    }
  };

  const handleBalance = async () => {
    if (!telegramId) return setMessage('⚠️ Telegram ID not loaded');
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
    if (!telegramId) return setMessage('⚠️ Telegram ID not loaded');
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

  // Cooldown logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastMined) {
        const now = new Date();
        const diff = (now - lastMined) / 1000;
        const cooldown = 300;
        setCooldownRemaining(Math.max(0, cooldown - diff));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lastMined]);

  return (
    <div className="App">
      <h1>JOHEC</h1>

      {/* ✅ Debugging only – can be removed later */}
      <p>🆔 Telegram ID: {telegramId || 'unknown'}</p>

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
