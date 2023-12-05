import React, { useEffect, useRef, useState } from "react";
import ImageSlider from "../components/ImageSlider";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	useDisclosure,
} from "@nextui-org/react";
import ImageUploader from "../components/ImageUploader";
import * as faceapi from "face-api.js";
import infoAlumnos from "../infoAlumno";
import { useStoreImg } from "zustand-img";
import { useLocation } from "wouter";

const App: React.FC = () => {
	const images = ["amigos1.webp", "amigos2.png", "amigos3.jpeg"];
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
	const [photo, setPhoto] = useState<string | null>(null);

	const [location, setLocation] = useLocation();
	const link = useStoreImg((s) => s.link);

	useEffect(() => {
		if (link !== "") {
			setLocation("/foto");
		}
	}, [link]);

	async function cargarModeloEntrenado() {
		const l: string[] = await (await fetch("faceDescriptors.json")).json();
		const labeledFaceDescriptors: faceapi.LabeledFaceDescriptors[] = [];
		l.forEach((ld) => {
			labeledFaceDescriptors.push(faceapi.LabeledFaceDescriptors.fromJSON(ld));
		});
		return labeledFaceDescriptors;
	}

	const startCamera = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true });
			setMediaStream(stream);

			if (videoRef.current) {
				videoRef.current.srcObject = stream;

				videoRef.current.addEventListener("loadeddata", async () => {
					if (canvasRef.current) {
						const canvas = canvasRef.current;
						const displaySize = {
							width: videoRef.current?.videoWidth || 640,
							height: videoRef.current?.videoHeight || 480,
						};
						faceapi.matchDimensions(canvas, displaySize);
						const labeledFaceDescriptors = await cargarModeloEntrenado();
						const faceMatcher = new faceapi.FaceMatcher(
							labeledFaceDescriptors,
							0.6,
						);
						setInterval(async () => {
							const detections = await faceapi
								.detectAllFaces(
									videoRef.current as unknown as faceapi.TNetInput,
									new faceapi.TinyFaceDetectorOptions(),
								)
								.withFaceLandmarks()
								.withFaceDescriptors();

							const resizedDetections = faceapi.resizeResults(
								detections,
								displaySize,
							);
							canvas
								.getContext("2d")
								?.clearRect(0, 0, canvas.width, canvas.height);
							const results = detections.map((fd) =>
								faceMatcher.findBestMatch(fd.descriptor),
							);

							results.forEach((bestMatch, i) => {
								const box = detections[i].detection.box;
								let nC = bestMatch.label;
								const encontrado = nC !== "unknown";
								if (encontrado) {
									nC = nC.split("_")[0];
									const alumno = infoAlumnos.get(nC);
									const nombre = `${alumno?.nombre} ${alumno?.apellido_paterno} ${alumno?.apellido_materno}`;
									const drawBox = new faceapi.draw.DrawBox(box, {
										label: nombre,
									});
									drawBox.draw(canvas);
								} else {
									const drawBox = new faceapi.draw.DrawBox(box, {
										label: "Desconocido",
										boxColor: "red",
									});
									drawBox.draw(canvas);
								}
							});

							// faceapi.draw.drawDetections(canvas, resizedDetections);
						}, 41);
					}
				});
			}
		} catch (error) {
			console.error("Error accessing camera:", error);
		}
	};

	const stopCamera = () => {
		if (mediaStream) {
			mediaStream.getTracks().forEach((track) => track.stop());
			setMediaStream(null);
		}
	};

	const takePhoto = () => {
		if (videoRef.current) {
			const canvas = document.createElement("canvas");
			canvas.width = videoRef.current.videoWidth;
			canvas.height = videoRef.current.videoHeight;
			const context = canvas.getContext("2d");
			if (context) {
				context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
				const photoURL = canvas.toDataURL("image/png");
				setPhoto(photoURL);
			}
		}
	};

	const openCamera = () => {
		onOpen();
		startCamera();
	};

	const closeCamera = () => {
		onOpenChange();
		stopCamera();
	};

	const fotoTomada = () => {
		takePhoto();
		onOpenChange();
		stopCamera();
	};

	const handleImageUpload = (image: string) => {
		console.log("Imagen subida:", image);
		alert("Imagen subida con éxito!");
	};

	return (
		<div
			className="min-h-screen cel flex justify-center self-center px-4"
			style={{ backgroundColor: "#F2F2F2" }}
		>
			<div className="max-w-md py-2 flex justify-center self-center flex-col">
				<ImageSlider images={images} interval={5000} />{" "}
				{/* Cambiar el intervalo según sea necesario */}
				<div className="py-6 flex justify-around">
					<Button
						className=""
						onPress={openCamera}
						color="warning"
						variant="shadow"
						endContent={
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="1.5em"
								height="1.5em"
								viewBox="0 0 24 24"
							>
								<path
									fill="#000"
									d="M4 4h3l2-2h6l2 2h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2m8 3a5 5 0 0 0-5 5a5 5 0 0 0 5 5a5 5 0 0 0 5-5a5 5 0 0 0-5-5m0 2a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3Z"
								/>
							</svg>
						}
					>
						Capturar imagen
					</Button>
					<Modal
						className="bg-yellow-200"
						isOpen={isOpen}
						onOpenChange={closeCamera}
					>
						<ModalContent>
							{(onClose) => (
								<>
									<ModalHeader className="flex flex-col gap-1"></ModalHeader>
									<ModalBody>
										<div style={{ position: "relative" }}>
											<video
												ref={videoRef}
												autoPlay
												style={{ width: "100%", height: "100%" }}
											/>
											<canvas
												ref={canvasRef}
												style={{
													position: "absolute",
													top: 0,
													left: 0,
													width: "100%",
													height: "100%",
												}}
											/>
										</div>
									</ModalBody>
									<ModalFooter>
										<Button color="default" variant="light" onPress={onClose}>
											Cancelar
										</Button>
										<Button color="warning" onPress={fotoTomada}>
											Tomar foto
										</Button>
									</ModalFooter>
								</>
							)}
						</ModalContent>
					</Modal>
					<Button
						className=""
						color="warning"
						variant="shadow"
						endContent={
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="1.5em"
								height="1.5em"
								viewBox="0 0 24 24"
							>
								<path
									fill="#000"
									fillRule="evenodd"
									d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2c4.714 0 7.071 0 8.535 1.464C22 4.93 22 7.286 22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12Zm10 5.75a.75.75 0 0 0 .75-.75v-5.19l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72V17c0 .414.336.75.75.75Zm-4-10a.75.75 0 0 1 0-1.5h8a.75.75 0 0 1 0 1.5H8Z"
									clipRule="evenodd"
								/>
							</svg>
						}
					>
						<ImageUploader onImageUpload={handleImageUpload} />
					</Button>
				</div>
			</div>
		</div>
	);
};

export default App;
