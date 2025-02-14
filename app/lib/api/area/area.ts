import { makeApiRequest } from "../makeApiRequest"
import { Bar } from "./types"

export const getArea = async () => {
  return makeApiRequest<Bar>({
    method: "get",
    url: `documents/chart/area`,
  })
}

