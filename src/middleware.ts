import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const usuarioCookie = request.cookies.get('usuario')
  const isLoginPage = request.nextUrl.pathname === '/login'
  const isApiRoute = request.nextUrl.pathname.startsWith('/api')

  // Se não estiver logado e não for página de login ou API, redirecionar para login
  if (!usuarioCookie && !isLoginPage && !isApiRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Se estiver logado e tentar acessar página de login, redirecionar para home
  if (usuarioCookie && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)']
}