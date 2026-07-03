// src/pages/Login.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.message);
    }
    // ✅ لا حاجة لـ navigate هنا لأن AuthContext سيتكفل بالتوجيه
    
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 py-16 px-4">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-2xl p-10">
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-900">
          تسجيل دخول الأدمن
        </h2>
        
        {error && (
          <div className="bg-red-50 border-2 border-red-300 text-red-700 px-6 py-4 rounded-lg mb-6 text-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-xl font-semibold text-gray-700 mb-3">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="admin@company.com"
            />
          </div>

          <div>
            <label className="block text-xl font-semibold text-gray-700 mb-3">
              كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 text-xl font-semibold bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? 'جاري تسجيل الدخول...' : 'دخول إلى لوحة التحكم'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-lg">
            هذه الصفحة مخصصة للأدمن فقط
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;