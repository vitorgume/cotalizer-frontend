import axios from "axios";
import type Orcamento from "../../models/orcamento";
import type Response from "../../models/response";
import type Page from "../../models/page";

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

export function listarPorRepresentante(idRep: string): Promise<Response<Page<Orcamento>>> {
    return axios.get<Response<Page<Orcamento>>>(`http://localhost:8080/orcamentos/usuario/${idRep}?page=0&size=10`)
    .then(response => response.data)
    .catch(err => {
        console.error("Erro ao carregar orcamentos:", err);
        return {
            dado: {
                content: [],
                totalElements: 0,
                totalPages: 0,
                number: 0,
                size: 0
            },
            erro: err
        }
    })
}
