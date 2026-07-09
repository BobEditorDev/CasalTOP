import { Card } from "@/shared/ui/Card";
import { getCurrentMonthDashboardData } from "@/domains/dashboard/actions";

export default async function Dashboard() {
  const data = await getCurrentMonthDashboardData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const now = new Date();
  const currentMonth = now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-lg text-gray-600 capitalize">
          {currentMonth}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <h2 className="text-lg font-semibold text-gray-600">Receita Total</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">{formatCurrency(data.totalIncome)}</p>
          <p className="text-sm text-gray-500 mt-1">{data.incomeCount} receita(s)</p>
        </Card>
        
        <Card>
          <h2 className="text-lg font-semibold text-gray-600">Despesa Total</h2>
          <p className="text-3xl font-bold text-red-600 mt-2">{formatCurrency(data.totalExpense)}</p>
          <p className="text-sm text-gray-500 mt-1">{data.expenseCount} despesa(s)</p>
        </Card>
        
        <Card>
          <h2 className="text-lg font-semibold text-gray-600">Saldo</h2>
          <p className={`text-3xl font-bold mt-2 ${data.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            {formatCurrency(data.balance)}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Gastos por Categoria</h2>
          {data.expensesByCategory.length === 0 ? (
            <p className="text-gray-500">Nenhum dado disponível</p>
          ) : (
            <div className="space-y-3">
              {data.expensesByCategory.map((item) => (
                <div key={item.category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.category}</span>
                    <span>{formatCurrency(item.amount)} ({item.percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Gastos por Pessoa</h2>
          {data.expensesByPerson.length === 0 ? (
            <p className="text-gray-500">Nenhum dado disponível</p>
          ) : (
            <div className="space-y-3">
              {data.expensesByPerson.map((item) => (
                <div key={item.person}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.person}</span>
                    <span>{formatCurrency(item.amount)} ({item.percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
      
      <Card>
        <h2 className="text-xl font-semibold mb-4">Últimos Lançamentos</h2>
        {data.recentTransactions.length === 0 ? (
          <p className="text-gray-500">Nenhum lançamento encontrado</p>
        ) : (
          <div className="space-y-2">
            {data.recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                </div>
                <span className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
