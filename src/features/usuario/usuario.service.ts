import axios from "axios";
import type Response from "../../models/response";
import type Usuario from "../../models/usuario";

export function consultarUsuarioPeloId(idUsuario: string): Promise<Response<Usuario>> {
    return axios.get<Response<Usuario>>(`http://localhost:8080/usuarios/${idUsuario}`)
    .then(response => response.data)
    .catch(err => {
        console.error("Erro ao carregar usuario:", err);
        return {
            dado: {} as Usuario,
            erro: err
        }
    })
}

export function cadastrarUsuario(usuario: Usuario): Promise<Response<Usuario>> {
    return axios.post<Response<Usuario>>(`http://localhost:8080/usuarios`, usuario)
    .then(response => response.data)
    .catch(err => {
        console.error("Erro ao cadastrar usuario:", err);
        return {
            dado: {} as Usuario,
            erro: err
        }
    })
}