import React, { forwardRef, RefObject } from "react";
import { infoEncontrado } from "../pantallas/Principal";
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
          <p>
            Los estudiantes encontrados teniendo en cuenta a su numero de
            control y su nombre fueron los siguientes:
          </p>

          {props.alumnos.map((alumno) => (
            <div key={alumno.nc}>
              <p className="mb-3 font-medium text-lg">
                <br />
                <b>
                  Nombre: {infoAlumno.get(alumno.nc)?.nombre}
                  {infoAlumno.get(alumno.nc)?.apellido_paterno}
                  {infoAlumno.get(alumno.nc)?.apellido_materno}
                </b>
              </p>
              <p>
                <br />
                <b>Numero de control: {alumno.nc.toString()}</b>
                <b></b>
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
