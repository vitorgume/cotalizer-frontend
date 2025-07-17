import api from '../../utils/axios';
import type Response from '../../models/response';
import type Assinatura from '../../models/assinatura';

export function criarAssinatura(dados: {
  cardTokenId: string;
  paymentMethodId: string;
  email: string;
  identification: {
    type: string;
    number: string;
  };
  idUsuario: string;
}): Promise<Response<Assinatura>> {
  return api.post<Response<Assinatura>>('/assinaturas', dados)
    .then(response => response.data)
    .catch(err => {
      console.error("Erro ao criar assinatura");
      return {
        dado: {} as Assinatura,
        erro: err
      }
    })
}
