import EntrenarModelo from "components/EntrenarModelo";
import Principal from "components/Principal";
import Eleccion from "pantallas/Eleccion";
import Inicio from "pantallas/Inicio";
import Camara from "pantallas/Camara";
import { Route } from "wouter";

const Router = () => (
	<>
		<Route path="/" children={<Camara />} />
		<Route path="/eleccion" children={<Eleccion />} />
		<Route path="/foto" children={<Principal />} />
		{/* <Route path="/webcam" children={<Webcamm />} /> */}

		<Route path="/entrenar" children={<EntrenarModelo />} />
	</>
);

export default Router;
