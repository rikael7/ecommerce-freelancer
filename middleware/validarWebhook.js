
const {
    WebhookSignatureValidator,
    InvalidWebhookSignatureError
} = require("mercadopago");

function validarWebhookMercadoPago(req, res, next) {
    const xSignature = req.headers["x-signature"];
    const xRequestId = req.headers["x-request-id"];

    /*
     * O Mercado Pago envia o ID do recurso
     * através da query string:
     *
     * ?data.id=123456789
     */
    const dataId = req.query["data.id"];

    if (!xSignature || !xRequestId || !dataId) {
        return res.status(401).json({
            error: "Webhook inválido."
        });
    }

    if (!process.env.MP_WEBHOOK_SECRET) {
        console.error(
            "MP_WEBHOOK_SECRET não configurado."
        );

        return res.status(500).json({
            error: "Configuração do webhook indisponível."
        });
    }

    try {
        WebhookSignatureValidator.validate({
            xSignature,
            xRequestId,
            dataId,
            secret: process.env.MP_WEBHOOK_SECRET
        });

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

