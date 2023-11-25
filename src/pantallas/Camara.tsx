import React, { useState, useRef } from 'react';

const CameraComponent: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
  };

  const takePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const photoURL = canvas.toDataURL('image/png');
        console.log('Photo taken:', photoURL);
        // Aquí puedes hacer lo que quieras con la foto, como mostrarla en una etiqueta img
      }
    }
  };

  return (
    <div>
      <button onClick={startCamera}>Start Camera</button>
      <button onClick={stopCamera}>Stop Camera</button>
      <button onClick={takePhoto}>Take Photo</button>
      <video ref={videoRef} autoPlay />
    </div>
  );
};

export default CameraComponent;