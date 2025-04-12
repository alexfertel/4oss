import { headers } from "next/headers";
import { userAgent } from "next/server";

type DeviceType = "console" | "mobile" | "tablet" | "smarttv" | "wearable" | "embedded";

export async function getDeviceType(): Promise<"desktop" | "mobile"> {
	const { device } = userAgent({ headers: await headers() });
	const types = ["console", "mobile", "tablet", "smarttv", "wearable", "embedded"];
	const deviceType = typeof (device.type) === "string" && types.includes(device.type) ? "mobile" : "desktop";
	return deviceType;
}
