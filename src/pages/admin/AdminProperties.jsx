// src/pages/admin/AdminProperties.jsx
import { useState, useEffect, Fragment } from 'react'; // ✅ استيراد Fragment
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { propertyService } from '../../services/propertyService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CITIES_AR, PROPERTY_TYPES_AR } from '../../constants/propertyConstants';

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, [page, searchTerm]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (searchTerm) params.search = searchTerm;

      const response = await propertyService.getAll(params);
      setProperties(response.data?.data || []);
      setPagination(response.data?.pagination || null);
    } catch (err) {
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`هل أنت متأكد من حذف العقار "${title}"؟ لا يمكن التراجع عن هذا الإجراء.`)) {
      return;
    }

    try {
      await propertyService.delete(id);
      setProperties(properties.filter(p => p._id !== id));
    } catch (err) {
      console.error('Error deleting property:', err);
      alert('حدث خطأ أثناء الحذف');
    }
  };

  const toggleExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">إدارة العقارات</h1>
        <Link
          to="/admin/properties/new"
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold flex items-center justify-center gap-2"
        >
          <Edit className="h-5 w-5" />
          إضافة عقار جديد
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث عن عقار بالعنوان..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-right text-gray-600 text-sm">
                <th className="py-4 px-6 w-12"></th>
                <th className="py-4 px-6">العنوان</th>
                <th className="py-4 px-6">السعر</th>
                <th className="py-4 px-6">النوع</th>
                <th className="py-4 px-6">الحالة</th>
                <th className="py-4 px-6 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                // ✅ الحل: استخدام React.Fragment مع key
                <Fragment key={property._id}>
                  <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <button
                        onClick={() => toggleExpand(property._id)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        {expandedRow === property._id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-gray-900 line-clamp-1">{property.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {CITIES_AR[property.city] || property.city}
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
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/properties/${property._id}`}
                          target="_blank"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="عرض"
                        >
                          <Eye className="h-5 w-5" />
                        </Link>
                        <Link
                          to={`/admin/properties/${property._id}/edit`}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(property._id, property.title)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded Row with Details */}
                  {expandedRow === property._id && (
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <td colSpan="6" className="py-4 px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 mb-1">الوصف</p>
                            <p className="text-gray-900 line-clamp-2">{property.description}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 mb-1">المواصفات</p>
                            <div className="flex flex-wrap gap-2">
                              <span className="px-2 py-1 bg-white rounded text-xs">
                                {property.bedrooms} غرف
                              </span>
                              <span className="px-2 py-1 bg-white rounded text-xs">
                                {property.bathrooms} حمام
                              </span>
                              <span className="px-2 py-1 bg-white rounded text-xs">
                                {property.area} م²
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-500 mb-1">المرافق</p>
                            <div className="flex flex-wrap gap-1">
                              {property.amenities?.slice(0, 5).map((amenity, idx) => (
                                <span key={idx} className="px-2 py-1 bg-white rounded text-xs">
                                  {amenity}
                                </span>
                              ))}
                              {property.amenities?.length > 5 && (
                                <span className="px-2 py-1 bg-white rounded text-xs">
                                  +{property.amenities.length - 5}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
              {properties.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500">
                    لا توجد عقارات مطابقة للبحث
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              صفحة {pagination.page} من {pagination.totalPages} (إجمالي {pagination.totalCount})
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={!pagination.prev}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                السابق
              </button>
              <button
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={!pagination.next}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                التالي
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProperties;