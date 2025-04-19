document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const form = document.getElementById('registro-form');
    const gerarRegistroBtn = document.getElementById('gerar-registro');
    const categoriaSelect = document.getElementById('categoria');
    const camposAdicionais = document.getElementById('campos-adicionais');
    const problemaRelatadoTextarea = document.getElementById('problema-relatado');
    const tratativaTextarea = document.getElementById('tratativa');
    const registroTextarea = document.getElementById('registro-textarea');
    const registroGeradoSection = document.getElementById('registro-gerado');

    // Funções auxiliares
    function showFeedback(message, backgroundColor) {
        let feedbackDiv = document.getElementById('feedback-message');
        if (!feedbackDiv) {
            feedbackDiv = document.createElement('div');
            feedbackDiv.id = 'feedback-message';
            feedbackDiv.style.cssText = `
                background-color: ${backgroundColor};
                color: white;
                padding: 10px;
                border-radius: 5px;
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.5s ease-out;
            `;
            document.body.appendChild(feedbackDiv);
        }

        feedbackDiv.textContent = message;
        feedbackDiv.style.backgroundColor = backgroundColor; // Define a cor de fundo
        feedbackDiv.style.opacity = '1';

        setTimeout(() => {
            feedbackDiv.style.opacity = '0';
        }, 3000);
    }

    // Copia texto para a área de transferência
    function copyToClipboard(text) {
        const tempTextarea = document.createElement('textarea');
        tempTextarea.value = text;
        tempTextarea.style.position = 'fixed'; // Para não interferir no layout
        tempTextarea.style.top = '0';
        tempTextarea.style.left = '0';
        tempTextarea.style.opacity = '0';
        document.body.appendChild(tempTextarea);
        tempTextarea.focus();
        tempTextarea.select();

        try {
            document.execCommand('copy');
            showFeedback('Copiado para a área de transferência!', 'green');
        } catch (err) {
            console.error('Falha ao copiar: ', err);
            showFeedback('Erro ao copiar para a área de transferência.', 'red');
        }

        document.body.removeChild(tempTextarea);
    }

    // Define os valores padrão para o problema relatado e a tratativa
    function setCategoryDefaults(categoria) {
        const defaults = {
            instalacao_ativacao: {
                problema: 'Solicitação de instalação/ativação.',
                tratativa: 'Realizada instalação/ativação e provisionamento da ONU/ONT utilizando ERP Voalle, UNM2000 ou TERMINUS.  Após os procedimentos, a conexão do cliente foi restabelecida com sucesso e o técnico/solicitante foi orientado a realizar testes no local.'
            },
            reparo_manutencao: {
                problema: 'Solicitação de reparo/manutenção.',
                tratativa: 'Realizados os procedimentos de reparo/manutenção, incluindo testes e configurações, utilizando ERP Voalle, UNM2000 ou TERMINUS. Foi confirmado que a conexão do cliente ficou estável e funcional após os ajustes.'
            },
            troca_endereco: {
                problema: 'Solicitação de troca de endereço.',
                tratativa: 'Realizado o desprovisionamento da ONU/ONT no endereço antigo e o provisionamento da ONU/ONT em novo endereço, utilizando ERP Voalle, UNM2000 ou TERMINUS. Após o procedimento foi constatado que a conexão do cliente subiu em sistema e o técnico/solicitante foi orientado a testar conexão no local.'
            },
            troca_equipamento: {
                problema: 'Solicitação de troca de equipamento (desprovisionamento e provisionamento de nova ONU/ONT).',
                tratativa: 'Realizado o desprovisionamento e, em seguida, o provisionamento da ONU/ONT utilizando ERP Voalle, UNM2000 ou TERMINUS. Após os procedimentos, a conexão do cliente foi restabelecida com sucesso e o técnico/solicitante foi orientado a realizar testes no local.'
            },
            verificar_cto: {
                problema: 'Solicitação de verificação da CTO (Caixa de Terminação Óptica).',
                tratativa: 'Verificação da CTO realizada, identificando as portas disponíveis e indisponíveis. As informações foram repassadas ao técnico para as devidas providências e testes. Segue resumo da análise/verificação: '
            },
            desprovisionar_provisionar: {
                problema: 'Solicitação de desprovisionamento e provisionamento da ONU/ONT.',
                tratativa: 'Realizado o desprovisionamento e o provisionamento da ONU/ONT utilizando ERP Voalle, UNM2000 ou TERMINUS. Após o procedimento, a conexão do cliente foi estabelecida com sucesso no sistema e o técnico/solicitante foi orientado a testar a conexão no local.'
            },
            analise_backoffice: {
                problema: 'Solicitação de análise do BackOffice - BA.',
                tratativa: 'Realizada análise da situação do cliente através do protocolo, verificando configurações, histórico de atendimentos e outros dados relevantes. Identificada a necessidade de desautorização e e autorização da ONU/ONT por meio das ferramentas ERP Voalle, UNM2000 ou TERMINUS. Após os procedimentos a conexão do cliente foi restabelecida e validada em sistema.'
            },
            verificar_conexao: {
                problema: 'Solicitação de verificação de conexão do cliente.',
                tratativa: 'Realizada a verificação da conexão do cliente, incluindo: análise de parâmetros (nível de sinal óptico ideal entre -5dBm e -25dBm, taxa de transmissão e perdas de pacotes); testes de conectividade (ping para servidores externos e traceroute para identificar possíveis gargalos); verificação das configurações da WAN (modo de operação: bridge ou router, autenticação PPPoE com usuário e senha, e configuração de DNS para 8.8.8.8 e 8.8.4.4); análise do histórico de autenticação (horários de conexão, desconexões frequentes e erros de autenticação); e reinicialização/reset dos equipamentos (reboot da ONU/ONT e aguardo da estabilização dos LEDs). As orientações e os resultados foram repassados ao técnico para auxiliar na solução do problema.'
            },
            apenas_desprovisionar: {
                problema: 'Solicitação de apenas desprovisionar a ONU/ONT.',
                tratativa: 'Realizado o desprovisionamento da ONU/ONT utilizando ERP Voalle, UNM2000 ou TERMINUS. Foi confirmado o desprovisionamento e repassado ao técnico.'
            },
            apenas_provisionar: {
                problema: 'Solicitação de apenas provisionamento da ONU/ONT.',
                tratativa: 'Realizado o provisionamento da ONU/ONT utilizando ERP Voalle, UNM2000 ou TERMINUS. Após o procedimento, a conexão foi estabelecida com sucesso no sistema e o técnico/solicitante foi orientado a testar a conexão no local.'
            }
        };

        problemaRelatadoTextarea.value = defaults[categoria]?.problema || '';
        tratativaTextarea.value = defaults[categoria]?.tratativa || '';
    }

    // Listeners de eventos

    // Ao mudar a categoria, define os valores padrão do problema/tratativa
    categoriaSelect.addEventListener('change', function() {
        const categoria = categoriaSelect.value;
        setCategoryDefaults(categoria); // Define os valores padrão
        camposAdicionais.classList.toggle('hidden', categoria === ''); // Mostra/esconde campos adicionais
    });

    // Ao clicar em gerar o registro
    gerarRegistroBtn.addEventListener('click', function() {
        const protocolo = document.getElementById('protocolo').value;
        const categoria = categoriaSelect.value;

        if (!protocolo || categoria === '') {
            showFeedback('Por favor, preencha o protocolo e selecione uma categoria.', 'red');
            return;
        }

        const evidencias = document.querySelector('input[name="evidencias"]:checked');
        let registroCompleto = `Protocolo de operações: ${protocolo}\n\nProblema relatado: ${problemaRelatadoTextarea.value}\n\nTratativa: ${tratativaTextarea.value}`;

        // Adiciona a linha das evidências apenas se a categoria não for "analise_backoffice"
        if (categoria !== 'analise_backoffice') {
            const evidenciasStr = evidencias ? evidencias.value.toUpperCase() : '';
            registroCompleto += `\n\nTécnico/solicitante enviou evidências: ${evidenciasStr}`;
        }

        registroTextarea.value = registroCompleto;
        registroGeradoSection.style.display = 'block';

        copyToClipboard(registroCompleto);
    });
});