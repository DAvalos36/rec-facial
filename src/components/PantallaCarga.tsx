// TODO: Aqui se debe implementar la pantalla de carga
import React from "react";
import Random from 'Random'
import { Player } from '@lottiefiles/react-lottie-player';

function PantallaCarga() {
	return <div className="bg-customYellow min-h-screen flex flex-col justify-center items-center p-3 md:p-0">
		<Random />
		<Player
			src='https://lottie.host/b480ea22-a680-4b0f-946e-2a0d8036a0a8/XUmuecKqCz.json'
			className="player object-cover max-w-full h-auto"
			loop
			autoplay
			speed={1}
			style={{ width: '100%', height: 'auto' }}
		/>
		</div>;

}

export default PantallaCarga;
