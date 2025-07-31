import type Response from "../../models/response";
import type Page from "../../models/page";
import type Orcamento from "../../models/orcamento";
import api from '../../utils/axios';
import type { OrcamentoTradicional } from "../../models/orcamentoTradicional";

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

export function gerarPdfOrcamentoTradicional(orcamento: OrcamentoTradicional): Promise<Response<OrcamentoTradicional>> {
    return api.post<Response<OrcamentoTradicional>>('/arquivos/tradicional', orcamento)
        .then(response => response.data)
        .catch(err => {
            console.error("Erro ao criar orcamento:", err);
            return {
                dado: {} as OrcamentoTradicional,
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

export function cadastrarOrcamento(orcamneto: OrcamentoTradicional): Promise<Response<OrcamentoTradicional>> {
    return api.post<Response<OrcamentoTradicional>>(`/orcamentos/tradicionais`, orcamneto)
        .then(response => response.data)
        .catch(err => {
            console.error("Erro ao criar orcamento:", err);
            return {
                dado: {} as OrcamentoTradicional,
                erro: err
            }
        });
}

export function listarTradicionaisPorUsuario(idUsuario: string): Promise<Response<Page<OrcamentoTradicional>>> {
    return api.get<Response<Page<OrcamentoTradicional>>>(`/orcamentos/tradicionais/usuario/${idUsuario}?page=0&size=10`)
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

export function consultarTradicionalPorId(idOrcamento: string): Promise<Response<OrcamentoTradicional>> {
    return api.get<Response<OrcamentoTradicional>>(`/orcamentos/tradicionais/${idOrcamento}`)
    .then(response => response.data)
    .catch(err => {
        console.error("Erro ao carregar orcamento:", err);
        return {
            dado: {} as OrcamentoTradicional,
            erro: err
        }
    })
}

export function atualizarOrcamentoTradicional(orcamento: OrcamentoTradicional): Promise<Response<OrcamentoTradicional>> {
    return api.put<Response<OrcamentoTradicional>>(`/orcamentos/tradicionais/${orcamento.id}`, orcamento)
        .then(response => response.data);
}

export function deletarTradicional(idOrcamento: string): Promise<Response<OrcamentoTradicional>> {
    return api.delete<Response<OrcamentoTradicional>>(`/orcamentos/tradicionais/${idOrcamento}`)
        .then(response => response.data);
}