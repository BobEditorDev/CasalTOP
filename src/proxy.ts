import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const usuarioCookie = request.cookies.get('usuario')
  const isLoginPage = request.nextUrl.pathname === '/login'
  const isApiRoute = request.nextUrl.pathname.startsWith('/api')
  const isStaticRoute =
    request.nextUrl.pathname.startsWith('/_next/static') ||
    request.nextUrl.pathname.startsWith('/_next/image') ||
    request.nextUrl.pathname === '/favicon.ico'

  // Permitir acesso a recursos estáticos sem autenticação
  if (isStaticRoute) {
    return NextResponse.next()
  }

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