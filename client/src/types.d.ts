export interface ToastMessage {
  title: string
  details?: string
  type: 'success' | 'error' | 'warning' | 'info'
}

export interface User {
  email: string
  isEmailConfirmed: boolean
}

export interface UserSignup {
  email: string
  password: string
}

export interface UserSignin {
  email: string
  password: string
}

export interface SigninResponse {
  tokenType: string
  accessToken: string
  expiresIn: number
  refreshToken: string
}

export interface APIErrorResponse {
  type: string
  title: string
  status: number
  errors: APIErrors
}

export interface APIErrors {
  [key:string]: string[]
}
