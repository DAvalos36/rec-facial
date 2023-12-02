import { Button, Image } from '@nextui-org/react'
import React from 'react'
import { useLocation } from 'wouter'

type Props = {}

function Inicio({}: Props) {
  const [location, setLocation] = useLocation();

  return (
    <div className='min-h-screen flex justify-center self-center' style={{backgroundColor: '#F2F2F2'}}>
        <div className='max-w-md py-2 flex justify-center self-center flex-col'>
            <Image src='Logo.webp'></Image>
            <p className='text-center my-2'>¿Te gustaría probar una IA para reconocer qué personas se encuentran en la foto?</p>
            <Button className='my-2 mx-20' color='warning' variant='ghost' size='lg' onClick={() => setLocation('/eleccion')}>¡Empecemos!</Button>
        </div>
    </div>
  )
}

export default Inicio