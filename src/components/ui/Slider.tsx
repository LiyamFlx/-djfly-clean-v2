import React from 'react';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  orientation?: 'horizontal' | 'vertical';
}

/**
 * A custom-styled slider component that replaces the default browser range input.
 * Supports horizontal and vertical orientations.
 * Styling is defined in `src/index.css`.
 */
const Slider: React.FC<SliderProps> = ({
  className = '',
  orientation = 'horizontal',
  ...props
}) => {
  return (
    <input
      type="range"
      className={`slider ${
        orientation === 'vertical' ? 'slider-vertical' : ''
      } ${className}`}
      {...props}
    />
  );
};

export default Slider;
