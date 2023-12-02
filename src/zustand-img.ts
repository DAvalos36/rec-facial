import { create } from "zustand";

type link = {
	link: string;
	setLink: (l: string) => void;
};

const useStoreImg = create<link>()((set) => ({
	link: "",
	setLink: (l) => set(() => ({ link: l })),
}));

export { useStoreImg };
