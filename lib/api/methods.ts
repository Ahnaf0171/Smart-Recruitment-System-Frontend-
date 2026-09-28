import { fetchApi } from "./fetchApi";
import type { ApiResponse } from "./fetchApi";

export const getData = async <T>(
  endpoint: string
): Promise<ApiResponse<T>> => {
  return fetchApi<T>(endpoint, "GET");
};

export const postData = async <S, T>(
  endpoint: string,
  body: S
): Promise<ApiResponse<T>> => {
  return fetchApi<T>(endpoint, "POST", body);
};

export const putData = async <S, T>(
  endpoint: string,
  body: S
): Promise<ApiResponse<T>> => {
  return fetchApi<T>(endpoint, "PUT", body);
};

export const patchData = async <S, T>(
  endpoint: string,
  body: S
): Promise<ApiResponse<T>> => {
  return fetchApi<T>(endpoint, "PATCH", body);
};

export const deleteData = async <T>(
  endpoint: string
): Promise<ApiResponse<T>> => {
  return fetchApi<T>(endpoint, "DELETE");
};
