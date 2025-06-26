import axios from "axios";
import type Response from "../../models/response";
import type Usuario from "../../models/usuario";
import type Login from "../../models/login";

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

export function logarUsuario(email: string, senha: string): Promise<Response<Login>> {
    return axios.post<Response<Login>>(`http://localhost:8080/logar`, {email, senha})
    .then(response => response.data)
    .catch(err => {
        console.error("Erro ao logar usuario:", err);
        return {
            dado: {} as Login,
            erro: err
        }
    })
}