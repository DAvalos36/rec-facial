import { createRoot } from "react-dom/client";
import "tailwindcss/tailwind.css";
import { NextUIProvider } from "@nextui-org/react";
import App from "components/App";

const container = document.getElementById("root") as HTMLDivElement;
const root = createRoot(container);

root.render(
	<NextUIProvider>
		<App />
	</NextUIProvider>,
);
