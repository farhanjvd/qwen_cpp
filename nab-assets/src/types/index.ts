export interface Asset {
  id: string;
  title: string;
  type: 'property' | 'vehicle' | 'land' | 'commercial';
  description: string;
  size?: string;
  value: number;
  latitude?: number;
  longitude?: number;
  address: string;
  city: string;
  images: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Auction {
  id: string;
  assetId: string;
  asset: Asset;
  startingPrice: number;
  currentBid: number;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'live' | 'ended';
  bids: Bid[];
  createdAt: string;
}

export interface Bid {
  id: string;
  auctionId: string;
  userId: string;
  amount: number;
  timestamp: string;
  bidder: User;
}

export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  role: 'admin' | 'user';
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
}

export interface OTP {
  id: string;
  userId: string;
  code: string;
  type: 'email' | 'phone';
  expiresAt: string;
  used: boolean;
}
