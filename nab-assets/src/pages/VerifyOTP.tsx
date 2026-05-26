import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function VerifyOTP() {
  const [emailCode, setEmailCode] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [verifying, setVerifying] = useState<'email' | 'phone' | null>(null);
  const { sendOTP, verifyOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { email, phone } = location.state || {};

  const handleSendOTP = async (type: 'email' | 'phone') => {
    await sendOTP(type);
    alert(`OTP sent to your ${type}`);
  };

  const handleVerify = async (type: 'email' | 'phone') => {
    const code = type === 'email' ? emailCode : phoneCode;
    if (!code) return;
    
    setVerifying(type);
    await verifyOTP(code, type);
    setVerifying(null);
    
    // If both verified, redirect
    alert(`${type} verified successfully!`);
    if (type === 'phone') {
      navigate('/');
    }
  };

  return (
    <div className="pt-20 pb-12 min-h-screen">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-nab-card rounded-3xl p-8">
          <h1 className="text-2xl font-bold text-white mb-2">Verify Your Account</h1>
          <p className="text-nab-gray mb-8">
            Enter the OTP codes sent to your email and phone
          </p>

          <div className="space-y-6">
            {/* Email Verification */}
            <div>
              <label className="block text-sm text-nab-gray mb-2">
                Email: {email}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={emailCode}
                  onChange={(e) => setEmailCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="flex-1 px-4 py-3 bg-nab-darker rounded-xl text-white border border-white/10 focus:border-nab-blue outline-none transition-colors"
                />
                <button
                  onClick={() => handleSendOTP('email')}
                  className="px-4 py-3 bg-nab-darker hover:bg-white/10 rounded-xl text-nab-blue transition-colors"
                >
                  Send
                </button>
              </div>
              <button
                onClick={() => handleVerify('email')}
                disabled={!emailCode || verifying === 'email'}
                className="w-full mt-2 py-3 bg-nab-blue hover:bg-nab-blue-dark disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl text-white font-semibold transition-colors"
              >
                {verifying === 'email' ? 'Verifying...' : 'Verify Email'}
              </button>
            </div>

            {/* Phone Verification */}
            <div>
              <label className="block text-sm text-nab-gray mb-2">
                Phone: {phone}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={phoneCode}
                  onChange={(e) => setPhoneCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="flex-1 px-4 py-3 bg-nab-darker rounded-xl text-white border border-white/10 focus:border-nab-blue outline-none transition-colors"
                />
                <button
                  onClick={() => handleSendOTP('phone')}
                  className="px-4 py-3 bg-nab-darker hover:bg-white/10 rounded-xl text-nab-blue transition-colors"
                >
                  Send
                </button>
              </div>
              <button
                onClick={() => handleVerify('phone')}
                disabled={!phoneCode || verifying === 'phone'}
                className="w-full mt-2 py-3 bg-nab-blue hover:bg-nab-blue-dark disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl text-white font-semibold transition-colors"
              >
                {verifying === 'phone' ? 'Verifying...' : 'Verify Phone'}
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-nab-gray text-xs text-center">
              ⚠️ Both email and phone verification are required to participate in auctions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
