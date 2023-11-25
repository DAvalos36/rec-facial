// ImageSlider.tsx
import { Image } from '@nextui-org/react';
import React, { useState, useEffect } from 'react';
// import './ImageSlider.css';

interface ImageSliderProps {
  images: string[];
  interval?: number;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images, interval = 3000 }) => {
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    setIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const intervalId = setInterval(handleNext, interval);

    return () => clearInterval(intervalId);
  }, [images, interval]);

  return (
    <div className="">
    <Image className="w-unit-8xl h-unit-6xl object-cover" src={images[index]} alt={`Slide ${index + 1}`} />
    </div>
  );
};

export default ImageSlider;
