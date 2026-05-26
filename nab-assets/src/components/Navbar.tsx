import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-nab-darker/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-nab-blue to-nab-blue-dark rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg">NAB Assets</h1>
              <p className="text-nab-gray text-xs">Rawalpindi/Islamabad</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm transition-colors ${
                location.pathname === '/' ? 'text-nab-blue' : 'text-nab-gray hover:text-white'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/auctions"
              className={`text-sm transition-colors ${
                location.pathname.includes('/auctions') ? 'text-nab-blue' : 'text-nab-gray hover:text-white'
              }`}
            >
              Auctions
            </Link>
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`text-sm transition-colors ${
                  location.pathname.includes('/admin') ? 'text-nab-blue' : 'text-nab-gray hover:text-white'
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-nab-gray text-sm">{user.name}</span>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-nab-card hover:bg-white/10 rounded-lg text-sm text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-nab-blue hover:bg-nab-blue-dark rounded-lg text-sm text-white transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
