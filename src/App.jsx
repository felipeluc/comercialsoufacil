import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  CreditCard, 
  Calculator, 
  TrendingUp, 
  Users, 
  Building2, 
  Gift,
  ArrowRight,
  CheckCircle,
  XCircle,
  DollarSign,
  Percent,
  Calendar
} from 'lucide-react'
import './App.css'

function App() {
  const [valorCompra, setValorCompra] = useState(300)
  const [parcelas, setParcelas] = useState(4)
  const [numeroVendas, setNumeroVendas] = useState(10)

  // Cálculos do cenário atual
  const calcularCenarioAtual = () => {
    const taxaJuros = valorCompra * 0.065
    const taxaUtilizacao = 14.90
    const custoTotalCliente = taxaJuros + (taxaUtilizacao * parcelas)
    const valorPorParcela = (valorCompra + taxaJuros) / parcelas + taxaUtilizacao
    
    const receitaLojista = (valorCompra * numeroVendas) - (150 * 4) // 4 meses
    const receitaSouFacil = (taxaJuros * numeroVendas) + (taxaUtilizacao * parcelas * numeroVendas) + (150 * 4)
    
    return {
      taxaJuros,
      taxaUtilizacao,
      custoTotalCliente,
      valorPorParcela,
      receitaLojista,
      receitaSouFacil
    }
  }

  // Cálculos do cenário novo
  const calcularCenarioNovo = () => {
    const taxaJuros = valorCompra * 0.065
    const taxaUtilizacao = 10.00
    const custoClubeLojista = 4.99
    const custoTotalCliente = taxaJuros + (taxaUtilizacao * parcelas)
    const valorPorParcela = (valorCompra + taxaJuros) / parcelas + taxaUtilizacao
    
    const custoAdicionalLojista = custoClubeLojista * parcelas * numeroVendas
    const receitaLojista = (valorCompra * numeroVendas) - (150 * 4) - custoAdicionalLojista
    const receitaSouFacil = (taxaJuros * numeroVendas) + (taxaUtilizacao * parcelas * numeroVendas) + (150 * 4) + custoAdicionalLojista
    
    return {
      taxaJuros,
      taxaUtilizacao,
      custoClubeLojista,
      custoTotalCliente,
      valorPorParcela,
      receitaLojista,
      receitaSouFacil,
      custoAdicionalLojista
    }
  }

  const cenarioAtual = calcularCenarioAtual()
  const cenarioNovo = calcularCenarioNovo()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Clube de Benefícios SouFácil Card</h1>
                <p className="text-gray-600">Nova proposta para melhorar vendas e satisfação do cliente</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Gift className="h-4 w-4 mr-2" />
              Novo Produto
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="simulacao" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="simulacao" className="flex items-center space-x-2">
              <Calculator className="h-4 w-4" />
              <span>Simulação</span>
            </TabsTrigger>
            <TabsTrigger value="cliente" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Cliente</span>
            </TabsTrigger>
            <TabsTrigger value="lojista" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>Lojista</span>
            </TabsTrigger>
            <TabsTrigger value="soufacil" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>SouFácil</span>
            </TabsTrigger>
          </TabsList>

          {/* Aba de Simulação */}
          <TabsContent value="simulacao" className="space-y-8">
            {/* Controles da Simulação */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5" />
                  <span>Parâmetros da Simulação</span>
                </CardTitle>
                <CardDescription>
                  Ajuste os valores para ver o impacto nos diferentes cenários
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="valor">Valor da Compra (R$)</Label>
                    <Input
                      id="valor"
                      type="number"
                      value={valorCompra}
                      onChange={(e) => setValorCompra(Number(e.target.value))}
                      className="text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parcelas">Número de Parcelas</Label>
                    <Input
                      id="parcelas"
                      type="number"
                      value={parcelas}
                      onChange={(e) => setParcelas(Number(e.target.value))}
                      className="text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vendas">Vendas do Lojista (mês)</Label>
                    <Input
                      id="vendas"
                      type="number"
                      value={numeroVendas}
                      onChange={(e) => setNumeroVendas(Number(e.target.value))}
                      className="text-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comparação Antes vs Depois */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Cenário Atual */}
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <XCircle className="h-5 w-5 text-red-600" />
                      <span>Cenário Atual</span>
                    </span>
                    <Badge variant="destructive">Problemas</Badge>
                  </CardTitle>
                  <CardDescription>Como funciona hoje</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Para o Cliente:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Taxa de juros (6.5%):</span>
                        <span className="font-medium">R$ {cenarioAtual.taxaJuros.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxa de utilização/parcela:</span>
                        <span className="font-medium">R$ {cenarioAtual.taxaUtilizacao.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-semibold">Custo total:</span>
                        <span className="font-bold text-red-600">R$ {cenarioAtual.custoTotalCliente.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Valor por parcela:</span>
                        <span className="font-bold">R$ {cenarioAtual.valorPorParcela.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 border-t pt-4">
                    <h4 className="font-semibold text-gray-900">Para o Lojista ({numeroVendas} vendas):</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Receita bruta:</span>
                        <span className="font-medium">R$ {(valorCompra * numeroVendas * 4).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mensalidade (4 meses):</span>
                        <span className="font-medium text-red-600">-R$ 600,00</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-semibold">Receita líquida:</span>
                        <span className="font-bold text-green-600">R$ {cenarioAtual.receitaLojista.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cenário Novo */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Cenário Novo</span>
                    </span>
                    <Badge variant="default" className="bg-green-600">Clube de Benefícios</Badge>
                  </CardTitle>
                  <CardDescription>Com o Clube de Benefícios</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Para o Cliente:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Taxa de juros (6.5%):</span>
                        <span className="font-medium">R$ {cenarioNovo.taxaJuros.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxa de utilização/parcela:</span>
                        <span className="font-medium text-green-600">R$ {cenarioNovo.taxaUtilizacao.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-semibold">Custo total:</span>
                        <span className="font-bold text-green-600">R$ {cenarioNovo.custoTotalCliente.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Valor por parcela:</span>
                        <span className="font-bold">R$ {cenarioNovo.valorPorParcela.toFixed(2)}</span>
                      </div>
                      <div className="bg-green-100 p-2 rounded mt-2">
                        <div className="flex items-center space-x-2 text-green-800">
                          <Gift className="h-4 w-4" />
                          <span className="text-xs font-medium">+ Sorteios mensais + Cashback</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 border-t pt-4">
                    <h4 className="font-semibold text-gray-900">Para o Lojista ({numeroVendas} vendas):</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Receita bruta:</span>
                        <span className="font-medium">R$ {(valorCompra * numeroVendas * 4).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mensalidade (4 meses):</span>
                        <span className="font-medium text-red-600">-R$ 600,00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Custo do clube:</span>
                        <span className="font-medium text-red-600">-R$ {cenarioNovo.custoAdicionalLojista.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-semibold">Receita líquida:</span>
                        <span className="font-bold text-green-600">R$ {cenarioNovo.receitaLojista.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Resumo dos Benefícios */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span>Resumo dos Benefícios</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-green-100 p-4 rounded-lg">
                      <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h3 className="font-semibold text-gray-900">Cliente Economiza</h3>
                      <p className="text-2xl font-bold text-green-600">
                        R$ {(cenarioAtual.custoTotalCliente - cenarioNovo.custoTotalCliente).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">por compra + benefícios</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-100 p-4 rounded-lg">
                      <Building2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <h3 className="font-semibold text-gray-900">Lojista Investe</h3>
                      <p className="text-2xl font-bold text-blue-600">
                        R$ {cenarioNovo.custoAdicionalLojista.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">para diferenciar seu cartão</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-100 p-4 rounded-lg">
                      <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <h3 className="font-semibold text-gray-900">SouFácil Ganha</h3>
                      <p className="text-2xl font-bold text-purple-600">
                        +R$ {cenarioNovo.custoAdicionalLojista.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">receita garantida adicional</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Cliente */}
          <TabsContent value="cliente" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Cenário Atual - Cliente */}
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span>Situação Atual do Cliente</span>
                  </CardTitle>
                  <CardDescription>Problemas enfrentados hoje</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <DollarSign className="h-5 w-5 text-red-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Alto Custo por Parcela</h4>
                        <p className="text-sm text-gray-600">
                          R$ 14,90 de taxa de utilização por parcela, gerando custos elevados ao longo do parcelamento.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <XCircle className="h-5 w-5 text-red-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Sem Benefícios Adicionais</h4>
                        <p className="text-sm text-gray-600">
                          O cartão não oferece nenhum tipo de vantagem ou benefício que justifique os custos.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Users className="h-5 w-5 text-red-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Insatisfação com o Produto</h4>
                        <p className="text-sm text-gray-600">
                          Muitos clientes reclamam das taxas, gerando resistência ao uso do cartão.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cenário Novo - Cliente */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Nova Experiência do Cliente</span>
                  </CardTitle>
                  <CardDescription>Benefícios com o Clube</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <DollarSign className="h-5 w-5 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Redução de Custos</h4>
                        <p className="text-sm text-gray-600">
                          Taxa de utilização reduzida para R$ 10,00 por parcela, economia de R$ 4,90 por parcela.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Gift className="h-5 w-5 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Sorteios Mensais</h4>
                        <p className="text-sm text-gray-600">
                          Participação automática em sorteios mensais de vale-compras para usar na loja.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Percent className="h-5 w-5 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Cashback em Compras</h4>
                        <p className="text-sm text-gray-600">
                          Cashback automático em todas as compras acima de R$ 30,00 no cartão da loja.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Percepção de Valor</h4>
                        <p className="text-sm text-gray-600">
                          O cliente vê valor real nos R$ 10,00 pagos, pois recebe benefícios tangíveis em troca.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Resumo dos Benefícios para o Cliente */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>Resumo dos Benefícios para o Cliente</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Vantagens Financeiras</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Economia de R$ 4,90 por parcela</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Cashback em compras acima de R$ 30</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Possibilidade de ganhar vale-compras</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Vantagens Experienciais</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Participação em sorteios mensais</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Sensação de pertencimento ao clube</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Maior satisfação com o produto</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Lojista */}
          <TabsContent value="lojista" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Cenário Atual - Lojista */}
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span>Situação Atual do Lojista</span>
                  </CardTitle>
                  <CardDescription>Desafios enfrentados hoje</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <TrendingUp className="h-5 w-5 text-red-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Baixas Vendas no Cartão</h4>
                        <p className="text-sm text-gray-600">
                          Clientes resistem ao uso do cartão devido às altas taxas, impactando as vendas.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Users className="h-5 w-5 text-red-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Reclamações Constantes</h4>
                        <p className="text-sm text-gray-600">
                          Clientes reclamam das taxas diretamente com o lojista, gerando desgaste na relação.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CreditCard className="h-5 w-5 text-red-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Cartão Sem Diferencial</h4>
                        <p className="text-sm text-gray-600">
                          O cartão da loja não oferece nenhum benefício exclusivo que o diferencie da concorrência.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cenário Novo - Lojista */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Nova Oportunidade para o Lojista</span>
                  </CardTitle>
                  <CardDescription>Vantagens competitivas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Gift className="h-5 w-5 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Cartão com Diferencial</h4>
                        <p className="text-sm text-gray-600">
                          Agora o cartão da loja oferece clube de benefícios exclusivo, criando vantagem competitiva.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <TrendingUp className="h-5 w-5 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Aumento nas Vendas</h4>
                        <p className="text-sm text-gray-600">
                          Clientes mais satisfeitos tendem a usar mais o cartão, aumentando o volume de vendas.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Users className="h-5 w-5 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Melhoria na Satisfação</h4>
                        <p className="text-sm text-gray-600">
                          Menos reclamações e maior satisfação dos clientes com o produto oferecido.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Building2 className="h-5 w-5 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Investimento Controlado</h4>
                        <p className="text-sm text-gray-600">
                          Custo de R$ 4,99 por parcela é um investimento pequeno para grandes benefícios.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Análise Financeira para o Lojista */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  <span>Análise Financeira para o Lojista</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <h3 className="font-semibold text-gray-900">Custo do Clube</h3>
                      <p className="text-2xl font-bold text-blue-600">R$ 4,99</p>
                      <p className="text-sm text-gray-600">por parcela do cliente</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <Percent className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h3 className="font-semibold text-gray-900">ROI Esperado</h3>
                      <p className="text-2xl font-bold text-green-600">+15%</p>
                      <p className="text-sm text-gray-600">aumento nas vendas</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <h3 className="font-semibold text-gray-900">Diferencial</h3>
                      <p className="text-2xl font-bold text-purple-600">Único</p>
                      <p className="text-sm text-gray-600">no mercado local</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba SouFácil */}
          <TabsContent value="soufacil" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Cenário Atual - SouFácil */}
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span>Modelo de Receita Atual</span>
                  </CardTitle>
                  <CardDescription>Dependência do pagamento do cliente</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <DollarSign className="h-5 w-5 text-red-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Receita Variável</h4>
                        <p className="text-sm text-gray-600">
                          Juros (6.5%) e taxas de utilização dependem do pagamento do cliente final.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <XCircle className="h-5 w-5 text-red-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Risco de Inadimplência</h4>
                        <p className="text-sm text-gray-600">
                          Quando clientes não pagam, a SouFácil perde tanto os juros quanto as taxas de utilização.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Calendar className="h-5 w-5 text-red-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Receita Garantida Limitada</h4>
                        <p className="text-sm text-gray-600">
                          Apenas a mensalidade do lojista (R$ 150) é receita garantida e recorrente.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cenário Novo - SouFácil */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Novo Modelo de Receita</span>
                  </CardTitle>
                  <CardDescription>Receita garantida adicional</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <DollarSign className="h-5 w-5 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Receita Mantida</h4>
                        <p className="text-sm text-gray-600">
                          Mantém os mesmos juros (6.5%) e taxas de utilização (agora R$ 10,00).
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Nova Receita Garantida</h4>
                        <p className="text-sm text-gray-600">
                          R$ 4,99 por parcela descontado diretamente do lojista, sem risco de inadimplência.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <TrendingUp className="h-5 w-5 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Crescimento Sustentável</h4>
                        <p className="text-sm text-gray-600">
                          Mais receita garantida permite investimentos em melhorias e expansão do produto.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Análise Estratégica para SouFácil */}
            <Card className="bg-purple-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <span>Análise Estratégica para SouFácil</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Vantagens Financeiras</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Nova fonte de receita garantida</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Redução do risco de inadimplência</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Fluxo de caixa mais previsível</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Margem de contribuição adicional</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Vantagens Estratégicas</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Diferenciação no mercado</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Maior satisfação dos stakeholders</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Potencial de expansão do produto</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Fortalecimento da marca</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-white rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Projeção de Receita Adicional</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-600">Por Parcela</p>
                      <p className="text-lg font-bold text-purple-600">+R$ 4,99</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Por Cliente (4x)</p>
                      <p className="text-lg font-bold text-purple-600">+R$ 19,96</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">10 Clientes/mês</p>
                      <p className="text-lg font-bold text-purple-600">+R$ 199,60</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default App

