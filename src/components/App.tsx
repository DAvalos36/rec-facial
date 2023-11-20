import * as faceapi from "face-api.js";
import { useEffect, useState } from "react";
import PantallaCarga from "./PantallaCarga";
import EntrenarModelo from "./EntrenarModelo";

function App() {
	const [modelosCargados, setModelosCargados] = useState(false);

	async function cargarModelos() {
		Promise.all([
			faceapi.loadSsdMobilenetv1Model("/models"),
			faceapi.loadFaceLandmarkModel("/models"),
			faceapi.loadFaceRecognitionModel("/models"),
		]).then(() => {
			setModelosCargados(true);
			return true;
		});
	}

	useEffect(() => {
		cargarModelos();
	}, []);

	if (!modelosCargados) {
		return <PantallaCarga />;
	}

	return <EntrenarModelo />;
}

export default App;
