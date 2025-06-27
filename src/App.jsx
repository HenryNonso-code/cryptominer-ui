import React, { useEffect, useState } from 'react';
import './App.css';

const API_URL = 'https://crypto-miner-bot-web.onrender.com'; // ✅ Your deployed backend

function App() {
  const [telegramId, setTelegramId] = useState(null);
  const [balance, setBalance] = useState(null);
  const [message, setMessage] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  // ✅ Get Telegram ID from Telegram WebApp
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      if (user?.id) {
        setTelegramId(user.id.toString());
      }
    }
  }, []);

  // ✅ Handle mining, spinning, quest, etc.
  const handleAction = async (endpoint) => {
    if (!telegramId) return setMessage('⚠️ Telegram ID not found');
    try {
      const res = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ telegram_id: telegramId })
      });
      const data = await res.json();
      setMessage(data.message || '✅ Done');
      if (data.balance !== undefined) setBalance(data.balance);
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to connect');
    }
  };

  // ✅ Link wallet to user account
  const handleLinkWallet = async () => {
    if (!telegramId || !walletAddress) return;
    try {
      const res = await fetch(`${API_URL}/link-wallet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegram_id: telegramId, wallet_address: walletAddress })
      });
      const data = await res.json();
      setMessage(data.message || '✅ Wallet Linked');
    } catch (err) {
      setMessage('❌ Link failed');
    }
  };

  return (
    <div className="App">
      <h1>JOHEC</h1>
      <p>🆔 Telegram ID: {telegramId || 'Detecting...'}</p>

      <button onClick={() => handleAction('register')}>📝 Register</button>
      <button onClick={() => handleAction('mine')}>⛏️ Mine</button>
      <button onClick={() => handleAction('spin')}>🎰 Spin</button>
      <button onClick={() => handleAction('quest')}>🎯 Quest</button>
      <button onClick={() => handleAction('balance')}>💰 Check Balance</button>

      <input
        type="text"
        placeholder="Enter wallet address"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
      />
      <button onClick={handleLinkWallet}>🔗 Link Wallet</button>

      {message && <p>{message}</p>}
      {balance !== null && <p>Wallet Balance: {balance} coins</p>}

      <a href="/leaderboard">
        <button style={{ backgroundColor: '#facc15', color: 'black' }}>
          🏆 View Leaderboard
        </button>
      </a>
    </div>
  );
}

export default App;
