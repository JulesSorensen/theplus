import env from "../env";
import { r } from "../utils/fetch";

export const getInvits = (data) =>
    r({ url: `${env.API_URL}/invits`, method: "GET", data });