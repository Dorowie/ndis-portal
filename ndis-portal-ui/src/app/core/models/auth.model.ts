export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  FirstName: string;
  LastName: string;
  Email: string;
  Password: string;
  Role: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
  };
  message: string;
}