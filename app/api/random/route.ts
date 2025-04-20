import { fetchRandomScreenshot } from "lib/random-screenshot";
import { DeviceType } from "lib/types";

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const deviceType: DeviceType =
    searchParams.get("deviceType") === "mobile" ? "mobile" : "desktop";

  const project = await fetchRandomScreenshot(deviceType);

  return Response.json({ deviceType, project }, { status: 200 });
}
