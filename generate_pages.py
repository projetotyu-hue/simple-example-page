import os

pages = {
    'payments': {'title': 'Pagamentos', 'subtitle': 'Configuração de Gateways e Histórico de Transações', 'desc': 'Sistema pronto para integração de PIX e Cartão de Crédito.'},
    'sales': {'title': 'Gestão de Vendas', 'subtitle': 'Histórico e Acompanhamento', 'desc': 'Lista de pedidos será conectada aos dados do backend.'},
    'products': {'title': 'Gestão de Produtos', 'subtitle': 'Catálogo e Estoque', 'desc': 'Interface pronta para criação e edição de produtos reais.'},
    'clients': {'title': 'Clientes', 'subtitle': 'Base de Dados e Histórico', 'desc': 'Informações de clientes e retenção.'},
    'analytics': {'title': 'Analytics', 'subtitle': 'Métricas Avançadas', 'desc': 'Gráficos e taxas de conversão detalhadas.'},
    'map': {'title': 'Mapa de Clientes', 'subtitle': 'Visualização Geográfica', 'desc': 'Mapeamento visual do comportamento de usuários.'},
    'logs_view': {'title': 'Logs do Sistema', 'subtitle': 'Auditoria de Eventos', 'desc': 'Rastreamento de erros e atividades administrativas.'},
    'monitoring': {'title': 'Monitoramento', 'subtitle': 'Segurança de Infraestrutura', 'desc': 'Análise de acessos em tempo real.'},
    'sites': {'title': 'Gestão de Sites', 'subtitle': 'Controle Multi-Tenant', 'desc': 'Administração de múltiplas lojas ou landing pages.'},
    'pages': {'title': 'Gestão de Páginas', 'subtitle': 'Criação de Conteúdo', 'desc': 'CMS para landing pages e publicações.'}
}

template = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - Sentinel Shield</title>
    <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>
    <div class="app-container">
        <!-- Sidebar injetada via JS -->
        <div id="sidebar-container"></div>

        <div class="main-wrapper">
            <!-- Topbar injetada via JS -->
            <div id="topbar-container"></div>

            <main class="content">
                <header class="page-header">
                    <h1 class="page-title">{title}</h1>
                    <p class="text-secondary">{subtitle}</p>
                </header>

                <div class="glass-panel empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <h2 class="empty-state-title">Nenhum dado disponível</h2>
                    <p class="empty-state-desc">
                        {desc} <br><br>
                        Aguardando conexão com as APIs reais do sistema.
                    </p>
                </div>
            </main>
        </div>
    </div>

    <script type="module">
        import {{ renderSidebar }} from '/assets/js/components/sidebar.js';
        import {{ renderTopbar }} from '/assets/js/components/topbar.js';
        document.addEventListener('DOMContentLoaded', () => {{
            renderSidebar('{id}');
            renderTopbar();
        }});
    </script>
</body>
</html>"""

for page_id, data in pages.items():
    folder = f'admin/{page_id}'
    os.makedirs(folder, exist_ok=True)
    with open(f'{folder}/index.html', 'w') as f:
        f.write(template.format(id=page_id, title=data['title'], subtitle=data['subtitle'], desc=data['desc']))

print("All structural pages generated.")
