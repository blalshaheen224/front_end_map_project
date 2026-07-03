// src/pages/Properties.jsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import PropertyCard from '../components/property/PropertyCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { CITIES, PROPERTY_PURPOSE, PROPERTY_TYPES, PROPERTY_CATEGORIES } from '../constants/propertyConstants';
import { CITIES_AR, PROPERTY_PURPOSE_AR, PROPERTY_TYPES_AR, PROPERTY_CATEGORIES_AR } from '../constants/propertyConstants';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [purpose, setPurpose] = useState(searchParams.get('purpose') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);

  useEffect(() => {
    fetchProperties();
  }, [page, city, purpose, type, category]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 12 };
      if (city) params.city = city;
      if (purpose) params.purpose = purpose;
      if (type) params.type = type;
      if (category) params.category = category;

      const response = await propertyService.getAll(params);
      setProperties(response.data?.data || []);
      setPagination(response.data?.pagination || null);
    } catch (err) {
      setError('حدث خطأ في تحميل العقارات');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    switch (filterName) {
      case 'city':
        setCity(value);
        break;
      case 'purpose':
        setPurpose(value);
        break;
      case 'type':
        setType(value);
        break;
      case 'category':
        setCategory(value);
        break;
    }
    setPage(1); // Reset to first page when filter changes
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && properties.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">جميع العقارات</h1>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* City */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              المدينة
            </label>
            <select
              value={city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">جميع المدن</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {CITIES_AR[c]}
                </option>
              ))}
            </select>
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              الغرض
            </label>
            <select
              value={purpose}
              onChange={(e) => handleFilterChange('purpose', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">الكل</option>
              {PROPERTY_PURPOSE.map((p) => (
                <option key={p} value={p}>
                  {PROPERTY_PURPOSE_AR[p]}
                </option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              النوع
            </label>
            <select
              value={type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">جميع الأنواع</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {PROPERTY_TYPES_AR[t]}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              الفئة
            </label>
            <select
              value={category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">جميع الفئات</option>
              {PROPERTY_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {PROPERTY_CATEGORIES_AR[c]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <ErrorMessage message={error} onRetry={fetchProperties} />
      )}

      {/* Properties Grid */}
      {properties.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500">لا توجد عقارات مطابقة للبحث</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.prev)}
                disabled={!pagination.prev}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ChevronRight className="h-5 w-5" />
                السابق
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 rounded-lg ${
                      pageNum === pagination.page
                        ? 'bg-primary-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(pagination.next)}
                disabled={!pagination.next}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                التالي
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Properties;