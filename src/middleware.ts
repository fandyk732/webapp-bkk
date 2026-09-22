import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Daftar email yang diizinkan mengakses Admin Panel
const ADMIN_EMAILS = [
  'fandyazis17@gmail.com', // Sesuaikan dengan email admin
  'fandyk732@guru.smk.belajar.id'
];

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Proteksi khusus rute /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      // Belum login -> lempar ke login
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirectTo', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    if (!user.email || !ADMIN_EMAILS.includes(user.email)) {
      // Login tapi bukan email Admin -> lempar ke homepage dengan peringatan
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};