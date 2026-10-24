
const express = require("express");
const {
  randomUUID,
  createHmac,
  timingSafeEqual
} = require("crypto");

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

// PRODUTOS DE TESTE
const produtos = {
  vip_teste: {
    nome: "VIP Teste",
    preco: "10.00"
  }
};

// VERIFICAR SERVIDOR
app.get("/api/health", (req, res) => {
  res.json({
    loja: "NOVAERA CITY STORE",
    status: "online",
    pix: "integracao_em_teste"
  });
});

// GERAR PIX
app.post("/api/pix/criar", async (req, res) => {
  try {
    const { produtoId, email } = req.body;

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

    if (!process.env.MP_ACCESS_TOKEN) {
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
          Authorization:
            `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
          "X-Idempotency-Key": referencia
        },
        body: JSON.stringify({
          type: "online",
          processing_mode: "automatic",
          external_reference: referencia,
          total_amount: produto.preco,
          payer: {
            email
          },
          transactions: {
            payments: [{
              amount: produto.preco,
              payment_method: {
                id: "pix",
                type: "bank_transfer"
              }
            }]
          }
        })
      }
    );

    const dados = await resposta.json();

    if (!resposta.ok) {
      console.error(
        "Falha Mercado Pago:",
        resposta.status,
        dados.error || dados.message
      );

      return res.status(502).json({
        erro: "Não foi possível criar o PIX"
      });
    }

    const pagamento =
      dados.transactions?.payments?.[0];

    return res.json({
      orderId: dados.id,
      status: dados.status,
      qrCode:
        pagamento?.payment_method?.qr_code,
      qrCodeBase64:
        pagamento?.payment_method?.qr_code_base64,
      ticketUrl:
        pagamento?.payment_method?.ticket_url
    });

  } catch (erro) {
    console.error(
      "Erro ao criar PIX:",
      erro.message
    );

    return res.status(500).json({
      erro: "Erro interno"
    });
  }
});

// WEBHOOK MERCADO PAGO
app.post(
  "/api/webhooks/mercadopago",
  async (req, res) => {
    try {
      const secret = process.env.MP_WEBHOOK_SECRET;
      const token = process.env.MP_ACCESS_TOKEN;

      if (!secret || !token) {
        console.error("Webhook não configurado");
        return res.sendStatus(503);
      }

      const assinatura =
        req.get("x-signature") || "";

      const requestId =
        req.get("x-request-id") || "";

      const partes = {};

      for (const parte of assinatura.split(",")) {
        const pos = parte.indexOf("=");

        if (pos > 0) {
          const chave =
            parte.slice(0, pos).trim();

          const valor =
            parte.slice(pos + 1).trim();

          partes[chave] = valor;
        }
      }

      const ts = partes.ts;
      const v1 = partes.v1;

      const id = req.query["data.id"];

      if (
        typeof id !== "string" ||
        !/^[a-zA-Z0-9_-]+$/.test(id) ||
        !/^\d+$/.test(ts || "") ||
        !/^[a-fA-F0-9]{64}$/.test(v1 || "")
      ) {
        return res.sendStatus(401);
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
        return res.sendStatus(401);
      }

      const manifesto =
        `id:${id.toLowerCase()};` +
        `request-id:${requestId};` +
        `ts:${ts};`;

      const esperado = createHmac(
        "sha256",
        secret
      )
        .update(manifesto)
        .digest();

      const recebido =
        Buffer.from(v1, "hex");

      if (
        recebido.length !== esperado.length ||
        !timingSafeEqual(recebido, esperado)
      ) {
        console.warn("Assinatura inválida");
        return res.sendStatus(401);
      }

      if (req.body?.type !== "order") {
        return res.sendStatus(200);
      }

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
          "Erro ao consultar order:",
          resposta.status
        );

        return res.sendStatus(503);
      }

      const pedido = await resposta.json();

      if (String(pedido.id) !== id) {
        return res.sendStatus(400);
      }

      const aprovado =
        pedido.status === "processed" &&
        pedido.status_detail === "accredited";

      console.log("Webhook validado:", {
        orderId: pedido.id,
        status: pedido.status,
        statusDetail: pedido.status_detail,
        aprovado
      });

      // Entrega automática ainda não ativada.
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

// INICIAR SERVIDOR
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("NOVAERA CITY STORE ONLINE!");
});
