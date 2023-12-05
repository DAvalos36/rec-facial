import React, { forwardRef, RefObject } from "react";
import { infoEncontrado } from "../pantallas/Principal";
import infoAlumno from "../infoAlumno";
import { Image, User } from "@nextui-org/react";

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
        .centered-image {
          display: block;
          margin: 0 auto;
        }
      `}
      </style>
      <div ref={ref as RefObject<HTMLDivElement>} className="w-full px-8">
        <div className="mt-4">
          <Image className="my-2 rounded-none centered-image" width='150' src="Logo.webp"></Image>
          <h2 className="my-4 text-center font-black text-2xl">Reporte de personas identificadas</h2>
          <p className="my-2 font-medium text-lg">La imagen usada fue:</p>
          <Image className="my-4 centered-image" width='90%' src={props.imagen}></Image>
          <p className="my-2 font-medium text-lg">
            Listado de personas identificadas:
          </p>

          {props.alumnos.map((alumno) => (
            <div className="w-full centered-image my-4" key={alumno.nc}>
              <User
              className=""
                  name={(<span style={{ fontSize: "1rem" }}>
                    {infoAlumno.get(alumno.nc)?.nombre +
                    " " +
                    infoAlumno.get(alumno.nc)?.apellido_paterno +
                    " " +
                    infoAlumno.get(alumno.nc)?.apellido_materno}
                    </span>)}
                  description={(<span>{alumno.nc}</span>)}
                  avatarProps={{
                    src: `fotos/${alumno.nc}.jpg`,
                    size: 'lg',
                  }}
                />
            </div>
          ))}
        </div>
      </div>
    </>
  );
});

Pdf.displayName = "Justificante de un dia o modulo.";
