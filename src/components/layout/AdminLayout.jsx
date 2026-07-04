// src/components/layout/AdminLayout.jsx
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, Building2, PlusCircle, LogOut, Menu, X, Home
} from 'lucide-react';
import { useState } from 'react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { path: '/admin/properties', label: 'العقارات', icon: Building2 },
    { path: '/admin/properties/new', label: 'إضافة عقار', icon: PlusCircle },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white shadow-sm sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary-600" />
            <h1 className="text-lg font-bold text-gray-900">لوحة التحكم</h1>
          </div>

          <Link 
            to="/"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="العودة للموقع"
          >
            <Home className="h-6 w-6" />
          </Link>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside 
        className={`
          lg:hidden fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b bg-gradient-to-r from-primary-600 to-primary-500 text-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">لوحة التحكم</h2>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold">{user?.username?.[0]?.toUpperCase() || 'A'}</span>
              </div>
              <div>
                <p className="font-semibold">{user?.username}</p>
                <p className="text-sm text-white/80">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive(item.path)
                    ? 'bg-primary-50 text-primary-600 font-semibold shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white shadow-lg flex-col fixed h-full z-30 right-0 top-0">
        <div className="p-6 border-b bg-gradient-to-r from-primary-600 to-primary-500 text-white">
          <h1 className="text-2xl font-bold mb-2">لوحة التحكم</h1>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold">{user?.username?.[0]?.toUpperCase() || 'A'}</span>
            </div>
            <div>
              <p className="font-semibold text-sm">{user?.username}</p>
              <p className="text-xs text-white/80">{user?.role}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive(item.path)
                  ? 'bg-primary-50 text-primary-600 font-semibold shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors mb-2"
          >
            <Home className="h-5 w-5" />
            <span>العودة للموقع</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:mr-64 p-4 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;