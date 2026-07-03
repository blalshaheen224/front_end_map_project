// src/pages/Unauthorized.jsx
import { Link } from 'react-router-dom';
import { ShieldX } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <ShieldX className="mx-auto h-16 w-16 text-red-500" />
        <h1 className="mt-4 text-3xl font-bold text-gray-900">غير مصرح</h1>
        <p className="mt-2 text-gray-600">
          ليس لديك صلاحية للوصول إلى هذه الصفحة
        </p>
        <Link
          to="/"
          className="mt-6 inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;