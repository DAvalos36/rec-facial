import React, { useRef, useState } from "react";
import * as faceapi from "face-api.js";
import infoAlumnos from "../infoAlumno";
import { PDFDocument } from "pdf-lib";
import { Button, ScrollShadow, User } from "@nextui-org/react";
import { useReactToPrint } from "react-to-print";

export type infoEncontrado = {
  nc: string;
  distancia: number;
};

function Principal() {
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const componentRef = useRef<HTMLDivElement | null>(null);

  const [alumnosEncontrados, setAlumnosEncontrados] = useState<infoEncontrado[]>([]);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

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

  async function handleDownloadPdf() {
    const pdfDoc = await PDFDocument.create();

    // Crear una nueva página
    const page = pdfDoc.addPage();

    // Establecer el tamaño de la página
    const { width, height } = page.getSize();

    // Dibujar información adicional
    const textSize = 18;
    const textHeight = 50;
    page.drawText("Personas encontradas:", { x: 50, y: height - textHeight, size: textSize });

    // Agregar información de alumnosEncontrados
    alumnosEncontrados.forEach((alumno, index) => {
      const nombre = `${infoAlumnos.get(alumno.nc)?.nombre} ${infoAlumnos.get(
        alumno.nc
      )?.apellido_paterno} ${infoAlumnos.get(alumno.nc)?.apellido_materno}`;
      const precision = (1 - alumno.distancia) * 100;

      const textYName = height - textHeight - (index + 1) * (textSize + 2); // Agregar 2 para dejar dos líneas
      const textYDistance = textYName - textSize; // Separación entre nombre y distancia

      // Ajustar la posición del texto si se desborda
      if (textYDistance >= 0) {
        // Dibujar el nombre en una línea
        page.drawText(`${index + 1}. Nombre: ${nombre}`, {
          x: 50,
          y: textYName,
          size: textSize,
        });

        // Dibujar la distancia en otra línea
        
      }
    });

    // Guardar el PDF en formato Uint8Array
    const pdfBytes = await pdfDoc.save();

    // Crear un Blob con el contenido del PDF
    const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });

    // Crear un enlace temporal y descargar el archivo
    const link = document.createElement("a");
    link.href = URL.createObjectURL(pdfBlob);
    link.download = "Alumnos.pdf";
    link.click();
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
        {alumnosEncontrados.map((alumno, index) => {
          const nombre = `${infoAlumnos.get(alumno.nc)?.nombre} ${infoAlumnos.get(
            alumno.nc
          )?.apellido_paterno} ${infoAlumnos.get(alumno.nc)?.apellido_materno}`;
          const precision = (1 - alumno.distancia) * 100;
          return (
            <div className="flex justify-between my-5 w-full" key={index}>
              <User
                name={nombre}
                description={alumno.nc}
                avatarProps={{
                  src: `/fotos/${alumno.nc}.jpg`,
                }}
              />
              <p>{precision.toString().split(".")[0]} %</p>
            </div>
          );
        })}
      </ScrollShadow>
      <Button onClick={handleDownloadPdf}>Descargar PDF</Button>
      
      {/* Nuevo botón para imprimir el documento */}
      <Button onClick={handlePrint}>Imprimir PDF</Button>
    </div>
  );
}

export default Principal;
