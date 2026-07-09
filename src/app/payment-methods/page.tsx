import { Card } from "@/shared/ui/Card";
import { PaymentMethodForm } from "@/domains/payment-methods/components/PaymentMethodForm";
import { PaymentMethodList } from "@/domains/payment-methods/components/PaymentMethodList";
import { getPaymentMethods } from "@/domains/payment-methods/actions";

export default async function PaymentMethodsPage() {
  const paymentMethods = await getPaymentMethods();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Formas de Pagamento</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Nova Forma de Pagamento</h2>
          <PaymentMethodForm />
        </Card>
        
        <Card>
          <h2 className="text-xl font-semibold mb-4">Formas de Pagamento Cadastradas</h2>
          <PaymentMethodList paymentMethods={paymentMethods} />
        </Card>
      </div>
    </div>
  );
}