import { Button, image } from "@nextui-org/react";
import * as faceapi from "face-api.js";
import { useEffect, useRef, useState } from "react";

const nC = ["19410251", "19410262", "19410269", "19410586"];
const variaciones = [1, 2, 3, 4, 6, 7, 8, 9];

function App() {
	const [modelosCargados, setModelosCargados] = useState(false);
	const [modeloEntrenado, setModeloEntrenado] = useState(false);

	const imgRef = useRef<HTMLImageElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	async function cargarModelos() {
		Promise.all([
			faceapi.loadSsdMobilenetv1Model("/models"),
			faceapi.loadFaceLandmarkModel("/models"),
			faceapi.loadFaceRecognitionModel("/models"),
		]).then(() => setModelosCargados(true));
	}

	async function entrenarRostros() {
		const labeledFaceDescriptors = await Promise.all(
			nC.map(async (label) => {
				variaciones.map(async (variacion) => {
					// fetch image data from urls and convert blob to HTMLImage element
					const imgUrl = `alumnos/${label}_${variacion}.jpeg.jpeg`;
					const img = await faceapi.fetchImage(imgUrl);

					// detect the face with the highest score in the image and compute it's landmarks and face descriptor
					const fullFaceDescription = await faceapi
						.detectSingleFace(img)
						.withFaceLandmarks()
						.withFaceDescriptor();

					if (!fullFaceDescription) {
						throw new Error(`no faces detected for ${label}`);
					}

					const faceDescriptors = [fullFaceDescription.descriptor];
					return new faceapi.LabeledFaceDescriptors(label, faceDescriptors);
				});
			}),
		);

		setModeloEntrenado(true);
	}

	useEffect(() => {
		async function a() {
			await cargarModelos();
			if (canvasRef && canvasRef.current) {
				canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(
					videoRef.current,
				);
			}
			const fullFaceDescriptions = await faceapi
				.detectAllFaces(imgRef.current as HTMLImageElement)
				.withFaceLandmarks()
				.withFaceDescriptors();
			// fullFaceDescriptions = faceapi.resizeResults(fullFaceDescriptions);
			// faceapi.draw.drawDetections(canvas, fullFaceDescriptions);
			// await entrenarRostros();
		}
		a();
	}, []);

	return (
		<div className="min-h-screen flex flex-col justify-center items-center">
			<img ref={imgRef} src="/prb.jpeg" alt="FOTO" id="imgPrueba" />
			<canvas ref={canvasRef} style={{ position: "absolute" }} /> <h1>Hola</h1>
			<Button color="primary">Prueba</Button>
			{modelosCargados ? <h1>Modelos cargados</h1> : <h1>Cargando modelos</h1>}
			{modeloEntrenado ? <h1>Modelo entrenado</h1> : <h1>Entrenando modelo</h1>}
		</div>
	);
}

export default App;
