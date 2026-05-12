export function createChargeWithAsaas() {
  return {
    createCustomer: async () => {},
    createCharge: async () => {},
    getCharge: async () => {},
    deleteCharge: async () => {},
    testConnection: async () => true,
  }
}

export function createEvolutionClient() {
  return {
    checkConnection: async () => ({ instance: '', status: 'open' as const }),
    getQRCode: async () => ({ code: '' }),
    sendTextMessage: async () => ({ key: { id: '', from: '', to: '', timestamp: 0 }, message: '' }),
  }
}
