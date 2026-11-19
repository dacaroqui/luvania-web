export type PaymentIntent = {
  status: "no-disponible";
  amount: null;
  currency: "COP";
  concept: string;
};

export interface PaymentProvider {
  createIntent(input: { concept: string }): Promise<PaymentIntent>;
}

/** La pasarela no está elegida. El intento nunca cobra ni guarda un monto. */
export const blockedPayment: PaymentProvider = {
  async createIntent({ concept }) {
    return { status: "no-disponible", amount: null, currency: "COP", concept };
  },
};
