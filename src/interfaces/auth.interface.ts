export interface IOAuthUser {
  googleId?: string
  appleId?: string
  email: string
}

export interface IAppleAuthorizationUrlConfig {
  redirectUri: string;
  scope?: ('email' | 'name')[];
  state?: string;
  nonce?: string;
  response_mode?: string;
}

export interface IAppleBodySigninReturn {
  state: string;
  code: string;
}
