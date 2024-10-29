import env from "../env"
import { r } from "../utils/fetch"

export const getMessages = (data) => r({ url: `${env.API_URL}/messages?group=null`, method: "GET" })

export const publishMessages = (data) => r({ url: `${env.API_URL}/messages`, method: "POST", data })

export const deleteMessage = (id) => r({ url: `${env.API_URL}/messages/${id}`, method: "DELETE" })