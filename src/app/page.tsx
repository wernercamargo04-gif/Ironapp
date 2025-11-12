"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { User, Target, Clock, Dumbbell, CheckCircle, RotateCcw } from 'lucide-react'

const formSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  age: z.number().min(16, 'Idade mínima 16 anos').max(80, 'Idade máxima 80 anos'),
  weight: z.number().min(40, 'Peso mínimo 40kg').max(200, 'Peso máximo 200kg'),
  height: z.number().min(140, 'Altura mínima 140cm').max(220, 'Altura máxima 220cm'),
  goal: z.string().min(1, 'Selecione um objetivo'),
  level: z.string().min(1, 'Selecione seu nível'),
  timeAvailable: z.string().min(1, 'Selecione o tempo disponível'),
  daysPerWeek: z.string().min(1, 'Selecione quantos dias por semana'),
  equipment: z.array(z.string()).min(1, 'Selecione pelo menos um equipamento'),
  limitations: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

interface Exercise {
  name: string
  sets: string
  reps: string
  rest: string
  muscle: string
  tips: string
}

interface WorkoutPlan {
  title: string
  duration: string
  frequency: string
  exercises: Exercise[]
  tips: string[]
}

export default function WorkoutGenerator() {
  const [currentStep, setCurrentStep] = useState<'form' | 'workout'>('form')
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      equipment: [],
      limitations: '',
    }
  })

  const generateWorkout = (data: FormData): WorkoutPlan => {
    const { goal, level, timeAvailable, daysPerWeek, equipment, age, weight } = data

    // Base de exercícios por categoria
    const exerciseDatabase = {
      strength: {
        beginner: [
          { name: 'Agachamento', sets: '3', reps: '12-15', rest: '60s', muscle: 'Pernas', tips: 'Mantenha o peito erguido e joelhos alinhados' },
          { name: 'Flexão (joelhos)', sets: '3', reps: '8-12', rest: '60s', muscle: 'Peito/Tríceps', tips: 'Comece com joelhos apoiados se necessário' },
          { name: 'Prancha', sets: '3', reps: '20-30s', rest: '45s', muscle: 'Core', tips: 'Mantenha o corpo reto como uma tábua' },
          { name: 'Remada com elástico', sets: '3', reps: '12-15', rest: '60s', muscle: 'Costas', tips: 'Puxe os ombros para trás' },
        ],
        intermediate: [
          { name: 'Agachamento com peso', sets: '4', reps: '10-12', rest: '90s', muscle: 'Pernas', tips: 'Use halteres ou barra para resistência' },
          { name: 'Flexão tradicional', sets: '3', reps: '12-15', rest: '60s', muscle: 'Peito/Tríceps', tips: 'Desça até o peito quase tocar o chão' },
          { name: 'Prancha lateral', sets: '3', reps: '30-45s', rest: '60s', muscle: 'Core', tips: 'Alterne os lados a cada série' },
          { name: 'Desenvolvimento com halteres', sets: '3', reps: '10-12', rest: '90s', muscle: 'Ombros', tips: 'Controle o movimento na descida' },
          { name: 'Afundo', sets: '3', reps: '10 cada perna', rest: '75s', muscle: 'Pernas', tips: 'Mantenha o tronco ereto' },
        ],
        advanced: [
          { name: 'Agachamento búlgaro', sets: '4', reps: '8-10 cada perna', rest: '90s', muscle: 'Pernas', tips: 'Foque na perna da frente' },
          { name: 'Flexão diamante', sets: '4', reps: '8-12', rest: '75s', muscle: 'Tríceps', tips: 'Mãos formam um diamante' },
          { name: 'Prancha com elevação', sets: '3', reps: '45-60s', rest: '60s', muscle: 'Core', tips: 'Eleve alternadamente braços e pernas' },
          { name: 'Burpee', sets: '4', reps: '8-10', rest: '90s', muscle: 'Corpo todo', tips: 'Movimento explosivo' },
          { name: 'Pistol squat assistido', sets: '3', reps: '5-8 cada perna', rest: '120s', muscle: 'Pernas', tips: 'Use apoio se necessário' },
        ]
      },
      weight_loss: {
        beginner: [
          { name: 'Caminhada no lugar', sets: '3', reps: '2 min', rest: '30s', muscle: 'Cardio', tips: 'Eleve bem os joelhos' },
          { name: 'Agachamento', sets: '3', reps: '15-20', rest: '45s', muscle: 'Pernas', tips: 'Movimento controlado' },
          { name: 'Jumping jacks', sets: '3', reps: '30s', rest: '30s', muscle: 'Cardio', tips: 'Mantenha ritmo constante' },
          { name: 'Prancha', sets: '3', reps: '20-30s', rest: '45s', muscle: 'Core', tips: 'Respire normalmente' },
        ],
        intermediate: [
          { name: 'Burpee modificado', sets: '4', reps: '8-10', rest: '60s', muscle: 'Corpo todo', tips: 'Sem pulo se necessário' },
          { name: 'Mountain climbers', sets: '4', reps: '30s', rest: '45s', muscle: 'Cardio/Core', tips: 'Movimento rápido' },
          { name: 'Agachamento com salto', sets: '3', reps: '12-15', rest: '60s', muscle: 'Pernas', tips: 'Aterrisse suavemente' },
          { name: 'Prancha dinâmica', sets: '3', reps: '20 rep', rest: '60s', muscle: 'Core', tips: 'Suba e desça dos cotovelos' },
        ],
        advanced: [
          { name: 'HIIT Circuit', sets: '5', reps: '45s on/15s off', rest: '2min entre rounds', muscle: 'Corpo todo', tips: 'Máxima intensidade' },
          { name: 'Burpee com flexão', sets: '4', reps: '10-12', rest: '75s', muscle: 'Corpo todo', tips: 'Adicione flexão no movimento' },
          { name: 'Tabata squats', sets: '4', reps: '20s on/10s off', rest: '60s', muscle: 'Pernas', tips: 'Máxima velocidade' },
          { name: 'Prancha com toque', sets: '4', reps: '30-45s', rest: '60s', muscle: 'Core', tips: 'Toque ombros alternadamente' },
        ]
      },
      muscle_gain: {
        beginner: [
          { name: 'Agachamento', sets: '4', reps: '8-10', rest: '90s', muscle: 'Pernas', tips: 'Foque na forma correta' },
          { name: 'Flexão inclinada', sets: '3', reps: '8-12', rest: '75s', muscle: 'Peito', tips: 'Use banco ou superfície elevada' },
          { name: 'Remada curvada', sets: '3', reps: '10-12', rest: '90s', muscle: 'Costas', tips: 'Aperte as escápulas' },
          { name: 'Desenvolvimento', sets: '3', reps: '8-10', rest: '90s', muscle: 'Ombros', tips: 'Não trave os cotovelos' },
        ],
        intermediate: [
          { name: 'Agachamento com pausa', sets: '4', reps: '6-8', rest: '120s', muscle: 'Pernas', tips: 'Pause 2s embaixo' },
          { name: 'Flexão com peso', sets: '4', reps: '8-10', rest: '90s', muscle: 'Peito', tips: 'Use mochila com peso' },
          { name: 'Remada unilateral', sets: '4', reps: '8-10 cada braço', rest: '90s', muscle: 'Costas', tips: 'Foque na contração' },
          { name: 'Desenvolvimento Arnold', sets: '3', reps: '8-10', rest: '90s', muscle: 'Ombros', tips: 'Rotação completa' },
          { name: 'Afundo com peso', sets: '4', reps: '8-10 cada perna', rest: '90s', muscle: 'Pernas', tips: 'Descida controlada' },
        ],
        advanced: [
          { name: 'Agachamento pistol', sets: '4', reps: '5-8 cada perna', rest: '120s', muscle: 'Pernas', tips: 'Uma perna só' },
          { name: 'Flexão archer', sets: '4', reps: '6-8 cada lado', rest: '90s', muscle: 'Peito', tips: 'Peso em um braço' },
          { name: 'Muscle-up assistido', sets: '4', reps: '3-5', rest: '120s', muscle: 'Costas/Braços', tips: 'Use elástico se necessário' },
          { name: 'Handstand push-up', sets: '3', reps: '3-6', rest: '120s', muscle: 'Ombros', tips: 'Use parede para apoio' },
        ]
      }
    }

    // Seleciona exercícios baseado no objetivo e nível
    const goalKey = goal as keyof typeof exerciseDatabase
    const levelKey = level as keyof typeof exerciseDatabase[typeof goalKey]
    const selectedExercises = exerciseDatabase[goalKey]?.[levelKey] || exerciseDatabase.strength.beginner

    // Ajusta baseado no tempo disponível
    const exerciseCount = timeAvailable === '30' ? 4 : timeAvailable === '45' ? 5 : 6
    const finalExercises = selectedExercises.slice(0, exerciseCount)

    // Gera dicas personalizadas
    const tips = [
      `Baseado na sua idade (${age} anos), mantenha boa hidratação durante o treino`,
      `Com ${daysPerWeek} por semana, você terá ótimos resultados em 4-6 semanas`,
      'Aumente a intensidade gradualmente a cada semana',
      'Descanse pelo menos 1 dia entre treinos intensos',
      'Mantenha uma alimentação balanceada para potencializar os resultados'
    ]

    if (goal === 'weight_loss') {
      tips.push('Para perda de peso, combine com déficit calórico moderado')
    } else if (goal === 'muscle_gain') {
      tips.push('Para ganho de massa, mantenha superávit calórico e proteína adequada')
    }

    return {
      title: `Treino Personalizado - ${goal === 'weight_loss' ? 'Emagrecimento' : goal === 'muscle_gain' ? 'Ganho de Massa' : 'Fortalecimento'}`,
      duration: `${timeAvailable} minutos`,
      frequency: `${daysPerWeek} por semana`,
      exercises: finalExercises,
      tips: tips.slice(0, 4)
    }
  }

  const onSubmit = (data: FormData) => {
    const workout = generateWorkout(data)
    setWorkoutPlan(workout)
    setCurrentStep('workout')
  }

  const resetForm = () => {
    setCurrentStep('form')
    setWorkoutPlan(null)
    form.reset()
  }

  if (currentStep === 'workout' && workoutPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
              <CheckCircle className="text-green-500" />
              Seu Treino Personalizado
            </h1>
            <p className="text-gray-600">Treino criado especialmente para você!</p>
          </div>

          {/* Workout Info */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl">{workoutPlan.title}</CardTitle>
              <CardDescription className="text-blue-100">
                {workoutPlan.duration} • {workoutPlan.frequency}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6">
                {/* Exercises */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Dumbbell className="text-blue-500" />
                    Exercícios
                  </h3>
                  <div className="grid gap-4">
                    {workoutPlan.exercises.map((exercise, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg text-gray-900">{exercise.name}</h4>
                            <Badge variant="secondary" className="mt-1">{exercise.muscle}</Badge>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Séries:</span> {exercise.sets}
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Reps:</span> {exercise.reps}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {exercise.rest}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2 italic">{exercise.tips}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Tips */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Target className="text-green-500" />
                    Dicas Importantes
                  </h3>
                  <div className="grid gap-3">
                    {workoutPlan.tips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={resetForm} variant="outline" size="lg" className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Criar Novo Treino
            </Button>
            <Button 
              onClick={() => window.print()} 
              size="lg" 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            >
              Imprimir Treino
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3">
            <Dumbbell className="text-blue-500" />
            Gerador de Treinos
          </h1>
          <p className="text-xl text-gray-600">
            Crie um treino personalizado para suas necessidades
          </p>
        </div>

        {/* Form */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center gap-2">
              <User className="w-6 h-6" />
              Suas Informações
            </CardTitle>
            <CardDescription className="text-blue-100">
              Preencha os dados para gerar seu treino ideal
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    placeholder="Seu nome"
                    {...form.register('name')}
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Idade</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    {...form.register('age', { valueAsNumber: true })}
                  />
                  {form.formState.errors.age && (
                    <p className="text-sm text-red-500">{form.formState.errors.age.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="70"
                    {...form.register('weight', { valueAsNumber: true })}
                  />
                  {form.formState.errors.weight && (
                    <p className="text-sm text-red-500">{form.formState.errors.weight.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="175"
                    {...form.register('height', { valueAsNumber: true })}
                  />
                  {form.formState.errors.height && (
                    <p className="text-sm text-red-500">{form.formState.errors.height.message}</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Goals and Preferences */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Objetivo Principal</Label>
                  <Select onValueChange={(value) => form.setValue('goal', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione seu objetivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weight_loss">Perder Peso</SelectItem>
                      <SelectItem value="muscle_gain">Ganhar Massa Muscular</SelectItem>
                      <SelectItem value="strength">Ganhar Força</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.goal && (
                    <p className="text-sm text-red-500">{form.formState.errors.goal.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Nível de Experiência</Label>
                  <Select onValueChange={(value) => form.setValue('level', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione seu nível" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Iniciante (0-6 meses)</SelectItem>
                      <SelectItem value="intermediate">Intermediário (6 meses - 2 anos)</SelectItem>
                      <SelectItem value="advanced">Avançado (2+ anos)</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.level && (
                    <p className="text-sm text-red-500">{form.formState.errors.level.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tempo Disponível</Label>
                    <Select onValueChange={(value) => form.setValue('timeAvailable', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tempo por treino" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutos</SelectItem>
                        <SelectItem value="45">45 minutos</SelectItem>
                        <SelectItem value="60">60 minutos</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.timeAvailable && (
                      <p className="text-sm text-red-500">{form.formState.errors.timeAvailable.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Frequência Semanal</Label>
                    <Select onValueChange={(value) => form.setValue('daysPerWeek', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Dias por semana" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3 dias">3 dias por semana</SelectItem>
                        <SelectItem value="4 dias">4 dias por semana</SelectItem>
                        <SelectItem value="5 dias">5 dias por semana</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.daysPerWeek && (
                      <p className="text-sm text-red-500">{form.formState.errors.daysPerWeek.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Equipment */}
              <div className="space-y-3">
                <Label>Equipamentos Disponíveis (selecione pelo menos um)</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Peso corporal',
                    'Halteres',
                    'Elásticos',
                    'Barra fixa',
                    'Kettlebell',
                    'Barra e anilhas'
                  ].map((equipment) => (
                    <div key={equipment} className="flex items-center space-x-2">
                      <Checkbox
                        id={equipment}
                        onCheckedChange={(checked) => {
                          const current = form.getValues('equipment') || []
                          if (checked) {
                            form.setValue('equipment', [...current, equipment])
                          } else {
                            form.setValue('equipment', current.filter(item => item !== equipment))
                          }
                        }}
                      />
                      <Label htmlFor={equipment} className="text-sm font-normal">
                        {equipment}
                      </Label>
                    </div>
                  ))}
                </div>
                {form.formState.errors.equipment && (
                  <p className="text-sm text-red-500">{form.formState.errors.equipment.message}</p>
                )}
              </div>

              {/* Limitations */}
              <div className="space-y-2">
                <Label htmlFor="limitations">Limitações ou Lesões (opcional)</Label>
                <Textarea
                  id="limitations"
                  placeholder="Descreva qualquer limitação física, lesão ou exercício que deve evitar..."
                  {...form.register('limitations')}
                />
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-lg py-6"
              >
                <Target className="w-5 h-5 mr-2" />
                Gerar Meu Treino Personalizado
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}