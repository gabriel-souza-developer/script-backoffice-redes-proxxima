document.addEventListener("DOMContentLoaded", function () {
  // === 1. Elementos do DOM ===
  const form = document.getElementById("formularioResumo");
  const botaoGerarCopiar = document.getElementById("gerarCopiarResumo");
  const resumoTexto = document.getElementById("resumoTexto");
  const outroTipoServicoRadio = document.getElementById("outro");
  const outroTipoServicoInput = document.getElementById("outroTipoServico");
  const tipoEquipamentoSelect = document.getElementById("tipoEquipamento");
  const marcaONUSelect = document.getElementById("marcaONU");
  const tentouPeloAnielSelect = document.getElementById("tentouPeloAniel");
  const quantidadePortasCtoContainer = document.getElementById(
    "quantidadePortasCtoContainer"
  );
  const quantidadePortasCtoSelect = document.getElementById(
    "quantidadePortasCto"
  );
  const verificarCtoRadio = document.getElementById("verificarCto");
  const verificarConexaoRadio = document.getElementById("verificarConexao");
  const appAside = document.querySelector(".app-aside");
  const vlanInput = document.getElementById("vlan");
  const serialOnuAntigaInput = document.getElementById("serialOnuAntiga");
  const serialOnuNovaInput = document.getElementById("serialOnuNova");
  const protocoloInput = document.getElementById("protocolo");
  const pppoeInput = document.getElementById("pppoe");
  const oltInput = document.getElementById("olt");
  const descricaoServicoInput = document.getElementById("descricaoServico");
  const scrollToBottomBtn = document.getElementById("scrollToBottomBtn");
  const pageFooter = document.querySelector(".app-footer");

  if (scrollToBottomBtn && pageFooter) {
    const checkScrollPosition = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (scrollTop > 50 && scrollTop + clientHeight < scrollHeight - 50) {
        scrollToBottomBtn.classList.add("visible");
      } else {
        scrollToBottomBtn.classList.remove("visible");
      }
    };
    window.addEventListener("scroll", checkScrollPosition);
    checkScrollPosition();
    scrollToBottomBtn.addEventListener("click", () => {
      pageFooter.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  }

  // === 2. Funções Auxiliares ===
  function getTipoServico() {
    const tipoServicoRadios = document.querySelectorAll(
      'input[name="tipoServico"]'
    );
    let tipoServico = "";
    for (const radio of tipoServicoRadios) {
      if (radio.checked) {
        tipoServico =
          radio.id === "outro"
            ? outroTipoServicoInput.value.trim()
            : radio.value;
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
    htmlLines.push("<br>");
    if (protocolo) htmlLines.push(`Protocolo: ${protocolo}`);
    if (pppoe) htmlLines.push(`PPPoE: ${pppoe}`);
    if (protocolo || pppoe) htmlLines.push("<br>");

    htmlLines.push(`<strong>TIPO DE ATENDIMENTO:</strong> ${tipoServico}`);
    htmlLines.push("<br>");

    const equipamentoLines = [];
    if (serialOnuAntigaValor)
      equipamentoLines.push(`SN equi. ANTIGO: ${serialOnuAntigaValor}`);
    if (serialOnuNovaValor)
      equipamentoLines.push(
        `SN equi. <strong>NOVO/ATUAL: ${serialOnuNovaValor}</strong>`
      );
    if (tipoEquipamento)
      equipamentoLines.push(`Modo OP. da ONU: ${tipoEquipamento}`);
    if (marcaONU) equipamentoLines.push(`Marca da ONU: ${marcaONU}`);
    if (vlan) equipamentoLines.push(`VLAN na WAN: ${vlan}`);
    if (olt) equipamentoLines.push(`Ponto de acesso: ${olt}`);
    if (equipamentoLines.length > 0) {
      htmlLines.push(`<strong>INFO. EQUIPAMENTOS:</strong>`);
      htmlLines.push("<br>");
      htmlLines.push(...equipamentoLines);
      htmlLines.push("<br>");
    }

    if (descricaoServico) {
      htmlLines.push(
        `<strong>DESCRIÇÃO DETALHADA:</strong> ${descricaoServico.replace(
          /\n/g,
          "<br>"
        )}`
      );
      htmlLines.push("<br>");
    }

    const anielEraObrigatorio =
      !verificarCtoRadio.checked && !verificarConexaoRadio.checked;
    if (tentouPeloAniel || anielEraObrigatorio) {
      htmlLines.push(
        `<strong>TENTOU PELO ANIEL:</strong> ${
          tentouPeloAniel || "Não informado"
        }`
      );
    }

    return htmlLines
      .join("<br>")
      .replace(/^(<br>)+|(<br>)+$/g, "")
      .replace(/(<br>\s*){3,}/g, "<br><br>");
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
    markdownLines.push("");
    if (protocolo) markdownLines.push(`Protocolo: ${protocolo}`);
    if (pppoe) markdownLines.push(`PPPoE: ${pppoe}`);
    if (protocolo || pppoe) markdownLines.push("");

    markdownLines.push(`*TIPO DE ATENDIMENTO:* ${tipoServico}`);
    markdownLines.push("");

    const equipamentoLines = [];
    if (serialOnuAntigaValor)
      equipamentoLines.push(`SN ANTIGO: ${serialOnuAntigaValor}`);
    if (serialOnuNovaValor)
      equipamentoLines.push(`SN *NOVO/ATUAL: ${serialOnuNovaValor}*`);
    if (tipoEquipamento)
      equipamentoLines.push(`Modo OP. da ONU: ${tipoEquipamento}`);
    if (marcaONU) equipamentoLines.push(`Marca da ONU: ${marcaONU}`);
    if (vlan) equipamentoLines.push(`VLAN na WAN: *${vlan}*`);
    if (olt) equipamentoLines.push(`Ponto de acesso: *${olt}*`);
    if (equipamentoLines.length > 0) {
      markdownLines.push(`*INFO. EQUIPAMENTOS:*`);
      markdownLines.push("");
      markdownLines.push(...equipamentoLines);
      markdownLines.push("");
    }

    if (descricaoServico) {
      markdownLines.push(`*DESCRIÇÃO DETALHADA:* ${descricaoServico}`);
      markdownLines.push("");
    }

    const anielEraObrigatorio =
      !verificarCtoRadio.checked && !verificarConexaoRadio.checked;
    if (tentouPeloAniel || anielEraObrigatorio) {
      markdownLines.push(
        `*TENTOU PELO ANIEL:* ${tentouPeloAniel || "Não informado"}`
      );
    }

    return markdownLines.join("\n").trim();
  }

  function mostrarToast(mensagem) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = mensagem;
    toast.classList.remove("hidden");
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.classList.add("hidden"), 300);
    }, 3000);
  }

  function copiarParaAreaTransferencia(texto) {
    if (!texto) {
      mostrarToast("Nenhuma informação para copiar.");
      return;
    }
    navigator.clipboard
      .writeText(texto)
      .then(() => mostrarToast("Resumo copiado para a área de transferência!"))
      .catch((err) => {
        console.error("Erro ao copiar: ", err);
        mostrarToast(
          "Falha ao copiar. Verifique as permissões ou copie manualmente."
        );
      });
  }

  function atualizarEstadoCampoOutro() {
    if (!outroTipoServicoRadio || !outroTipoServicoInput) return;
    const habilitar = outroTipoServicoRadio.checked;
    outroTipoServicoInput.disabled = !habilitar;
    outroTipoServicoInput.required = habilitar;
    if (!habilitar) {
      outroTipoServicoInput.value = "";
      outroTipoServicoInput.setCustomValidity("");
    }
  }

  function atualizarVisibilidadeQuantidadeCto() {
    if (
      !verificarCtoRadio ||
      !quantidadePortasCtoContainer ||
      !quantidadePortasCtoSelect
    )
      return;
    const mostrar = verificarCtoRadio.checked;
    quantidadePortasCtoContainer.style.display = mostrar ? "block" : "none";
    quantidadePortasCtoSelect.required = mostrar;
    if (!mostrar) {
      quantidadePortasCtoSelect.value = "";
      quantidadePortasCtoSelect.setCustomValidity("");
    }
  }

  function atualizarRequisitoAniel() {
    if (!verificarCtoRadio || !verificarConexaoRadio || !tentouPeloAnielSelect)
      return;
    const ehObrigatorio =
      !verificarCtoRadio.checked && !verificarConexaoRadio.checked;
    tentouPeloAnielSelect.required = ehObrigatorio;
    if (!ehObrigatorio) {
      tentouPeloAnielSelect.setCustomValidity("");
    }
  }

  function atualizarRequisitoOlt() {
    if (!verificarCtoRadio || !oltInput) return;
    const ehObrigatorio = verificarCtoRadio.checked;
    oltInput.required = ehObrigatorio;
    if (!ehObrigatorio) {
      oltInput.setCustomValidity("");
    }
  }

  function atualizarRequisitoPppoe() {
    if (!verificarCtoRadio || !pppoeInput) return;
    const ehObrigatorio = !verificarCtoRadio.checked;
    pppoeInput.required = ehObrigatorio;
    if (!ehObrigatorio) {
      pppoeInput.setCustomValidity("");
    }
  }

  botaoGerarCopiar.addEventListener("click", function () {
    if (!form.checkValidity()) {
      form.reportValidity();
      let scrolled = false;
      const primeiroTipoServico = document.querySelector(
        'input[name="tipoServico"][required]'
      );
      let algumTipoServicoMarcado = false;
      if (primeiroTipoServico) {
        document
          .querySelectorAll('input[name="tipoServico"]')
          .forEach((radio) => {
            if (radio.checked) algumTipoServicoMarcado = true;
          });
      }
      if (primeiroTipoServico && !algumTipoServicoMarcado) {
        const tipoServicoTitulo = [
          ...document.querySelectorAll(".form__section-title"),
        ].find((h2) => h2.textContent.trim() === "Tipo de Atendimento");
        if (tipoServicoTitulo) {
          tipoServicoTitulo.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          scrolled = true;
        } else {
          primeiroTipoServico.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          scrolled = true;
        }
      }
      mostrarToast(
        "Por favor, preencha todos os campos obrigatórios destacados."
      );
      appAside.style.display = "none";
      resumoTexto.innerHTML = "";
      return;
    }

    const textoResumoHTML = gerarTextoResumoHTML();
    const textoResumoMarkdown = gerarTextoResumoMarkdown();

    if (textoResumoHTML) {
      resumoTexto.innerHTML = textoResumoHTML;
      copiarParaAreaTransferencia(textoResumoMarkdown);
      appAside.style.display = "block";
    } else {
      resumoTexto.innerHTML =
        "<em>Erro ao gerar resumo. Verifique os campos.</em>";
      appAside.style.display = "block";
      mostrarToast("Erro ao gerar resumo.");
    }
  });

  document.querySelectorAll('input[name="tipoServico"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      atualizarEstadoCampoOutro();
      atualizarVisibilidadeQuantidadeCto();
      atualizarRequisitoAniel();
      atualizarRequisitoOlt();
      atualizarRequisitoPppoe();
    });
  });

  atualizarEstadoCampoOutro();
  atualizarVisibilidadeQuantidadeCto();
  atualizarRequisitoAniel();
  atualizarRequisitoOlt();
  atualizarRequisitoPppoe();
  appAside.style.display = "none";

  // === 4. Autocomplete OLT ===
  const opcoesOlt = [
    "SZA-JDIR-01",
    "LJD-LJA-01",
    "SSY-CEN-01",
    "CZE-HRT-01",
    "JTU-CEN-01",
    "BBZ-CEN-01",
    "TTT-CEN-01",
    "SKS-CEN-01",
    "CIC-CEN-01",
    "SXF-CEN-01",
    "SFA-CEN-01",
    "OLT-SII-CEN-01",
    "CZS-CEN-01",
    "JUI-CEN-01",
    "BJM-OXT-01",
    "TRU-CEN-01",
    "PBL-VDNV-01",
    "SXQ-JSG-01",
    "MRIZ-STAN-01",
    "FILADELFIA-DATACOM",
    "AEI-CEN-01",
    "GBI-CEN-01",
    "GBI-CEN-02",
    "GBI-CEN-03",
    "AHA-CEN-01",
    "UIN-BLVT-01",
    "CPD-CGE-CJU-01",
    "SJMT-CEN-01",
    "CGE-JAP-01",
    "CGE-MJR-01",
    "CGE-BGO-01",
    "CGE-SJE-01",
    "CGE-PRT-01",
    "GE-SJMT-SCB-01",
    "CGE-SAC-01",
    "CGE-SJMT",
    "CGE-ALU-01",
    "CGE-SJMT-02",
    "JMH-CEN-01"
    
  ];

  const sugestaoContainer = document.createElement("div");
  sugestaoContainer.classList.add("autocomplete-suggestions");
  sugestaoContainer.style.position = "absolute";
  sugestaoContainer.style.border = "1px solid #ccc";
  sugestaoContainer.style.background = "#fff";
  sugestaoContainer.style.zIndex = "1000";
  sugestaoContainer.style.display = "none";
  sugestaoContainer.style.maxHeight = "150px";
  sugestaoContainer.style.overflowY = "auto";
  sugestaoContainer.style.fontSize = "14px";
  sugestaoContainer.style.width = oltInput.offsetWidth + "px";

  oltInput.parentNode.style.position = "relative";
  oltInput.parentNode.appendChild(sugestaoContainer);

  oltInput.addEventListener("input", () => {
    const termo = oltInput.value.toLowerCase();
    sugestaoContainer.innerHTML = "";
    if (!termo) {
      sugestaoContainer.style.display = "none";
      return;
    }

    const resultados = opcoesOlt.filter((opcao) =>
      opcao.toLowerCase().includes(termo)
    );
    if (resultados.length === 0) {
      sugestaoContainer.style.display = "none";
      return;
    }

    resultados.forEach((opcao) => {
      const div = document.createElement("div");
      div.textContent = opcao;
      div.style.padding = "6px 10px";
      div.style.cursor = "pointer";
      div.addEventListener("click", () => {
        oltInput.value = opcao;
        sugestaoContainer.style.display = "none";
      });
      div.addEventListener("mouseover", () => (div.style.background = "#eee"));
      div.addEventListener("mouseout", () => (div.style.background = "#fff"));
      sugestaoContainer.appendChild(div);
    });

    sugestaoContainer.style.display = "block";
  });

  document.addEventListener("click", (e) => {
    if (!sugestaoContainer.contains(e.target) && e.target !== oltInput) {
      sugestaoContainer.style.display = "none";
    }
  });
});
