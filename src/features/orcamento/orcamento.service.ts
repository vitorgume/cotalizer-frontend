import type Response from "../../models/response";
import type Page from "../../models/page";
import type Orcamento from "../../models/orcamento";
import api from '../../utils/axios';

export function consultarPorId(idOrcamento: string): Promise<Response<Orcamento>> {
    return api.get<Response<Orcamento>>(
        `/orcamentos/${idOrcamento}`
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
    api.delete(
        `/orcamentos/${idOrcamento}`
    ).catch(err => console.error("Erro ao deletar orcamento:", err))
}

export function listarPorUsuario(idRep: string): Promise<Response<Page<Orcamento>>> {
    return api.get<Response<Page<Orcamento>>>(`/orcamentos/usuario/${idRep}?page=0&size=10`)
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

export function criarOrcamento(novoOrcamento: Orcamento): Promise<Response<Orcamento>> {
    return api.post<Response<Orcamento>>(`/arquivos`, novoOrcamento)
        .then(response => response.data)
        .catch(err => {
            console.error("Erro ao criar orcamento:", err);
            return {
                dado: {} as Orcamento,
                erro: err
            }
        });
}

export function interpretarOrcamento(novoOrcamento: Orcamento): Promise<Response<Orcamento>> {
    return api.post<Response<Orcamento>>(`/orcamentos`, novoOrcamento)
        .then(response => response.data)
        .catch(err => {
            console.error("Erro ao interpretar orcamento:", err);
            return {
                dado: {} as Orcamento,
                erro: err
            }
        });
}

export function atualizarOrcamento(orcamento: Orcamento): Promise<Response<Orcamento>> {
    return api.put<Response<Orcamento>>(`/orcamentos/${orcamento.id}`, orcamento)
        .then(response => response.data);
}
