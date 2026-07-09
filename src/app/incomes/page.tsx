import { Card } from "@/shared/ui/Card";
import { IncomeForm } from "@/domains/incomes/components/IncomeForm";
import { IncomeList } from "@/domains/incomes/components/IncomeList";
import { getIncomes } from "@/domains/incomes/actions";

export default async function IncomesPage() {
  const incomes = await getIncomes();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Receitas</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Nova Receita</h2>
          <IncomeForm />
        </Card>
        
        <Card>
          <h2 className="text-xl font-semibold mb-4">Receitas Cadastradas</h2>
          <IncomeList incomes={incomes} />
        </Card>
      </div>
    </div>
  );
}