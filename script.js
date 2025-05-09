// Função principal executada quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Define o ano atual no rodapé
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Inicializa observadores de interseção para animações
    initAnimations();
    
    // Inicializa o menu mobile
    initMobileMenu();
    
    // Inicializa as abas
    initTabs();
    
    // Inicializa as abas de visualização
    initVizTabs();
    
    // Inicializa a animação do gráfico de barras
    initBarChart();
    
    // Inicializa o gráfico de pizza
    initPieChart();
});

// Inicializa animações com Intersection Observer
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));
}

// Inicializa a funcionalidade do menu mobile
function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Fecha o menu mobile ao clicar em um link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // Controla o fundo da barra de navegação ao rolar a página
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        if (header) {
            if (window.scrollY > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });
}

// Inicializa a funcionalidade das abas da seção de aplicação
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove a classe ativa de todos os botões e painéis
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Adiciona a classe ativa ao botão clicado e ao painel correspondente
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Inicializa as abas de visualização
function initVizTabs() {
    const vizTabButtons = document.querySelectorAll('.viz-tab-button');
    const vizTabPanes = document.querySelectorAll('.viz-tab-pane');

    vizTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove a classe ativa de todos os botões e painéis
            vizTabButtons.forEach(btn => btn.classList.remove('active'));
            vizTabPanes.forEach(pane => pane.classList.remove('active'));

            // Adiciona a classe ativa ao botão clicado e ao painel correspondente
            button.classList.add('active');
            const vizId = button.getAttribute('data-viz');
            document.getElementById(vizId + '-viz').classList.add('active');
        });
    });
}

// Inicializa a animação do gráfico de barras
function initBarChart() {
    const bars = document.querySelectorAll('.bar');

    // Atraso na animação para garantir que o contêiner esteja visível primeiro
    setTimeout(() => {
        bars.forEach(bar => {
            const height = bar.getAttribute('data-height');
            bar.style.height = height + '%';
        });
    }, 500);

    // Adiciona efeito de hover
    bars.forEach(bar => {
        bar.addEventListener('mouseenter', () => {
            bar.classList.add('hovered');
        });
        bar.addEventListener('mouseleave', () => {
            bar.classList.remove('hovered');
        });
    });
}

// Inicializa o gráfico de pizza
function initPieChart() {
    const pieData = [
        { label: 'Energia', value: 45, color: '#34d399' },
        { label: 'Água', value: 25, color: '#38bdf8' },
        { label: 'Materiais', value: 20, color: '#facc15' },
        { label: 'Outros', value: 10, color: '#a3a3a3' }
    ];

    const svg = document.getElementById('pieChart');
    const tooltip = document.getElementById('pieTooltip');
    const legend = document.getElementById('pieLegend');

    if (!svg || !tooltip || !legend) return;

    // Limpa o conteúdo existente
    svg.innerHTML = '';
    legend.innerHTML = '';

    // Calcula o total
    const total = pieData.reduce((sum, item) => sum + item.value, 0);

    // Cria os segmentos do gráfico
    let startAngle = 0;
    pieData.forEach((item, index) => {
        const percentage = item.value / total;
        const angle = percentage * 360;
        const endAngle = startAngle + angle;

        // Converte ângulos para radianos e calcula pontos na circunferência
        const startRad = (startAngle - 90) * Math.PI / 180;
        const endRad = (endAngle - 90) * Math.PI / 180;

        const centerX = 100;
        const centerY = 100;
        const radius = 80;

        const x1 = centerX + radius * Math.cos(startRad);
        const y1 = centerY + radius * Math.sin(startRad);
        const x2 = centerX + radius * Math.cos(endRad);
        const y2 = centerY + radius * Math.sin(endRad);

        // Determina se o arco é maior que 180 graus
        const largeArcFlag = angle > 180 ? 1 : 0;

        // Cria o caminho para o segmento
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`);
        path.setAttribute('fill', item.color);
        path.setAttribute('data-index', index);
        path.setAttribute('data-label', item.label);
        path.setAttribute('data-value', item.value);

        // Adiciona efeito de hover
        path.addEventListener('mouseenter', (e) => {
            const segment = e.target;
            segment.setAttribute('opacity', '0.8');

            // Posiciona e exibe o tooltip
            tooltip.innerHTML = `
                <strong>${item.label}:</strong> ${item.value}% do fluxo emergético
            `;
            tooltip.style.opacity = '1';
            tooltip.style.top = '0';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translateX(-50%)';
        });

        path.addEventListener('mouseleave', (e) => {
            const segment = e.target;
            segment.setAttribute('opacity', '1');
            tooltip.style.opacity = '0';
        });

        svg.appendChild(path);

        // Cria rótulos para os segmentos (somente os maiores)
        if (item.value >= 20) {
            const textRad = startRad + (endRad - startRad) / 2;
            const textDistance = radius * 0.6;
            const textX = centerX + textDistance * Math.cos(textRad);
            const textY = centerY + textDistance * Math.sin(textRad);

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', textX);
            text.setAttribute('y', textY);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('fill', '#ffffff');
            text.setAttribute('font-size', '12');
            text.setAttribute('font-weight', 'bold');
            text.textContent = `${item.value}%`;

            svg.appendChild(text);
        }

        // Atualiza o ângulo inicial para o próximo segmento
        startAngle = endAngle;

        // Adiciona item à legenda
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.innerHTML = `
            <div class="legend-color" style="background-color: ${item.color}"></div>
            <span>${item.label}</span>
        `;

        legendItem.addEventListener('mouseenter', () => {
            // Destaca o segmento correspondente do gráfico
            const segment = svg.querySelector(`path[data-index="${index}"]`);
            if (segment) {
                segment.setAttribute('opacity', '0.8');

                // Exibe o tooltip
                tooltip.innerHTML = `
                    <strong>${item.label}:</strong> ${item.value}% do fluxo emergético
                `;
                tooltip.style.opacity = '1';
                tooltip.style.top = '0';
                tooltip.style.left = '50%';
                tooltip.style.transform = 'translateX(-50%)';
            }
        });

        legendItem.addEventListener('mouseleave', () => {
            // Remove o destaque do segmento
            const segment = svg.querySelector(`path[data-index="${index}"]`);
            if (segment) {
                segment.setAttribute('opacity', '1');
                tooltip.style.opacity = '0';
            }
        });

        legend.appendChild(legendItem);
    });
}

// Envio do formulário de contato
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Validação simples do formulário
            if (!email || !message) {
                alert('Por favor, preencha todos os campos.');
                return;
            }
        });
    }
});
