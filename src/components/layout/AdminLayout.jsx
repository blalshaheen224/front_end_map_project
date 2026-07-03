// src/components/layout/AdminLayout.jsx
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, Building2, PlusCircle, LogOut, Menu, X 
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
    { path: '/admin/properties', label: 'إدارة العقارات', icon: Building2 },
    { path: '/admin/properties/new', label: 'إضافة عقار', icon: PlusCircle },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 bg-white shadow-lg flex-col fixed h-full z-20 right-0 top-0">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-primary-600">لوحة التحكم</h1>
          <p className="text-sm text-gray-500 mt-1">مرحباً، {user?.username}</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-primary-50 text-primary-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-30 flex">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50" 
            onClick={() => setIsSidebarOpen(false)}
          ></div>
          <aside className="relative w-64 bg-white shadow-lg flex-col flex h-full z-40 mr-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h1 className="text-xl font-bold text-primary-600">لوحة التحكم</h1>
              <button onClick={() => setIsSidebarOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary-50 text-primary-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut className="h-5 w-5" />
                تسجيل الخروج
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:mr-64 flex flex-col min-h-screen">
        {/* Topbar for Mobile */}
        <header className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-lg font-bold text-gray-800">لوحة التحكم</h1>
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;