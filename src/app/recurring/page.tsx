import { Card } from "@/shared/ui/Card";
import { RecurringExpenseForm } from "@/domains/recurring/components/RecurringExpenseForm";
import { RecurringExpenseList } from "@/domains/recurring/components/RecurringExpenseList";
import { getRecurringExpenses } from "@/domains/recurring/actions";

export default async function RecurringPage() {
  const recurringExpenses = await getRecurringExpenses();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Despesas Recorrentes</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Nova Despesa Recorrente</h2>
          <RecurringExpenseForm />
        </Card>
        
        <Card>
          <h2 className="text-xl font-semibold mb-4">Despesas Recorrentes</h2>
          <RecurringExpenseList recurringExpenses={recurringExpenses} />
        </Card>
      </div>
    </div>
  );
}