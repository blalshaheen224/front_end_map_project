// src/pages/admin/Dashboard.jsx (محسّن)
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, TrendingUp, DollarSign, Star, Eye, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { propertyService } from '../../services/propertyService';
import { DashboardSkeleton } from '../../components/common/SkeletonLoader';
import ScrollReveal from '../../components/common/ScrollReveal';
import AnimatedCounter from '../../components/common/AnimatedCounter';
import MagneticButton from '../../components/common/MagneticButton';
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'إجمالي العقارات', value: stats.total, icon: Building2, gradient: 'from-blue-500 to-cyan-500', change: '+12%' },
    { label: 'عقارات مميزة', value: stats.featured, icon: Star, gradient: 'from-yellow-500 to-orange-500', change: '+5%' },
    { label: 'للبيع', value: stats.sale, icon: DollarSign, gradient: 'from-green-500 to-emerald-500', change: '+18%' },
    { label: 'للإيجار', value: stats.rent, icon: TrendingUp, gradient: 'from-purple-500 to-pink-500', change: '+7%' },
  ];

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 animated-gradient-text inline-block">نظرة عامة</h1>
          <p className="text-gray-600">مرحباً بك في لوحة التحكم الخاصة بك</p>
        </div>
        <MagneticButton to="/admin/properties/new" strength={0.4} className="btn btn-primary">
          <Plus className="h-5 w-5" />
          إضافة عقار جديد
        </MagneticButton>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <ScrollReveal key={index} delay={index * 100} direction="up">
            <div className="relative bg-white rounded-2xl shadow-sm hover:shadow-2xl p-6 overflow-hidden group hover-lift-3d">
              {/* Background gradient */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}></div>
              
              <div className="relative flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-semibold">
                  <ArrowUpRight className="h-3 w-3" />
                  {stat.change}
                </div>
              </div>
              
              <div className="relative">
                <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                <p className="text-4xl font-bold text-gray-900">
                  <AnimatedCounter end={stat.value} />
                </p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Recent Properties Table */}
      <ScrollReveal>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-shadow">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">أحدث العقارات</h2>
              <p className="text-sm text-gray-500">آخر 5 عقارات تمت إضافتها</p>
            </div>
            <MagneticButton to="/admin/properties" strength={0.4} className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1">
              عرض الكل
              <Eye className="h-4 w-4" />
            </MagneticButton>
          </div>

          <div className="overflow-x-auto smooth-scrollbar">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr className="text-right text-gray-600 text-sm">
                  <th className="py-4 px-6 font-semibold">العنوان</th>
                  <th className="py-4 px-6 font-semibold hidden sm:table-cell">الموقع</th>
                  <th className="py-4 px-6 font-semibold">السعر</th>
                  <th className="py-4 px-6 font-semibold hidden md:table-cell">النوع</th>
                  <th className="py-4 px-6 font-semibold">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {recentProperties.map((property, index) => (
                  <tr 
                    key={property._id} 
                    className="border-b border-gray-50 hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-purple-50/50 transition-all duration-300 cursor-pointer group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img 
                          src={property.images?.[0]?.url || 'https://via.placeholder.com/40'}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover group-hover:scale-110 transition-transform"
                        />
                        <p className="font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">{property.title}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 hidden sm:table-cell">
                      {CITIES_AR[property.city] || property.city}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">
                        {property.price.toLocaleString()} ج.م
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 hidden md:table-cell">
                      {PROPERTY_TYPES_AR[property.type]}
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
              </tbody>
            </table>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};

export default Dashboard;