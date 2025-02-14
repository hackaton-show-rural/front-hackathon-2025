import { makeApiRequest } from "../makeApiRequest"
import { Bar } from "./types"

export const getBar = async () => {
  return makeApiRequest<Bar>({
    method: "get",
    url: `documents/chart/bar`,
  })
}

