export const ApiGlobalPrefix = '/api/v1'
export const ApiGlobalPrefixRouteNotFound = '*'
export const AuthPrefixRoutes = '/auth'
export const AuthGooglePrefixRoutes = '/Oauth'
export const hellow = '/hellow'

export const PUBLIC_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VALIDATE_CODE: '/validate-code'
}

export const PRIVATE_ROUTES = {
  USER: '/user',
  GET_USER_BY_ID: '/:uuid'
}
