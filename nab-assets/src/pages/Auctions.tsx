import { useState } from 'react';
import { mockAuctions } from '../data/mockData';
import AuctionCard from '../components/AuctionCard';

export default function Auctions() {
  const [filter, setFilter] = useState<'all' | 'live' | 'upcoming'>('all');

  const filteredAuctions = filter === 'all'
    ? mockAuctions
    : mockAuctions.filter((a) => a.status === filter);

  const handleBid = (auctionId: string, amount: number) => {
    console.log('Placing bid:', auctionId, amount);
    // In real app, this would call the API via socket
  };

  return (
    <div className="pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Live Auctions
          </h1>
          <p className="text-nab-gray text-lg max-w-2xl">
            Participate in real-time online auctions for seized assets. 
            Verify your account with email and phone OTP to start bidding.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-8">
          {(['all', 'live', 'upcoming'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-nab-blue text-white'
                  : 'bg-nab-card text-nab-gray hover:text-white'
              }`}
            >
              {status === 'all' && 'All Auctions'}
              {status === 'live' && '🔴 Live Now'}
              {status === 'upcoming' && '⏰ Upcoming'}
            </button>
          ))}
        </div>

        {/* Auction Grid */}
        {filteredAuctions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAuctions.map((auction) => (
              <AuctionCard
                key={auction.id}
                auction={auction}
                onBid={(amount) => handleBid(auction.id, amount)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-white mb-2">No auctions found</h3>
            <p className="text-nab-gray">Check back later for new auctions</p>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="bg-nab-card rounded-2xl p-6">
            <div className="text-3xl mb-4">🔒</div>
            <h3 className="text-white font-semibold mb-2">Secure Bidding</h3>
            <p className="text-nab-gray text-sm">
              All bidders must verify their identity through email and phone OTP verification.
            </p>
          </div>
          <div className="bg-nab-card rounded-2xl p-6">
            <div className="text-3xl mb-4">⏱️</div>
            <h3 className="text-white font-semibold mb-2">Anti-Sniping System</h3>
            <p className="text-nab-gray text-sm">
              Last-minute bids automatically extend the auction by 2 minutes to ensure fair bidding.
            </p>
          </div>
          <div className="bg-nab-card rounded-2xl p-6">
            <div className="text-3xl mb-4">✅</div>
            <h3 className="text-white font-semibold mb-2">Verified Assets</h3>
            <p className="text-nab-gray text-sm">
              All assets are legally seized and verified by NAB for transparent auctions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
