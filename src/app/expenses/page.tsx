import { Card } from "@/shared/ui/Card";
import { ExpenseForm } from "@/domains/expenses/components/ExpenseForm";
import { ExpenseList } from "@/domains/expenses/components/ExpenseList";
import { getExpenses } from "@/domains/expenses/actions";

export default async function ExpensesPage() {
  const expenses = await getExpenses();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Despesas</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Nova Despesa</h2>
          <ExpenseForm />
        </Card>
        
        <Card>
          <h2 className="text-xl font-semibold mb-4">Despesas Cadastradas</h2>
          <ExpenseList expenses={expenses} />
        </Card>
      </div>
    </div>
  );
}