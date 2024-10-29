import env from "../env"
import { r } from "../utils/fetch"

export const getGroups = () => r({ url: `${env.API_URL}/groups`, method: "GET" })

export const createGroup = (data) => r({ url: `${env.API_URL}/groups`, method: "POST", data })

export const createInvit = (data) => r({ url: `${env.API_URL}/invits`, method: "POST", data })