import type Response from "../../models/response";
import type Page from "../../models/page";
import type Orcamento from "../../models/orcamento";
import { api } from "../../utils/axios";
import type { OrcamentoTradicional } from "../../models/orcamentoTradicional";
import axios from "axios";

type ApiThrownError = Error & { status?: number; payload?: any };

const PAGE_SIZE = 10;

function handleAxiosError(e: unknown, fallbackMsg: string): never {
  if (axios.isAxiosError(e)) {
    const status = e.response?.status;
    const payload = e.response?.data;
    const msg =
      (payload as any)?.erro?.mensagens?.[0] ??
      (payload as any)?.message ??
      fallbackMsg;

    const err: ApiThrownError = Object.assign(new Error(msg), {
      status,
      payload,
    });
    throw err;
  }
  throw e as any;
}

/** ----------------- IA ----------------- **/

export async function consultarPorId(
  idOrcamento: string
): Promise<Response<Orcamento>> {
  try {
    const { data } = await api.get<Response<Orcamento>>(
      `/orcamentos/${idOrcamento}`
    );
    return data;
  } catch (e) {
    handleAxiosError(e, "Falha ao carregar orçamento.");
  }
}

export async function deletar(idOrcamento: string): Promise<void> {
  try {
    await api.delete(`/orcamentos/${idOrcamento}`);
  } catch (e) {
    handleAxiosError(e, "Falha ao deletar orçamento.");
  }
}

export async function listarPorUsuario(
  idUsuario: string,
  page = 0,
  size = PAGE_SIZE
): Promise<Response<Page<Orcamento>>> {
  const { data } = await api.get<Response<Page<Orcamento>>>(
    `/orcamentos/usuario/${idUsuario}?page=${page}&size=${size}`
  );
  return data;
}

export async function criarOrcamento(
  novoOrcamento: Orcamento
): Promise<Response<Orcamento>> {
  try {
    const { data } = await api.post<Response<Orcamento>>(
      `/api/arquivos`,
      novoOrcamento
    );
    return data;
  } catch (e) {
    handleAxiosError(e, "Falha ao criar orçamento.");
  }
}

export async function interpretarOrcamento(
  novoOrcamento: Orcamento
): Promise<Response<Orcamento>> {
  try {
    const { data } = await api.post<Response<Orcamento>>(
      `/orcamentos`,
      novoOrcamento
    );
    return data;
  } catch (e) {
    handleAxiosError(e, "Falha ao interpretar orçamento.");
  }
}

export async function atualizarOrcamento(
  orcamento: Orcamento
): Promise<Response<Orcamento>> {
  try {
    const { data } = await api.put<Response<Orcamento>>(
      `/orcamentos/${orcamento.id}`,
      orcamento
    );
    return data;
  } catch (e) {
    handleAxiosError(e, "Falha ao atualizar orçamento.");
  }
}

/** --------- Tradicional --------- **/

export async function gerarPdfOrcamentoTradicional(
  orcamento: OrcamentoTradicional
): Promise<Response<OrcamentoTradicional>> {
  try {
    const { data } = await api.post<Response<OrcamentoTradicional>>(
      "/api/arquivos/tradicional",
      orcamento
    );
    return data;
  } catch (e) {
    console.error('Erro', e);
    handleAxiosError(e, "Falha ao gerar PDF do orçamento.");
  }
}

export async function cadastrarOrcamento(
  orcamento: OrcamentoTradicional
): Promise<Response<OrcamentoTradicional>> {
  try {
    const { data } = await api.post<Response<OrcamentoTradicional>>(
      "/orcamentos/tradicionais",
      orcamento
    );
    return data;
  } catch (e) {
    handleAxiosError(e, "Falha ao cadastrar orçamento.");
  }
}

export async function listarTradicionaisPorUsuario(
  idUsuario: string,
  page = 0,
  size = PAGE_SIZE
): Promise<Response<Page<OrcamentoTradicional>>> {
  const { data } = await api.get<Response<Page<OrcamentoTradicional>>>(
    `/orcamentos/tradicionais/usuario/${idUsuario}?page=${page}&size=${size}`
  );
  return data;
}

export async function consultarTradicionalPorId(
  idOrcamento: string
): Promise<Response<OrcamentoTradicional>> {
  try {
    const { data } = await api.get<Response<OrcamentoTradicional>>(
      `/orcamentos/tradicionais/${idOrcamento}`
    );
    return data;
  } catch (e) {
    handleAxiosError(e, "Falha ao carregar orçamento tradicional.");
  }
}

export async function atualizarOrcamentoTradicional(
  orcamento: OrcamentoTradicional
): Promise<Response<OrcamentoTradicional>> {
  try {
    const { data } = await api.put<Response<OrcamentoTradicional>>(
      `/orcamentos/tradicionais/${orcamento.id}`,
      orcamento
    );
    return data;
  } catch (e) {
    handleAxiosError(e, "Falha ao atualizar orçamento tradicional.");
  }
}

export async function deletarTradicional(
  idOrcamento: string
): Promise<Response<OrcamentoTradicional>> {
  try {
    const { data } = await api.delete<Response<OrcamentoTradicional>>(
      `/orcamentos/tradicionais/${idOrcamento}`
    );
    return data;
  } catch (e) {
    handleAxiosError(e, "Falha ao deletar orçamento tradicional.");
  }
}

export async function deletarArquivo(
  nomeArquivo: string
): Promise<void> {
  try {
    await api.delete(`/api/arquivos/arquivo/${nomeArquivo}`);
  } catch (e) {
    handleAxiosError(e, "Falha ao deletar arquivo.");
  }
}
