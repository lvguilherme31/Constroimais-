import { Employee } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DetailRow } from '@/components/DetailRow'
import { DollarSign, Landmark } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

interface ColaboradorFinanceiroTabProps {
  employee: Employee
}

export function ColaboradorFinanceiroTab({
  employee,
}: ColaboradorFinanceiroTabProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" /> Dados Salariais
          </CardTitle>
        </CardHeader>
        <CardContent>
          {employee.tipoRemuneracao === 'production' ? (
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground block mb-1">
                    Tipo de Remuneração
                  </span>
                  <span className="text-lg font-semibold text-foreground">
                    Por Produção
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground block mb-1">
                    Valor Total a Receber
                  </span>
                  <span className="text-2xl font-bold text-emerald-600">
                    {employee.producaoValorTotal
                      ? employee.producaoValorTotal.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })
                      : 'R$ 0,00'}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground block mb-1">
                    Quantidade/Unidades
                  </span>
                  <span className="text-lg font-semibold text-foreground">
                    {employee.producaoQuantidade || 0}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground block mb-1">
                    Valor Unitário
                  </span>
                  <span className="text-lg font-semibold text-foreground">
                    {employee.producaoValorUnitario
                      ? employee.producaoValorUnitario.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })
                      : 'R$ 0,00'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4">
              <span className="text-sm font-medium text-muted-foreground block mb-1">
                Salário Base
              </span>
              <span className="text-3xl font-bold text-foreground">
                {employee.salary
                  ? employee.salary.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })
                  : 'R$ 0,00'}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Landmark className="h-5 w-5 text-primary" /> Dados Bancários
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DetailRow
            label="Banco"
            value={employee.bankDetails?.bank || 'Não informado'}
          />
          <Separator />
          <DetailRow
            label="Agência"
            value={employee.bankDetails?.agency || 'Não informado'}
          />
          <Separator />
          <DetailRow
            label="Conta"
            value={employee.bankDetails?.account || 'Não informado'}
          />
          <Separator />
          <DetailRow
            label="Chave PIX"
            value={employee.bankDetails?.pix || 'Não informada'}
          />
        </CardContent>
      </Card>
    </div>
  )
}
