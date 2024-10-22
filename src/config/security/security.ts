import { JwtHelper } from "./Jwthelpers"
import { TOKEN_SECRET_KEY, REFESCH_TOKEN_SECRET_KEY } from '@/config/constants'

export const jwtHelpers = new JwtHelper(TOKEN_SECRET_KEY, REFESCH_TOKEN_SECRET_KEY)
