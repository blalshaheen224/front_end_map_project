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
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <Home className="h-10 w-10 text-primary-600" />
            <span className="text-3xl font-bold text-gray-900">عقارات</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            <Link 
              to="/" 
              className="text-lg font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              الرئيسية
            </Link>
            <Link 
              to="/properties" 
              className="text-lg font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              العقارات
            </Link>
            <Link 
              to="/map" 
              className="text-lg font-medium text-gray-700 hover:text-primary-600 transition-colors flex items-center gap-2"
            >
              <MapIcon className="h-6 w-6" />
              الخريطة
            </Link>
            <Link 
              to="/search" 
              className="text-lg font-medium text-gray-700 hover:text-primary-600 transition-colors flex items-center gap-2"
            >
              <Search className="h-6 w-6" />
              بحث
            </Link>

            {user ? (
              <>
                {/* ✅ تم إزالة زر لوحة التحكم من هنا لأن الأدمن سيصل إليها تلقائياً بعد تسجيل الدخول */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-6 py-3 text-lg font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <LogOut className="h-6 w-6" />
                  خروج
                </button>
              </>
            ) : (
              /* ✅ تم إخفاء زر تسجيل الدخول - الوصول فقط عبر الرابط المباشر /login */
              null
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="block text-lg font-medium text-gray-700 hover:text-primary-600 py-2"
            >
              الرئيسية
            </Link>
            <Link
              to="/properties"
              onClick={() => setIsMenuOpen(false)}
              className="block text-lg font-medium text-gray-700 hover:text-primary-600 py-2"
            >
              العقارات
            </Link>
            <Link
              to="/map"
              onClick={() => setIsMenuOpen(false)}
              className="block text-lg font-medium text-gray-700 hover:text-primary-600 py-2 flex items-center gap-2"
            >
              <MapIcon className="h-6 w-6" />
              الخريطة
            </Link>
            <Link
              to="/search"
              onClick={() => setIsMenuOpen(false)}
              className="block text-lg font-medium text-gray-700 hover:text-primary-600 py-2"
            >
              بحث
            </Link>

            {user ? (
              <>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 text-lg font-medium bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <LogOut className="h-6 w-6" />
                  خروج
                </button>
              </>
            ) : (
              /* ✅ تم إخفاء زر تسجيل الدخول من القائمة المحمولة أيضاً */
              null
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;