import React, { forwardRef, RefObject } from "react";

interface Props {
	grado: string;
	grupo: string;
	nombreAlumno: string;
	fechaInicio: string;
	motivo: string;
	quienSolicita: string;
	moduloHora: string;
}

export const PdfJustificanteHoraODia = forwardRef<HTMLDivElement, Props>(
	(props, ref) => {
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
						<p className="mb-3 font-medium text-lg">
							Se les notifica que el estudiante <b>{props.nombreAlumno}</b> del{" "}
							<b>
								{props.grado}° {props.grupo}
							</b>{" "}
							no asistirá{" "}
							{props.moduloHora === ""
								? `el dia <b>${props.fechaInicio}</b>`
								: `a la hora <b>${props.moduloHora}</b> del dia <b>${props.fechaInicio}</b>`}{" "}
							del teniendo como motivo <b>{props.motivo}</b>.
						</p>

						<h3 className="font-bold mb-14 text-center text-lg">
							Favor de firmar de enterados
						</h3>
						<h3 className="font-bold my-14 text-center text-lg">Atentamente</h3>
						<h3 className="font-bold text-center text-lg border-t-2 border-black">
							{props.quienSolicita}
						</h3>
					</div>
				</div>
			</>
		);
	},
);

PdfJustificanteHoraODia.displayName = "Justificante de un dia o modulo.";
