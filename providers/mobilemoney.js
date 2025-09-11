export async function processMobileMoney(payment){
  const provider = (payment.provider || 'mock').toLowerCase();
  if (provider === 'mock'){
    return { ok: true, ref: 'MM-' + payment.id, message: 'mock_initiated' };
  }
  // TODO: integrate MTN/Airtel real providers here
  return { ok: false, ref: null, message: 'provider_not_implemented' };
}
