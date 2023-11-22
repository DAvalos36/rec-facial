import React, { forwardRef, RefObject } from "react";
import { infoEncontrado } from "./Principal";
import infoAlumno from "../infoAlumno";

interface Props {
  alumnos: infoEncontrado[];
  imagen: string;
}

export const Pdf = forwardRef<HTMLDivElement, Props>((props, ref) => {
  return (
    <>
      <style>
        {`
        @page {
          margin: 1cm 1cm 1cm 1cm;
        }
      `}
      </style>
      <div ref={ref as RefObject<HTMLDivElement>} className="w-full px-8 ">
        <div className="mt-4">
          <p className="mb-3 font-medium text-lg">La imagen usada fue:</p>
          <img src={props.imagen} />
          {props.alumnos.map((alumno) => (
            <div key={alumno.nc}>
              <p className="mb-3 font-medium text-lg">
                Los estudiantes encontrados fueron los siguientes: <br />
                <b>{alumno.nc.toString()}</b> del{"\n"}
              </p>
              <p>
                Los numeros de control fueron los siguientes: <br />
                <b>{infoAlumno.get(alumno.nc)?.nombre}</b> del{"\n"}
              </p>
            </div>
          ))}
          <p></p>
        </div>
      </div>
    </>
  );
});

Pdf.displayName = "Justificante de un dia o modulo.";
