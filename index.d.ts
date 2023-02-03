import { Adapter } from "@sveltejs/kit";

type Options = {
	out?: string;
	assetsDir?: string;
	precompress?: boolean;
};

export default function plugin(options?: Options): Adapter;
