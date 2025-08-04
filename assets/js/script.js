// script.js

document.addEventListener('DOMContentLoaded', function () {
  // === Elementos do DOM ===
  const ctoForm = document.getElementById('ctoForm');
  const protocoloInput = document.getElementById('protocoloInput');
  const ctoNameInput = document.getElementById('ctoNameInput');
  const gponInput = document.getElementById('gponInput');
  const portCountInput = document.getElementById('portCountInput');
  const gponTitleContainer = document.getElementById('gponTitleContainer');
  const ctoTableBody = document.getElementById('ctoTableBody');
  const gerarRelatorioBtn = document.getElementById('gerarRelatorioBtn');
  const relatorioContainer = document.getElementById('relatorioContainer');

  // === Variáveis dos valores de entrada ===
  let protocoloValue = '';
  let ctoNameValue = '';
  let gponNameValue = '';
  let portCountValue = '';



  // Exibe mensagens de feedback
  function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('alert', `alert-${type}`, 'mt-2');
    messageDiv.textContent = message;

    const target = type === 'danger' ? ctoForm : gerarRelatorioBtn.parentNode;
    target.insertBefore(messageDiv, target.firstChild);

    setTimeout(() => messageDiv.remove(), 3000);
  }

  // Validação de campos obrigatórios
  function validateForm() {
    protocoloValue = protocoloInput.value.trim();
    ctoNameValue = ctoNameInput.value.trim();
    gponNameValue = gponInput.value.trim();
    portCountValue = parseInt(portCountInput.value);

    if (protocoloValue === '' || ctoNameValue === '' || isNaN(portCountValue) || portCountValue <= 0) {
      showMessage('Por favor, preencha o protocolo, o nome da CTO/OLT e a quantidade de portas corretamente.', 'danger');
      return false;
    }
    return true;
  }

  // Atualiza o título acima da tabela com os dados inseridos
  function updateGponTitle() {
    let gponTitle = gponTitleContainer.querySelector('p');
    if (!gponTitle) {
      gponTitle = document.createElement('p');
      gponTitleContainer.appendChild(gponTitle);
      gponTitle.classList.add('gpon-title');
    }

    let titleText = '';
    if (protocoloValue) titleText += `PROTOCOLO: ${protocoloValue}<br>`;
    titleText += `VERIFICAÇÃO CTO/OLT: ${ctoNameValue}<br>`;
    if (gponNameValue) titleText += `GPON: ${gponNameValue}<br>`;
    titleText += `PORTAS: ${portCountValue}`;

    gponTitle.innerHTML = titleText;
  }

  // Gera dinamicamente a tabela de portas
  function createPortTable() {
    ctoTableBody.innerHTML = '';

    for (let i = 1; i <= portCountValue; i++) {
      const newRow = document.createElement('tr');
      newRow.classList.add('minha-tabela__linha');

      // Porta
      const portaCell = document.createElement('td');
      portaCell.textContent = i;
      portaCell.classList.add('minha-tabela__celula');
      newRow.appendChild(portaCell);

      // ID
      const idCell = document.createElement('td');
      idCell.classList.add('minha-tabela__celula');
      const idInput = document.createElement('input');
      idInput.type = 'text';
      idInput.classList.add('form-control-custom');
      idCell.appendChild(idInput);
      newRow.appendChild(idCell);

      // Status
      const statusCell = document.createElement('td');
      statusCell.classList.add('minha-tabela__celula');
      const statusSelect = document.createElement('select');
      statusSelect.classList.add('form-select-custom');
      ['', 'Livre', 'Em uso', 'Com defeito'].forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        statusSelect.appendChild(opt);
      });
      statusCell.appendChild(statusSelect);
      newRow.appendChild(statusCell);

      // Verificação
      const verificacaoCell = document.createElement('td');
      verificacaoCell.classList.add('minha-tabela__celula');
      const verificacaoSelect = document.createElement('select');
      verificacaoSelect.classList.add('form-select-custom');
      ['', 'Cliente Online', 'Cliente Offline'].forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        verificacaoSelect.appendChild(opt);
      });
      verificacaoCell.appendChild(verificacaoSelect);
      newRow.appendChild(verificacaoCell);

      // Ações
      const acoesCell = document.createElement('td');
      acoesCell.classList.add('minha-tabela__celula');
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Excluir';
      deleteButton.classList.add('minha-tabela__botao-excluir');
      acoesCell.appendChild(deleteButton);
      newRow.appendChild(acoesCell);

      ctoTableBody.appendChild(newRow);
    }

    gerarRelatorioBtn.style.display = 'block';
  }

  // Gera o texto do relatório
  function generateReport() {
    let relatorio = '';

    if (protocoloValue) relatorio += `Protocolo: ${protocoloValue}\n`;
    relatorio += `Verificação CTO/OLT: ${ctoNameValue}\n`;
    if (gponNameValue) relatorio += `Gpon: ${gponNameValue}\n`;

    const portasLivres = [];
    for (let i = 0; i < ctoTableBody.rows.length; i++) {
      const status = ctoTableBody.rows[i].cells[2].querySelector('select')?.value;
      if (status === 'Livre') portasLivres.push(i + 1);
    }

    relatorio += portasLivres.length > 0
      ? `Portas livres: ${portasLivres.join(', ')}\n`
      : 'Não há portas livres.\n';

    relatorioContainer.textContent = relatorio;
    return relatorio;
  }

  // === Event Listeners ===

  // Submissão do formulário
  ctoForm.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!validateForm()) return;

    updateGponTitle();
    createPortTable();
  });

  // Exclusão de linha da tabela
  ctoTableBody.addEventListener('click', function (event) {
    if (event.target.classList.contains('minha-tabela__botao-excluir')) {
      if (confirm('Tem certeza que deseja excluir esta porta?')) {
        event.target.closest('tr').remove();
      }
    }
  });

  // Geração do relatório
  gerarRelatorioBtn.addEventListener('click', function () {
    if (!validateForm()) return;

    gerarRelatorioBtn.style.display = 'block';
    relatorioContainer.style.display = 'block';

    const relatorio = generateReport();
    navigator.clipboard.writeText(relatorio)
      .then(() => showMessage('Copiado para área de transferência!', 'success'))
      .catch(err => {
        console.error('Falha ao copiar o relatório: ', err);
        alert('Falha ao copiar o relatório. Verifique as permissões do navegador.');
      });
  });
});
