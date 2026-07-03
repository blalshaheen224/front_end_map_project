// src/pages/admin/AddProperty.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Save, ArrowLeft, AlertCircle } from 'lucide-react';
import { propertyService } from '../../services/propertyService';
import LocationPicker from '../../components/property/LocationPicker';
import ImageUpload from '../../components/property/ImageUpload';
import {
  PROPERTY_TYPES,
  PROPERTY_CATEGORIES,
  CITIES,
  PROPERTY_AMENITIES,
  PROPERTY_STATUS,
  PROPERTY_PURPOSE,
  PROPERTY_TYPES_AR,
  PROPERTY_CATEGORIES_AR,
  CITIES_AR,
  PROPERTY_AMENITIES_AR,
  PROPERTY_STATUS_AR,
  PROPERTY_PURPOSE_AR,
} from '../../constants/propertyConstants';

const AddProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [submitErrors, setSubmitErrors] = useState({});

  const { register, handleSubmit } = useForm();

  const handleLocationChange = (lat, lng) => {
    setLocation({ latitude: lat, longitude: lng });
  };

  const handleAmenityToggle = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const onSubmit = async (data) => {
    console.log('🔍 Form Data:', data);
    console.log('🖼️ Images:', images);
    console.log('📍 Location:', location);
    console.log('🏷️ Amenities:', selectedAmenities);

    try {
      setLoading(true);
      setError('');
      setSubmitErrors({});

      // ✅ تحقق من الصور
      if (images.length === 0) {
        alert('⚠️ يرجى رفع صورة واحدة على الأقل');
        setSubmitErrors({ images: 'يرجى رفع صورة واحدة على الأقل' });
        document.querySelector('input[type="file"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // ✅ تحقق من الموقع
      if (!location.latitude || !location.longitude) {
        alert('⚠️ يرجى تحديد موقع العقار على الخريطة');
        setSubmitErrors({ location: 'يرجى تحديد موقع العقار على الخريطة' });
        return;
      }

      const formData = new FormData();

      // ✅ إضافة الحقول النصية
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'amenities' && value !== undefined && value !== '') {
          formData.append(key, value);
          console.log(`✅ Added field: ${key} = ${value}`);
        }
      });

      // ✅ إضافة الموقع - تحويل إلى Number
      formData.append('latitude', Number(location.latitude));
      formData.append('longitude', Number(location.longitude));

      // ✅ إضافة المرافق
      if (selectedAmenities.length > 0) {
        formData.append('amenities', selectedAmenities.join(','));
        console.log(`✅ Added amenities: ${selectedAmenities.join(',')}`);
      }

      // ✅ إضافة الصور
      images.forEach((image, index) => {
        formData.append('images', image);
        console.log(`✅ Added image ${index + 1}:`, image.name);
      });

      console.log('📦 Final FormData:');
      for (let pair of formData.entries()) {
        console.log(`   ${pair[0]}:`, pair[1]);
      }

      console.log('🚀 Sending request to API...');
      const response = await propertyService.create(formData);
      console.log('✅ Success:', response);

      alert('✅ تم حفظ العقار بنجاح!');
      navigate('/admin/properties');
    } catch (err) {
      console.error('❌ Error:', err);
      console.error('❌ Response:', err.response);
      console.error('❌ Data:', err.response?.data);

      if (err.response?.data?.errors) {
        const backendErrors = {};
        err.response.data.errors.forEach((errItem) => {
          if (errItem.field) {
            backendErrors[errItem.field] = errItem.message;
          }
        });
        setSubmitErrors(backendErrors);
        alert(`⚠️ هناك أخطاء في النموذج:\n${Object.values(backendErrors).join('\n')}`);
      } else {
        setError(err.response?.data?.message || 'حدث خطأ أثناء إضافة العقار');
        alert(`❌ خطأ: ${err.response?.data?.message || 'حدث خطأ غير معروف'}`);
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">إضافة عقار جديد</h1>
      </div>

      {/* ✅ خطأ عام */}
      {error && (
        <div className="bg-red-50 border-2 border-red-300 text-red-700 px-6 py-4 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-6 w-6 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">حدث خطأ:</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* ✅ أخطاء الحقول */}
      {Object.keys(submitErrors).length > 0 && (
        <div className="bg-yellow-50 border-2 border-yellow-300 text-yellow-800 px-6 py-4 rounded-lg">
          <p className="font-semibold mb-2">يرجى تصحيح الأخطاء التالية:</p>
          <ul className="list-disc list-inside space-y-1">
            {Object.entries(submitErrors).map(([field, message]) => (
              <li key={field}>
                <strong>{field}:</strong> {message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">المعلومات الأساسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                العنوان *
              </label>
              <input
                type="text"
                {...register('title')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                  submitErrors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="مثال: فيلا فاخرة في التجمع الخامس"
              />
              {submitErrors.title && (
                <p className="text-red-500 text-sm mt-1">{submitErrors.title}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                الوصف *
              </label>
              <textarea
                {...register('description')}
                rows="4"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                  submitErrors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="اكتب وصفاً تفصيلياً للعقار..."
              />
              {submitErrors.description && (
                <p className="text-red-500 text-sm mt-1">{submitErrors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                السعر *
              </label>
              <input
                type="number"
                {...register('price')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                  submitErrors.price ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="5000000"
              />
              {submitErrors.price && (
                <p className="text-red-500 text-sm mt-1">{submitErrors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                الغرض *
              </label>
              <select
                {...register('purpose')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                  submitErrors.purpose ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">اختر الغرض</option>
                {PROPERTY_PURPOSE.map((p) => (
                  <option key={p} value={p}>{PROPERTY_PURPOSE_AR[p]}</option>
                ))}
              </select>
              {submitErrors.purpose && (
                <p className="text-red-500 text-sm mt-1">{submitErrors.purpose}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                النوع *
              </label>
              <select
                {...register('type')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                  submitErrors.type ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">اختر النوع</option>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>{PROPERTY_TYPES_AR[t]}</option>
                ))}
              </select>
              {submitErrors.type && (
                <p className="text-red-500 text-sm mt-1">{submitErrors.type}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                الفئة *
              </label>
              <select
                {...register('category')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                  submitErrors.category ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">اختر الفئة</option>
                {PROPERTY_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{PROPERTY_CATEGORIES_AR[c]}</option>
                ))}
              </select>
              {submitErrors.category && (
                <p className="text-red-500 text-sm mt-1">{submitErrors.category}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                المدينة *
              </label>
              <select
                {...register('city')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                  submitErrors.city ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">اختر المدينة</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>{CITIES_AR[c]}</option>
                ))}
              </select>
              {submitErrors.city && (
                <p className="text-red-500 text-sm mt-1">{submitErrors.city}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                الحي
              </label>
              <input
                type="text"
                {...register('district')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="مثال: التجمع الخامس"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                العنوان التفصيلي *
              </label>
              <input
                type="text"
                {...register('address')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                  submitErrors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="الشارع، رقم المبنى، إلخ"
              />
              {submitErrors.address && (
                <p className="text-red-500 text-sm mt-1">{submitErrors.address}</p>
              )}
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">المواصفات</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                المساحة (م²) *
              </label>
              <input
                type="number"
                {...register('area')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                  submitErrors.area ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {submitErrors.area && (
                <p className="text-red-500 text-sm mt-1">{submitErrors.area}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                غرف النوم
              </label>
              <input
                type="number"
                {...register('bedrooms')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="اختياري"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                الحمامات
              </label>
              <input
                type="number"
                {...register('bathrooms')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="اختياري"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                الطابق
              </label>
              <input
                type="number"
                {...register('floor')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="اختياري"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                موقف السيارات
              </label>
              <input
                type="number"
                {...register('parking')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="اختياري"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                سنة البناء
              </label>
              <input
                type="number"
                {...register('yearBuilt')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="اختياري"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                الحالة
              </label>
              <select
                {...register('status')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                {PROPERTY_STATUS.map((s) => (
                  <option key={s} value={s}>{PROPERTY_STATUS_AR[s]}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('isFeatured')}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-semibold text-gray-700">عقار مميز</span>
              </label>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">الموقع</h2>
          {submitErrors.location && (
            <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg">
              {submitErrors.location}
            </div>
          )}
          <LocationPicker
            latitude={location.latitude}
            longitude={location.longitude}
            onChange={handleLocationChange}
          />
        </div>

        {/* Amenities */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">المرافق</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {PROPERTY_AMENITIES.map((amenity) => (
              <label
                key={amenity}
                className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">
                  {PROPERTY_AMENITIES_AR[amenity]}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">الصور</h2>
          {submitErrors.images && (
            <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg">
              {submitErrors.images}
            </div>
          )}
          <ImageUpload images={images} onChange={setImages} />
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 sticky bottom-4 bg-white p-4 rounded-lg shadow-lg">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-5 w-5" />
            {loading ? 'جاري الحفظ...' : 'حفظ العقار'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProperty;