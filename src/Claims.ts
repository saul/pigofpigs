export interface Claim {
  readonly issuer: string;
  readonly originalIssuer: string;
  readonly type: string;
  readonly value: string;
}

export interface Roles {
  readonly isAdmin: boolean;
}

export type Claims = { claims: ReadonlyArray<Claim> } & Roles;
