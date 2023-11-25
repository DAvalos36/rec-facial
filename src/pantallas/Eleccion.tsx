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
                    <Button className='' endContent={<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="#000" d="M4 4h3l2-2h6l2 2h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2m8 3a5 5 0 0 0-5 5a5 5 0 0 0 5 5a5 5 0 0 0 5-5a5 5 0 0 0-5-5m0 2a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3Z"/></svg>}>Capturar imagen</Button>
                    <Button className='' endContent={<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2c4.714 0 7.071 0 8.535 1.464C22 4.93 22 7.286 22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12Zm10 5.75a.75.75 0 0 0 .75-.75v-5.19l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72V17c0 .414.336.75.75.75Zm-4-10a.75.75 0 0 1 0-1.5h8a.75.75 0 0 1 0 1.5H8Z" clipRule="evenodd"/></svg>}>Subir imagen</Button>
                </div>
            </div>
        </div>
    );
};

export default App;
