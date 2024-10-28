import env from "../env"
import { r } from "../utils/fetch"

export const login = (data) => r( {url : `${env.API_URL}/login`,method: "POST", data})