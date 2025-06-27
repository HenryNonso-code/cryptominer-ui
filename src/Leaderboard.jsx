import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://cryptominerbot-1.onrender.com/leaderboard?limit=10";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(API_URL);
        setLeaders(res.data);
      } catch (err) {
        console.error("Error loading leaderboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-center">🏆 Leaderboard</h2>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <ul className="divide-y divide-gray-300">
          {leaders.length === 0 ? (
            <p className="text-center text-red-500">No data found</p>
          ) : (
            leaders.map((user, index) => (
              <li key={user.telegram_id} className="flex justify-between py-2">
                <span className="font-medium">{index + 1}. {user.username || 'Anonymous'}</span>
                <span className="text-green-600 font-semibold">{user.balance} 🪙</span>
              </li>
            ))
          )}
        </ul>
      )}

      {/* Optional Promotion Link */}
      <div className="text-center mt-4">
        <a
          href="https://t.me/JOHEC"
          className="text-blue-500 underline text-sm"
          target="_blank"
          rel="noreferrer"
        >
          Invite friends to earn bonus tokens 💸
        </a>
      </div>
    </div>
  );
};

export default Leaderboard;
