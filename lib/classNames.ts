import { Falsy } from "./types";

export function classNames(...classes: Array<Falsy | string>): string {
	return classes.filter(Boolean).join(" ");
}
