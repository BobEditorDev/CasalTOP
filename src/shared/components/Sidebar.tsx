'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  { href: '/', label: 'Dashboard', icon: '📊' },
  { href: '/incomes', label: 'Receitas', icon: '💰' },
  { href: '/expenses', label: 'Despesas', icon: '💸' },
  { href: '/installments', label: 'Parcelamentos', icon: '📦' },
  { href: '/recurring', label: 'Recorrências', icon: '🔄' },
  { href: '/categories', label: 'Categorias', icon: '🏷️' },
  { href: '/people', label: 'Pessoas', icon: '👥' },
  { href: '/payment-methods', label: 'Formas de Pagamento', icon: '💳' },
  { href: '/reports', label: 'Relatórios', icon: '📈' },
]

export const Sidebar: React.FC = () => {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">CasalTOP</h1>
        <p className="text-gray-400 text-sm">Controle Financeiro</p>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === item.href
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}