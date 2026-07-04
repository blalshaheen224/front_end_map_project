// src/pages/admin/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, TrendingUp, DollarSign, Star, Eye, Plus } from 'lucide-react';
import { propertyService } from '../../services/propertyService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CITIES_AR, PROPERTY_TYPES_AR } from '../../constants/propertyConstants';

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

      setRecentProperties(properties.slice(0, 5));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  const statCards = [
    { label: 'إجمالي العقارات', value: stats.total, icon: Building2, color: 'from-blue-500 to-blue-600' },
    { label: 'عقارات مميزة', value: stats.featured, icon: Star, color: 'from-yellow-500 to-yellow-600' },
    { label: 'للبيع', value: stats.sale, icon: DollarSign, color: 'from-green-500 to-green-600' },
    { label: 'للإيجار', value: stats.rent, icon: TrendingUp, color: 'from-purple-500 to-purple-600' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">نظرة عامة</h1>
        <Link
          to="/admin/properties/new"
          className="btn btn-primary"
        >
          <Plus className="h-5 w-5" />
          إضافة عقار
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Properties */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">أحدث العقارات</h2>
          <Link to="/admin/properties" className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center gap-1">
            عرض الكل
            <Eye className="h-4 w-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-right text-gray-600 text-sm">
                <th className="py-4 px-6">العنوان</th>
                <th className="py-4 px-6 hidden sm:table-cell">الموقع</th>
                <th className="py-4 px-6">السعر</th>
                <th className="py-4 px-6 hidden md:table-cell">النوع</th>
                <th className="py-4 px-6">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {recentProperties.map((property, index) => (
                <tr 
                  key={property._id} 
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="py-4 px-6">
                    <p className="font-semibold text-gray-900 line-clamp-1">{property.title}</p>
                    <p className="text-xs text-gray-500 mt-1 sm:hidden">
                      {CITIES_AR[property.city] || property.city}
                    </p>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600 hidden sm:table-cell">
                    {CITIES_AR[property.city] || property.city}
                  </td>
                  <td className="py-4 px-6 font-semibold text-primary-600">
                    {property.price.toLocaleString()} ج.م
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600 hidden md:table-cell">
                    {PROPERTY_TYPES_AR[property.type] || property.type}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`badge ${
                      property.status === 'active' ? 'badge-success' :
                      property.status === 'pending' ? 'badge-warning' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {property.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentProperties.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-500">
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