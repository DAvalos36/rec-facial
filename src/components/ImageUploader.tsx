// ImageUploader.tsx
import { Input } from '@nextui-org/react';
import React, { useState, ChangeEvent } from 'react';
import { useStoreImg } from 'zustand-img';

interface ImageUploaderProps {
  onImageUpload: (image: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const setLink = useStoreImg(s => s.setLink);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      // const reader = new FileReader();
      // reader.onloadend = () => {
      //   const imageDataUrl = reader.result as string;
      //   setSelectedImage(imageDataUrl);
      //   onImageUpload(imageDataUrl);
      // };
      // reader.readAsDataURL(file);
      const link = URL.createObjectURL(file);
      console.log(link);
      setLink(link);
    }
  };

  return (
    <div>
        <label htmlFor="customFileInput" style={{cursor: 'pointer'}}>Subir imagen</label>
      <input type='file' accept="image/*" id='customFileInput' style={{display: 'none'}} onChange={handleImageChange} />
    </div>
  );
};

export default ImageUploader;