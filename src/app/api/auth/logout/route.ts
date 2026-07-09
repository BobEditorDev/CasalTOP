import { NextResponse } from 'next/server'
import { limparSessao } from '@/lib/auth'

export async function POST() {
  await limparSessao()
  return NextResponse.json({ success: true })
}