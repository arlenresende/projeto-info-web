export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface RegisterResponse {
  data: {
    token: string
  }
}
