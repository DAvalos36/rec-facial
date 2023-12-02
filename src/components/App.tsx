import * as faceapi from "face-api.js";
import { useEffect, useState } from "react";
import PantallaCarga from "./PantallaCarga";
import EntrenarModelo from "./EntrenarModelo";
import Principal from "./Principal";
// import Inicio from "pantallas/inicio";
import Router from "../Router";

function App() {
	const [modelosCargados, setModelosCargados] = useState(false);

	async function cargarModelos() {
		Promise.all([
			faceapi.loadSsdMobilenetv1Model("/models"),
			faceapi.loadFaceLandmarkModel("/models"),
			faceapi.loadFaceRecognitionModel("/models"),
			faceapi.nets.tinyFaceDetector.loadFromUri("/models")
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

	return <Router />;
}

export default App;
