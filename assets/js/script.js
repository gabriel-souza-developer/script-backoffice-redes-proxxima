document.addEventListener('DOMContentLoaded', function () {
    // === 1. Elementos do DOM ===
    const form = document.getElementById('formularioResumo');
    const botaoGerarCopiar = document.getElementById('gerarCopiarResumo');
    const resumoTexto = document.getElementById('resumoTexto');
    const outroTipoServicoRadio = document.getElementById('outro');
    const outroTipoServicoInput = document.getElementById('outroTipoServico');
    const tipoEquipamentoSelect = document.getElementById('tipoEquipamento');
    const marcaONUSelect = document.getElementById('marcaONU');
    const tentouPeloAnielSelect = document.getElementById('tentouPeloAniel');
    const quantidadePortasCtoContainer = document.getElementById('quantidadePortasCtoContainer');
    const quantidadePortasCtoSelect = document.getElementById('quantidadePortasCto');
    const verificarCtoRadio = document.getElementById('verificarCto');
    const appAside = document.querySelector('.app-aside');
    const vlanInput = document.getElementById('vlan');
    const serialOnuAntigaInput = document.getElementById('serialOnuAntiga');
    const serialOnuNovaInput = document.getElementById('serialOnuNova');
    const protocoloInput = document.getElementById('protocolo');
    const pppoeInput = document.getElementById('pppoe');
    const oltInput = document.getElementById('olt');
    const descricaoServicoInput = document.getElementById('descricaoServico');

    const scrollToBottomBtn = document.getElementById('scrollToBottomBtn');
    const pageFooter = document.querySelector('.app-footer');

    if (scrollToBottomBtn && pageFooter) {
        const checkScrollPosition = () => {
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = document.documentElement.clientHeight;
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            if (scrollTop > 50 && (scrollTop + clientHeight < scrollHeight - 50)) {
                scrollToBottomBtn.classList.add('visible');
            } else {
                scrollToBottomBtn.classList.remove('visible');
            }
        };
        window.addEventListener('scroll', checkScrollPosition);
        checkScrollPosition();
        scrollToBottomBtn.addEventListener('click', () => {
            pageFooter.scrollIntoView({ behavior: 'smooth', block: 'end' });
        });
    }

    // === 2. Funções Auxiliares ===

    function getTipoServico() {
        const tipoServicoRadios = document.querySelectorAll('input[name="tipoServico"]');
        let tipoServico = '';
        for (const radio of tipoServicoRadios) {
            if (radio.checked) {
                tipoServico = (radio.id === 'outro') ? outroTipoServicoInput.value.trim() : radio.value;
                break;
            }
        }
        if (verificarCtoRadio.checked) {
            const quantidadePortasCto = quantidadePortasCtoSelect.value.trim();
            if (quantidadePortasCto) {
                tipoServico += ` (Portas: ${quantidadePortasCto})`;
            }
        }
        return tipoServico;
    }

    function gerarTextoResumoHTML() {
        const htmlLines = [];
        const protocolo = protocoloInput.value.trim();
        const pppoe = pppoeInput.value.trim();
        let tipoServico = getTipoServico();
        const tentouPeloAniel = tentouPeloAnielSelect.value.trim();
        const serialOnuAntigaValor = serialOnuAntigaInput.value.trim();
        const serialOnuNovaValor = serialOnuNovaInput.value.trim();
        const tipoEquipamento = tipoEquipamentoSelect.value.trim();
        const marcaONU = marcaONUSelect.value.trim();
        const vlan = vlanInput.value.trim();
        const olt = oltInput.value.trim();
        const descricaoServico = descricaoServicoInput.value.trim();

        htmlLines.push(`<strong>INFORMAÇÕES DO CLIENTE:</strong>`);
        htmlLines.push('<br>');
        htmlLines.push(`Protocolo: ${protocolo}`);
        if (pppoe) {
            htmlLines.push(`PPPoE: ${pppoe}`);
        }
        htmlLines.push('<br>');

        htmlLines.push(`<strong>TIPO DE ATENDIMENTO:</strong> ${tipoServico}`);
        htmlLines.push('<br>');

        const equipamentoLines = [];
        if (serialOnuAntigaValor) equipamentoLines.push(`SN equi. ANTIGO: ${serialOnuAntigaValor}`);
        if (serialOnuNovaValor) equipamentoLines.push(`SN equi. <strong>NOVO/ATUAL:</strong> ${serialOnuNovaValor}`);
        if (tipoEquipamento) equipamentoLines.push(`Modo operacional da ONU: ${tipoEquipamento}`);
        if (marcaONU) equipamentoLines.push(`Marca da ONU: ${marcaONU}`);
        if (vlan) equipamentoLines.push(`VLAN preenchida na WAN: ${vlan}`);
        if (olt) equipamentoLines.push(`Ponto de Acesso - OLT: ${olt}`);
        if (equipamentoLines.length > 0) {
            htmlLines.push(`<strong>INFO. EQUIPAMENTOS:</strong>`);
            htmlLines.push('<br>');
            htmlLines.push(...equipamentoLines);
            htmlLines.push('<br>');
        }

        if (descricaoServico) {
            htmlLines.push(`<strong>DESCRIÇÃO DETALHADA:</strong> ${descricaoServico.replace(/\n/g, '<br>')}`);
            htmlLines.push('<br>');
        }

        if (tentouPeloAniel || !verificarCtoRadio.checked) {
            htmlLines.push(`<strong>TENTOU PELO ANIEL:</strong> ${tentouPeloAniel || 'Não aplicável/informado'}`);
        }

        return htmlLines.join('<br>').replace(/^(<br>)+|(<br>)+$/g, '').replace(/(<br>\s*){3,}/g, '<br><br>');
    }

    function gerarTextoResumoMarkdown() {
        const markdownLines = [];
        const protocolo = protocoloInput.value.trim();
        const pppoe = pppoeInput.value.trim();
        let tipoServico = getTipoServico();
        const tentouPeloAniel = tentouPeloAnielSelect.value.trim();
        const serialOnuAntigaValor = serialOnuAntigaInput.value.trim();
        const serialOnuNovaValor = serialOnuNovaInput.value.trim();
        const tipoEquipamento = tipoEquipamentoSelect.value.trim();
        const marcaONU = marcaONUSelect.value.trim();
        const vlan = vlanInput.value.trim();
        const olt = oltInput.value.trim();
        const descricaoServico = descricaoServicoInput.value.trim();

        markdownLines.push(`*INFORMAÇÕES DO CLIENTE:*`);
        markdownLines.push('');
        markdownLines.push(`Protocolo: ${protocolo}`);
        if (pppoe) {
            markdownLines.push(`PPPoE: ${pppoe}`);
        }
        markdownLines.push('');

        markdownLines.push(`*TIPO DE ATENDIMENTO:* ${tipoServico}`);
        markdownLines.push('');

        const equipamentoLines = [];
        if (serialOnuAntigaValor) equipamentoLines.push(`SN equi. ANTIGO: ${serialOnuAntigaValor}`);
        if (serialOnuNovaValor) equipamentoLines.push(`SN equi. *NOVO/ATUAL:* ${serialOnuNovaValor}`);
        if (tipoEquipamento) equipamentoLines.push(`Modo operacional da ONU: ${tipoEquipamento}`);
        if (marcaONU) equipamentoLines.push(`Marca da ONU: ${marcaONU}`);
        if (vlan) equipamentoLines.push(`VLAN: ${vlan}`);
        if (olt) equipamentoLines.push(`Ponto de Acesso - OLT: ${olt}`);
        if (equipamentoLines.length > 0) {
            markdownLines.push(`*INFO. EQUIPAMENTOS:*`);
            markdownLines.push('');
            markdownLines.push(...equipamentoLines);
            markdownLines.push('');
        }

        if (descricaoServico) {
            markdownLines.push(`*DESCRIÇÃO DETALHADA:*`);
            markdownLines.push(descricaoServico);
            markdownLines.push('');
        }

        if (tentouPeloAniel || !verificarCtoRadio.checked) {
            markdownLines.push(`*TENTOU PELO ANIEL:* ${tentouPeloAniel || 'Não aplicável/informado'}`);
        }

        return markdownLines.join('\n').trim();
    }

    function mostrarToast(mensagem) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = mensagem;
        toast.classList.remove('hidden');
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.classList.add('hidden'), 300);
        }, 3000);
    }

    function copiarParaAreaTransferencia(texto) {
        if (!texto) {
            mostrarToast("Nenhuma informação para copiar.");
            return;
        }
        navigator.clipboard.writeText(texto)
            .then(() => mostrarToast("Resumo copiado para a área de transferência!"))
            .catch(err => {
                console.error('Erro ao copiar: ', err);
                mostrarToast("Falha ao copiar. Verifique as permissões ou copie manualmente.");
            });
    }

    function atualizarEstadoCampoOutro() {
        if (!outroTipoServicoRadio || !outroTipoServicoInput) return;
        const habilitar = outroTipoServicoRadio.checked;
        outroTipoServicoInput.disabled = !habilitar;
        outroTipoServicoInput.required = habilitar;
        if (!habilitar) {
            outroTipoServicoInput.value = '';
            outroTipoServicoInput.setCustomValidity('');
        }
    }

    function atualizarVisibilidadeQuantidadeCto() {
        if (!verificarCtoRadio || !quantidadePortasCtoContainer || !quantidadePortasCtoSelect) return;
        const mostrar = verificarCtoRadio.checked;
        quantidadePortasCtoContainer.style.display = mostrar ? 'block' : 'none';
        quantidadePortasCtoSelect.required = mostrar;
        if (!mostrar) {
            quantidadePortasCtoSelect.value = '';
            quantidadePortasCtoSelect.setCustomValidity('');
        }
    }

    function atualizarRequisitoAniel() {
        if (!verificarCtoRadio || !tentouPeloAnielSelect) return;
        const ehObrigatorio = !verificarCtoRadio.checked;
        tentouPeloAnielSelect.required = ehObrigatorio;
        if (!ehObrigatorio) {
            tentouPeloAnielSelect.setCustomValidity('');
        }
    }

    function atualizarRequisitoOlt() {
        if (!verificarCtoRadio || !oltInput) return;
        const ehObrigatorio = verificarCtoRadio.checked;
        oltInput.required = ehObrigatorio;
        if (!ehObrigatorio) {
            oltInput.setCustomValidity('');
        }
    }

    function atualizarRequisitoPppoe() {
        if (!verificarCtoRadio || !pppoeInput) return;
        const ehObrigatorio = !verificarCtoRadio.checked;
        pppoeInput.required = ehObrigatorio;
        if (!ehObrigatorio) {
            pppoeInput.setCustomValidity('');
        }
    }

    // === 3. Event Listeners e Inicialização ===
    botaoGerarCopiar.addEventListener('click', function () {
        // Passo 1: Validar o Formulário
        if (!form.checkValidity()) {
            // Mostra a validação nativa
            form.reportValidity();

            // --- Início: Scroll Manual para Campos Inválidos (Foco em Tipo de Atendimento) ---
            let scrolled = false;

            // Verifica o grupo 'tipoServico' (o primeiro radio tem 'required')
            const primeiroTipoServico = document.querySelector('input[name="tipoServico"][required]'); // Encontra o radio obrigatório
            let algumTipoServicoMarcado = false;
            if (primeiroTipoServico) {
                 document.querySelectorAll('input[name="tipoServico"]').forEach(radio => {
                      if (radio.checked) algumTipoServicoMarcado = true;
                 })
            }


            if (primeiroTipoServico && !algumTipoServicoMarcado) {
                // Se nenhum radio do grupo foi marcado, tenta rolar para o título da seção
                const tipoServicoTitulo = [...document.querySelectorAll('.form__section-title')]
                                          .find(h2 => h2.textContent.trim() === 'Tipo de Atendimento');

                if (tipoServicoTitulo) {
                    tipoServicoTitulo.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    scrolled = true;
                } else {
                    // Fallback: rolar para o primeiro radio se o título não for encontrado
                    primeiroTipoServico.scrollIntoView({ behavior: 'smooth', block: 'center' });
                     scrolled = true;
                }
            }

            // Adicionar aqui verificações para outros campos se necessário (protocolo, pppoe, aniel, olt)
            // Exemplo:
            /*
            const camposObrigatorios = [protocoloInput, pppoeInput, tentouPeloAnielSelect, oltInput]; // Adicione outros conforme a lógica 'required' dinâmica
            if (!scrolled) {
                for (const campo of camposObrigatorios) {
                    // Verifica se o campo existe, é obrigatório no estado atual e está inválido
                    if (campo && campo.required && !campo.validity.valid) {
                         campo.scrollIntoView({ behavior: 'smooth', block: 'center' });
                         scrolled = true;
                         break; // Rola para o primeiro encontrado e para
                    }
                }
            }
            */
            // --- Fim: Scroll Manual ---

            mostrarToast("Por favor, preencha todos os campos obrigatórios destacados.");
            appAside.style.display = 'none';
            resumoTexto.innerHTML = '';
            return; // Interrompe a execução
        }

        // Passo 2: Gerar os Resumos
        const textoResumoHTML = gerarTextoResumoHTML();
        const textoResumoMarkdown = gerarTextoResumoMarkdown();

        // Passo 3: Exibir e Copiar
        if (textoResumoHTML) {
            resumoTexto.innerHTML = textoResumoHTML;
            copiarParaAreaTransferencia(textoResumoMarkdown);
            appAside.style.display = 'block';
        } else {
            resumoTexto.innerHTML = '<em>Erro ao gerar resumo. Verifique os campos.</em>';
            appAside.style.display = 'block';
            mostrarToast("Erro ao gerar resumo.");
        }
    });

    // Adiciona listeners aos radios tipoServico
    document.querySelectorAll('input[name="tipoServico"]').forEach(radio => {
        radio.addEventListener('change', () => {
            atualizarEstadoCampoOutro();
            atualizarVisibilidadeQuantidadeCto();
            atualizarRequisitoAniel();
            atualizarRequisitoOlt();
            atualizarRequisitoPppoe();
        });
    });

    // Inicialização
    atualizarEstadoCampoOutro();
    atualizarVisibilidadeQuantidadeCto();
    atualizarRequisitoAniel();
    atualizarRequisitoOlt();
    atualizarRequisitoPppoe();
    appAside.style.display = 'none';
});