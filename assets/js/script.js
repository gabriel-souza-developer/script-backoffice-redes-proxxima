document.addEventListener("DOMContentLoaded", function () {
  // === 1. Elementos do DOM ===
  const dom = {
    form: document.getElementById("formularioResumo"),
    botaoGerarCopiar: document.getElementById("gerarCopiarResumo"),
    resumoTexto: document.getElementById("resumoTexto"),
    outroTipoServicoRadio: document.getElementById("outro"),
    outroTipoServicoInput: document.getElementById("outroTipoServico"),
    tipoEquipamentoSelect: document.getElementById("tipoEquipamento"),
    marcaONUSelect: document.getElementById("marcaONU"),
    tentouPeloAnielSelect: document.getElementById("tentouPeloAniel"),
    quantidadePortasCtoContainer: document.getElementById(
      "quantidadePortasCtoContainer"
    ),
    quantidadePortasCtoSelect: document.getElementById("quantidadePortasCto"),
    verificarCtoRadio: document.getElementById("verificarCto"),
    verificarConexaoRadio: document.getElementById("verificarConexao"),
    appAside: document.querySelector(".app-aside"),
    vlanInput: document.getElementById("vlan"),
    serialOnuAntigaInput: document.getElementById("serialOnuAntiga"),
    serialOnuNovaInput: document.getElementById("serialOnuNova"),
    protocoloInput: document.getElementById("protocolo"),
    pppoeInput: document.getElementById("pppoe"),
    oltInput: document.getElementById("olt"),
    descricaoServicoInput: document.getElementById("descricaoServico"),
    scrollToBottomBtn: document.getElementById("scrollToBottomBtn"),
    pageFooter: document.querySelector(".app-footer"),
  };

  // === 2. Funções utilitárias ===

  const getTipoServico = () => {
    const radios = document.querySelectorAll('input[name="tipoServico"]');
    for (const radio of radios) {
      if (radio.checked) {
        let tipo =
          radio.id === "outro"
            ? dom.outroTipoServicoInput.value.trim()
            : radio.value;
        if (
          dom.verificarCtoRadio.checked &&
          dom.quantidadePortasCtoSelect.value
        ) {
          tipo += ` (Portas: ${dom.quantidadePortasCtoSelect.value.trim()})`;
        }
        return tipo;
      }
    }
    return "";
  };

  const gerarTextoResumo = (formato = "html") => {
    const isHTML = formato === "html";
    const br = isHTML ? "<br>" : "";
    const bold = (text) => (isHTML ? `<strong>${text}</strong>` : `*${text}*`);
    const novaLinha = isHTML ? "<br>" : "\n";
    const linhas = [];
    const add = (linha = "") => linhas.push(linha + novaLinha);

    const {
      protocoloInput,
      pppoeInput,
      serialOnuAntigaInput,
      serialOnuNovaInput,
      tipoEquipamentoSelect,
      marcaONUSelect,
      vlanInput,
      oltInput,
      descricaoServicoInput,
      tentouPeloAnielSelect,
    } = dom;

    const protocolo = protocoloInput.value.trim();
    const pppoe = pppoeInput.value.trim();
    const tipoServico = getTipoServico();
    const serialAntiga = serialOnuAntigaInput.value.trim();
    const serialNova = serialOnuNovaInput.value.trim();
    const tipoEquipamento = tipoEquipamentoSelect.value.trim();
    const marcaONU = marcaONUSelect.value.trim();
    const vlan = vlanInput.value.trim();
    const olt = oltInput.value.trim();
    const descricao = descricaoServicoInput.value.trim();
    const tentouAniel = tentouPeloAnielSelect.value.trim();
    const anielObrigatorio = !["Verificar CTO - Caixa de Terminação Óptica", "Análise de conexão", "Solicitação de atribuição de IP", "Redirecionamento de portas", "Plano contratado x plano entregue", "Dificuldades de acesso"].includes(tipoServico);

    // Cliente
    add(bold("INFORMAÇÕES DO CLIENTE:"));
    add("");
    if (protocolo) add(`Protocolo: ${protocolo}`);
    if (pppoe) add(`PPPoE: ${pppoe}`);
    add("");

    // Atendimento
    add(`${bold("TIPO DE ATENDIMENTO:")} ${tipoServico}`);
    add("");

    // Equipamentos
    const equipamentos = [];
    if (serialAntiga) equipamentos.push(`SN EQUIP. ANTIGO: ${serialAntiga}`);
    if (serialNova)
      equipamentos.push(bold(`SN EQUIP. NOVO/ATUAL: ${serialNova}`));
    if (tipoEquipamento)
      equipamentos.push(`Modo OP. da ONU: ${tipoEquipamento}`);
    if (marcaONU) equipamentos.push(`Marca da ONU: ${marcaONU}`);
    if (vlan) equipamentos.push(`VLAN na WAN: ${bold(vlan)}`);
    if (olt) equipamentos.push(`Ponto de acesso: ${bold(olt)}`);

    if (equipamentos.length > 0) {
      add(bold("INFO. EQUIPAMENTOS:"));
      add("");
      equipamentos.forEach((l) => add(l));
      add("");
    }

    // Descrição
    if (descricao) {
      const texto =
        formato === "html" ? descricao.replace(/\n/g, "<br>") : descricao;
      add(`${bold("DESCRIÇÃO DETALHADA:")} ${texto}`);
      add("");
    }

    // Aniel
    if (tentouAniel || anielObrigatorio) {
      add(`${bold("TENTOU PELO ANIEL:")} ${tentouAniel || "Não informado"}`);
    }

    return linhas.join("").trim();
  };

  const mostrarToast = (mensagem) => {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = mensagem;
    toast.classList.remove("hidden");
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
      toast.classList.add("hidden");
    }, 3000);
  };

  const copiarParaClipboard = (texto) => {
    if (!texto) {
      mostrarToast("Nenhuma informação para copiar.");
      return;
    }
    navigator.clipboard
      .writeText(texto)
      .then(() => mostrarToast("Resumo copiado para a área de transferência!"))
      .catch(() => mostrarToast("Erro ao copiar. Copie manualmente."));
  };

  // === 3. Atualizações dinâmicas ===

  const atualizarCampoOutro = () => {
    const ativo = dom.outroTipoServicoRadio.checked;
    dom.outroTipoServicoInput.disabled = !ativo;
    dom.outroTipoServicoInput.required = ativo;
    if (!ativo) dom.outroTipoServicoInput.value = "";
  };

  const atualizarQuantidadeCto = () => {
    const mostrar = dom.verificarCtoRadio.checked;
    dom.quantidadePortasCtoContainer.style.display = mostrar ? "block" : "none";
    dom.quantidadePortasCtoSelect.required = mostrar;
    if (!mostrar) dom.quantidadePortasCtoSelect.value = "";
  };

  const atualizarObrigatorios = () => {
    dom.tentouPeloAnielSelect.required = false;
    dom.oltInput.required = dom.verificarCtoRadio.checked;
    dom.pppoeInput.required = !dom.verificarCtoRadio.checked;
  };

  // === 4. Botão de gerar e copiar ===

  dom.botaoGerarCopiar.addEventListener("click", () => {
    if (!dom.form.checkValidity()) {
      dom.form.reportValidity();

      const algumMarcado = [
        ...document.querySelectorAll('input[name="tipoServico"]'),
      ].some((r) => r.checked);
      if (!algumMarcado) {
        const titulo = [
          ...document.querySelectorAll(".form__section-title"),
        ].find((el) => el.textContent.includes("Tipo de Atendimento"));
        (titulo || dom.form).scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }

      mostrarToast(
        "Por favor, preencha todos os campos obrigatórios destacados."
      );
      dom.appAside.style.display = "none";
      dom.resumoTexto.innerHTML = "";
      return;
    }

    const resumoHTML = gerarTextoResumo("html");
    const resumoMarkdown = gerarTextoResumo("markdown");

    if (resumoHTML) {
      dom.resumoTexto.innerHTML = resumoHTML;
      copiarParaClipboard(resumoMarkdown);
      dom.appAside.style.display = "block";
    } else {
      dom.resumoTexto.innerHTML = "<em>Erro ao gerar resumo.</em>";
      dom.appAside.style.display = "block";
      mostrarToast("Erro ao gerar resumo.");
    }
  });

  // === 5. Eventos dinâmicos ===

  document.querySelectorAll('input[name="tipoServico"]').forEach((radio) =>
    radio.addEventListener("change", () => {
      atualizarCampoOutro();
      atualizarQuantidadeCto();
      atualizarObrigatorios();
    })
  );

  atualizarCampoOutro();
  atualizarQuantidadeCto();
  atualizarObrigatorios();
  dom.appAside.style.display = "none";

  // === 6. Botão scroll para o final ===
  if (dom.scrollToBottomBtn && dom.pageFooter) {
    const atualizarVisibilidade = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      const mostrar =
        scrollTop > 50 && scrollTop + clientHeight < scrollHeight - 50;
      dom.scrollToBottomBtn.classList.toggle("visible", mostrar);
    };
    window.addEventListener("scroll", atualizarVisibilidade);
    dom.scrollToBottomBtn.addEventListener("click", () => {
      dom.pageFooter.scrollIntoView({ behavior: "smooth" });
    });
    atualizarVisibilidade();
  }

  // === 7. Autocomplete OLT ===
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
    "CGE-SJMT-CPA-01",
    "JMH-CEN-01",
    "CGE-SJMT-CEN-01",
    "SUN-CEN-01",
    "CGE-HRO-01",
    "PHS-CEN-01",
    "PRH-CEN-01",
    "CUO-CEN-01",
  ];

  const sugestaoContainer = document.createElement("div");
  sugestaoContainer.className = "autocomplete-suggestions";
  Object.assign(sugestaoContainer.style, {
    position: "absolute",
    border: "1px solid #ccc",
    background: "#fff",
    zIndex: "1000",
    display: "none",
    maxHeight: "150px",
    overflowY: "auto",
    fontSize: "14px",
    width: dom.oltInput.offsetWidth + "px",
  });

  dom.oltInput.parentNode.style.position = "relative";
  dom.oltInput.parentNode.appendChild(sugestaoContainer);

  dom.oltInput.addEventListener("input", () => {
    const termo = dom.oltInput.value.toLowerCase();
    sugestaoContainer.innerHTML = "";

    const resultados = opcoesOlt.filter((op) =>
      op.toLowerCase().includes(termo)
    );
    if (!termo || resultados.length === 0) {
      sugestaoContainer.style.display = "none";
      return;
    }

    resultados.forEach((opcao) => {
      const div = document.createElement("div");
      div.textContent = opcao;
      Object.assign(div.style, {
        padding: "6px 10px",
        cursor: "pointer",
      });
      div.addEventListener("click", () => {
        dom.oltInput.value = opcao;
        sugestaoContainer.style.display = "none";
      });
      div.addEventListener("mouseover", () => (div.style.background = "#eee"));
      div.addEventListener("mouseout", () => (div.style.background = "#fff"));
      sugestaoContainer.appendChild(div);
    });

    sugestaoContainer.style.display = "block";
  });

  document.addEventListener("click", (e) => {
    if (!sugestaoContainer.contains(e.target) && e.target !== dom.oltInput) {
      sugestaoContainer.style.display = "none";
    }
  });
});
