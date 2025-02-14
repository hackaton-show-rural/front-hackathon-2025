import { makeApiRequest } from "../makeApiRequest"
import { Radial } from "./types"

export const getRadial = async () => {
  return makeApiRequest<Radial>({
    method: "get",
    url: `documents/chart/radial`,
  })
}

