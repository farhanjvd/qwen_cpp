import { useState, useEffect } from 'react';
import { Auction } from '../types';
import { useAuth } from '../context/AuthContext';

interface AuctionCardProps {
  auction: Auction;
  onBid?: (amount: number) => void;
}

export default function AuctionCard({ auction, onBid }: AuctionCardProps) {
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [isBidding, setIsBidding] = useState(false);

  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(auction.endTime).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('Ended');
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [auction.endTime]);

  const handleBid = () => {
    if (!bidAmount || !onBid) return;
    const amount = parseFloat(bidAmount);
    if (amount > auction.currentBid) {
      onBid(amount);
      setBidAmount('');
      setIsBidding(false);
    }
  };

  const isLive = auction.status === 'live';
  const isUpcoming = auction.status === 'upcoming';

  return (
    <div className="bg-nab-card rounded-2xl overflow-hidden hover:bg-white/5 transition-all">
      <div className="relative h-48 bg-gradient-to-br from-nab-blue/20 to-nab-blue-dark/20">
        {auction.asset.images && auction.asset.images.length > 0 ? (
          <img
            src={auction.asset.images[0]}
            alt={auction.asset.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            {auction.asset.type === 'vehicle' ? '🚗' : '🏠'}
          </div>
        )}
        
        <div className={`absolute top-3 right-3 px-4 py-2 rounded-full text-xs font-semibold backdrop-blur ${
          isLive ? 'bg-green-500/90 text-white animate-pulse' : 
          isUpcoming ? 'bg-nab-blue/90 text-white' : 'bg-gray-500/90 text-white'
        }`}>
          {isLive ? `🔴 LIVE • ${timeLeft}` : isUpcoming ? `Starts in ${timeLeft}` : 'Ended'}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-white font-semibold text-lg mb-2">{auction.asset.title}</h3>
        <p className="text-nab-gray text-sm mb-4 line-clamp-2">{auction.asset.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-nab-darker/50 rounded-xl p-3">
            <p className="text-nab-gray text-xs mb-1">Starting Price</p>
            <p className="text-white font-semibold">Rs. {(auction.startingPrice / 1000000).toFixed(2)}M</p>
          </div>
          <div className="bg-nab-darker/50 rounded-xl p-3">
            <p className="text-nab-gray text-xs mb-1">Current Bid</p>
            <p className="text-nab-blue font-bold text-lg">Rs. {(auction.currentBid / 1000000).toFixed(2)}M</p>
          </div>
        </div>

        {auction.bids.length > 0 && (
          <div className="mb-4">
            <p className="text-nab-gray text-xs mb-2">Recent Bids ({auction.bids.length})</p>
            <div className="space-y-2">
              {auction.bids.slice(-3).map((bid) => (
                <div key={bid.id} className="flex justify-between items-center text-sm">
                  <span className="text-nab-gray">{bid.bidder.name}</span>
                  <span className="text-nab-blue font-semibold">Rs. {(bid.amount / 1000000).toFixed(2)}M</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {isLive && user && (
          <div className="space-y-3">
            {!isBidding ? (
              <button
                onClick={() => setIsBidding(true)}
                disabled={!user?.emailVerified || !user?.phoneVerified}
                className="w-full py-3 bg-nab-blue hover:bg-nab-blue-dark disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl text-white font-semibold transition-colors"
              >
                {!user?.emailVerified || !user?.phoneVerified ? 'Verify Account to Bid' : 'Place Bid'}
              </button>
            ) : (
              <div className="flex gap-2">
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={`Min: Rs. ${(auction.currentBid + 100000).toLocaleString()}`}
                  className="flex-1 px-4 py-3 bg-nab-darker rounded-xl text-white border border-white/10 focus:border-nab-blue outline-none"
                />
                <button
                  onClick={handleBid}
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-xl text-white font-semibold transition-colors"
                >
                  Bid
                </button>
              </div>
            )}
            <p className="text-nab-gray text-xs text-center">
              ⏱️ Anti-sniping: +2 mins for last-minute bids
            </p>
          </div>
        )}

        {!user && isLive && (
          <p className="text-nab-gray text-sm text-center py-3">
            Sign in to participate in this auction
          </p>
        )}
      </div>
    </div>
  );
}
