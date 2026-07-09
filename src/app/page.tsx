import { GastoForm } from "@/domains/gastos/components/GastoForm";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto p-4">
        <header className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Controle Financeiro</h1>
            <p className="text-gray-600">Rodrigo & Giovana</p>
          </div>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="text-sm text-red-600 hover:text-red-800"
            >
              Sair
            </button>
          </form>
        </header>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Novo Gasto</h2>
          <GastoForm />
        </div>

        <div className="mt-6 text-center space-y-2">
          <Link
            href="/lancamentos"
            className="block text-blue-600 hover:text-blue-800 font-medium"
          >
            Ver Lançamentos →
          </Link>
          <Link
            href="/resumo"
            className="block text-blue-600 hover:text-blue-800 font-medium"
          >
            Ver Resumo →
          </Link>
        </div>
      </div>
    </div>
  );
}
