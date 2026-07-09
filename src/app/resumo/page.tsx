import { getGastos } from "@/domains/gastos/actions";
import { ResumoDashboard } from "@/domains/gastos/components/ResumoDashboard";
import { configuracaoRepository } from "@/domains/configuracao/repositories";

export default async function ResumoPage() {
  const gastos = await getGastos();
  const configuracao = await configuracaoRepository.get();

  const percentualRodrigo = configuracao?.percentualRodrigo || 62.5;
  const percentualGiovana = configuracao?.percentualGiovana || 37.5;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Resumo Mensal</h1>
        </header>

        <ResumoDashboard
          gastos={gastos}
          percentualRodrigo={percentualRodrigo}
          percentualGiovana={percentualGiovana}
        />
      </div>
    </div>
  );
}
