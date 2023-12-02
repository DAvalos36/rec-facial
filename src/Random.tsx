// TODO: Aqui se debe implementar la pantalla de carga
import React, {useEffect, useState} from "react";
import { Player } from '@lottiefiles/react-lottie-player';

const nombreAleatorio = () => {
	const [nombreActual, setNombreActual] = useState('');
	const listaDeNombres = ["Ivan Acosta", "David Avalos", "Victor Hernandez", "Issac Navarro", "Oscar Figueroa", 
                            "Sergio Garcia", "Jesus Herandez","Corazon Leyva","Luisa Alejandra","Manuel Olloqui","Idalia Valencia",
                            "Kenneth Aguirre"];
  
	const actualizarNombre = () => {
	  const nombreAleatorio = listaDeNombres[Math.floor(Math.random() * listaDeNombres.length)];
	  setNombreActual(nombreAleatorio);
	};
  
	useEffect(() => {
	  const intervalId = setInterval(() => {
		actualizarNombre();
	  }, 100); //Segundos, aqui es para que vaya mas rapido
  
	  // Limpiemos el componente
	  return () => clearInterval(intervalId);
	}, []);
  
	return (
	  <div className= "container">
		<h1 className="max-w-screen-md mx-auto text-lg p-6 mt-6 absolute inset-x-0 top-0 text-center bg-customGray text-white p-4 rounded-2xl ">Nuestra IA está analizando los rostros... <span className="text-white font-bold">{nombreActual}</span></h1>
	  </div>
	);
  };

export default nombreAleatorio;
