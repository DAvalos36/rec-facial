import { useRef, useState } from "react";
import * as faceapi from "face-api.js";
import infoAlumnos from "../infoAlumno";
import { useReactToPrint } from "react-to-print";
import {Pdf} from "./Pdf"
import { Button, ScrollShadow, User } from "@nextui-org/react";

export type infoEncontrado = {
  nc: string;
  distancia: number;
};

function Principal() {
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const componentRef = useRef<HTMLDivElement | null>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [alumnosEncontrados, setAlumnosEncontrados] = useState<
    infoEncontrado[]
  >([]);

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
        maxDescriptorDistance
      );

      const results = fullFaceDescriptions.map((fd) =>
        faceMatcher.findBestMatch(fd.descriptor)
      );

      const ac: infoEncontrado[] = [];

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
          ac.push({ nc: nC, distancia: bestMatch.distance });
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
      <ScrollShadow>
		{
			alumnosEncontrados.map((alumno, index) => {
				const nombre = `${infoAlumnos.get(alumno.nc)?.nombre} ${infoAlumnos.get(alumno.nc)?.apellido_paterno} ${infoAlumnos.get(alumno.nc)?.apellido_materno}`
        const precision = (1-alumno.distancia)*100
				return (
					<div className="flex justify-between my-5 w-full">
						<User
							name={nombre}
							description={alumno.nc}
							avatarProps={{
								src: `/fotos/${alumno.nc}.jpg`,
							}}
						/>
            <p>{precision.toString().split('.')[0] } %</p>
					</div>
				);
			})
		}
	  </ScrollShadow>
      <div className="hidden">
        <Pdf ref={componentRef} imagen="/prb.jpeg" alumnos={alumnosEncontrados}/>
      </div>
	  

    <Button onClick={()=>handlePrint()}>Guardar PDF</Button>
    </div>
  );
}

export default Principal;
