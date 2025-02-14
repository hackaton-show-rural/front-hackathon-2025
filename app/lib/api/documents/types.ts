import { DefType } from "../types"

export interface Documents extends DefType {
  "id": number,
  "protocol": number,
  "number": number,
  "limitDate": string,
  "cnpj": string,
  "documentUrl": string,
  "status": string,
  "identifier": {
    "id": number,
    "name": string,
    "address": string,
    "city": string,
    "postalCode": string,
  },
  "conditions": []
}

export interface MutateDocuments {
  files: any[]
}
