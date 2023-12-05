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
        <div className="mt-4 ">
          <Image className="my-2 rounded-none centered-image" width='150' src="Logo.webp"/>
          <h2 className="my-4 text-center font-black text-2xl">Reporte de personas identificadas</h2>
          <p className="my-2 font-medium text-lg text-center">La imagen usada fue:</p>
          <Image removeWrapper className="my-4 centered-image" width='90%' src={props.imagen}/>
          <p className="my-2 font-medium text-lg text-center">
            Listado de personas identificadas:
          </p>

          <table className="w-full">
							<thead>
								<tr>
									<th className="px-4 py-2">Numero de control</th>
									<th className="px-4 py-2">Nombre</th>
									<th className="px-4 py-2">Porcentaje</th>
								</tr>
							</thead>
							<tbody>
								{props.alumnos.map((alumno) => (
									<tr key={alumno.nc}>
										<td className="border px-4 py-2">{alumno.nc.toString()}</td>
										<td className="border px-4 py-2">
											{infoAlumno.get(alumno.nc)?.nombre}
											{infoAlumno.get(alumno.nc)?.apellido_paterno}
											{infoAlumno.get(alumno.nc)?.apellido_materno}
										</td>
										<td className="border px-4 py-2">
											{((1 - alumno.distancia) * 100).toString().split(".")[0]}{" "}
											%
										</td>
									</tr>
								))}
							</tbody>
						</table>
        </div>
      </div>
    </>
  );
});

Pdf.displayName = "Justificante de un dia o modulo.";
