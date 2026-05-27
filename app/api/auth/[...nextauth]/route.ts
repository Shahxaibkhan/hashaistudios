import NextAuth from 'next-auth'
import { carpectAuthOptions } from '@/lib/carpect/auth'

const handler = NextAuth(carpectAuthOptions)
export { handler as GET, handler as POST }
