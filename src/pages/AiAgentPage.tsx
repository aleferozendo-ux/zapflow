import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import {
  Bot,
  Send,
  Sparkles,
  TrendingUp,
  Users,
  Target,
  MessageSquare,
  DollarSign,
  Lightbulb,
  Copy,
  Check,
  Zap,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

const quickActions = [
  {
    icon: TrendingUp,
    title: 'Analise de Vendas',
    prompt: 'Analise minhas vendas recentes e me de insights para melhorar.',
  },
  {
    icon: Users,
    title: 'Leads Frios',
    prompt: 'Quais leads estao parados a mais de 7 dias e o que devo fazer?',
  },
  {
    icon: Target,
    title: 'Estrategia',
    prompt: 'Sugira estrategias para aumentar a taxa de conversao do meu funil.',
  },
  {
    icon: MessageSquare,
    title: 'Mensagem de Venda',
    prompt: 'Crie uma mensagem persuasiva para recuperar clientes perdidos.',
  },
];

const aiInsights = [
  {
    icon: DollarSign,
    title: 'Oportunidades Perdidas',
    description: 'Voce perdeu 8 oportunidades de venda esta semana. 3 estavam na fase de negociacao.',
    priority: 'high',
  },
  {
    icon: TrendingUp,
    title: 'Melhor Horario',
    description: 'Clientes respondem 40% mais das 18h as 21h. Foque seus contatos nesse periodo.',
    priority: 'medium',
  },
  {
    icon: Users,
    title: 'Clientes VIP',
    description: '5 clientes com potencial de compra recorrente. Tempo medio entre pedidos: 21 dias.',
    priority: 'medium',
  },
];

export function AiAgentPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: `Ola! Sou o **Flux**, seu assistente de inteligencia artificial.\n\nPosso ajudar voce a:\n\n• **Analisar** seus dados de vendas\n• **Sugerir** estrategias de conversao\n• **Criar** mensagens persuasivas\n• **Identificar** oportunidades perdidas\n\nComo posso ajudar voce hoje?`,
        created_at: new Date().toISOString(),
      },
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (message?: string) => {
    const text = message || input.trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const responses = generateAiResponse(text);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setLoading(false);
    }, 1500);
  };

  const generateAiResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('venda') || lowerQuery.includes('faturamento')) {
      return `**Analise de Vendas**\n\nCom base nos seus dados recentes:\n\n• Faturamento este mes: R$ 127.450 (+23% vs mes anterior)\n• Conversao de leads: 18% (+5%)\n• Ticket medio: R$ 1.850\n\n**Sugestoes:**\n1. Aumente o follow-up com leads parados\n2. Foco em clientes que ja compraram (upsell)\n3. Melhor horario para contato: 18h-21h\n\nQuer que eu detalhe algum ponto especifico?`;
    }

    if (lowerQuery.includes('lead') || lowerQuery.includes('cliente')) {
      return `**Analise de Leads**\n\n**Leads parados (+7 dias):** 47 contatos\n\n**Acao recomendada:**\n1. Envie uma mensagem de reativacao\n2. Ofereca um beneficio exclusivo\n3. Pergunte se ainda tem interesse\n\n**Template sugerido:**\n"Ola! Vi que voce demonstrou interesse no [produto] a um tempo. Apenas pasando para avisar que temos uma condicao especial para voce. Ainda faz sentido conversar?"\n\nPosso criar mensagens personalizadas para cada lead?`;
    }

    if (lowerQuery.includes('mensagem') || lowerQuery.includes('texto')) {
      return `**Mensagem Criada**\n\n---\nOla [Nome]!\n\nNotei que voce demonstrou interesse em nossos produtos a algum tempo e nao queria deixar de te avisar: estamos com uma condicao exclusiva esta semana.\n\nComo cliente especial, voce tem:\n• 15% de desconto\n• Frete gratis\n• Garantia estendida\n\nEssa oferta e valida ate sexta-feira. Faz sentido te enviar mais detalhes?\n\nAbraços,\n[Seu nome]\n---\n\n**Dica:** Personalize o [Nome] e ajuste os beneficios conforme seu produto.`;
    }

    if (lowerQuery.includes('estrategia') || lowerQuery.includes('conversao')) {
      return `**Estrategias para Aumentar Conversao**\n\n**1. Follow-up Agressivo**\n72% das vendas acontecem apos o 5o contato. Configure automacoes!\n\n**2. Social Proof**\nAdicione depoimentos nas suas mensagens. "Mais de 500 clientes satisfeitos..."\n\n**3. Urgencia Real**\nCrie ofertas com prazo real. "Apenas 3 unidades disponiveis"\n\n**4. Upsell Inteligente**\nClientes que ja compraram sao 60% mais propensos a comprar novamente.\n\nQuer que eu detalhe como implementar cada uma?`;
    }

    return `Entendi sua pergunta.\n\nBaseado no seu historico, aqui estao algumas observacoes:\n\n1. **Oportunidade identificada**: Seus leads tem mais engajamento quando contatados em ate 2 horas.\n\n2. **Acao sugerida**: Configure um fluxo automatico de resposta.\n\n3. **Resultado esperado**: Aumento de ate 40% na taxa de resposta.\n\nPosso ajudar a implementar isso ou explore outro topico?`;
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatMessage = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-secondary-900 dark:text-white font-semibold">$1</strong>')
      .replace(/\n\n/g, '</p><p class="mt-3">')
      .replace(/\n/g, '<br />')
      .replace(/---/g, '<hr class="my-4 border-secondary-200 dark:border-secondary-700" />');
  };

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-950">
      <Navbar />
      <Sidebar />

      <div className="lg:pl-64 pt-16">
        <div className="flex h-[calc(100vh-4rem)] flex-col lg:flex-row">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 bg-white dark:bg-secondary-900 border-b border-secondary-100 dark:border-secondary-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-secondary-900 dark:text-white">Flux</h1>
                  <div className="flex items-center gap-1.5 text-sm text-secondary-500 dark:text-secondary-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Assistente IA
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] ${
                      message.role === 'user'
                        ? 'bg-primary-500 text-white px-4 py-3 rounded-2xl rounded-br-none'
                        : 'bg-white dark:bg-secondary-800 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm border border-secondary-100 dark:border-secondary-700'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2 text-purple-600 dark:text-purple-400 font-medium text-sm">
                        <Sparkles className="w-4 h-4" />
                        Flux
                      </div>
                    )}
                    <div
                      className={`prose prose-sm max-w-none ${
                        message.role === 'user' ? 'text-white prose-invert' : 'text-secondary-700 dark:text-secondary-200'
                      }`}
                      dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                    />
                    {message.role === 'assistant' && (
                      <div className="mt-2 pt-2 border-t border-secondary-100 dark:border-secondary-700 flex justify-end">
                        <button
                          onClick={() => copyToClipboard(message.content, message.id)}
                          className="flex items-center gap-1.5 text-xs text-secondary-400 dark:text-secondary-500 hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors"
                        >
                          {copiedId === message.id ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              Copiado
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              Copiar
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-secondary-800 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm border border-secondary-100 dark:border-secondary-700">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm text-secondary-500 dark:text-secondary-400">Flux esta pensando...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-2 bg-white dark:bg-secondary-900 border-t border-secondary-100 dark:border-secondary-800 flex flex-wrap gap-2">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(action.prompt)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-secondary-100 dark:bg-secondary-800 hover:bg-secondary-200 dark:hover:bg-secondary-700 rounded-full text-sm font-medium text-secondary-700 dark:text-secondary-200 transition-colors"
                >
                  <action.icon className="w-4 h-4" />
                  {action.title}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="px-4 py-3 bg-white dark:bg-secondary-900 border-t border-secondary-100 dark:border-secondary-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-end gap-3"
              >
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Pergunte ao Flux..."
                  rows={1}
                  className="flex-1 px-4 py-3 bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl text-secondary-900 dark:text-white placeholder:text-secondary-400 dark:placeholder:text-secondary-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>

          {/* Insights Sidebar */}
          <div className="hidden xl:block w-72 bg-white dark:bg-secondary-900 border-l border-secondary-100 dark:border-secondary-800 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-primary-500" />
                <h2 className="font-semibold text-secondary-900 dark:text-white text-sm">Insights</h2>
              </div>

              <div className="space-y-3">
                {aiInsights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-secondary-100 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800"
                  >
                    <div className="flex items-start gap-2">
                      <div className={`p-1.5 rounded-lg ${
                        insight.priority === 'high'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                          : 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                      }`}>
                        <insight.icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-secondary-900 dark:text-white text-xs">
                          {insight.title}
                        </h3>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1 line-clamp-2">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="text-xs font-semibold text-secondary-900 dark:text-white mb-3">Perguntas Sugeridas</h3>
                <div className="space-y-1">
                  {[
                    'Quais clientes nao voltaram?',
                    'Melhor hora para ofertas?',
                    'Aumentar ticket medio?',
                  ].map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(prompt)}
                      className="w-full text-left px-3 py-2 bg-secondary-50 dark:bg-secondary-800 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg text-xs text-secondary-700 dark:text-secondary-200 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
