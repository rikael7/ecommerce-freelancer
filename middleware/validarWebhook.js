const {
  WebhookSignatureValidator,
  InvalidWebhookSignatureError,
} = require('mercadopago');

const validarWebhookMercadoPago = (req, res, next) => {
  try {
    const xSignature = req.headers['x-signature'];
    const xRequestId = req.headers['x-request-id'];

    // IMPORTANTE:
    // O Mercado Pago manda o data.id na QUERY STRING.
    const dataId = req.query['data.id'];

    const secret = process.env.MP_WEBHOOK_SECRET;

    console.log('========== MP WEBHOOK ==========');
    console.log('x-request-id:', xRequestId);
    console.log('x-signature:', xSignature);
    console.log('data.id query:', dataId);
    console.log('data.id body:', req.body?.data?.id);
    console.log('================================');

    if (!xSignature || !xRequestId || !dataId || !secret) {
      console.error('Webhook Mercado Pago: dados de assinatura ausentes.');
      return res.sendStatus(401);
    }

    WebhookSignatureValidator.validate({
      xSignature,
      xRequestId,
      dataId,
      secret,
    });

    console.log('Webhook Mercado Pago: assinatura válida.');

    next();
  } catch (erro) {
    if (erro instanceof InvalidWebhookSignatureError) {
      console.error(
        'Webhook Mercado Pago: assinatura inválida.'
      );

      return res.sendStatus(401);
    }

    console.error(
      'Erro ao validar webhook do Mercado Pago:',
      erro
    );

    return res.sendStatus(500);
  }
};

module.exports = validarWebhookMercadoPago;