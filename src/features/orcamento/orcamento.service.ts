import axios from "axios";
import type Orcamento from "../../models/orcamento";
import type Response from "../../models/response";

export function consultarPorId(idOrcamento: string): Promise<Response<Orcamento>> {
    return axios.get<Response<Orcamento>>(
        `http://localhost:8080/orcamentos/${idOrcamento}`
    )
    .then(response => response.data)
    .catch(err => {
        console.error("Erro ao carregar prontuarios:", err);
        return {
            dado: {} as Orcamento,
            erro: err
        }
    })
}

export function deletar(idOrcamento: string): void {
    axios.delete(
        `http://localhost:8080/orcamentos/${idOrcamento}`
    ).catch(err => console.error("Erro ao deletar orcamento:", err))
}