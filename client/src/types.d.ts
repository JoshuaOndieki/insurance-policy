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

export interface APIBadRequestError {
  memberNames: string[]
  errorMessage: string
}

export interface InsurancePolicy {
  policyNumber: string
  holderName: string
  holderEmail: string | null
  holderPhone: string | null
  startDate: string
  endDate: string
  premiumAmount: number
  coverageDetails: string | null
  id: string
  createdById: string
  createdAtUtc: string
  lastModifiedById: string | null
  lastModifiedAtUtc: string | null
}
