// App.tsx
import React from 'react';
import ImageSlider from '../components/ImageSlider';
import { Button } from '@nextui-org/react';

const App: React.FC = () => {
    const images = ['amigos1.webp', 'amigos2.png', 'amigos3.jpeg'];

    return (
        <div className='min-h-screen flex justify-center self-center bg-cyan-500/[0.7]'>
            <div className='max-w-md py-2 flex justify-center self-center flex-col'>
                <ImageSlider images={images} interval={5000} /> {/* Cambiar el intervalo según sea necesario */}
                <div className='py-2 flex justify-around'>
                    <Button size='md'>Subir imagen</Button>
                    <Button size='md'>Tomar imagen</Button>
                </div>
            </div>
        </div>
    );
};

export default App;
