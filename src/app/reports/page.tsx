import { Card } from "@/shared/ui/Card";
import { getAllReports } from "@/domains/reports/actions";

export default async function ReportsPage() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const reports = await getAllReports(currentYear, currentMonth);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const monthName = now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Relatórios</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 capitalize">
          Resumo Mensal - {monthName}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <h3 className="text-sm font-semibold text-gray-600">Receita Total</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">{formatCurrency(reports.summary.totalIncome)}</p>
          <p className="text-xs text-gray-500 mt-1">{reports.summary.incomeCount} transações</p>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-gray-600">Despesa Total</h3>
          <p className="text-2xl font-bold text-red-600 mt-2">{formatCurrency(reports.summary.totalExpense)}</p>
          <p className="text-xs text-gray-500 mt-1">{reports.summary.expenseCount} transações</p>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-gray-600">Saldo</h3>
          <p className={`text-2xl font-bold mt-2 ${reports.summary.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            {formatCurrency(reports.summary.balance)}
          </p>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-gray-600">Total Transações</h3>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {reports.summary.incomeCount + reports.summary.expenseCount}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Gastos por Categoria</h3>
          {reports.byCategory.length === 0 ? (
            <p className="text-gray-500">Nenhum dado disponível</p>
          ) : (
            <div className="space-y-3">
              {reports.byCategory.map((item) => (
                <div key={item.category} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{item.category}</span>
                    <span className="text-sm text-gray-600">
                      {formatCurrency(item.totalAmount)} ({item.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all" 
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{item.transactionCount} transação(ões)</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Gastos por Pessoa</h3>
          {reports.byPerson.length === 0 ? (
            <p className="text-gray-500">Nenhum dado disponível</p>
          ) : (
            <div className="space-y-3">
              {reports.byPerson.map((item) => (
                <div key={item.person} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{item.person}</span>
                    <span className={`text-sm font-medium ${item.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(item.balance)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Receitas:</span>
                      <span className="ml-1 text-green-600">{formatCurrency(item.totalIncome)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Despesas:</span>
                      <span className="ml-1 text-red-600">{formatCurrency(item.totalExpense)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{item.transactionCount} transação(ões)</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Receitas vs Despesas (Acumulado Anual)</h3>
        {reports.incomeVsExpense.length === 0 ? (
          <p className="text-gray-500">Nenhum dado disponível</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Mês</th>
                  <th className="text-right p-3">Receitas</th>
                  <th className="text-right p-3">Despesas</th>
                  <th className="text-right p-3">Saldo</th>
                </tr>
              </thead>
              <tbody>
                {reports.incomeVsExpense.map((item) => (
                  <tr key={item.month} className="border-b hover:bg-gray-50">
                    <td className="p-3">{item.month}</td>
                    <td className="p-3 text-right text-green-600">{formatCurrency(item.income)}</td>
                    <td className="p-3 text-right text-red-600">{formatCurrency(item.expense)}</td>
                    <td className={`p-3 text-right font-medium ${item.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                      {formatCurrency(item.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}