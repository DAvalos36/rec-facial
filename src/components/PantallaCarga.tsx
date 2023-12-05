// TODO: Aqui se debe implementar la pantalla de carga
import React from "react";
import Random from 'Random'
import { Player } from '@lottiefiles/react-lottie-player';

function PantallaCarga() {
	return <div className="bg-customYellow max-w-screen-md mx-auto ">
		<Random />
		<Player
			src='https://lottie.host/b480ea22-a680-4b0f-946e-2a0d8036a0a8/XUmuecKqCz.json'
			className="player"
			loop
			autoplay
			speed={1}
			style={{ height: '700px', width: '700px' }}
		/>
		</div>;

}

export default PantallaCarga;
