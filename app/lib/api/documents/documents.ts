import { axiosInstance } from "../axiosInstance"
import { makeApiRequest } from "../makeApiRequest"
import { GetApiParams, Pagination } from "../types"
import { MutateDocuments, Documents } from "./types"

export const getDocuments = async ({
  offset,
  limit,
  filter,
}: GetApiParams) => {
  return makeApiRequest<Pagination<Documents>>({
    method: "get",
    url: `documents?offset=${offset}&limit=${limit}${filter || ""}`,
  })
}

export const getDocumentsById = async (id: number) => {
  return makeApiRequest<Documents>({
    method: "get",
    url: `documents/${id}`,
  })
}

export const mutateDocuments = async ({
  data,
}: {
  data: MutateDocuments
}) => {

  const formData = new FormData();

  data.files.forEach((file) => {
    formData.append(`files`, file);
  });

  try {
    const response = await axiosInstance.post("documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading files:", error);
    throw error;
  }

}
