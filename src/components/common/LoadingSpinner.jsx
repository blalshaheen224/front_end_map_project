// src/components/common/LoadingSpinner.jsx
const LoadingSpinner = ({ size = 'md' }) => {
    const sizes = {
      sm: 'h-8 w-8',
      md: 'h-12 w-12',
      lg: 'h-16 w-16',
    };
  
    return (
      <div className="flex items-center justify-center">
        <div
          className={`${sizes[size]} animate-spin rounded-full border-b-2 border-primary-600`}
        ></div>
      </div>
    );
  };
  
  export default LoadingSpinner;