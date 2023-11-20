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
const variaciones = [1, 2, 3, 4, 5, 6, 7, 8, 9];

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
						alert(`No se detectaron rostros en la imagen ${nombre}`);
						// throw new Error(`no faces detected for ${nombre}`);
					} else {
						console.log(nombre);
						setContador((c) => c + 1);

						const faceDescriptors = [fullFaceDescription.descriptor];
						return new faceapi.LabeledFaceDescriptors(nombre, faceDescriptors);
					}
				} catch (error) {
					console.log(error);
					console.log(`Error al cargar imagen: ${nombre}`);
					// throw new Error(`No se encontro la imagen ${nombre}`);
				}
			}),
		);
		console.log("labeledFaceDescriptors", labeledFaceDescriptors);
		console.log(JSON.stringify(labeledFaceDescriptors));
		setEntrenando(false);
		return labeledFaceDescriptors;
	}

	async function main() {
		if (entrenando) {
			return;
		}
		const l = (await entrenarRostros()) as faceapi.LabeledFaceDescriptors[];
		console.log(l);

		const arrayLabeled: string[] = [];

		l.forEach((ld) => {
			arrayLabeled.push(ld.toJSON());
		});

		const serializedDescriptors = JSON.stringify(arrayLabeled);

		// Guardar modelo ENTRENADO en un archivo JSON
		const blob = new Blob([serializedDescriptors], {
			type: "application/json",
		});
		const href = await URL.createObjectURL(blob);
		if (aRef?.current) {
			alert("entra");
			aRef.current.href = href;
			aRef.current.download = "faceDescriptors.json";
		}
	}

	async function cargarModeloEntrenado() {
		const l: string[] = await (await fetch("/faceDescriptors.json")).json();
		const labeledFaceDescriptors: faceapi.LabeledFaceDescriptors[] = [];
		l.forEach((ld) => {
			labeledFaceDescriptors.push(faceapi.LabeledFaceDescriptors.fromJSON(ld));
		});
		setEntrenando(false);
		console.log(labeledFaceDescriptors);
	}

	useEffect(() => {
		main();
		// cargarModeloEntrenado();
	}, [entrenando]);

	return (
		<div className="min-h-screen flex flex-col justify-center items-center">
			<div className={`text-lg  ${!entrenando && "hidden"}`}>
				Entrenando modelo {contador}
			</div>

			<h2 className={`text-lg  ${entrenando && "hidden"}`}>
				Entrenamiento finalizado
			</h2>

			<a ref={aRef} href="/" className={`text-lg  ${entrenando && "hidden"}`}>
				Descargar
			</a>
		</div>
	);
}

export default EntrenarModelo;
