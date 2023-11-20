import { useRef, useState } from "react";
import * as faceapi from "face-api.js";
import infoAlumnos from "../infoAlumno";

function Principal() {
	const imgRef = useRef<HTMLImageElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const [alumnosEncontrados, setAlumnosEncontrados] = useState<string[]>([]);

	async function cargarModeloEntrenado() {
		const l: string[] = await (await fetch("/faceDescriptors.json")).json();
		const labeledFaceDescriptors: faceapi.LabeledFaceDescriptors[] = [];
		l.forEach((ld) => {
			labeledFaceDescriptors.push(faceapi.LabeledFaceDescriptors.fromJSON(ld));
		});
		return labeledFaceDescriptors;
	}

	async function a() {
		if (imgRef?.current && canvasRef && canvasRef.current) {
			const canvas = canvasRef.current;
			canvas.width = imgRef.current.width;
			canvas.height = imgRef.current.height;

			const fullFaceDescriptions = await faceapi
				.detectAllFaces(imgRef.current as HTMLImageElement)
				.withFaceLandmarks()
				.withFaceDescriptors();
			// fullFaceDescriptions = faceapi.resizeResults(fullFaceDescriptions);
			console.log(fullFaceDescriptions);

			faceapi.draw.drawDetections(canvas, fullFaceDescriptions);

			const labeledFaceDescriptors = await cargarModeloEntrenado();
			canvas.width = imgRef.current.width;
			canvas.height = imgRef.current.height;

			const maxDescriptorDistance = 0.6;
			const faceMatcher = new faceapi.FaceMatcher(
				labeledFaceDescriptors,
				maxDescriptorDistance,
			);

			const results = fullFaceDescriptions.map((fd) =>
				faceMatcher.findBestMatch(fd.descriptor),
			);

			const ac: string[] = [];

			results.forEach((bestMatch, i) => {
				const box = fullFaceDescriptions[i].detection.box;
				let nC = bestMatch.label;
				const encontrado = nC !== "unknown";
				if (encontrado) {
					nC = nC.split("_")[0];
					const alumno = infoAlumnos.get(nC);
					const nombre = `${alumno?.nombre} ${alumno?.apellido_paterno} ${alumno?.apellido_materno}`;
					const drawBox = new faceapi.draw.DrawBox(box, { label: nombre });
					drawBox.draw(canvas);
					ac.push(nC);
				} else {
					const drawBox = new faceapi.draw.DrawBox(box, {
						label: "Desconocido",
						boxColor: "red",
					});
					drawBox.draw(canvas);
				}
			});
			setAlumnosEncontrados(ac);
		}
	}

	return (
		<div className="min-h-screen flex flex-col justify-center items-center">
			<img ref={imgRef} src="/prb.jpeg" onLoad={a} alt="FOTO" id="imgPrueba" />
			<canvas
				ref={canvasRef}
				width={600}
				height={400}
				style={{ border: "1px solid #000", position: "absolute" }}
			/>
			<p>Alumnos : {alumnosEncontrados.toString()}</p>
		</div>
	);
}

export default Principal;
