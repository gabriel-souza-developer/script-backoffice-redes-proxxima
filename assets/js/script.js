document.addEventListener('DOMContentLoaded', function () {
    // === 1. Elementos do DOM ===
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
    const serialOnuAntiga = document.getElementById('serialOnuAntiga');
    const serialOnuNova = document.getElementById('serialOnuNova');

    // === 2. Funções Auxiliares ===
    function getTipoServico() {
        const tipoServicoRadios = document.querySelectorAll('input[name="tipoServico"]');
        let tipoServico = '';

        tipoServicoRadios.forEach(radio => {
            if (radio.checked) {
                tipoServico = radio.value;
                if (radio.id === 'outro') {
                    tipoServico = outroTipoServicoInput.value.trim();
                }
            }
        });

        return tipoServico || "";
    }

    function gerarTextoResumoHTML() {
        const protocolo = document.getElementById('protocolo').value.trim() || "Não informado";
        const pppoe = document.getElementById('pppoe').value.trim() || "Não informado";
        const serialOnuAntigaValor = serialOnuAntiga?.value.trim() || "";
        const serialOnuNovaValor = serialOnuNova?.value.trim() || "";
        const tipoEquipamento = tipoEquipamentoSelect.value.trim() || "";
        const marcaONU = marcaONUSelect.value.trim() || "";
        const vlan = vlanInput.value.trim() || "";
        const olt = document.getElementById('olt').value.trim() || "";
        let tipoServico = getTipoServico();
        const descricaoServico = document.getElementById('descricaoServico').value.trim() || "";
        const tentouPeloAniel = tentouPeloAnielSelect.value.trim() || "";
        
        let quantidadePortasCto = "";
        if (verificarCtoRadio.checked) {
            quantidadePortasCto = quantidadePortasCtoSelect.value.trim() || "Não informado";
            tipoServico += ` (Portas: ${quantidadePortasCto})`;
        }

        return `
<strong>INFORMAÇÕES DO CLIENTE:</strong>

Protocolo: ${protocolo} 
PPPoE: ${pppoe}

<strong>TIPO DE ATENDIMENTO:</strong> ${tipoServico}

<strong>INFO. EQUIPAMENTOS:</strong>

SN equi. ANTIGO: ${serialOnuAntigaValor} 

SN equi. <strong>NOVO</strong>: ${serialOnuNovaValor}
Modo Operacional: ${tipoEquipamento}
Marca da ONU: ${marcaONU} 
VLAN: ${vlan}
Ponto de Acesso - OLT: ${olt}

<strong>DESCRIÇÃO DETALHADA:</strong> ${descricaoServico}

<strong>TENTOU PELO ANIEL:</strong> ${tentouPeloAniel}
`.trim();
    }

    function gerarTextoResumoMarkdown() {
        const textoHTML = gerarTextoResumoHTML();
        return textoHTML
            .replace(/<strong>(.*?)<\/strong>/g, '*$1*') // Converte <strong> para * (negrito Markdown)
            .replace(/\|/g, '\n'); // Quebra as informações agrupadas em novas linhas
    }

    function mostrarToast(mensagem) {
        const toast = document.getElementById('toast');
        toast.textContent = mensagem;
        toast.classList.remove('hidden');
        toast.classList.add('show');
    
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.classList.add('hidden'), 300);
        }, 3000); // Toast visível por 3 segundos
    }
    
    function copiarParaAreaTransferencia(texto) {
        navigator.clipboard.writeText(texto)
            .then(() => mostrarToast("Resumo copiado para a área de transferência!"))
            .catch(() => mostrarToast("Falha ao copiar o resumo. Por favor, tente novamente."));
    }
    

    function atualizarEstadoCampoOutro() {
        outroTipoServicoInput.disabled = !outroTipoServicoRadio.checked;
        if (!outroTipoServicoRadio.checked) {
            outroTipoServicoInput.value = '';
        }
    }

    function atualizarVisibilidadeQuantidadeCto() {
        quantidadePortasCtoContainer.style.display = verificarCtoRadio.checked ? 'block' : 'none';
        if (!verificarCtoRadio.checked) {
            quantidadePortasCtoSelect.value = '';
        }
    }

    botaoGerarCopiar.addEventListener('click', function () {
        const textoResumoHTML = gerarTextoResumoHTML();
        const textoResumoMarkdown = gerarTextoResumoMarkdown();
        resumoTexto.innerHTML = textoResumoHTML; // Exibe formatado
        copiarParaAreaTransferencia(textoResumoMarkdown); // Copia formatado para Markdown
        appAside.style.display = 'block';
    });

    outroTipoServicoRadio.addEventListener('change', atualizarEstadoCampoOutro);
    verificarCtoRadio.addEventListener('change', atualizarVisibilidadeQuantidadeCto);

    // Inicia os estados corretos dos campos
    atualizarEstadoCampoOutro();
    atualizarVisibilidadeQuantidadeCto();
});
