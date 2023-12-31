import { Button, Image } from '@nextui-org/react'
import { useEffect } from 'react';
import { useLocation } from 'wouter'
import { useStoreImg } from 'zustand-img';

type Props = {}

function Inicio({}: Props) {
  const [location, setLocation] = useLocation();

  const seLink = useStoreImg(s => s.setLink)

  useEffect(() => {
    seLink('')
  }, [])
  

  return (
    <div className='min-h-screen cel flex justify-center self-center' style={{backgroundColor: '#F2F2F2'}}>
        <div className='max-w-md py-2 px-4 flex justify-center self-center flex-col'>
            <Image src='Logo.webp'></Image>
            <p className='text-center my-2'>¿Te gustaría probar una IA para reconocer qué personas se encuentran en la foto?</p>
            <Button className='my-2 mx-20' color='warning' variant='shadow' size='lg' onClick={() => setLocation('/eleccion')}>¡Empecemos!</Button>
        </div>
    </div>
  )
}

export default Inicio