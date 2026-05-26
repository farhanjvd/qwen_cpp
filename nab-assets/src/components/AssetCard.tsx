import { Asset } from '../types';

interface AssetCardProps {
  asset: Asset;
  onClick?: () => void;
}

export default function AssetCard({ asset, onClick }: AssetCardProps) {
  const getTypeIcon = (type: Asset['type']) => {
    switch (type) {
      case 'property':
        return '🏠';
      case 'vehicle':
        return '🚗';
      case 'land':
        return '🌾';
      case 'commercial':
        return '🏢';
      default:
        return '📦';
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-nab-card rounded-2xl overflow-hidden hover:bg-white/5 transition-all cursor-pointer group"
    >
      <div className="relative h-48 bg-gradient-to-br from-nab-blue/20 to-nab-blue-dark/20 flex items-center justify-center">
        {asset.images && asset.images.length > 0 ? (
          <img
            src={asset.images[0]}
            alt={asset.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-6xl">{getTypeIcon(asset.type)}</span>
        )}
        <div className="absolute top-3 right-3 px-3 py-1 bg-nab-darker/90 backdrop-blur rounded-full text-xs text-white capitalize">
          {asset.type}
        </div>
        {!asset.published && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-orange-500/90 backdrop-blur rounded-full text-xs text-white">
            Draft
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-nab-blue transition-colors">
          {asset.title}
        </h3>
        <p className="text-nab-gray text-sm mb-3 line-clamp-2">{asset.description}</p>

        <div className="flex items-center justify-between">
          <div>
            {asset.size && (
              <p className="text-nab-gray text-xs mb-1">Size: {asset.size}</p>
            )}
            <p className="text-nab-gray text-xs">{asset.city}</p>
          </div>
          <p className="text-nab-blue font-bold text-lg">
            Rs. {(asset.value / 1000000).toFixed(2)}M
          </p>
        </div>
      </div>
    </div>
  );
}
