import { GastoForm } from "@/domains/gastos/components/GastoForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto p-4">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Controle Financeiro</h1>
          <p className="text-gray-600">Rodrigo & Giovana</p>
        </header>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Novo Gasto</h2>
          <GastoForm />
        </div>

        <div className="mt-6 text-center">
          <a
            href="/lancamentos"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Ver Lançamentos →
          </a>
        </div>
        
        <div className="mt-2 text-center">
          <a
            href="/resumo"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Ver Resumo →
          </a>
        </div>
      </div>
    </div>
  );
}
