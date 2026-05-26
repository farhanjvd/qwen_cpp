import { useState } from 'react';
import { mockAssets } from '../data/mockData';
import AssetCard from '../components/AssetCard';
import AssetMap from '../components/AssetMap';

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [filterType, setFilterType] = useState<string>('all');

  const publishedAssets = mockAssets.filter((a) => a.published);
  const filteredAssets = filterType === 'all' 
    ? publishedAssets 
    : publishedAssets.filter((a) => a.type === filterType);

  return (
    <div className="pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Seized Assets Dashboard
          </h1>
          <p className="text-nab-gray text-lg max-w-2xl">
            National Accountability Bureau - Rawalpindi/Islamabad Region. 
            Browse confiscated properties, vehicles, and land available for auction.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-nab-card rounded-2xl p-6">
            <p className="text-nab-gray text-sm mb-2">Total Assets</p>
            <p className="text-3xl font-bold text-white">{mockAssets.length}</p>
          </div>
          <div className="bg-nab-card rounded-2xl p-6">
            <p className="text-nab-gray text-sm mb-2">Published</p>
            <p className="text-3xl font-bold text-nab-blue">{publishedAssets.length}</p>
          </div>
          <div className="bg-nab-card rounded-2xl p-6">
            <p className="text-nab-gray text-sm mb-2">Properties</p>
            <p className="text-3xl font-bold text-white">
              {mockAssets.filter((a) => a.type !== 'vehicle').length}
            </p>
          </div>
          <div className="bg-nab-card rounded-2xl p-6">
            <p className="text-nab-gray text-sm mb-2">Vehicles</p>
            <p className="text-3xl font-bold text-white">
              {mockAssets.filter((a) => a.type === 'vehicle').length}
            </p>
          </div>
        </div>

        {/* Filters & View Toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto">
            {['all', 'property', 'vehicle', 'land', 'commercial'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  filterType === type
                    ? 'bg-nab-blue text-white'
                    : 'bg-nab-card text-nab-gray hover:text-white'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-nab-blue text-white'
                  : 'bg-nab-card text-nab-gray hover:text-white'
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                viewMode === 'map'
                  ? 'bg-nab-blue text-white'
                  : 'bg-nab-card text-nab-gray hover:text-white'
              }`}
            >
              Map View
            </button>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        ) : (
          <div className="h-[600px] bg-nab-card rounded-2xl overflow-hidden">
            <AssetMap assets={filteredAssets} />
          </div>
        )}
      </div>
    </div>
  );
}
