export interface LoginCredentials {
  readonly email: string
  readonly password: string
  readonly rememberMe: boolean
}

export interface LoginResponseUser {
  readonly id: number
  readonly name: string
  readonly email: string
}

export interface LoginResponse {
  readonly token: string
  readonly user: LoginResponseUser
}
