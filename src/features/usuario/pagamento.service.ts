import axios from 'axios';

interface DadosPagamento {
  token: string;
  issuer_id: string;
  payment_method_id: string;
  transaction_amount: number;
  installments: number;
  description: string;
  payer: {
    email: string;
    identification: {
      type: string;
      number: string;
    };
  };
}

export async function processarPagamento(dados: DadosPagamento) {
  try {
    const response = await axios.post('/process_payment', dados);
    return response.data;
  } catch (error) {
    console.error("Erro ao processar pagamento:", error);
    throw error;
  }
}
