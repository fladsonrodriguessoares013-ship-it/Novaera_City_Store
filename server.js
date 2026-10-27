
"use strict";

const express = require("express");
const { Pool } = require("pg");
const { randomUUID, createHmac, timingSafeEqual, randomBytes, createHash } = require("crypto");

const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "32kb" }));
app.use(express.static(__dirname));

// ====================================
// BANCO POSTGRESQL - NOVAERA CITY
// ====================================

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000,
  max: 5
});

let bancoPronto = false;

// ====================================
// CATALOGO DE VIPS - VALORES EM REAIS (PIX)
// ====================================

const produtos = {
  "vip-vip-royal": { nome: "VIP Royal", preco: "10.00", vipNumero: 1, dias: 30 },
  "vip-vip-mestre": { nome: "VIP Mestre", preco: "20.00", vipNumero: 2, dias: 30 },
  "vip-vip-black": { nome: "VIP Black", preco: "40.00", vipNumero: 3, dias: 30 },
  "vip-vip-novaera": { nome: "VIP NOVAERA", preco: "70.00", vipNumero: 4, dias: 30 },
  "vip-vip-patrocinador": { nome: "VIP Patrocinador", preco: "100.00", vipNumero: 5, dias: 60 },
  "weapon-1": { nome: "G36C Azul", preco: "10.00", tipo: "give:weapon-skin", skinId: 1 },
  "weapon-2": { nome: "G36C Rosa", preco: "10.00", tipo: "give:weapon-skin", skinId: 2 },
  "weapon-3": { nome: "G36C Verde", preco: "10.00", tipo: "give:weapon-skin", skinId: 3 },
  "weapon-4": { nome: "G36C Amarela", preco: "10.00", tipo: "give:weapon-skin", skinId: 4 },
  "weapon-5": { nome: "G36C Roxa", preco: "10.00", tipo: "give:weapon-skin", skinId: 5 },
  "weapon-6": { nome: "G36C Camo Vermelha", preco: "15.00", tipo: "give:weapon-skin", skinId: 6 },
  "weapon-7": { nome: "G36C Camo Azul", preco: "15.00", tipo: "give:weapon-skin", skinId: 7 },
  "weapon-8": { nome: "G36C Camo Roxa", preco: "15.00", tipo: "give:weapon-skin", skinId: 8 },
  "weapon-9": { nome: "G36C Camo Verde", preco: "15.00", tipo: "give:weapon-skin", skinId: 9 },
  "weapon-10": { nome: "G36C Deserto", preco: "15.00", tipo: "give:weapon-skin", skinId: 10 },
  "weapon-11": { nome: "G36C Galáxia 1", preco: "20.00", tipo: "give:weapon-skin", skinId: 11 },
  "weapon-12": { nome: "G36C Galáxia 2", preco: "20.00", tipo: "give:weapon-skin", skinId: 12 },
  "weapon-13": { nome: "G36C Galáxia 3", preco: "20.00", tipo: "give:weapon-skin", skinId: 13 },
  "weapon-14": { nome: "G36C Vulcan", preco: "20.00", tipo: "give:weapon-skin", skinId: 14 },
  "weapon-15": { nome: "G36C Asiimov", preco: "20.00", tipo: "give:weapon-skin", skinId: 15 },
  "weapon-16": { nome: "G36C Asiimov Roxa", preco: "20.00", tipo: "give:weapon-skin", skinId: 16 },
  "weapon-17": { nome: "G36C Asiimov Verde", preco: "20.00", tipo: "give:weapon-skin", skinId: 17 },
  "weapon-76": { nome: "G36C Lacoste", preco: "30.00", tipo: "give:weapon-skin", skinId: 76 },
  "weapon-18": { nome: "G36C Natal 2024", preco: "55.00", tipo: "give:weapon-skin", skinId: 18 },
  "weapon-43": { nome: "Parafal Azul", preco: "10.00", tipo: "give:weapon-skin", skinId: 43 },
  "weapon-44": { nome: "Parafal Rosa", preco: "10.00", tipo: "give:weapon-skin", skinId: 44 },
  "weapon-45": { nome: "Parafal Verde", preco: "10.00", tipo: "give:weapon-skin", skinId: 45 },
  "weapon-59": { nome: "Parafal Amarela", preco: "10.00", tipo: "give:weapon-skin", skinId: 59 },
  "weapon-60": { nome: "Parafal Roxa", preco: "10.00", tipo: "give:weapon-skin", skinId: 60 },
  "weapon-61": { nome: "Parafal Camo Vermelha", preco: "15.00", tipo: "give:weapon-skin", skinId: 61 },
  "weapon-49": { nome: "Parafal Camo Azul", preco: "15.00", tipo: "give:weapon-skin", skinId: 49 },
  "weapon-50": { nome: "Parafal Camo Roxa", preco: "15.00", tipo: "give:weapon-skin", skinId: 50 },
  "weapon-51": { nome: "Parafal Camo Verde", preco: "15.00", tipo: "give:weapon-skin", skinId: 51 },
  "weapon-52": { nome: "Parafal Deserto", preco: "15.00", tipo: "give:weapon-skin", skinId: 52 },
  "weapon-53": { nome: "Parafal Galáxia 1", preco: "20.00", tipo: "give:weapon-skin", skinId: 53 },
  "weapon-54": { nome: "Parafal Galáxia 2", preco: "20.00", tipo: "give:weapon-skin", skinId: 54 },
  "weapon-55": { nome: "Parafal Galáxia 3", preco: "20.00", tipo: "give:weapon-skin", skinId: 55 },
  "weapon-63": { nome: "Parafal Vulcan", preco: "20.00", tipo: "give:weapon-skin", skinId: 63 },
  "weapon-67": { nome: "Parafal Asiimov", preco: "20.00", tipo: "give:weapon-skin", skinId: 67 },
  "weapon-70": { nome: "Parafal Asiimov Roxa", preco: "20.00", tipo: "give:weapon-skin", skinId: 70 },
  "weapon-73": { nome: "Parafal Asiimov Verde", preco: "20.00", tipo: "give:weapon-skin", skinId: 73 },
  "weapon-75": { nome: "Parafal Lacoste", preco: "30.00", tipo: "give:weapon-skin", skinId: 75 },
  "weapon-74": { nome: "Parafal Natal 2024", preco: "55.00", tipo: "give:weapon-skin", skinId: 74 },
  "weapon-25": { nome: "AWP Dragon Lore", preco: "20.00", tipo: "give:weapon-skin", skinId: 25 },
  "weapon-26": { nome: "AWP Laranja", preco: "20.00", tipo: "give:weapon-skin", skinId: 26 },
  "weapon-27": { nome: "AWP Asiimov", preco: "20.00", tipo: "give:weapon-skin", skinId: 27 },
  "weapon-36": { nome: "M9 Aquecimento de Aço", preco: "10.00", tipo: "give:weapon-skin", skinId: 36 },
  "weapon-37": { nome: "M9 Massacre", preco: "15.00", tipo: "give:weapon-skin", skinId: 37 },
  "weapon-35": { nome: "M9 Safira", preco: "20.00", tipo: "give:weapon-skin", skinId: 35 },
  "weapon-38": { nome: "M9 Rubi", preco: "20.00", tipo: "give:weapon-skin", skinId: 38 },
  "weapon-42": { nome: "GLOCK Espectros", preco: "10.00", tipo: "give:weapon-skin", skinId: 42 },
  "weapon-41": { nome: "GLOCK Fuinha", preco: "15.00", tipo: "give:weapon-skin", skinId: 41 },
  "weapon-40": { nome: "GLOCK Rebelde", preco: "20.00", tipo: "give:weapon-skin", skinId: 40 },
  "money-100000": { nome: "+ R$ 100.000", preco: "10.00", tipo: "give:money", quantia: 100000 },
  "money-250000": { nome: "+ R$ 250.000", preco: "20.00", tipo: "give:money", quantia: 250000 },
  "money-500000": { nome: "+ R$ 500.000", preco: "35.00", tipo: "give:money", quantia: 500000 },
  "money-1000000": { nome: "+ R$ 1.000.000", preco: "65.00", tipo: "give:money", quantia: 1000000 },
  "vehicle-431-7": { nome: "Ônibus — 7 dias", preco: "7.00", tipo: "give:vehicle", modelo: 431, dias: 7 },
  "vehicle-431-15": { nome: "Ônibus — 15 dias", preco: "15.00", tipo: "give:vehicle", modelo: 431, dias: 15 },
  "vehicle-431-30": { nome: "Ônibus — 30 dias", preco: "20.00", tipo: "give:vehicle", modelo: 431, dias: 30 },
  "vehicle-431-230": { nome: "Ônibus — Permanente", preco: "200.00", tipo: "give:vehicle", modelo: 431, dias: null },
  "vehicle-422-7": { nome: "Saveiro Paredão — 7 dias", preco: "7.00", tipo: "give:vehicle", modelo: 422, dias: 7 },
  "vehicle-422-15": { nome: "Saveiro Paredão — 15 dias", preco: "15.00", tipo: "give:vehicle", modelo: 422, dias: 15 },
  "vehicle-422-30": { nome: "Saveiro Paredão — 30 dias", preco: "25.00", tipo: "give:vehicle", modelo: 422, dias: 30 },
  "vehicle-422-230": { nome: "Saveiro Paredão — Permanente", preco: "200.00", tipo: "give:vehicle", modelo: 422, dias: null },
  "vehicle-522-7": { nome: "BMW GS R1200 — 7 dias", preco: "10.00", tipo: "give:vehicle", modelo: 522, dias: 7 },
  "vehicle-522-15": { nome: "BMW GS R1200 — 15 dias", preco: "25.00", tipo: "give:vehicle", modelo: 522, dias: 15 },
  "vehicle-522-30": { nome: "BMW GS R1200 — 30 dias", preco: "40.00", tipo: "give:vehicle", modelo: 522, dias: 30 },
  "vehicle-522-230": { nome: "BMW GS R1200 — Permanente", preco: "300.00", tipo: "give:vehicle", modelo: 522, dias: null },
  "vehicle-559-7": { nome: "Skyline GTR R34 — 7 dias", preco: "10.00", tipo: "give:vehicle", modelo: 559, dias: 7 },
  "vehicle-559-15": { nome: "Skyline GTR R34 — 15 dias", preco: "25.00", tipo: "give:vehicle", modelo: 559, dias: 15 },
  "vehicle-559-30": { nome: "Skyline GTR R34 — 30 dias", preco: "45.00", tipo: "give:vehicle", modelo: 559, dias: 30 },
  "vehicle-559-230": { nome: "Skyline GTR R34 — Permanente", preco: "350.00", tipo: "give:vehicle", modelo: 559, dias: null },
  "vehicle-546-7": { nome: "AMG GT 63S — 7 dias", preco: "10.00", tipo: "give:vehicle", modelo: 546, dias: 7 },
  "vehicle-546-15": { nome: "AMG GT 63S — 15 dias", preco: "20.00", tipo: "give:vehicle", modelo: 546, dias: 15 },
  "vehicle-546-30": { nome: "AMG GT 63S — 30 dias", preco: "30.00", tipo: "give:vehicle", modelo: 546, dias: 30 },
  "vehicle-546-230": { nome: "AMG GT 63S — Permanente", preco: "400.00", tipo: "give:vehicle", modelo: 546, dias: null },
  "vehicle-602-7": { nome: "Mazda Rx7 — 7 dias", preco: "15.00", tipo: "give:vehicle", modelo: 602, dias: 7 },
  "vehicle-602-15": { nome: "Mazda Rx7 — 15 dias", preco: "30.00", tipo: "give:vehicle", modelo: 602, dias: 15 },
  "vehicle-602-30": { nome: "Mazda Rx7 — 30 dias", preco: "50.00", tipo: "give:vehicle", modelo: 602, dias: 30 },
  "vehicle-602-230": { nome: "Mazda Rx7 — Permanente", preco: "500.00", tipo: "give:vehicle", modelo: 602, dias: null },
  "vehicle-496-7": { nome: "McLaren 600LT — 7 dias", preco: "10.00", tipo: "give:vehicle", modelo: 496, dias: 7 },
  "vehicle-496-15": { nome: "McLaren 600LT — 15 dias", preco: "20.00", tipo: "give:vehicle", modelo: 496, dias: 15 },
  "vehicle-496-30": { nome: "McLaren 600LT — 30 dias", preco: "35.00", tipo: "give:vehicle", modelo: 496, dias: 30 },
  "vehicle-496-230": { nome: "McLaren 600LT — Permanente", preco: "400.00", tipo: "give:vehicle", modelo: 496, dias: null },
  "vehicle-487-7": { nome: "Swift Deluxe — 7 dias", preco: "15.00", tipo: "give:vehicle", modelo: 487, dias: 7 },
  "vehicle-487-15": { nome: "Swift Deluxe — 15 dias", preco: "25.00", tipo: "give:vehicle", modelo: 487, dias: 15 },
  "vehicle-487-30": { nome: "Swift Deluxe — 30 dias", preco: "45.00", tipo: "give:vehicle", modelo: 487, dias: 30 },
  "vehicle-487-230": { nome: "Swift Deluxe — Permanente", preco: "300.00", tipo: "give:vehicle", modelo: 487, dias: null },
  "vehicle-456-7": { nome: "Caminhão Baú — 7 dias", preco: "12.00", tipo: "give:vehicle", modelo: 456, dias: 7 },
  "vehicle-456-15": { nome: "Caminhão Baú — 15 dias", preco: "25.00", tipo: "give:vehicle", modelo: 456, dias: 15 },
  "vehicle-456-30": { nome: "Caminhão Baú — 30 dias", preco: "45.00", tipo: "give:vehicle", modelo: 456, dias: 30 },
  "vehicle-456-230": { nome: "Caminhão Baú — Permanente", preco: "300.00", tipo: "give:vehicle", modelo: 456, dias: null },
  "vehicle-463-7": { nome: "MonoWheel — 7 dias", preco: "7.00", tipo: "give:vehicle", modelo: 463, dias: 7 },
  "vehicle-463-15": { nome: "MonoWheel — 15 dias", preco: "15.00", tipo: "give:vehicle", modelo: 463, dias: 15 },
  "vehicle-463-30": { nome: "MonoWheel — 30 dias", preco: "30.00", tipo: "give:vehicle", modelo: 463, dias: 30 },
  "vehicle-463-230": { nome: "MonoWheel — Permanente", preco: "150.00", tipo: "give:vehicle", modelo: 463, dias: null },
  "vehicle-547-7": { nome: "Audi RS6 (BLINDADO) — 7 dias", preco: "20.00", tipo: "give:vehicle", modelo: 547, dias: 7 },
  "vehicle-547-15": { nome: "Audi RS6 (BLINDADO) — 15 dias", preco: "35.00", tipo: "give:vehicle", modelo: 547, dias: 15 },
  "vehicle-547-30": { nome: "Audi RS6 (BLINDADO) — 30 dias", preco: "60.00", tipo: "give:vehicle", modelo: 547, dias: 30 },
  "vehicle-547-230": { nome: "Audi RS6 (BLINDADO) — Permanente", preco: "500.00", tipo: "give:vehicle", modelo: 547, dias: null },
  "vehicle-415-7": { nome: "GTR R35 (BLINDADA) — 7 dias", preco: "20.00", tipo: "give:vehicle", modelo: 415, dias: 7 },
  "vehicle-415-15": { nome: "GTR R35 (BLINDADA) — 15 dias", preco: "45.00", tipo: "give:vehicle", modelo: 415, dias: 15 },
  "vehicle-415-30": { nome: "GTR R35 (BLINDADA) — 30 dias", preco: "70.00", tipo: "give:vehicle", modelo: 415, dias: 30 },
  "vehicle-415-230": { nome: "GTR R35 (BLINDADA) — Permanente", preco: "550.00", tipo: "give:vehicle", modelo: 415, dias: null },
  "vehicle-438-7": { nome: "G63 (BLINDADA) — 7 dias", preco: "20.00", tipo: "give:vehicle", modelo: 438, dias: 7 },
  "vehicle-438-15": { nome: "G63 (BLINDADA) — 15 dias", preco: "35.00", tipo: "give:vehicle", modelo: 438, dias: 15 },
  "vehicle-438-30": { nome: "G63 (BLINDADA) — 30 dias", preco: "60.00", tipo: "give:vehicle", modelo: 438, dias: 30 },
  "vehicle-438-230": { nome: "G63 (BLINDADA) — Permanente", preco: "500.00", tipo: "give:vehicle", modelo: 438, dias: null },
  "vehicle-400-7": { nome: "X7 (BLINDADA) — 7 dias", preco: "20.00", tipo: "give:vehicle", modelo: 400, dias: 7 },
  "vehicle-400-15": { nome: "X7 (BLINDADA) — 15 dias", preco: "40.00", tipo: "give:vehicle", modelo: 400, dias: 15 },
  "vehicle-400-30": { nome: "X7 (BLINDADA) — 30 dias", preco: "60.00", tipo: "give:vehicle", modelo: 400, dias: 30 },
  "vehicle-400-230": { nome: "X7 (BLINDADA) — Permanente", preco: "500.00", tipo: "give:vehicle", modelo: 400, dias: null }
};

// ====================================
// ====================================
// CRIAR TABELA AUTOMATICAMENTE
// ====================================

async function prepararBanco() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS novaera_pedidos (
      referencia UUID PRIMARY KEY,
      mp_order_id TEXT UNIQUE,
      produto_id TEXT NOT NULL,
      produto_nome TEXT NOT NULL,
      valor_centavos INTEGER NOT NULL CHECK (valor_centavos > 0),
      email TEXT NOT NULL,
      jogador_id TEXT,
      conta_mta TEXT,
      estado TEXT NOT NULL DEFAULT 'criando'
        CHECK (estado IN (
          'criando', 'aguardando', 'aprovado',
          'cancelado', 'erro'
        )),
      entrega_estado TEXT NOT NULL DEFAULT 'bloqueada'
        CHECK (entrega_estado IN (
          'bloqueada', 'pendente', 'entregue'
        )),
      criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      aprovado_em TIMESTAMPTZ,
      entregue_em TIMESTAMPTZ
    )
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_novaera_pedidos_estado
    ON novaera_pedidos (estado, entrega_estado)
  `);

  await pool.query(`CREATE TABLE IF NOT EXISTS novaera_entregas (
    referencia UUID PRIMARY KEY REFERENCES novaera_pedidos(referencia),
    conta_mta TEXT NOT NULL,
    estado TEXT NOT NULL CHECK (estado IN ('reservado','confirmado')),
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS novaera_codigos_conta (
    codigo_hash TEXT PRIMARY KEY,
    conta_mta TEXT NOT NULL,
    expira_em TIMESTAMPTZ NOT NULL,
    usado_em TIMESTAMPTZ,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_novaera_codigos_conta_conta
    ON novaera_codigos_conta (conta_mta, criado_em DESC)`);
  bancoPronto = true;

  console.log(
    "[NOVAERA] PostgreSQL conectado; tabela de pedidos pronta!"
  );
}

// ====================================
// CONVERTER PRECO PARA CENTAVOS
// ====================================

function valorEmCentavos(valor) {
  if (
    typeof valor !== "string" ||
    !/^\d+\.\d{2}$/.test(valor)
  ) {
    throw new Error("Preco do produto invalido");
  }

  const [reais, centavos] = valor.split(".");
  const numero = Number(reais) * 100 + Number(centavos);

  if (!Number.isSafeInteger(numero) || numero <= 0) {
    throw new Error("Preco invalido");
  }

  return numero;
}

// ====================================
// VALIDAR WEBHOOK MERCADO PAGO
// ====================================

function validarWebhook(req) {
  const secret = process.env.MP_WEBHOOK_SECRET;
  const assinatura = req.get("x-signature") || "";
  const requestId = req.get("x-request-id") || "";
  const id = req.query["data.id"];

  if (
    !secret ||
    typeof id !== "string" ||
    !id ||
    !requestId
  ) {
    return null;
  }

  const partes = {};

  for (const parte of assinatura.split(",")) {
    const pos = parte.indexOf("=");

    if (pos > 0) {
      partes[parte.slice(0, pos).trim()] =
        parte.slice(pos + 1).trim();
    }
  }

  const { ts, v1 } = partes;

  if (
    !/^\d+$/.test(ts || "") ||
    !/^[a-fA-F0-9]{64}$/.test(v1 || "")
  ) {
    return null;
  }

  const n = Number(ts);
  const timestampMs = n < 1e11 ? n * 1000 : n;

  if (
    !Number.isFinite(timestampMs) ||
    Math.abs(Date.now() - timestampMs) > 600000
  ) {
    return null;
  }

  const manifesto =
    `id:${id.toLowerCase()};` +
    `request-id:${requestId};` +
    `ts:${ts};`;

  const esperado = createHmac("sha256", secret)
    .update(manifesto)
    .digest();

  const recebido = Buffer.from(v1, "hex");

  if (
    recebido.length !== esperado.length ||
    !timingSafeEqual(recebido, esperado)
  ) {
    return null;
  }

  return id;
}

// ====================================
// STATUS DA LOJA
// ====================================

app.get("/api/health", (req, res) => {
  res.json({
    loja: "NOVAERA CITY STORE",
    status: bancoPronto
      ? "online"
      : "banco_indisponivel",
    pix: "mercadopago",
    entregaVip: entregaLigada() && publicoLigado() && !!dataPublica() ? "habilitada" : "desativada"
  });
});

// ====================================
// GERAR PIX E SALVAR PEDIDO
// ====================================

app.post("/api/pix/criar", async (req, res) => {
  if (!bancoPronto || !entregaLigada() || !publicoLigado() || !dataPublica() || Date.now() < Date.parse(dataPublica())) {
    return res.status(503).json({ erro: "Vendas VIP indisponiveis temporariamente" });
  }

  const { produtoId, email, jogadorId, codigoVinculacao } = req.body || {};
  const produto = produtos[produtoId];
  if (produto && produto.tipo && process.env.NOVAERA_EXTRA_PRODUCTS_ENABLED !== "true") {
    return res.status(503).json({ erro: "Novos produtos aguardam testes de entrega no MTA" });
  }

  if (!produto) {
    return res.status(400).json({
      erro: "Produto invalido"
    });
  }

  if (
    typeof email !== "string" ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return res.status(400).json({
      erro: "E-mail invalido"
    });
  }

  const id =
    jogadorId == null || jogadorId === ""
      ? null
      : String(jogadorId).trim();

  if (id !== null && !/^\d{1,10}$/.test(id)) {
    return res.status(400).json({
      erro: "ID do jogador invalido"
    });
  }

  if (typeof codigoVinculacao !== "string" || !/^[A-F0-9]{10}$/.test(codigoVinculacao.trim().toUpperCase())) {
    return res.status(400).json({ erro: "Codigo de vinculacao invalido. Digite /vincularloja no MTA." });
  }

  const token = process.env.MP_ACCESS_TOKEN;

  if (!token) {
    return res.status(503).json({
      erro: "Mercado Pago nao configurado"
    });
  }

  const referencia = randomUUID();
  const centavos = valorEmCentavos(produto.preco);

  try {
    // Consumo atomico: o comprador nao pode escolher outra conta nem reutilizar o codigo.
    const codigoHash = createHash("sha256").update(codigoVinculacao.trim().toUpperCase()).digest("hex");
    const cliente = await pool.connect();
    let contaMta;
    try {
      await cliente.query("BEGIN");
      const vinculo = await cliente.query(`UPDATE novaera_codigos_conta
        SET usado_em = NOW()
        WHERE codigo_hash = $1 AND usado_em IS NULL AND expira_em > NOW()
        RETURNING conta_mta`, [codigoHash]);
      if (vinculo.rowCount !== 1) {
        await cliente.query("ROLLBACK");
        return res.status(400).json({ erro: "Codigo expirado ou ja utilizado. Gere outro com /vincularloja." });
      }
      contaMta = vinculo.rows[0].conta_mta;
      // Teste de producao: bloquear compras de outros produtos/contas.
      if (process.env.NOVAERA_TEST_ACCOUNT === "coringa" &&
          (contaMta !== "coringa" || produtoId !== "vip-vip-royal")) {
        await cliente.query("ROLLBACK");
        return res.status(403).json({ erro: "Loja restrita ao VIP Royal da conta de teste" });
      }
      await cliente.query(`INSERT INTO novaera_pedidos (
        referencia, produto_id, produto_nome, valor_centavos, email, jogador_id, conta_mta
      ) VALUES ($1,$2,$3,$4,$5,$6,$7)`, [
        referencia, produtoId, produto.nome, centavos, email, id, contaMta
      ]);
      await cliente.query("COMMIT");
    } catch (e) {
      await cliente.query("ROLLBACK");
      throw e;
    } finally {
      cliente.release();
    }

    const resposta = await fetch(
      "https://api.mercadopago.com/v1/orders",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Idempotency-Key": referencia
        },
        body: JSON.stringify({
          type: "online",
          processing_mode: "automatic",
          external_reference: referencia,
          total_amount: produto.preco,
          payer: { email },
          transactions: {
            payments: [
              {
                amount: produto.preco,
                payment_method: {
                  id: "pix",
                  type: "bank_transfer"
                }
              }
            ]
          }
        }),
        signal: AbortSignal.timeout(15000)
      }
    );

    const dados = await resposta.json();

    if (!resposta.ok || !dados.id) {
      console.error(
        "[NOVAERA] Falha ao criar PIX:",
        resposta.status,
        dados.error || dados.message
      );

      await pool.query(`
        UPDATE novaera_pedidos
        SET estado = 'erro',
            atualizado_em = NOW()
        WHERE referencia = $1
      `, [referencia]);

      return res.status(502).json({
        erro: "Nao foi possivel gerar o PIX"
      });
    }

    await pool.query(`
      UPDATE novaera_pedidos
      SET mp_order_id = $2,
          estado = CASE
            WHEN estado = 'aprovado'
            THEN estado
            ELSE 'aguardando'
          END,
          atualizado_em = NOW()
      WHERE referencia = $1
    `, [referencia, String(dados.id)]);

    const pagamento =
      dados.transactions?.payments?.[0];

    return res.json({
      orderId: dados.id,
      referencia,
      status: dados.status,
      qrCode: pagamento?.payment_method?.qr_code,
      qrCodeBase64:
        pagamento?.payment_method?.qr_code_base64,
      ticketUrl:
        pagamento?.payment_method?.ticket_url
    });

  } catch (erro) {
    console.error(
      "[NOVAERA] Erro ao criar PIX:",
      erro.message
    );

    return res.status(503).json({
      erro: "Falha temporaria ao registrar o pedido"
    });
  }
});

// Consulta publica limitada ao estado do pedido. Somente o webhook validado
// pode marcar um pagamento como aprovado.
app.get("/api/pix/status/:referencia", async (req, res) => {
  const referencia = req.params.referencia;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(referencia)) {
    return res.status(400).json({ erro: "Referencia invalida" });
  }
  if (!bancoPronto) return res.status(503).json({ erro: "Banco indisponivel" });
  try {
    const result = await pool.query(
      "SELECT estado FROM novaera_pedidos WHERE referencia = $1::uuid",
      [referencia]
    );
    if (!result.rowCount) return res.status(404).json({ erro: "Pedido nao encontrado" });
    res.set("Cache-Control", "no-store");
    return res.json({ estado: result.rows[0].estado });
  } catch (erro) {
    console.error("[NOVAERA] Falha ao consultar status:", erro.message);
    return res.status(503).json({ erro: "Nao foi possivel consultar o pedido" });
  }
});

// ====================================
// WEBHOOK MERCADO PAGO
// ====================================

app.post(
  "/api/webhooks/mercadopago",
  async (req, res) => {
    const id = validarWebhook(req);

    if (!id) {
      return res.sendStatus(401);
    }

    const tipo =
      req.body?.type || req.body?.topic;

    if (tipo !== "order") {
      return res.sendStatus(200);
    }

    if (
      !bancoPronto ||
      !process.env.MP_ACCESS_TOKEN
    ) {
      return res.sendStatus(503);
    }

    try {
      const resposta = await fetch(
        "https://api.mercadopago.com/v1/orders/" +
          encodeURIComponent(id),
        {
          headers: {
            Authorization:
              `Bearer ${process.env.MP_ACCESS_TOKEN}`
          },
          signal: AbortSignal.timeout(10000)
        }
      );

      if (!resposta.ok) {
        return res.sendStatus(503);
      }

      const pedido = await resposta.json();

      if (
        String(pedido.id) !== id ||
        typeof pedido.external_reference !== "string"
      ) {
        return res.sendStatus(400);
      }

      const referencia = pedido.external_reference;

      const encontrado = await pool.query(
        "SELECT * FROM novaera_pedidos WHERE referencia::text = $1",
        [referencia]
      );

      if (!encontrado.rowCount) {
        console.warn(
          "[NOVAERA] Pedido desconhecido:",
          id
        );

        return res.sendStatus(200);
      }

      const local = encontrado.rows[0];

      if (
        local.mp_order_id &&
        local.mp_order_id !== id
      ) {
        return res.sendStatus(400);
      }

      const total = Number(pedido.total_amount);

      if (
        !Number.isFinite(total) ||
        Math.round(total * 100) !== local.valor_centavos
      ) {
        console.error(
          "[NOVAERA] Valor divergente:",
          id
        );

        return res.sendStatus(400);
      }

      const aprovado =
        pedido.status === "processed" &&
        pedido.status_detail === "accredited";

      if (aprovado) {
        await pool.query(`
          UPDATE novaera_pedidos
          SET mp_order_id = $2,
              estado = 'aprovado',
              aprovado_em =
                COALESCE(aprovado_em, NOW()),
              atualizado_em = NOW()
          WHERE referencia = $1
            AND estado <> 'aprovado'
        `, [referencia, id]);

        console.log(
          "[NOVAERA] PIX aprovado e registrado:",
          referencia
        );
      } else {
        console.log(
          "[NOVAERA] Pedido ainda nao aprovado:",
          id,
          pedido.status,
          pedido.status_detail
        );
      }

      // Apenas pagamentos autenticados pelo Mercado Pago entram na fila.
      if (aprovado) {
        await pool.query(`UPDATE novaera_pedidos SET entrega_estado = 'pendente'
          WHERE referencia = $1 AND estado = 'aprovado' AND entrega_estado = 'bloqueada'`, [referencia]);
      }

      return res.sendStatus(200);

    } catch (erro) {
      console.error(
        "[NOVAERA] Erro no webhook:",
        erro.message
      );

      return res.sendStatus(503);
    }
  }
);

// ====================================
// PONTE PRIVADA MTA - desativada ate testes
// ====================================
const entregaLigada = () => process.env.NOVAERA_DELIVERY_ENABLED === "true";
// Em teste real, permitir entrega apenas para a conta configurada.
// Modo publico exige habilitacao explicita e data de corte para nao entregar pedidos antigos.
const publicoLigado = () => process.env.NOVAERA_PUBLIC_ENABLED === "true";
const dataPublica = () => {
  const valor = process.env.NOVAERA_PUBLIC_FROM || "";
  const d = new Date(valor);
  return /^\d{4}-\d{2}-\d{2}T/.test(valor) && Number.isFinite(d.getTime()) ? d.toISOString() : null;
};
const contaLiberada = conta => typeof conta === "string" && conta.length > 0 && conta.length <= 64 && publicoLigado() && !!dataPublica();
function autorizarMta(req, res, next) {
  const segredo = process.env.NOVAERA_BRIDGE_SECRET;
  const recebido = req.get("x-novaera-bridge-secret") || "";
  if (!segredo || segredo.length < 32 || recebido.length !== segredo.length ||
      !timingSafeEqual(Buffer.from(recebido), Buffer.from(segredo))) {
    return res.sendStatus(401);
  }
  next();
}
// Vinculacao segura: apenas a ponte autenticada pode emitir codigos.
app.post("/api/mta/vincular/gerar", autorizarMta, async (req, res) => {
  if (!bancoPronto) return res.sendStatus(503);
  const dados = Array.isArray(req.body) ? req.body[0] : req.body;
  const conta = dados?.conta;
if (
    typeof conta !== "string" ||
    conta.length < 1 ||
    conta.length > 64 ||
    /[\x00-\x1F\x7F]/.test(conta)
) {
    return res.status(400).json({ erro: "Conta invalida" });
  }
  try {
    const codigo = randomBytes(5).toString("hex").toUpperCase();
    const hash = createHash("sha256").update(codigo).digest("hex");
    await pool.query(`DELETE FROM novaera_codigos_conta WHERE conta_mta = $1 AND usado_em IS NULL`, [conta]);
    await pool.query(`INSERT INTO novaera_codigos_conta (codigo_hash, conta_mta, expira_em)
      VALUES ($1, $2, NOW() + INTERVAL '10 minutes')`, [hash, conta]);
    res.set("Cache-Control", "no-store");
    return res.json({ codigo, validadeMinutos: 10 });
  } catch (e) {
    console.error("[MTA] vincular:", e.message);
    return res.sendStatus(503);
  }
});

const uuidValido = s => typeof s === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);

// Somente a conta autenticada no MTA recebe pedidos com esse nome exato.
app.get("/api/mta/pedidos", autorizarMta, async (req, res) => {
  const conta = req.query.conta;
  if (typeof conta !== "string" || conta.length < 1 || conta.length > 64) {
    return res.sendStatus(400);
  }
  if (!contaLiberada(conta)) return res.json({ pedidos: [] });
  try {
    const result = await pool.query(`SELECT p.referencia, p.produto_id, p.conta_mta
      FROM novaera_pedidos p LEFT JOIN novaera_entregas e ON e.referencia = p.referencia
      WHERE p.estado = 'aprovado' AND p.entrega_estado = 'pendente'
        AND p.produto_id = ANY($2::text[]) AND p.criado_em >= $3::timestamptz
        AND p.conta_mta = $1 AND e.referencia IS NULL
      ORDER BY p.aprovado_em LIMIT 10`, [conta, Object.keys(produtos), dataPublica()]);
    res.set("Cache-Control", "no-store");
    return res.json({ pedidos: result.rows });
  } catch (e) { console.error("[MTA] pedidos:", e.message); return res.sendStatus(503); }
});

// SIMULACAO ISOLADA: nunca grava pedido, aprova PIX ou entra na fila de entrega.
// Disponivel apenas para a ponte autenticada e com entrega desativada.
app.get("/api/mta/simular-pedido", autorizarMta, (req, res) => {
  if (entregaLigada()) return res.status(409).json({ erro: "Desative a entrega para simular" });
  const conta = req.query.conta;
  if (typeof conta !== "string" || conta.length < 1 || conta.length > 64 || /[\x00-\x1F\x7F]/.test(conta)) {
    return res.status(400).json({ erro: "Conta invalida" });
  }
  res.set("Cache-Control", "no-store");
  return res.json({
    simulacao: true,
    pagamento_real: false,
    gravado_no_banco: false,
    vip_entregue: false,
    pedido: { produto_id: "vip-vip-royal", conta_mta: conta, dias: 30, valor_centavos: 1000 }
  });
});

// Reserva permanente ANTES de aplicar o VIP. Falhas incertas exigem revisao manual.
app.post("/api/mta/reservar", autorizarMta, async (req, res) => {
  if (!entregaLigada()) return res.status(503).json({ erro: "Entrega desativada" });
  const { referencia, conta } = (Array.isArray(req.body) ? req.body[0] : req.body) || {};
  if (!uuidValido(referencia) || typeof conta !== "string" || conta.length > 64) return res.sendStatus(400);
  if (!contaLiberada(conta)) return res.sendStatus(403);
  try {
    const r = await pool.query(`INSERT INTO novaera_entregas (referencia, conta_mta, estado)
      SELECT referencia, conta_mta, 'reservado' FROM novaera_pedidos
      WHERE referencia = $1 AND conta_mta = $2 AND produto_id = ANY($3::text[])
        AND criado_em >= $4::timestamptz AND estado = 'aprovado' AND entrega_estado = 'pendente'
      ON CONFLICT (referencia) DO NOTHING RETURNING referencia`, [referencia, conta, Object.keys(produtos), dataPublica()]);
    return res.json({ reservado: r.rowCount === 1 });
  } catch(e) { console.error("[MTA] reservar:", e.message); return res.sendStatus(503); }
});
app.post("/api/mta/confirmar", autorizarMta, async (req, res) => {
  if (!entregaLigada()) return res.status(503).json({ erro: "Entrega desativada" });
  const { referencia, conta } = (Array.isArray(req.body) ? req.body[0] : req.body) || {};
  if (!uuidValido(referencia) || typeof conta !== "string" || conta.length > 64) return res.sendStatus(400);
  if (!contaLiberada(conta)) return res.sendStatus(403);
  try {
    const r = await pool.query(`WITH confirmacao AS (
      UPDATE novaera_entregas SET estado = 'confirmado', atualizado_em = NOW()
      WHERE referencia = $1 AND conta_mta = $2 AND estado IN ('reservado','confirmado')
      RETURNING referencia
    ) UPDATE novaera_pedidos SET entrega_estado = 'entregue', entregue_em = COALESCE(entregue_em,NOW())
      WHERE referencia IN (SELECT referencia FROM confirmacao) AND estado = 'aprovado'
      RETURNING referencia`, [referencia, conta]);
    return res.json({ confirmado: r.rowCount === 1 });
  } catch(e) { console.error("[MTA] confirmar:", e.message); return res.sendStatus(503); }
});

// Diagnostico de ponta a ponta SEM pagamento, reserva ou entrega.
// Requer autenticacao da ponte e entrega desativada.
app.get("/api/mta/diagnostico-entrega", autorizarMta, async (req, res) => {
  res.set("Cache-Control", "no-store");
  if (entregaLigada()) return res.status(409).json({ erro: "Desative a entrega antes do diagnostico" });
  if (!bancoPronto) return res.sendStatus(503);
  try {
    const r = await pool.query(`SELECT
      to_regclass('public.novaera_pedidos') IS NOT NULL AS pedidos,
      to_regclass('public.novaera_entregas') IS NOT NULL AS entregas,
      to_regclass('public.novaera_codigos_conta') IS NOT NULL AS codigos`);
    const tabelas = r.rows[0];
    return res.json({ diagnostico: true, banco: true, tabelas,
      entrega_automatica: false, pagamento_real: false,
      pedido_criado: false, vip_entregue: false });
  } catch (e) {
    console.error('[MTA] diagnostico:', e.message);
    return res.sendStatus(503);
  }
});

// ====================================
// INICIAR SERVIDOR
// ====================================

const PORT = process.env.PORT || 3000;

prepararBanco()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log("NOVAERA CITY STORE ONLINE!");
    });
  })
  .catch(erro => {
    console.error(
      "[NOVAERA] Falha ao preparar PostgreSQL:",
      erro.message
    );

    process.exit(1);
  });
