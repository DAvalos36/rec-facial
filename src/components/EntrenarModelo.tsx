import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

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
const variaciones = [1];

const imagenes = nC.flatMap((nc) => {
	return variaciones.map((v) => {
		return `${nc}_${v}`;
	});
});

function EntrenarModelo() {
	const [contador, setContador] = useState(0);
	const [entrenando, setEntrenando] = useState(true);
	const aRef = useRef<HTMLAnchorElement>(null);

	async function entrenarRostros() {
		const labeledFaceDescriptors = await Promise.all(
			imagenes.map(async (nombre, i) => {
				try {
					const imgUrl = `alumnos/${nombre}.jpg`;
					const img = await faceapi.fetchImage(imgUrl);

					const fullFaceDescription = await faceapi
						.detectSingleFace(img)
						.withFaceLandmarks()
						.withFaceDescriptor();

					if (!fullFaceDescription) {
						throw new Error(`no faces detected for ${nombre}`);
					}

					console.log(nombre);
					setContador((c) => c + 1);

					const faceDescriptors = [fullFaceDescription.descriptor];
					return new faceapi.LabeledFaceDescriptors(nombre, faceDescriptors);
				} catch (error) {
					console.log(`Error: ${nombre}`);
					throw new Error(`No se encontro la imagen ${nombre}`);
				}
			}),
		);
		console.log(JSON.stringify(labeledFaceDescriptors));
		setEntrenando(false);
		return labeledFaceDescriptors;
	}

	async function main() {
		const l = await entrenarRostros();
		console.log(l);

		const labeledDescriptorsArray = l.map((ld) => {
			return {
				label: ld.label,
				descriptors: ld.descriptors,
			};
		});

		// Ahora `labeledDescriptorsArray` es un array serializable que puedes guardar utilizando JSON.stringify()
		const serializedDescriptors = JSON.stringify(labeledDescriptorsArray);

		// Guardar modelo ENTRENADO en un archivo JSON
		const blob = new Blob([serializedDescriptors], {
			type: "application/json",
		});
		const href = await URL.createObjectURL(blob);
		if (aRef?.current) {
			aRef.current.href = href;
			aRef.current.download = "faceDescriptors.json";
		}

		// const l: faceapi.LabeledFaceDescriptors = await (
		// 	await fetch("/faceDescriptors.json")
		// ).json();
		// console.log(l);
		// alert("finalizo entrenamiento");
	}

	useEffect(() => {
		main();
	}, []);

	if (entrenando) {
		return (
			<div className="min-h-screen flex flex-col justify-center items-center">
				<div>Entrenando modelo {contador}</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex flex-col justify-center items-center">
			<h2 className="text-lg">Entrenamiento finalizado</h2>

			<a ref={aRef} href="/">
				Descargar
			</a>
		</div>
	);
}

export default EntrenarModelo;
