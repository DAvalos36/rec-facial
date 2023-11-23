import { Button, Image } from '@nextui-org/react'
import React from 'react'

type Props = {}

function Inicio({}: Props) {
  return (
    <div className='min-h-screen flex justify-center self-center bg-cyan-500/[0.7]'>
        <div className='max-w-md py-2 flex justify-center self-center flex-col'>
            <Image src='prb.jpeg'></Image>
            <p className='text-center my-2'>¿Te gustaría probar una IA para reconocer qué personas se encuentran en la foto?</p>
            <Button className='my-2 mx-20'>Empezar</Button>
        </div>
    </div>
  )
}

export default Inicio