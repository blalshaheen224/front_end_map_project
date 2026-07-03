// src/pages/admin/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, TrendingUp, DollarSign, Star, Eye } from 'lucide-react';
import { propertyService } from '../../services/propertyService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CITIES_AR, PROPERTY_TYPES_AR, PROPERTY_PURPOSE_AR } from '../../constants/propertyConstants';

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, featured: 0, sale: 0, rent: 0 });
  const [recentProperties, setRecentProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await propertyService.getAll({ limit: 100 });
      const properties = response.data?.data || [];
      
      setStats({
        total: response.data?.pagination?.totalCount || 0,
        featured: properties.filter(p => p.isFeatured).length,
        sale: properties.filter(p => p.purpose === 'sale').length,
        rent: properties.filter(p => p.purpose === 'rent').length,
      });

      // Get latest 5
      setRecentProperties(properties.slice(0, 5));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  const statCards = [
    { label: 'إجمالي العقارات', value: stats.total, icon: Building2, color: 'bg-blue-500' },
    { label: 'عقارات مميزة', value: stats.featured, icon: Star, color: 'bg-yellow-500' },
    { label: 'للبيع', value: stats.sale, icon: DollarSign, color: 'bg-green-500' },
    { label: 'للإيجار', value: stats.rent, icon: TrendingUp, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">نظرة عامة</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`${stat.color} p-3 rounded-lg text-white`}>
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Properties */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">أحدث العقارات المضافة</h2>
          <Link to="/admin/properties" className="text-primary-600 hover:text-primary-700 text-sm font-semibold">
            عرض الكل
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-right text-gray-600 text-sm">
                <th className="py-4 px-6">العنوان</th>
                <th className="py-4 px-6">السعر</th>
                <th className="py-4 px-6">النوع</th>
                <th className="py-4 px-6">الحالة</th>
                <th className="py-4 px-6">التاريخ</th>
                <th className="py-4 px-6 text-center">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {recentProperties.map((property) => (
                <tr key={property._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-semibold text-gray-900 line-clamp-1">{property.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {CITIES_AR[property.city] || property.city}
                      {property.district && ` - ${property.district}`}
                    </p>
                  </td>
                  <td className="py-4 px-6 font-semibold text-primary-600">
                    {property.price.toLocaleString()} ج.م
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {PROPERTY_TYPES_AR[property.type] || property.type}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      property.status === 'active' ? 'bg-green-100 text-green-700' :
                      property.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {property.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-500 text-sm">
                    {new Date(property.createdAt).toLocaleDateString('ar-EG')}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <Link
                      to={`/properties/${property._id}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                    >
                      <Eye className="h-4 w-4" />
                      عرض
                    </Link>
                  </td>
                </tr>
              ))}
              {recentProperties.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500">
                    لا توجد عقارات حتى الآن
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;