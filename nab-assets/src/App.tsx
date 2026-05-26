import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Auctions from './pages/Auctions';
import Admin from './pages/Admin';
import Login from './pages/Login';
import VerifyOTP from './pages/VerifyOTP';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-b from-nab-dark to-nab-darker">
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/auctions" element={<Auctions />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
