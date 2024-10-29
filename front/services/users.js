import env from "../env"
import { r } from "../utils/fetch"

export const getUsers = () => r({ url: `${env.API_URL}/users`, method: "GET" })
