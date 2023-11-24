import EntrenarModelo from "components/EntrenarModelo";
import Eleccion from "pantallas/Eleccion";
import Inicio from "pantallas/Inicio";
import { Route } from "wouter";

const Router = () => (
	<>
		<Route path="/" children={<Inicio />} />
		<Route path="/eleccion" children={<Eleccion />} />

		<Route path="/entrenar" children={<EntrenarModelo />} />
	</>
);

export default Router;
