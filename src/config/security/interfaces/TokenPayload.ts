export interface TokenPayload<T> {
  rol: "ADMIN" | "USER",
  uuid: T
}
