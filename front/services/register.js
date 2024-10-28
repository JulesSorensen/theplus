import env from "../env"
import { r } from "../utils/fetch"

export const register = (data) => r( {url : `${env.API_URL}/users`,method: "POST", data})