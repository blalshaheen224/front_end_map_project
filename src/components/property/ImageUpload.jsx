// src/components/property/ImageUpload.jsx
import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const ImageUpload = ({ images = [], onChange }) => {
  const [previews, setPreviews] = useState(
    images.map((img) => ({ url: img.url || URL.createObjectURL(img), file: img }))
  );
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = 10 - previews.length;
    const newFiles = files.slice(0, remainingSlots);

    const newPreviews = newFiles.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));

    const updatedPreviews = [...previews, ...newPreviews];
    setPreviews(updatedPreviews);
    onChange(updatedPreviews.map((p) => p.file));
  };

  const handleRemove = (index) => {
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setPreviews(updatedPreviews);
    onChange(updatedPreviews.map((p) => p.file));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          صور العقار (الحد الأقصى 10 صور)
        </label>
        <p className="text-xs text-gray-500 mb-3">
          الصورة الأولى ستكون الصورة الرئيسية. يمكنك سحب الصور لإعادة ترتيبها.
        </p>
      </div>

      {/* Upload Area */}
      {previews.length < 10 && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors"
        >
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-semibold">اضغط لرفع الصور</p>
          <p className="text-sm text-gray-500 mt-1">
            {10 - previews.length} صورة متبقية
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}

      {/* Image Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={preview.url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              {index === 0 && (
                <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                  رئيسية
                </div>
              )}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 left-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;