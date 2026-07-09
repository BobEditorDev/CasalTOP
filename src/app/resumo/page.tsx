import { getGastos } from "@/domains/gastos/actions";
import { calcularRateioMensal, detectarCategoriasRecorrentes, calcularGastosPorCategoria } from "@/lib/calculos";
import { usuarioService } from "@/domains/usuarios/services";
import { configuracaoRepository } from "@/domains/configuracao/repositories";

export default async function ResumoPage() {
  const gastos = await getGastos();
  const configuracao = await configuracaoRepository.get();
  const usuarios = await usuarioService.getAll();

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const gastosParaCalculo = gastos.map(g => ({
    tipo: g.tipo,
    valor: g.valor,
    data: g.data,
    categoria: g.categoria
  }));

  const percentualRodrigo = configuracao?.percentualRodrigo || 62.5;
  const percentualGiovana = configuracao?.percentualGiovana || 37.5;

  const rateio = calcularRateioMensal(
    gastosParaCalculo,
    percentualRodrigo,
    percentualGiovana,
    currentYear,
    currentMonth
  );

  const categoriasRecorrentes = detectarCategoriasRecorrentes(gastosParaCalculo);
  const gastosPorCategoria = calcularGastosPorCategoria(gastosParaCalculo, currentYear, currentMonth);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentual = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getMonthName = (month: number) => {
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return months[month - 1];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Resumo Mensal</h1>
          <p className="text-gray-600">
            {getMonthName(currentMonth)} de {currentYear}
          </p>
          <a
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Voltar
          </a>
        </header>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-sm font-semibold text-gray-600 mb-2">Total Compartilhado</h2>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(rateio.totalCompartilhado)}</p>
          </div>

          <div className={`bg-white rounded-lg shadow-md p-6 ${rateio.giovanaDevePagar ? 'border-l-4 border-blue-500' : 'border-l-4 border-red-500'}`}>
            <h2 className="text-sm font-semibold text-gray-600 mb-2">
              {rateio.giovanaDevePagar ? 'Giovana deve pagar' : 'Rodrigo deve pagar'}
            </h2>
            <p className={`text-2xl font-bold ${rateio.giovanaDevePagar ? 'text-blue-600' : 'text-red-600'}`}>
              {formatCurrency(Math.abs(rateio.parteGiovana))}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-sm font-semibold text-gray-600 mb-2">Parte Rodrigo (Informativo)</h2>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(rateio.parteRodrigo)}</p>
          </div>
        </div>

        {/* Configuração de Rateio */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Configuração de Rateio</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Percentual Rodrigo</p>
              <p className="text-xl font-bold">{formatPercentual(percentualRodrigo)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Percentual Giovana</p>
              <p className="text-xl font-bold">{formatPercentual(percentualGiovana)}</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Baseado nos salários: Rodrigo {formatCurrency(usuarios.find(u => u.nome === 'Rodrigo')?.salario || 0)} 
            vs Giovana {formatCurrency(usuarios.find(u => u.nome === 'Giovana')?.salario || 0)}
          </div>
        </div>

        {/* Gastos por Categoria */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Gastos por Categoria ({getMonthName(currentMonth)})</h2>
          {gastosPorCategoria.length === 0 ? (
            <p className="text-gray-500">Nenhum gasto neste mês</p>
          ) : (
            <div className="space-y-3">
              {gastosPorCategoria.map((item) => (
                <div key={item.categoria}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.categoria}</span>
                    <span className="font-medium">{formatCurrency(item.valor)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Categorias Recorrentes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Categorias Recorrentes (≥ 6 meses)</h2>
          {categoriasRecorrentes.length === 0 ? (
            <p className="text-gray-500">Nenhuma categoria recorrente detectada</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categoriasRecorrentes.map((categoria) => (
                <span
                  key={categoria}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {categoria}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}