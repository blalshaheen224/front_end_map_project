// src/components/layout/Header.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, Search, LogOut, Menu, X, Map as MapIcon } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-br from-primary-600 to-primary-500 rounded-xl group-hover:shadow-lg transition-all duration-300">
              <Home className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient hidden sm:block">عقارات</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-base font-medium text-gray-700 hover:text-primary-600 transition-colors relative group"
            >
              الرئيسية
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link 
              to="/properties" 
              className="text-base font-medium text-gray-700 hover:text-primary-600 transition-colors relative group"
            >
              العقارات
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link 
              to="/map" 
              className="text-base font-medium text-gray-700 hover:text-primary-600 transition-colors flex items-center gap-2 relative group"
            >
              <MapIcon className="h-5 w-5" />
              الخريطة
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link 
              to="/search" 
              className="text-base font-medium text-gray-700 hover:text-primary-600 transition-colors flex items-center gap-2 relative group"
            >
              <Search className="h-5 w-5" />
              بحث
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300" />
            </Link>

            {user ? (
              <button
                onClick={handleLogout}
                className="btn btn-outline"
              >
                <LogOut className="h-5 w-5" />
                خروج
              </button>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 animate-fade-in">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors"
            >
              الرئيسية
            </Link>
            <Link
              to="/properties"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors"
            >
              العقارات
            </Link>
            <Link
              to="/map"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors flex items-center gap-2"
            >
              <MapIcon className="h-5 w-5" />
              الخريطة
            </Link>
            <Link
              to="/search"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors"
            >
              بحث
            </Link>

            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-base font-medium bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                خروج
              </button>
            ) : null}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;