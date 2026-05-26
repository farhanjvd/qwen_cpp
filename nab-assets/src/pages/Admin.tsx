import { useState } from 'react';
import { mockAssets, mockAuctions } from '../data/mockData';
import AssetCard from '../components/AssetCard';
import AuctionCard from '../components/AuctionCard';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'assets' | 'auctions'>('assets');
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [showCreateAuction, setShowCreateAuction] = useState(false);

  return (
    <div className="pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-nab-gray">Manage assets and run auctions</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('assets')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'assets'
                  ? 'bg-nab-blue text-white'
                  : 'bg-nab-card text-nab-gray hover:text-white'
              }`}
            >
              Assets
            </button>
            <button
              onClick={() => setActiveTab('auctions')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'auctions'
                  ? 'bg-nab-blue text-white'
                  : 'bg-nab-card text-nab-gray hover:text-white'
              }`}
            >
              Auctions
            </button>
          </div>
        </div>

        {activeTab === 'assets' ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">All Assets</h2>
              <button
                onClick={() => setShowAddAsset(true)}
                className="px-4 py-2 bg-nab-blue hover:bg-nab-blue-dark rounded-xl text-white font-medium transition-colors"
              >
                + Add Asset
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockAssets.map((asset) => (
                <AssetCard key={asset.id} asset={asset} />
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Active Auctions</h2>
              <button
                onClick={() => setShowCreateAuction(true)}
                className="px-4 py-2 bg-nab-blue hover:bg-nab-blue-dark rounded-xl text-white font-medium transition-colors"
              >
                + Create Auction
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockAuctions.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Asset Modal */}
      {showAddAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-nab-darker rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Add New Asset</h2>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-nab-gray mb-2">Title</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-nab-card rounded-xl text-white border border-white/10 focus:border-nab-blue outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-nab-gray mb-2">Type</label>
                  <select className="w-full px-4 py-3 bg-nab-card rounded-xl text-white border border-white/10 focus:border-nab-blue outline-none">
                    <option>property</option>
                    <option>vehicle</option>
                    <option>land</option>
                    <option>commercial</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-nab-gray mb-2">Description</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 bg-nab-card rounded-xl text-white border border-white/10 focus:border-nab-blue outline-none"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-nab-gray mb-2">Size</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-nab-card rounded-xl text-white border border-white/10 focus:border-nab-blue outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-nab-gray mb-2">Value (PKR)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 bg-nab-card rounded-xl text-white border border-white/10 focus:border-nab-blue outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-nab-gray mb-2">Address</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-nab-card rounded-xl text-white border border-white/10 focus:border-nab-blue outline-none"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-nab-gray mb-2">City</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-nab-card rounded-xl text-white border border-white/10 focus:border-nab-blue outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-nab-gray mb-2">Upload Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="w-full px-4 py-3 bg-nab-card rounded-xl text-white border border-white/10"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="published" className="rounded bg-nab-card border-white/10" />
                <label htmlFor="published" className="text-sm text-white">Publish immediately</label>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddAsset(false)}
                  className="flex-1 py-3 bg-nab-card hover:bg-white/10 rounded-xl text-white font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-nab-blue hover:bg-nab-blue-dark rounded-xl text-white font-medium transition-colors"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Auction Modal */}
      {showCreateAuction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-nab-darker rounded-3xl p-8 max-w-2xl w-full">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Auction</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm text-nab-gray mb-2">Select Asset</label>
                <select className="w-full px-4 py-3 bg-nab-card rounded-xl text-white border border-white/10 focus:border-nab-blue outline-none">
                  {mockAssets.map((asset) => (
                    <option key={asset.id} value={asset.id}>{asset.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-nab-gray mb-2">Starting Price (PKR)</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 bg-nab-card rounded-xl text-white border border-white/10 focus:border-nab-blue outline-none"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-nab-gray mb-2">Start Time</label>
                  <input
                    type="datetime-local"
                    className="w-full px-4 py-3 bg-nab-card rounded-xl text-white border border-white/10 focus:border-nab-blue outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-nab-gray mb-2">End Time</label>
                  <input
                    type="datetime-local"
                    className="w-full px-4 py-3 bg-nab-card rounded-xl text-white border border-white/10 focus:border-nab-blue outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateAuction(false)}
                  className="flex-1 py-3 bg-nab-card hover:bg-white/10 rounded-xl text-white font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-nab-blue hover:bg-nab-blue-dark rounded-xl text-white font-medium transition-colors"
                >
                  Create Auction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
