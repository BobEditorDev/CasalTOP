import { getGastos } from "@/domains/gastos/actions";
import { deleteGasto } from "@/domains/gastos/actions";

export default async function LancamentosPage() {
  const gastos = await getGastos();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const formatTipo = (tipo: string) => {
    const tipos: Record<string, string> = {
      'RODRIGO_PAGA': 'Rodrigo Paga',
      'GIOVANA_PAGA': 'Giovana Paga',
      'RODRIGO_PAGOU_DA_GIOVANA': 'Rodrigo Pagou da Giovana',
      'GIOVANA_PAGOU_DO_RODRIGO': 'Giovana Pagou do Rodrigo'
    };
    return tipos[tipo] || tipo;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Lançamentos</h1>
          <a
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Voltar
          </a>
        </header>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Data</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Categoria</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tipo</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Valor</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Observação</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {gastos.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      Nenhum lançamento encontrado
                    </td>
                  </tr>
                ) : (
                  gastos.map((gasto) => (
                    <tr key={gasto.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{formatDate(gasto.data)}</td>
                      <td className="px-4 py-3 text-sm">{gasto.categoria}</td>
                      <td className="px-4 py-3 text-sm">{formatTipo(gasto.tipo)}</td>
                      <td className="px-4 py-3 text-sm text-right font-medium">{formatCurrency(gasto.valor)}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{gasto.observacao || '-'}</td>
                      <td className="px-4 py-3 text-center">
                        <form action={deleteGasto.bind(null, gasto.id)}>
                          <button
                            type="submit"
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Excluir
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}