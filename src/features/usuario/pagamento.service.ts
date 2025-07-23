import api from '../../utils/axios';
import type Response from '../../models/response';
import type Assinatura from '../../models/assinatura';

export function criarAssinatura(dados: Assinatura): Promise<Response<Assinatura>> {
  return api.post<Response<Assinatura>>('http://localhost:8081/assinaturas', dados)
    .then(response => response.data)
    .catch(err => {
      console.error("Erro ao criar assinatura");
      return {
        dado: {} as Assinatura,
        erro: err
      }
    })
}

export function cancelarAssinatura(idUsuario: string) {
  return api.delete(`http://localhost:8081/assinaturas/${idUsuario}`)
    .catch(err => console.error('Erro ao deletar usuario', err));
}
