import { Button, image } from "@nextui-org/react";
import * as faceapi from "face-api.js";
import { useEffect, useRef, useState } from "react";

const nC = [
	"18410762",
	"19410250",
	"19410251",
	"19410254",
	"19410255",
	"19410257",
	"19410261",
	"19410262",
	"19410265",
	"19410269",
	"19410529",
	"19410586",
	"19410588",
	"19410591",
	"19410597",
	"19410598",
	"20410499",
	"B17740215",
	"C18410942",
	"C19410231",
];
const variaciones = [1, 2, 3, 4, 6, 7, 8, 9];

function App() {
	const [modelosCargados, setModelosCargados] = useState(false);
	const [modeloEntrenado, setModeloEntrenado] = useState(false);

	const imgRef = useRef<HTMLImageElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

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

	async function entrenarRostros() {
		const labeledFaceDescriptors = await Promise.all(
			nC.map(async (label, i) => {
				try {
					// fetch image data from urls and convert blob to HTMLImage element
					const imgUrl = `alumnos/${label}_${i + 1}.jpg`;
					const img = await faceapi.fetchImage(imgUrl);

					// detect the face with the highest score in the image and compute it's landmarks and face descriptor
					const fullFaceDescription = await faceapi
						.detectSingleFace(img)
						.withFaceLandmarks()
						.withFaceDescriptor();

					if (!fullFaceDescription) {
						throw new Error(`no faces detected for ${label}`);
					}

					console.log(`${label} ${i + 1}`);

					const faceDescriptors = [fullFaceDescription.descriptor];
					return new faceapi.LabeledFaceDescriptors(
						`${label}_${i + 1}`,
						faceDescriptors,
					);
				} catch (error) {
					console.log(`Error: ${label}_${i + 1}`);
				}
			}),
		);
		console.log(JSON.stringify(labeledFaceDescriptors));
		setModeloEntrenado(true);
		return labeledFaceDescriptors;
	}

	async function a() {
		if (imgRef?.current && canvasRef && canvasRef.current) {
			const canvas = canvasRef.current;
			canvas.width = imgRef.current.width;
			canvas.height = imgRef.current.height;
			// if (canvasRef && canvasRef.current) {
			// 	canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(
			// 		imgRef.current as HTMLImageElement,
			// 	);
			// }
			const fullFaceDescriptions = await faceapi
				.detectAllFaces(imgRef.current as HTMLImageElement)
				.withFaceLandmarks()
				.withFaceDescriptors();
			// fullFaceDescriptions = faceapi.resizeResults(fullFaceDescriptions);
			console.log(fullFaceDescriptions);
			alert(fullFaceDescriptions.length);
			faceapi.draw.drawDetections(canvas, fullFaceDescriptions);
			alert("dibujados");
			const l = await entrenarRostros();

			// Guardar modelo ENTRENADO en un archivo JSON
			// const json = JSON.stringify(l);
			// const blob = new Blob([json], { type: "application/json" });
			// const href = await URL.createObjectURL(blob);
			// const link = document.createElement("a");
			// link.href = href;
			// link.download = "faceDescriptors.json";
			// document.body.appendChild(link);
			// link.click();
			// document.body.removeChild(link);

			const maxDescriptorDistance = 0.6;
			const faceMatcher = new faceapi.FaceMatcher(l, maxDescriptorDistance);

			const results = fullFaceDescriptions.map((fd) =>
				faceMatcher.findBestMatch(fd.descriptor),
			);

			results.forEach((bestMatch, i) => {
				const box = fullFaceDescriptions[i].detection.box;
				const text = bestMatch.toString();
				const drawBox = new faceapi.draw.DrawBox(box, { label: text });
				drawBox.draw(canvas);
			});
		}
	}

	useEffect(() => {
		cargarModelos();
	}, []);

	return (
		<div className="min-h-screen flex flex-col justify-center items-center">
			{modelosCargados && (
				<img
					ref={imgRef}
					src="/prb.jpeg"
					onLoad={a}
					alt="FOTO"
					id="imgPrueba"
				/>
			)}
			<canvas
				ref={canvasRef}
				width={600}
				height={400}
				style={{ border: "1px solid #000", position: "absolute" }}
			/>
			<h1>Hola</h1>
			<Button color="primary">Prueba</Button>
			{modelosCargados ? <h1>Modelos cargados</h1> : <h1>Cargando modelos</h1>}
			{modeloEntrenado ? <h1>Modelo entrenado</h1> : <h1>Entrenando modelo</h1>}
		</div>
	);
}

export default App;
