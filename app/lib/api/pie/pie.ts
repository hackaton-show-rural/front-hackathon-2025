import { makeApiRequest } from "../makeApiRequest"
import { Pie } from "./types"

export const getPie = async () => {
  return makeApiRequest<Pie>({
    method: "get",
    url: `documents/chart/pie`,
  })
}

