import axios from 'axios';
import { AppConfig } from '../../config';
import { PaystackPaymentDetails } from '../../types';

export class PaystackService {
  static async createPaymentLink(paymentDetails: PaystackPaymentDetails) {
    const result = await axios.post('https://api.paystack.co/transaction/initialize', paymentDetails, {
      headers: {
        Authorization: `Bearer ${AppConfig.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Paystack payment link result: ', result.data);
    return result.data;
  }
}