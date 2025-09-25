import type Plano from "../../models/plano";
import type Response from "../../models/response";
import { api } from "../../utils/axios";

export function listarPlanos(): Promise<Response<Plano[]>> {
    return api.get<Response<Plano[]>>('/planos')
        .then(response => response.data)
        .catch(err => {
            console.error("Erro ao carregar planos:", err);
            return {
                dado: {} as Plano[],
                erro: err
            }
        })
}