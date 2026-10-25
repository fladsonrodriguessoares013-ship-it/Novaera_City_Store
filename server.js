
"use strict";

const express = require("express");
const { Pool } = require("pg");
const { randomUUID, createHmac, timingSafeEqual } = require("crypto");

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
  "vip-vip-patrocinador": { nome: "VIP Patrocinador", preco: "100.00", vipNumero: 5, dias: 60 }
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
    pix: "integracao_em_teste",
    entregaVip: process.env.NOVAERA_DELIVERY_ENABLED === "true" ? "habilitada" : "desativada"
  });
});

// ====================================
// GERAR PIX E SALVAR PEDIDO
// ====================================

app.post("/api/pix/criar", async (req, res) => {
  if (!bancoPronto) {
    return res.status(503).json({
      erro: "Banco indisponivel"
    });
  }

  const { produtoId, email, jogadorId, contaMta } = req.body || {};
  const produto = produtos[produtoId];

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

  if (typeof contaMta !== "string" || !/^[\p{L}\p{N}_. -]{3,40}$/u.test(contaMta.trim())) {
    return res.status(400).json({ erro: "Nome da conta MTA invalido" });
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
    await pool.query(`
      INSERT INTO novaera_pedidos (
        referencia,
        produto_id,
        produto_nome,
        valor_centavos,
        email,
        jogador_id,
        conta_mta
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      referencia,
      produtoId,
      produto.nome,
      centavos,
      email,
      id,
      contaMta.trim()
    ]);

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
function autorizarMta(req, res, next) {
  const segredo = process.env.NOVAERA_BRIDGE_SECRET;
  const recebido = req.get("x-novaera-bridge-secret") || "";
  if (!segredo || segredo.length < 32 || recebido.length !== segredo.length ||
      !timingSafeEqual(Buffer.from(recebido), Buffer.from(segredo))) {
    return res.sendStatus(401);
  }
  next();
}
const uuidValido = s => typeof s === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);

// Somente a conta autenticada no MTA recebe pedidos com esse nome exato.
app.get("/api/mta/pedidos", autorizarMta, async (req, res) => {
  const conta = req.query.conta;
  if (typeof conta !== "string" || conta.length < 3 || conta.length > 40) {
    return res.sendStatus(400);
  }
  try {
    const result = await pool.query(`SELECT p.referencia, p.produto_id, p.conta_mta
      FROM novaera_pedidos p LEFT JOIN novaera_entregas e ON e.referencia = p.referencia
      WHERE p.estado = 'aprovado' AND p.entrega_estado = 'pendente'
        AND p.conta_mta = $1 AND e.referencia IS NULL
      ORDER BY p.aprovado_em LIMIT 10`, [conta]);
    res.set("Cache-Control", "no-store");
    return res.json({ pedidos: result.rows });
  } catch (e) { console.error("[MTA] pedidos:", e.message); return res.sendStatus(503); }
});

// Reserva permanente ANTES de aplicar o VIP. Falhas incertas exigem revisao manual.
app.post("/api/mta/reservar", autorizarMta, async (req, res) => {
  if (!entregaLigada()) return res.status(503).json({ erro: "Entrega desativada" });
  const { referencia, conta } = req.body || {};
  if (!uuidValido(referencia) || typeof conta !== "string" || conta.length > 40) return res.sendStatus(400);
  try {
    const r = await pool.query(`INSERT INTO novaera_entregas (referencia, conta_mta, estado)
      SELECT referencia, conta_mta, 'reservado' FROM novaera_pedidos
      WHERE referencia = $1 AND conta_mta = $2 AND estado = 'aprovado' AND entrega_estado = 'pendente'
      ON CONFLICT (referencia) DO NOTHING RETURNING referencia`, [referencia, conta]);
    return res.json({ reservado: r.rowCount === 1 });
  } catch(e) { console.error("[MTA] reservar:", e.message); return res.sendStatus(503); }
});
app.post("/api/mta/confirmar", autorizarMta, async (req, res) => {
  if (!entregaLigada()) return res.status(503).json({ erro: "Entrega desativada" });
  const { referencia, conta } = req.body || {};
  if (!uuidValido(referencia) || typeof conta !== "string" || conta.length > 40) return res.sendStatus(400);
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
