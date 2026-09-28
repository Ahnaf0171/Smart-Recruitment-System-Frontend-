import { postData } from "@/lib/api/methods";

export interface SignupPayload {
  role: string;
  username: string;
  email: string;
  password: string;
  phone?: string;
  company?: string;
}

export interface SignupResponse {
  id: number;
  email: string;
  username: string;
  role: string;
}

export const signupApi = (payload: SignupPayload) =>
  postData<SignupPayload, SignupResponse>("/accounts/signup/", payload);

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  role: string;
  username: string;
}

export const loginApi = (payload: LoginPayload) =>
  postData<LoginPayload, LoginResponse>("/accounts/login/", payload);
