import EntrenarModelo from "components/EntrenarModelo";
import Principal from "pantallas/Principal";
import Eleccion from "pantallas/Eleccion";
import Inicio from "pantallas/Inicio";
import { Route, Router as R } from "wouter";
import {
	BaseLocationHook,
	navigate,
	useLocationProperty,
} from "wouter/use-location";

const hashLocation = () => window.location.hash.replace(/^#/, "") || "/";

const hashNavigate = (to: string) => navigate(`#${to}`);

const useHashLocation: BaseLocationHook = () => {
	const location = useLocationProperty(hashLocation);
	return [location, hashNavigate];
};

const Router = () => (
	<>
		<R hook={useHashLocation}>
			<Route path="/" children={<Inicio />} />
			<Route path="/eleccion" children={<Eleccion />} />
			<Route path="/foto" children={<Principal />} />
			{/* <Route path="/webcam" children={<Webcamm />} /> */}

			<Route path="/entrenar" children={<EntrenarModelo />} />
		</R>
	</>
);

export default Router;
