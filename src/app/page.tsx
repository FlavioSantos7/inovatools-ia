"use client"

import { useState, useEffect } from "react"
import { Sparkles, Image, Video, Mic, FileText, Briefcase, Zap, Star, Crown, Check, X, Menu, ChevronRight, Upload, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import { registerServiceWorker } from "@/lib/pwa-utils"

const categories = [
  {
    id: "image",
    name: "Edição de Imagem",
    icon: Image,
    color: "from-purple-500 to-pink-500",
    tools: [
      { name: "Remover Fundo de Imagem", credits: 25, popular: true },
      { name: "Melhorar Qualidade / Upscale 4K", credits: 40, popular: true },
      { name: "Transformar Foto em Desenho / Anime", credits: 50, popular: true },
      { name: "Criar Avatar IA", credits: 35 },
      { name: "Gerador de Fotos de Perfil Profissional", credits: 30 },
      { name: "Envelhecer ou Rejuvenescer Fotos", credits: 45 },
      { name: "Trocar Rosto em Fotos (Face Swap)", credits: 60 },
      { name: "Criar Foto Estilo Pixar", credits: 50 },
      { name: "Transformar Selfie em Foto de Estúdio", credits: 40 },
      { name: "Restaurar Fotos Antigas", credits: 70 },
      { name: "Criar Memes Automáticos", credits: 15 },
      { name: "Criar Arte Estilo IA", credits: 35 },
      { name: "Compressão Automática de Imagens", credits: 20 },
      { name: "Remover Objetos de Imagens", credits: 55 },
      { name: "Reiluminar Fotos", credits: 45 },
    ]
  },
  {
    id: "video",
    name: "Vídeo / Reels / Shorts",
    icon: Video,
    color: "from-cyan-500 to-blue-600",
    tools: [
      { name: "Criar Reels Automáticos a partir de texto", credits: 50, popular: true },
      { name: "Melhorar Qualidade de Vídeos", credits: 40 },
      { name: "Cortar Silêncio e Pausas", credits: 25 },
      { name: "Legenda Inteligente para Vídeos", credits: 30, popular: true },
      { name: "Criar Shorts Automáticos de Vídeos Longos", credits: 60 },
      { name: "Transformar Texto em Vídeo", credits: 75 },
      { name: "Criar Slideshows Automáticos", credits: 35 },
      { name: "Lip Sync IA", credits: 50 },
      { name: "Criar Video Motivacional Automático", credits: 60 },
      { name: "Transformar Vídeos em Animação", credits: 80 },
    ]
  },
  {
    id: "audio",
    name: "Áudio / Voz",
    icon: Mic,
    color: "from-emerald-400 to-teal-600",
    tools: [
      { name: "Remover Ruído e Melhorar Áudio", credits: 30, popular: true },
      { name: "Gerador de Voz IA", credits: 40, popular: true },
      { name: "Dublagem Automática para Português", credits: 45 },
      { name: "Transformar Texto em Narração Profissional", credits: 50 },
      { name: "Transformar Voz em Outra Voz", credits: 60 },
      { name: "Criar Música Lo-Fi Automática", credits: 45 },
      { name: "Gerar Voz de Narrador para Reels", credits: 35 },
    ]
  },
  {
    id: "text",
    name: "Texto / Copy / Social Media",
    icon: FileText,
    color: "from-orange-400 to-pink-600",
    tools: [
      { name: "Criador de Legendas Virais para Instagram", credits: 20, popular: true },
      { name: "Gerador de Títulos para YouTube", credits: 15 },
      { name: "Criador de Scripts para Reels/TikTok", credits: 30, popular: true },
      { name: "Gerador de Posts Prontos", credits: 20 },
      { name: "Gerador de Threads para Twitter/X", credits: 25 },
      { name: "Criador Automático de E-books", credits: 60 },
      { name: "Gerador de Artigo Completo", credits: 70 },
      { name: "Criador de e-mail automático", credits: 25 },
      { name: "Reescritor de Textos Profissionais", credits: 40 },
      { name: "Gerador de Frases Motivacionais", credits: 15 },
      { name: "Criador de Prompts para IA", credits: 30 },
    ]
  },
  {
    id: "productivity",
    name: "Produtividade / Negócios",
    icon: Briefcase,
    color: "from-blue-500 to-indigo-600",
    tools: [
      { name: "Criar Site Automático (1 clique)", credits: 80, popular: true },
      { name: "Criador de Landing Page", credits: 65 },
      { name: "Gerador de Logotipo Automático", credits: 50 },
      { name: "Criador de Currículo + Carta de Apresentação", credits: 35 },
      { name: "Criador de Contratos Básicos", credits: 45 },
      { name: "Organizador Inteligente de Estudos", credits: 25 },
      { name: "Criador de PDFs Automatizados", credits: 35 },
    ]
  },
]

const plans = [
  {
    name: "Básico",
    price: "29,90",
    credits: 500,
    features: [
      "500 créditos mensais",
      "Acesso a todas as ferramentas",
      "Suporte por email",
      "Exportação com marca d'água",
    ],
    notIncluded: [
      "Créditos ilimitados",
      "Exportação sem marca d'água",
      "Suporte prioritário",
    ],
    color: "from-gray-500 to-gray-600",
    icon: Zap,
  },
  {
    name: "Intermediário",
    price: "79,90",
    credits: 2000,
    features: [
      "2000 créditos mensais",
      "Acesso a todas as ferramentas",
      "Suporte prioritário",
      "Exportação com marca d'água",
      "Histórico de projetos",
    ],
    notIncluded: [
      "Créditos ilimitados",
      "Exportação sem marca d'água",
    ],
    color: "from-blue-500 to-indigo-600",
    icon: Star,
    popular: true,
  },
  {
    name: "Premium",
    price: "149,90",
    credits: "Ilimitados",
    features: [
      "Créditos ILIMITADOS",
      "Acesso a todas as ferramentas",
      "Suporte VIP 24/7",
      "Exportação SEM marca d'água",
      "Ferramentas exclusivas",
      "Acesso antecipado a novidades",
      "Comunidade exclusiva",
    ],
    notIncluded: [],
    color: "from-amber-400 to-orange-500",
    icon: Crown,
    recommended: true,
  },
]

const creditPackages = [
  { credits: 500, price: "19,90" },
  { credits: 2000, price: "59,90", popular: true },
  { credits: 5000, price: "129,90" },
]

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(categories[0])
  const [userCredits, setUserCredits] = useState(50) // Créditos iniciais grátis
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [showToolDialog, setShowToolDialog] = useState(false)
  const [selectedTool, setSelectedTool] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [toolInput, setToolInput] = useState("")
  const [toolResult, setToolResult] = useState("")

  useEffect(() => {
    // Registra o Service Worker
    registerServiceWorker()
    
    // Simula login automático para demonstração
    const hasVisited = localStorage.getItem('hasVisited')
    if (!hasVisited) {
      localStorage.setItem('hasVisited', 'true')
      setUserCredits(50) // Dá 50 créditos grátis na primeira visita
    } else {
      const savedCredits = localStorage.getItem('userCredits')
      if (savedCredits) {
        setUserCredits(parseInt(savedCredits))
      }
    }
    setIsLoggedIn(true)
  }, [])

  useEffect(() => {
    // Salva créditos no localStorage
    localStorage.setItem('userCredits', userCredits.toString())
  }, [userCredits])

  const handleToolClick = (tool: any) => {
    if (!isLoggedIn) {
      setShowLoginDialog(true)
      return
    }

    if (userCredits < tool.credits) {
      alert(`Você precisa de ${tool.credits} créditos para usar esta ferramenta. Você tem apenas ${userCredits} créditos.`)
      return
    }

    setSelectedTool(tool)
    setToolInput("")
    setToolResult("")
    setShowToolDialog(true)
  }

  const handleProcessTool = async () => {
    if (!selectedTool || !toolInput.trim()) {
      alert("Por favor, forneça os dados necessários para processar.")
      return
    }

    setIsProcessing(true)
    
    // Simula processamento da ferramenta
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Deduz créditos
    setUserCredits(prev => prev - selectedTool.credits)
    
    // Gera resultado simulado
    setToolResult(`✅ Processamento concluído com sucesso!\n\nSua ${selectedTool.name.toLowerCase()} foi criada e está pronta para download.\n\nCréditos utilizados: ${selectedTool.credits}\nCréditos restantes: ${userCredits - selectedTool.credits}`)
    
    setIsProcessing(false)
  }

  const handleLogin = () => {
    setIsLoggedIn(true)
    setShowLoginDialog(false)
    setUserCredits(50) // Dá 50 créditos grátis ao fazer login
  }

  const handleBuyCredits = (credits: number) => {
    setUserCredits(prev => prev + credits)
    alert(`✅ ${credits} créditos adicionados com sucesso!\n\nTotal de créditos: ${userCredits + credits}`)
  }

  const handleSelectPlan = (plan: any) => {
    if (typeof plan.credits === 'number') {
      setUserCredits(plan.credits)
    } else {
      setUserCredits(999999) // Créditos "ilimitados"
    }
    alert(`✅ Plano ${plan.name} ativado com sucesso!\n\nSeus créditos foram atualizados.`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bem-vindo ao InovaTools.AI</DialogTitle>
            <DialogDescription>
              Faça login para começar a usar as ferramentas e ganhar 50 créditos grátis!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="seu@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
            <Button onClick={handleLogin} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
              Entrar e Ganhar 50 Créditos Grátis
            </Button>
            <p className="text-xs text-center text-slate-600 dark:text-slate-400">
              Não tem conta? Ao fazer login você cria uma automaticamente.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tool Dialog */}
      <Dialog open={showToolDialog} onOpenChange={setShowToolDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedTool?.name}</DialogTitle>
            <DialogDescription>
              Esta ferramenta custa {selectedTool?.credits} créditos. Você tem {userCredits} créditos disponíveis.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {!toolResult ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="toolInput">
                    {selectedTool?.name.includes("Imagem") || selectedTool?.name.includes("Foto") 
                      ? "Faça upload da imagem ou cole a URL" 
                      : selectedTool?.name.includes("Vídeo") 
                      ? "Faça upload do vídeo ou cole a URL"
                      : "Digite o texto ou instruções"}
                  </Label>
                  <Textarea 
                    id="toolInput"
                    value={toolInput}
                    onChange={(e) => setToolInput(e.target.value)}
                    placeholder={
                      selectedTool?.name.includes("Imagem") || selectedTool?.name.includes("Foto")
                        ? "Cole a URL da imagem ou clique para fazer upload..."
                        : selectedTool?.name.includes("Vídeo")
                        ? "Cole a URL do vídeo ou clique para fazer upload..."
                        : "Digite suas instruções aqui..."
                    }
                    rows={6}
                    className="resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setToolInput("https://exemplo.com/arquivo.jpg")}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Fazer Upload
                  </Button>
                </div>
                <Button 
                  onClick={handleProcessTool} 
                  disabled={isProcessing || !toolInput.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Processar ({selectedTool?.credits} créditos)
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <pre className="whitespace-pre-wrap text-sm text-green-900 dark:text-green-100">
                    {toolResult}
                  </pre>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setToolResult("")
                      setToolInput("")
                    }}
                  >
                    Processar Novamente
                  </Button>
                  <Button 
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    onClick={() => setShowToolDialog(false)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Baixar Resultado
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  InovaTools.AI
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400 hidden sm:block">
                  Transforme suas ideias em realidade
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200 dark:border-amber-800">
                <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="font-bold text-amber-900 dark:text-amber-100">{userCredits}</span>
                <span className="text-xs text-amber-700 dark:text-amber-300 hidden sm:inline">créditos</span>
              </div>
              
              {!isLoggedIn ? (
                <Button 
                  onClick={() => setShowLoginDialog(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                >
                  Entrar
                </Button>
              ) : (
                <Button 
                  variant="outline"
                  className="hidden sm:inline-flex"
                >
                  Minha Conta
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 sm:mb-6 px-4 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
            🚀 Mais de 50 ferramentas de IA em um só lugar
          </Badge>
          
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-slate-900 via-purple-900 to-pink-900 dark:from-slate-100 dark:via-purple-100 dark:to-pink-100 bg-clip-text text-transparent leading-tight">
            Crie Conteúdo Viral em
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Segundos com IA
            </span>
          </h2>
          
          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-400 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Edite imagens, crie vídeos virais, gere textos persuasivos e muito mais. 
            Tudo que você precisa para dominar as redes sociais.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <Button 
              size="lg" 
              onClick={() => !isLoggedIn ? setShowLoginDialog(true) : document.getElementById('tools-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {isLoggedIn ? 'Explorar Ferramentas' : 'Começar Gratuitamente'}
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 hover:bg-slate-50 dark:hover:bg-slate-800">
              Ver Demonstração
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="mt-8 sm:mt-12 flex flex-wrap justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>50 créditos grátis</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Cancele quando quiser</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Suporte em português</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools-section" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-slate-900/50">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4">
              Mais de 50 Ferramentas Poderosas
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Escolha a categoria e descubra ferramentas incríveis
            </p>
          </div>

          <Tabs defaultValue="image" className="w-full">
            <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 h-auto bg-transparent mb-8">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="flex flex-col sm:flex-row items-center gap-2 p-3 sm:p-4 data-[state=active]:bg-gradient-to-r data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${category.color.split(' ')[0].replace('from-', '')}, ${category.color.split(' ')[1].replace('to-', '')})`
                    }}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs sm:text-sm font-medium text-center">{category.name}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {category.tools.map((tool, index) => (
                    <Card key={index} className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 hover:border-purple-200 dark:hover:border-purple-800">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base sm:text-lg">{tool.name}</CardTitle>
                          {tool.popular && (
                            <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 text-xs">
                              Popular
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="flex items-center gap-2 mt-2">
                          <Zap className="w-4 h-4 text-amber-500" />
                          <span className="font-bold text-amber-600 dark:text-amber-400">{tool.credits} créditos</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button 
                          onClick={() => handleToolClick(tool)}
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        >
                          Usar Ferramenta
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4">
              Planos que Cabem no Seu Bolso
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Escolha o plano ideal para suas necessidades
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {plans.map((plan, index) => {
              const Icon = plan.icon
              return (
                <Card
                  key={index}
                  className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                    plan.recommended ? 'border-4 border-amber-400 shadow-2xl shadow-amber-500/20' : 'hover:shadow-xl'
                  }`}
                >
                  {plan.recommended && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-1 text-xs font-bold rounded-bl-lg">
                      RECOMENDADO
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-sm text-slate-600 dark:text-slate-400">R$</span>
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">/mês</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                      {typeof plan.credits === 'number' ? `${plan.credits} créditos` : plan.credits}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                      {plan.notIncluded.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2 opacity-50">
                          <X className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button
                      onClick={() => handleSelectPlan(plan)}
                      className={`w-full ${
                        plan.recommended
                          ? 'bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shadow-lg'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                      }`}
                    >
                      {plan.recommended ? 'Começar Agora' : 'Escolher Plano'}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Credit Packages */}
          <div className="text-center mb-8">
            <h4 className="text-xl sm:text-2xl font-bold mb-2">Ou Compre Créditos Avulsos</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Sem compromisso mensal, pague apenas pelo que usar
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {creditPackages.map((pkg, index) => (
              <Card key={index} className={`hover:shadow-xl transition-all duration-300 hover:scale-105 ${pkg.popular ? 'border-2 border-purple-400' : ''}`}>
                <CardHeader className="text-center">
                  {pkg.popular && (
                    <Badge className="mb-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 mx-auto">
                      Mais Popular
                    </Badge>
                  )}
                  <CardTitle className="text-3xl font-bold">{pkg.credits}</CardTitle>
                  <CardDescription>créditos</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    R$ {pkg.price}
                  </div>
                  <Button 
                    onClick={() => handleBuyCredits(pkg.credits)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    Comprar Agora
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-4xl font-bold mb-4">
              Por Que Escolher InovaTools.AI?
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                icon: Sparkles,
                title: "IA de Última Geração",
                description: "Tecnologia de ponta para resultados profissionais",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: Zap,
                title: "Resultados em Segundos",
                description: "Crie conteúdo viral em poucos cliques",
                color: "from-cyan-500 to-blue-600"
              },
              {
                icon: Star,
                title: "Qualidade Premium",
                description: "Exportações em alta resolução sem perda",
                color: "from-amber-400 to-orange-500"
              },
              {
                icon: Crown,
                title: "Suporte Dedicado",
                description: "Equipe pronta para ajudar 24/7",
                color: "from-emerald-400 to-teal-600"
              },
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2">
                  <CardHeader>
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <Card className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 border-0 shadow-2xl">
            <CardContent className="p-8 sm:p-12 text-center text-white">
              <h3 className="text-2xl sm:text-4xl font-bold mb-4">
                Pronto para Transformar Suas Ideias?
              </h3>
              <p className="text-lg sm:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Junte-se a milhares de criadores que já estão criando conteúdo viral com InovaTools.AI
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => !isLoggedIn ? setShowLoginDialog(true) : document.getElementById('tools-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white text-purple-600 hover:bg-slate-100 shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {isLoggedIn ? 'Começar a Criar' : 'Começar Gratuitamente'}
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
                  Falar com Vendas
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">InovaTools.AI</span>
          </div>
          <p className="text-slate-400 text-sm mb-4">
            Transforme suas ideias em criações impressionantes
          </p>
          <p className="text-slate-500 text-xs">
            © 2024 InovaTools.AI. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
