import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'

export function ShadcnDemo() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">BE.RICH com shadcn/ui</h1>
          <p className="text-muted-foreground">Design system modernizado com Tailwind CSS</p>
        </div>

        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Botões</CardTitle>
            <CardDescription>Diferentes variações de botões</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Button variant="default">Padrão</Button>
              <Button variant="secondary">Secundário</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Deletar</Button>
            </div>
          </CardContent>
        </Card>

        {/* Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Cartões</CardTitle>
            <CardDescription>Layout de card com componentes shadcn</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Saldo Total', value: 'R$ 12.450,00', icon: '💰' },
                { label: 'Despesas', value: 'R$ 2.340,50', icon: '📊' },
                { label: 'Investimentos', value: 'R$ 16.670,00', icon: '📈' }
              ].map((item, i) => (
                <div key={i} className="border border-border rounded-lg p-4 space-y-2">
                  <div className="text-2xl">{item.icon}</div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="text-lg font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Inputs */}
        <Card>
          <CardHeader>
            <CardTitle>Inputs</CardTitle>
            <CardDescription>Campos de entrada com novo design</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Valor</label>
              <Input placeholder="Digite o valor..." type="number" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição</label>
              <Input placeholder="Descrição do lançamento..." />
            </div>
          </CardContent>
        </Card>

        {/* Badges & Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Badges & Progresso</CardTitle>
            <CardDescription>Indicadores de status e progresso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Status dos lançamentos</p>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="default">Confirmado</Badge>
                <Badge variant="secondary">Pendente</Badge>
                <Badge variant="destructive">Cancelado</Badge>
                <Badge variant="outline">Revisado</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Gastos do mês</p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Alimentação</span>
                  <span>45%</span>
                </div>
                <Progress value={45} />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Transporte</span>
                  <span>25%</span>
                </div>
                <Progress value={25} />
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
