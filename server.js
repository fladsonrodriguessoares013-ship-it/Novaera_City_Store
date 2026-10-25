
const express = require("express");
const {
  randomUUID,
  createHmac,
  timingSafeEqual
} = require("crypto");

const app = express();

// ================================
// BANCO DE DADOS NOVAERA CITY
// ================================

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000
});

async function conectarBanco() {
  try {
    await pool.query("SELECT 1");

    console.log(
      "[NOVAERA] PostgreSQL conectado!"
    );
  } catch (erro) {
    console.error(
      "[NOVAERA] Erro no banco:",
      erro.message
    );
  }
}

conectarBanco();

app.use(express.json());
app.use(express.static(__dirname));

// ================================
// PRODUTOS DE TESTE
// ================================

const produtos = {
  vip_teste: {
    nome: "VIP Teste",
    preco: "10.00"
  }
};

// ================================
// STATUS DA LOJA
// ================================

app.get("/api/health", (req, res) => {
  res.json({
    loja: "NOVAERA CITY STORE",
    status: "online",
    pix: "integracao_em_teste"
  });
});

// ================================
// GERAR PIX
// ================================

app.post("/api/pix/criar", async (req, res) => {
  try {
    const { produtoId, email } = req.body || {};
    const produto = produtos[produtoId];

    if (!produto) {
      return res.status(400).json({
        erro: "Produto inválido"
      });
    }

    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return res.status(400).json({
        erro: "E-mail inválido"
      });
    }

    const token = process.env.MP_ACCESS_TOKEN;

    if (!token) {
      return res.status(503).json({
        erro: "Mercado Pago não configurado"
      });
    }

    const referencia = randomUUID();

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

    if (!resposta.ok) {
      console.error(
        "Erro Mercado Pago:",
        resposta.status,
        dados.error || dados.message
      );

      return res.status(502).json({
        erro: "Não foi possível gerar o PIX"
      });
    }

    const pagamento =
      dados.transactions?.payments?.[0];

    return res.json({
      orderId: dados.id,
      status: dados.status,
      qrCode: pagamento?.payment_method?.qr_code,
      qrCodeBase64:
        pagamento?.payment_method?.qr_code_base64,
      ticketUrl:
        pagamento?.payment_method?.ticket_url
    });

  } catch (erro) {
    console.error("Erro ao gerar PIX:", erro.message);

    return res.status(500).json({
      erro: "Erro interno"
    });
  }
});

// ================================
// VALIDAR ASSINATURA DO WEBHOOK
// ================================

function validarWebhook(req) {
  const secret = process.env.MP_WEBHOOK_SECRET;

  if (!secret) {
    return {
      valido: false,
      motivo: "Segredo não configurado"
    };
  }

  const assinatura = req.get("x-signature") || "";
  const requestId = req.get("x-request-id") || "";

  const partes = {};

  for (const parte of assinatura.split(",")) {
    const pos = parte.indexOf("=");

    if (pos > 0) {
      const chave = parte.slice(0, pos).trim();
      const valor = parte.slice(pos + 1).trim();

      partes[chave] = valor;
    }
  }

  const ts = partes.ts;
  const v1 = partes.v1;
  const id = req.query["data.id"];

  if (typeof id !== "string" || !id) {
    return {
      valido: false,
      motivo: "data.id ausente na URL"
    };
  }

  if (!requestId) {
    return {
      valido: false,
      motivo: "x-request-id ausente"
    };
  }

  if (
    !/^\d+$/.test(ts || "") ||
    !/^[a-fA-F0-9]{64}$/.test(v1 || "")
  ) {
    return {
      valido: false,
      motivo: "Cabeçalho de assinatura inválido"
    };
  }

  const timestamp = Number(ts);

  const timestampMs =
    timestamp < 1e11
      ? timestamp * 1000
      : timestamp;

  if (
    !Number.isFinite(timestampMs) ||
    Math.abs(Date.now() - timestampMs) >
      10 * 60 * 1000
  ) {
    return {
      valido: false,
      motivo: "Timestamp fora da janela"
    };
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
    return {
      valido: false,
      motivo: "HMAC não corresponde"
    };
  }

  return {
    valido: true,
    id
  };
}

// ================================
// WEBHOOK MERCADO PAGO
// ================================

app.post(
  "/api/webhooks/mercadopago",
  async (req, res) => {
    try {
      const verificacao = validarWebhook(req);

      if (!verificacao.valido) {

        console.warn(
          "Webhook rejeitado:",
          verificacao.motivo
        );

        // DIAGNOSTICO ADICIONADO
        console.log("Diagnóstico webhook:", {
          idUrlPresente: Boolean(req.query["data.id"]),
          idBodyPresente: Boolean(req.body?.data?.id),
          requestIdPresente: Boolean(
            req.get("x-request-id")
          ),
          assinaturaPresente: Boolean(
            req.get("x-signature")
          ),
          segredoConfigurado: Boolean(
            process.env.MP_WEBHOOK_SECRET
          ),
          tipoEvento:
            req.body?.type || "desconhecido"
        });

        return res.sendStatus(401);
      }

      console.log("Assinatura do webhook válida");

      const tipo =
        req.body?.type || req.body?.topic;

      if (tipo !== "order") {
        console.log(
          "Evento ignorado:",
          tipo || "desconhecido"
        );

        return res.sendStatus(200);
      }

      const token = process.env.MP_ACCESS_TOKEN;

      if (!token) {
        return res.sendStatus(503);
      }

      const id = verificacao.id;

      const resposta = await fetch(
        "https://api.mercadopago.com/v1/orders/" +
          encodeURIComponent(id),
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          signal: AbortSignal.timeout(10000)
        }
      );

      if (!resposta.ok) {
        console.error(
          "Erro ao consultar pedido:",
          resposta.status
        );

        return res.sendStatus(503);
      }

      const pedido = await resposta.json();

      if (String(pedido.id) !== id) {
        console.error(
          "ID do pedido não corresponde"
        );

        return res.sendStatus(400);
      }

      const aprovado =
        pedido.status === "processed" &&
        pedido.status_detail === "accredited";

      console.log("Pedido consultado:", {
        orderId: pedido.id,
        status: pedido.status,
        statusDetail: pedido.status_detail,
        aprovado
      });

      // Entrega automática ainda desativada.
      // Falta banco de dados e integração MTA.

      return res.sendStatus(200);

    } catch (erro) {
      console.error(
        "Erro no webhook:",
        erro.message
      );

      return res.sendStatus(503);
    }
  }
);

// ================================
// INICIAR SERVIDOR
// ================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("NOVAERA CITY STORE ONLINE!");
});
