import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import infoAlumnos from "../infoAlumno";
import { useReactToPrint } from "react-to-print";
import { Pdf } from "../components/Pdf";
import { Button, ScrollShadow, User } from "@nextui-org/react";
import { useStoreImg } from "zustand-img";
import { useLocation } from "wouter";

export type infoEncontrado = {
  nc: string;
  distancia: number;
};

function Principal() {
  const imgRef = useRef<HTMLImageElement>(null);
  const componentRef = useRef<HTMLDivElement | null>(null);
  const [cargando, setCargando] = useState(true)
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [alumnosEncontrados, setAlumnosEncontrados] = useState<infoEncontrado[]>([]);

  const [location, setLocation] = useLocation();
	const link = useStoreImg((s) => s.link);
  const [linkCanva, setLinkCanva] = useState('')

  useEffect(() => {
    if (link === "") {
      setLocation("/");
    }
	}, []);
    

  async function cargarModeloEntrenado() {
    const l: string[] = await (await fetch("faceDescriptors.json")).json();
    const labeledFaceDescriptors: faceapi.LabeledFaceDescriptors[] = [];
    l.forEach((ld) => {
      labeledFaceDescriptors.push(faceapi.LabeledFaceDescriptors.fromJSON(ld));
    });
    return labeledFaceDescriptors;
  }

  async function a() {
    const img = imgRef.current as HTMLImageElement;
    const canvas = faceapi.createCanvasFromMedia(img);

    // Obtén el contenedor de la imagen o el componente de la aplicación
    const container = document.getElementById('contenedor-imagen') || document.body;
    const divDestino = document.getElementById('miDiv') || document.body;

    if (container && divDestino) {
      container.append(canvas);
      divDestino.append(canvas);

      const fullFaceDescriptions = await faceapi
        .detectAllFaces(img)
        .withFaceLandmarks()
        .withFaceDescriptors();

      const labeledFaceDescriptors = await cargarModeloEntrenado();

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

          // Dibujar un cuadro alrededor de cada rostro
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
      setCargando(false)

      // save canvas image as data url (png format by default)
      const dataURL = canvas.toDataURL();
      setLinkCanva(dataURL);
    }
  }

  return (
    <div className="flex-col min-h-screen flex justify-center self-center" style={{ backgroundColor: '#F2F2F2' }}>
      <div className="max-w-fit py-4 flex justify-center self-center" id="miDiv">
        <img className='hidden' ref={imgRef} src={link} onLoad={a} alt="FOTO" id="imgPrueba contenedor-imagen" />
      </div>

      <div className="py-unit-sm flex justify-center self-center flex-col mb-7">
        <ScrollShadow className="w-full">
          {alumnosEncontrados.map((alumno, index) => {
            const nombre = `${infoAlumnos.get(alumno.nc)?.nombre} ${infoAlumnos.get(alumno.nc)?.apellido_paterno} ${infoAlumnos.get(alumno.nc)?.apellido_materno}`;
            const precision = (1 - alumno.distancia) * 100;
            return (
              <div className="flex justify-between my-5 w-full" key={index}>
                <User
                  name={nombre}
                  description={alumno.nc}
                  avatarProps={{
                    src: `fotos/${alumno.nc}.jpg`,
                  }}
                />
                <p className="px-6 font-bold text-orange-700">{precision.toString().split('.')[0]} %</p>
              </div>
            );
          })}
        </ScrollShadow>

        <div className="hidden">
          <Pdf ref={componentRef} imagen={linkCanva} alumnos={alumnosEncontrados} />
        </div>

        <Button className="mx-20" color="warning" variant="shadow" onClick={() => handlePrint() } isLoading={cargando}>Guardar PDF</Button>
      </div>
    </div>
  );
}

export default Principal;