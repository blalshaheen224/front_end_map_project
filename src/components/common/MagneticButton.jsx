// src/components/common/MagneticButton.jsx
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MagneticButton = ({ 
  children, 
  className = '', 
  strength = 0.3, 
  onClick, 
  to,
  type = 'button',
  ...props 
}) => {
  const btnRef = useRef(null);
  const navigate = useNavigate();
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!btnRef.current) return;
    
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    setPosition({ x: x * strength, y: y * strength });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
    // ✅ إذا كان هناك مسار to، قم بالتنقل
    if (to) {
      navigate(to);
    }
  };

  return (
    <button
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      type={type}
      className={className}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: 'transform 300ms cubic-bezier(0.2, 1, 0.3, 1)',
      }}
      {...props}
    >
      <span style={{ 
        transform: `translate(${position.x * 0.3}px, ${position.y * 0.3}px)`, 
        display: 'inline-block', 
        transition: 'transform 300ms' 
      }}>
        {children}
      </span>
    </button>
  );
};

export default MagneticButton;