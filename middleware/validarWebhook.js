const {
    WebhookSignatureValidator,
    InvalidWebhookSignatureError
} = require("mercadopago");

function validarWebhookMercadoPago(req, res, next) {
    try {
        const xSignature = req.headers["x-signature"];
        const xRequestId = req.headers["x-request-id"];

        const dataId =
            req.query["data.id"] ||
            req.body?.data?.id;

        console.log("========== MP WEBHOOK ==========");
        console.log("x-signature:", xSignature);
        console.log("x-request-id:", xRequestId);
        console.log("data.id:", dataId);
        console.log("query:", req.query);
        console.log("body:", req.body);
        console.log("================================");

        if (!xSignature || !xRequestId || !dataId) {
            console.warn("Webhook sem dados necessários.");

            return res.status(401).json({
                error: "Webhook inválido."
            });
        }

        const secret = process.env.MP_WEBHOOK_SECRET;

        if (!secret) {
            console.error(
                "MP_WEBHOOK_SECRET não configurado."
            );

            return res.status(500).json({
                error: "Configuração do webhook indisponível."
            });
        }

        WebhookSignatureValidator.validate({
            xSignature,
            xRequestId,
            dataId: String(dataId),
            secret
        });

        console.log(
            "Webhook Mercado Pago: assinatura válida."
        );

        next();

    } catch (error) {
        if (error instanceof InvalidWebhookSignatureError) {
            console.warn(
                "Webhook do Mercado Pago rejeitado: assinatura inválida."
            );

            return res.status(401).json({
                error: "Assinatura do webhook inválida."
            });
        }

        console.error(
            "Erro ao validar webhook do Mercado Pago:",
            error
        );

        return res.status(500).json({
            error: "Erro ao validar webhook."
        });
    }
}

module.exports = validarWebhookMercadoPago;