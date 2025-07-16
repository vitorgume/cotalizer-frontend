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

export async function criarAssinatura(dados: {
  token: string;
  email: string;
  identification: {
    type: string;
    number: string;
  };
}) {
  const response = await axios.post("/assinaturas", dados);
  return response.data;
}
