
const express = require("express");
const path = require("path");
const { randomUUID } = require("crypto");

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

const produtos = {
  // EXEMPLO DE TESTE. Substituir pelos
  // produtos e preços reais da loja.
  vip_teste: {
    nome: "VIP Teste",
    preco: "10.00"
  }
};

app.get("/api/health", (req, res) => {
  res.json({
    loja: "NOVAERA CITY STORE",
    status: "online",
    pix: "integracao_em_teste"
  });
});

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
          "Authorization":
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

    res.json({
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
    console.error("Erro ao criar PIX:", erro.message);

    res.status(500).json({
      erro: "Erro interno"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("NOVAERA CITY STORE ONLINE!");
});
