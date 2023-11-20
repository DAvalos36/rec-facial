import React, { useRef } from "react";
import * as faceapi from "face-api.js";

function Principal() {
	const imgRef = useRef<HTMLImageElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

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

			const maxDescriptorDistance = 0.6;
			const faceMatcher = new faceapi.FaceMatcher(
				labeledFaceDescriptors,
				maxDescriptorDistance,
			);

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

	return (
		<div className="min-h-screen flex flex-col justify-center items-center">
			<img ref={imgRef} src="/prb.jpeg" onLoad={a} alt="FOTO" id="imgPrueba" />
			<canvas
				ref={canvasRef}
				width={600}
				height={400}
				style={{ border: "1px solid #000", position: "absolute" }}
			/>
		</div>
	);
}

export default Principal;
