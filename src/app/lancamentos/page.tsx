import { getGastos } from "@/domains/gastos/actions";
import { GastoList } from "@/domains/gastos/components/GastoList";

export default async function LancamentosPage() {
  const gastos = await getGastos();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Lançamentos</h1>
        </header>

        <GastoList gastos={gastos} />
      </div>
    </div>
  );
}
