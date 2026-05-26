import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      await register({ name, email, phone, password });
      // After registration, show OTP verification
      navigate('/verify-otp', { state: { email, phone } });
    } else {
      await login(email, password);
      navigate('/');
    }
  };

  return (
    <div className="pt-20 pb-12 min-h-screen">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-nab-card rounded-3xl p-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-nab-gray mb-8">
            {isRegister 
              ? 'Sign up to participate in auctions' 
              : 'Sign in to your account'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div>
                  <label className="block text-sm text-nab-gray mb-2">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-nab-darker rounded-xl text-white border border-white/10 focus:border-nab-blue outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-nab-gray mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 XXX XXXXXXX"
                    className="w-full px-4 py-3 bg-nab-darker rounded-xl text-white border border-white/10 focus:border-nab-blue outline-none transition-colors"
                    required
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm text-nab-gray mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-nab-darker rounded-xl text-white border border-white/10 focus:border-nab-blue outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-nab-gray mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-nab-darker rounded-xl text-white border border-white/10 focus:border-nab-blue outline-none transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-nab-blue hover:bg-nab-blue-dark rounded-xl text-white font-semibold transition-colors"
            >
              {isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-nab-blue hover:text-white text-sm transition-colors"
            >
              {isRegister 
                ? 'Already have an account? Sign In' 
                : "Don't have an account? Sign Up"}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-nab-gray text-xs text-center">
              🔐 Email and phone verification required for bidding
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
