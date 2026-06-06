import { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import {
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  MessageSquare,
  Percent,
  ShoppingBag,
  HeartHandshake,
  Target,
  Users,
  Zap,
} from 'lucide-react';

const templates = [
  {
    id: 'promotional',
    icon: Percent,
    title: 'Mensagem Promocional',
    description: 'Ofertas e descontos para seus clientes',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    id: 'recovery',
    icon: Users,
    title: 'Recuperacao de Cliente',
    description: 'Trazer clientes de volta',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: 'post-sale',
    icon: HeartHandshake,
    title: 'Pos-Venda',
    description: 'Acompanhamento e agradecimento',
    color: 'bg-pink-100 text-pink-600',
  },
  {
    id: 'closing',
    icon: Target,
    title: 'Fechamento de Venda',
    description: 'Urgencia e call-to-action',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    id: 're-engagement',
    icon: MessageSquare,
    title: 'Re-Engajamento',
    description: 'Reativar leads frios',
    color: 'bg-teal-100 text-teal-600',
  },
  {
    id: 'upsell',
    icon: ShoppingBag,
    title: 'Upsell',
    description: 'Oferecer produtos adicionais',
    color: 'bg-green-100 text-green-600',
  },
];

interface GeneratedMessage {
  id: string;
  template: string;
  content: string;
  createdAt: Date;
}

export function GeneratorPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [customization, setCustomization] = useState({
    clientName: '',
    productName: '',
    discount: '',
    urgency: '',
  });
  const [generatedMessages, setGeneratedMessages] = useState<GeneratedMessage[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!selectedTemplate) return;

    setGenerating(true);

    // Simulate generation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const messages = generateMessages(selectedTemplate, customization);
    setGeneratedMessages(messages);
    setGenerating(false);
  };

  const generateMessages = (templateId: string, options: typeof customization): GeneratedMessage[] => {
    const messages: GeneratedMessage[] = [];
    const name = options.clientName || '[Nome do Cliente]';
    const product = options.productName || '[Produto]';
    const discount = options.discount || '20%';

    switch (templateId) {
      case 'promotional':
        messages.push({
          id: Date.now().toString(),
          template: templateId,
          content: `Ola ${name}!\n\nVoce nao vai querer perder isso!\n\nEstamos com uma promocao exclusiva: ${discount} de desconto em ${product}!\n\nA oferta e valida por tempo limitado e so para clientes selecionados.\n\nClique aqui para garantir: [LINK]\n\nAproveite!`,
          createdAt: new Date(),
        });
        messages.push({
          id: (Date.now() + 1).toString(),
          template: templateId,
          content: `${name}, seu desconto especial chegou!\n\nSeparado especialmente para voce: ${product} com ${discount} OFF.\n\nEssa condicao especial vale ate amanha as 18h.\n\nResponda "QUERO" para reservar o seu!`,
          createdAt: new Date(),
        });
        messages.push({
          id: (Date.now() + 2).toString(),
          template: templateId,
          content: `Psst, ${name}!\n\nNossa equipe liberou uma oferta relampago que nao esta no site.\n\n${product} com ${discount} de desconto.\n\nSo hoje. So para clientes VIP.\n\nQuer que eu reserve uma unidade para voce?`,
          createdAt: new Date(),
        });
        break;

      case 'recovery':
        messages.push({
          id: Date.now().toString(),
          template: templateId,
          content: `Ola ${name}, tudo bem?\n\nNotei que voce demonstrou interesse em ${product} a algum tempo e queria verificar se ainda faz sentido para voce.\n\nTenho uma condicao especial para seu retorno: ${discount} de desconto na primeira compra.\n\nAinda esta interessado(a)? Mande um oi!`,
          createdAt: new Date(),
        });
        messages.push({
          id: (Date.now() + 1).toString(),
          template: templateId,
          content: `${name}, faz um tempinho!\n\nEu fiquei com uma duvida: o que te impediu de finalizar sua compra de ${product}?\n\nSei que as vezes a vida fica corrida. Se quiser, posso te ajudar a resolver qualquer duvida.\n\nSo responder essa mensagem!`,
          createdAt: new Date(),
        });
        messages.push({
          id: (Date.now() + 2).toString(),
          template: templateId,
          content: `${name}, estava pensando em voce!\n\nRelembrei que voce tinha interesse em ${product} e preparei algo especial.\n\nFrete gratis + ${discount} de desconto para fecharmos essa questao.\n\nFaz sentido te enviar mais detalhes?`,
          createdAt: new Date(),
        });
        break;

      case 'post-sale':
        messages.push({
          id: Date.now().toString(),
          template: templateId,
          content: `Ola ${name}!\n\nPassei aqui para agradecer sua compra de ${product}!\n\nSua satisfacao e nossa prioridade. Se precisar de qualquer coisa, estamos a disposicao.\n\nAproveitando: sua avalizacao e muito importante para nos. Podem nos dar uma nota de 1 a 5?\n\nObrigado pela confianca!`,
          createdAt: new Date(),
        });
        messages.push({
          id: (Date.now() + 1).toString(),
          template: templateId,
          content: `${name}, seu pedido de ${product} chegou bem?\n\nGostaria de saber como foi sua experiencia e se tem algo em que podemos melhorar.\n\nTambem quero te oferecer uma condicao especial para sua proxima compra. Posso enviar os detalhes?\n\nAbraços!`,
          createdAt: new Date(),
        });
        messages.push({
          id: (Date.now() + 2).toString(),
          template: templateId,
          content: `Oi ${name}!\n\nComo esta gostando de ${product}?\n\nEspero que esteja amando tanto quanto nos amamos criar para voce!\n\nSe tiver qualquer duvida ou feedback, e so chamar. Estamos aqui para voce.\n\nAproveite!`,
          createdAt: new Date(),
        });
        break;

      case 'closing':
        messages.push({
          id: Date.now().toString(),
          template: templateId,
          content: `${name}, vamos fechar isso?\n\nO estoque de ${product} esta diminuindo e nao quero que voce fique de fora.\n\nTenho liberado um desconto especial de ${discount} para fecharmos hoje.\n\nE agora, fechamos?`,
          createdAt: new Date(),
        });
        messages.push({
          id: (Date.now() + 1).toString(),
          template: templateId,
          content: `${name}, so passando para avisar!\n\nEssa oferta de ${product} com ${discount} expira hoje as 23:59.\n\nDepois volta ao preco normal. Posso garantir sua unidade agora?`,
          createdAt: new Date(),
        });
        messages.push({
          id: (Date.now() + 2).toString(),
          template: templateId,
          content: `Ultima chance, ${name}!\n\nRestam apenas algumas unidades de ${product}.\n\n${discount} de desconto ainda esta valendo, mas so por mais algumas horas.\n\nResponda "SIM" para eu reservar a sua!`,
          createdAt: new Date(),
        });
        break;

      case 're-engagement':
        messages.push({
          id: Date.now().toString(),
          template: templateId,
          content: `Oi ${name}!\n\nFaz um tempinho que nao aparecemos por aqui.\n\nPreparei algo especial para reencontrar voce: ${discount} no seu proximo pedido de ${product}!\n\nE um presente meu para voltarmos a nos falar.\n\nO que acha?`,
          createdAt: new Date(),
        });
        break;

      case 'upsell':
        messages.push({
          id: Date.now().toString(),
          template: templateId,
          content: `${name}, adorei sua compra de ${product}!\n\nAproveitando que voce gostou, quero te mostrar algo que combina perfeitamente.\n\nTemos um acessorio exclusivo que vai deixar sua experiencia ainda melhor.\n\nQuer que eu mostre as opcoes?`,
          createdAt: new Date(),
        });
        break;

      default:
        messages.push({
          id: Date.now().toString(),
          template: templateId,
          content: `Ola ${name}!\n\nTemos uma oferta especial para voce sobre ${product}.\n\nResponda para saber mais!`,
          createdAt: new Date(),
        });
    }

    return messages;
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const regenerateMessages = () => {
    if (selectedTemplate) {
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <Navbar />
      <Sidebar />

      <div className="lg:pl-64 pt-16">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-primary-500" />
              <h1 className="text-2xl font-bold text-secondary-900">Gerador de Mensagens</h1>
            </div>
            <p className="text-secondary-500">
              Crie mensagens de vendas persuasivas com IA em segundos
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Template Selection */}
            <div className="lg:col-span-1">
              <div className="card p-6">
                <h2 className="font-semibold text-secondary-900 mb-4">Tipo de Mensagem</h2>

                <div className="space-y-2">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                        selectedTemplate === template.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-transparent bg-secondary-50 hover:bg-secondary-100'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${template.color}`}>
                        <template.icon className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium text-secondary-900">{template.title}</h3>
                        <p className="text-xs text-secondary-500">{template.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Customization */}
              <div className="card p-6 mt-4">
                <h2 className="font-semibold text-secondary-900 mb-4">Personalizacao</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Nome do Cliente
                    </label>
                    <input
                      type="text"
                      value={customization.clientName}
                      onChange={(e) => setCustomization({ ...customization, clientName: e.target.value })}
                      placeholder="Ex: Maria"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Produto/Servico
                    </label>
                    <input
                      type="text"
                      value={customization.productName}
                      onChange={(e) => setCustomization({ ...customization, productName: e.target.value })}
                      placeholder="Ex: Plano Pro"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Desconto (opcional)
                    </label>
                    <input
                      type="text"
                      value={customization.discount}
                      onChange={(e) => setCustomization({ ...customization, discount: e.target.value })}
                      placeholder="Ex: 20%"
                      className="input-field"
                    />
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={!selectedTemplate || generating}
                  className="w-full btn-primary mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generating ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Gerar Mensagens
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Generated Messages */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-secondary-900">
                  Mensagens Geradas {generatedMessages.length > 0 && `(${generatedMessages.length})`}
                </h2>
                {generatedMessages.length > 0 && (
                  <button
                    onClick={regenerateMessages}
                    className="btn-ghost text-sm"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Regenerar
                  </button>
                )}
              </div>

              {generatedMessages.length > 0 ? (
                <div className="space-y-4">
                  {generatedMessages.map((message, idx) => (
                    <div
                      key={message.id}
                      className="card p-6 animate-fade-in"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-secondary-500">
                            Opcao {idx + 1}
                          </span>
                          <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full">
                            {templates.find((t) => t.id === message.template)?.title}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(message.content);
                            setCopiedId(message.id);
                            setTimeout(() => setCopiedId(null), 2000);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          {copiedId === message.id ? (
                            <>
                              <Check className="w-4 h-4" />
                              Copiado!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Copiar
                            </>
                          )}
                        </button>
                      </div>
                      <div className="bg-secondary-50 rounded-xl p-4">
                        <p className="text-secondary-700 whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card p-12 text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                    Selecione um tipo de mensagem
                  </h3>
                  <p className="text-secondary-500 max-w-sm mx-auto">
                    Escolha um template ao lado e personalize com os dados do seu cliente para gerar mensagens persuasivas.
                  </p>
                </div>
              )}

              {/* Tips */}
              <div className="card p-6 mt-6 bg-gradient-to-r from-primary-50 to-primary-100/50 border border-primary-200">
                <h3 className="font-semibold text-secondary-900 mb-3">Dicas para Melhor Conversao</h3>
                <div className="grid sm:grid-cols-2 gap-3 text-sm text-secondary-600">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary-600 mt-0.5" />
                    <span>Personalize sempre o nome do cliente</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary-600 mt-0.5" />
                    <span>Faca uma pergunta no final</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary-600 mt-0.5" />
                    <span>Crie urgencia com prazos reais</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary-600 mt-0.5" />
                    <span>Teste diferentes mensagens</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
