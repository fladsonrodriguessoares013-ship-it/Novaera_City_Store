/* Novaera City Store — catálogo e pedidos de demonstração.
   O checkout ainda NÃO cobra PIX e NÃO entrega itens no MTA. */
const STORE_CONFIG = {
  currency: "BRL",
  products: [{"id":"vip-vip-royal","name":"VIP Royal","category":"VIP","price":10,"tag":"30 DIAS","symbol":"VIP","description":"VIP por 30 dias. Índice de entrega do sistema original: 1.","deliveryType":"give:vip","vipIndex":1,"days":30},{"id":"vip-vip-mestre","name":"VIP Mestre","category":"VIP","price":20,"tag":"30 DIAS","symbol":"VIP","description":"VIP por 30 dias. Índice de entrega do sistema original: 2.","deliveryType":"give:vip","vipIndex":2,"days":30},{"id":"vip-vip-black","name":"VIP Black","category":"VIP","price":40,"tag":"30 DIAS","symbol":"VIP","description":"VIP por 30 dias. Índice de entrega do sistema original: 3.","deliveryType":"give:vip","vipIndex":3,"days":30},{"id":"vip-vip-novaera","name":"VIP NOVAERA","category":"VIP","price":70,"tag":"30 DIAS","symbol":"VIP","description":"VIP por 30 dias. Índice de entrega do sistema original: 4.","deliveryType":"give:vip","vipIndex":4,"days":30},{"id":"vip-vip-patrocinador","name":"VIP Patrocinador","category":"VIP","price":100,"tag":"60 DIAS","symbol":"VIP","description":"VIP por 60 dias. Índice de entrega do sistema original: 5.","deliveryType":"give:vip","vipIndex":5,"days":60}]
};
const $ = s => document.querySelector(s);
const money = value => value == null ? "Preço a definir" : Number(value).toLocaleString("pt-BR", {style:"currency",currency:"BRL"});
let cart = [];
let currentFilter = "Todos";
let pixGerado = false;
const grid = $("#product-grid");
const safeReadOrders = () => { try { return JSON.parse(localStorage.getItem("novaera_store_orders") || "[]"); } catch { return []; } };
function renderProducts(){
  const items = STORE_CONFIG.products.filter(p => currentFilter === "Todos" || p.category === currentFilter);
  grid.innerHTML = items.map(p => { const art = p.category === "VIP" ? "vip" : p.category === "Moedas" ? "money" : p.category === "Armas" ? "weapons" : p.category === "Veículos" ? "vehicles" : p.category === "Casas" ? "houses" : p.category === "Facções" ? "factions" : p.category === "Garagem" ? "garage" : "vip"; return `<article class="product-card"><div class="product-visual product-visual-photo"><img class="product-image" src="assets/products/${art}.svg" alt="Imagem ilustrativa de ${escapeHtml(p.name)}" loading="lazy"><span class="tag">${p.tag || p.category}</span></div><div class="product-content"><span class="product-category">${p.category.toUpperCase()}</span><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.description || "")}</p><div class="product-buy"><div class="price">${money(p.price)}<small>${p.price == null ? "Configure o preço" : "Modo de teste"}</small></div><button class="add-button" data-add="${p.id}" ${p.price == null ? "disabled title=\"Preço precisa ser configurado\"" : ""}>${p.price == null ? "INDISPONÍVEL" : "+ ADICIONAR"}</button></div></div></article>`; }).join("");
  grid.querySelectorAll("[data-add]").forEach(btn => btn.addEventListener("click", () => addToCart(btn.dataset.add)));
}
function addToCart(id){ const product = STORE_CONFIG.products.find(p => p.id === id); if (!product || product.price == null) return; const existing = cart.find(i => i.id === id); if (existing) existing.qty++; else cart.push({...product,qty:1}); renderCart(); openCart(); }
function total(){ return cart.reduce((sum,item) => sum + item.price * item.qty, 0); }
function renderCart(){
  $("#cart-count").textContent = cart.reduce((sum,item) => sum + item.qty,0);
  $("#cart-total").textContent = money(total()); $("#modal-total").textContent = money(total()); $("#checkout").disabled = cart.length === 0;
  $("#cart-items").innerHTML = cart.length ? cart.map(item => `<div class="cart-row"><div><strong>${escapeHtml(item.name)}</strong><small>Qtd: ${item.qty} · ${money(item.price)} cada</small><button data-remove="${item.id}">Remover</button></div><strong>${money(item.price * item.qty)}</strong></div>`).join("") : `<div class="empty-cart">Sua sacola está vazia.<br>Escolha um produto para começar.</div>`;
  $("#cart-items").querySelectorAll("[data-remove]").forEach(btn => btn.addEventListener("click", () => { cart = cart.filter(i => i.id !== btn.dataset.remove); renderCart(); }));
}
function openCart(){ $("#cart-drawer").classList.add("show"); $("#backdrop").classList.add("show"); }
function closeCart(){ $("#cart-drawer").classList.remove("show"); $("#backdrop").classList.remove("show"); }
function renderOrders(){ const orders = safeReadOrders(); const host = $("#orders-list"); if (!orders.length) { host.innerHTML = '<div class="empty-cart">Nenhum pedido de teste salvo neste navegador.</div>'; return; } host.innerHTML = orders.slice().reverse().map(o => `<article class="order-card"><div><strong>${escapeHtml(o.id)}</strong><small>${escapeHtml(o.date)} · Conta: ${escapeHtml(o.contaMta || "Não informada")} · ID: ${escapeHtml(o.jogadorId || "Não informado")} · Conta MTA: ${escapeHtml(o.contaMta || o.nick || "-")}</small></div><strong>${money(o.total)}</strong><p>${o.items.map(i => `${escapeHtml(i.name)} × ${i.qty}`).join(" · ")}</p><span class="order-status">${escapeHtml(o.status)}</span></article>`).join(""); }
function escapeHtml(value){ return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
$("#open-cart").addEventListener("click",openCart); $("#close-cart").addEventListener("click",closeCart); $("#backdrop").addEventListener("click",closeCart);
$("#filters").querySelectorAll("[data-filter]").forEach(btn => btn.addEventListener("click", () => { currentFilter = btn.dataset.filter; $("#filters").querySelectorAll(".filter").forEach(b => b.classList.toggle("active",b === btn)); renderProducts(); }));
function fecharPagamento(){
  $("#checkout-modal").classList.remove("show");
  if (pixGerado) {
    pixGerado = false;
    $("#checkout-form").hidden = false;
    $("#checkout-form").reset();
    $("#order-result").hidden = true;
    $("#order-result").replaceChildren();
    $("#checkout-modal .eyebrow").textContent = "FINALIZAR PEDIDO";
    $("#checkout-modal h2").textContent = "Quase lá!";
    $("#checkout-modal .modal-intro").textContent = "Informe os dados da sua conta para gerar o PIX.";
  }
}
$("#checkout").addEventListener("click",() => { if (!cart.length) return; closeCart(); fecharPagamento(); $("#order-result").hidden = true; $("#checkout-modal").classList.add("show"); });
$("#close-modal").addEventListener("click",fecharPagamento);
$("#checkout-modal").addEventListener("click",e => { if (e.target.id === "checkout-modal") fecharPagamento(); });
// Código copiado pelo comando /vincularloja no cliente MTA.
const linkCodeInput = $("#link-code");
const linkCodeFeedback = $("#link-code-feedback");
function aplicarCodigoMTA(texto) {
  const codigo = String(texto || "").trim().toUpperCase();
  if (!/^[A-F0-9]{10}$/.test(codigo)) {
    linkCodeFeedback.textContent = "Código inválido. Use /vincularloja no MTA e tente novamente.";
    return false;
  }
  linkCodeInput.value = codigo;
  linkCodeFeedback.textContent = "Código preenchido! Agora informe seu ID e e-mail.";
  return true;
}
$("#paste-link-code").addEventListener("click", async () => {
  try {
    if (!navigator.clipboard || !navigator.clipboard.readText) throw new Error("Clipboard indisponível");
    aplicarCodigoMTA(await navigator.clipboard.readText());
  } catch (err) {
    linkCodeFeedback.textContent = "O navegador não permitiu colar automaticamente. Clique no campo e pressione Ctrl+V.";
    linkCodeInput.focus();
  }
});
linkCodeInput.addEventListener("paste", event => {
  const texto = event.clipboardData && event.clipboardData.getData("text");
  if (texto && /^[A-Fa-f0-9]{10}$/.test(texto.trim())) {
    event.preventDefault();
    aplicarCodigoMTA(texto);
  }
});
$("#checkout-form").addEventListener("submit", async e => {
  e.preventDefault();
  if (!cart.length) return;
  if (cart.length !== 1 || cart[0].qty !== 1 || cart[0].category !== "VIP") {
    alert("Por enquanto, o PIX aceita apenas 1 VIP por pedido. Retire os outros itens da sacola.");
    return;
  }
  const codigoVinculacao = $("#link-code").value.trim().toUpperCase();
  const jogadorId = $("#player-id").value.trim();
  const email = $("#buyer-email").value.trim();
  if (!/^[A-F0-9]{10}$/.test(codigoVinculacao) || !/^[0-9]{1,10}$/.test(jogadorId) || !email) {
    alert("Preencha o código do MTA, ID e e-mail corretamente."); return;
  }
  const btn = $("#checkout-form button[type=submit]");
  const result = $("#order-result");
  btn.disabled = true;
  btn.textContent = "GERANDO PIX...";
  result.hidden = false;
  result.replaceChildren();
  try {
    const resposta = await fetch("/api/pix/criar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ produtoId: cart[0].id, codigoVinculacao, jogadorId, email })
    });
    const dados = await resposta.json();
    if (!resposta.ok) throw new Error(dados.erro || "Nao foi possivel gerar o PIX.");
    if (!dados.qrCode && !dados.qrCodeBase64 && !dados.ticketUrl) {
      throw new Error("Mercado Pago nao retornou dados para pagamento. Nao tente pagar sem confirmar o pedido.");
    }
    const heading = document.createElement("strong");
    heading.textContent = "PIX GERADO — " + money(cart[0].price);
    result.append(heading, document.createElement("hr"));
    if (dados.qrCodeBase64) {
      const img = document.createElement("img");
      img.alt = "QR Code PIX";
      img.style.cssText = "display:block;width:210px;max-width:100%;margin:12px auto;background:white;padding:8px;border-radius:8px";
      img.src = "data:image/png;base64," + dados.qrCodeBase64;
      result.append(img);
    }
    if (dados.qrCode) {
      const campo = document.createElement("textarea");
      campo.readOnly = true;
      campo.value = dados.qrCode;
      campo.rows = 4;
      campo.style.cssText = "width:100%;box-sizing:border-box;resize:vertical";
      result.append(campo);
      const copiar = document.createElement("button");
      copiar.type = "button";
      copiar.textContent = "COPIAR PIX COPIA E COLA";
      copiar.className = "checkout-button";
      copiar.addEventListener("click", async () => {
        try { await navigator.clipboard.writeText(dados.qrCode); copiar.textContent = "PIX COPIADO!"; }
        catch { campo.select(); alert("Selecione e copie o codigo PIX acima."); }
      });
      result.append(copiar);
    }
    if (dados.ticketUrl && /^https:\/\//.test(dados.ticketUrl)) {
      const a = document.createElement("a");
      a.href = dados.ticketUrl;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = "Abrir pagina do PIX";
      result.append(a);
    }
    const status = document.createElement("p");
    status.textContent = "Aguardando confirmacao do pagamento. VIP nao e entregue automaticamente.";
    result.append(status);
    const order = {
      id: dados.referencia, date: new Date().toLocaleString("pt-BR"),
      contaMta: "Conta vinculada pelo MTA", jogadorId, items: [{ id: cart[0].id, name: cart[0].name, qty: 1, price: cart[0].price }],
      total: cart[0].price, status: "PIX gerado — aguardando confirmacao"
    };
    const orders = safeReadOrders(); orders.push(order);
    localStorage.setItem("novaera_store_orders", JSON.stringify(orders));
    renderOrders();
    cart = []; renderCart();
    const voltar = document.createElement("button");
    voltar.type = "button";
    voltar.className = "secondary-button";
    voltar.textContent = "VOLTAR À LOJA";
    voltar.style.cssText = "display:block;width:100%;margin-top:12px";
    voltar.addEventListener("click", fecharPagamento);
    result.append(voltar);
    pixGerado = true;
    $("#checkout-form").hidden = true;
    $("#checkout-modal .eyebrow").textContent = "PAGAMENTO PIX";
    $("#checkout-modal h2").textContent = "PIX GERADO";
    $("#checkout-modal .modal-intro").textContent = "Valor: " + money(order.total) + " • Pague pelo QR Code ou Copia e Cola.";
  } catch (err) {
    result.textContent = "Erro ao gerar PIX: " + err.message;
  } finally {
    btn.disabled = false;
    btn.textContent = "GERAR PIX";
  }
});
$("#clear-orders").addEventListener("click",() => { if (confirm("Apagar o histórico de pedidos salvo somente neste navegador?")) { localStorage.removeItem("novaera_store_orders"); renderOrders(); } });
document.addEventListener("keydown",e => { if (e.key === "Escape") { closeCart(); fecharPagamento(); } });
$("#year").textContent = new Date().getFullYear(); renderProducts(); renderCart(); renderOrders();
