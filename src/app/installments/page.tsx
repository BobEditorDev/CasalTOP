import { Card } from "@/shared/ui/Card";
import { InstallmentForm } from "@/domains/installments/components/InstallmentForm";
import { InstallmentList } from "@/domains/installments/components/InstallmentList";
import { getInstallmentGroups } from "@/domains/installments/actions";

export default async function InstallmentsPage() {
  const groups = await getInstallmentGroups();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Parcelamentos</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Novo Parcelamento</h2>
          <InstallmentForm />
        </Card>
        
        <Card>
          <h2 className="text-xl font-semibold mb-4">Parcelamentos Ativos</h2>
          <InstallmentList groups={groups} />
        </Card>
      </div>
    </div>
  );
}