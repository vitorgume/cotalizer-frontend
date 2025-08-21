import type Response from "../../models/response";
import type Usuario from "../../models/usuario";
import type Login from "../../models/login";
import api from '../../utils/axios';
import type { VerificaoEmail } from "../../models/verificaoEmail";
import type Avaliacao from "../../models/avaliacao";

export function consultarUsuarioPeloId(idUsuario: string): Promise<Response<Usuario>> {
    return api.get<Response<Usuario>>(`/usuarios/${idUsuario}`)
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
    return api.post<Response<Usuario>>(`/usuarios/cadastro`, usuario)
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
    return api.post<Response<Login>>(`/login`, { email, senha })
        .then(response => response.data)
        .catch(err => {
            console.error("Erro ao logar usuario:", err);
            return {
                dado: {} as Login,
                erro: err
            }
        })
}

export function verificarCodigo(dadosVerificacao: VerificaoEmail): Promise<Response<VerificaoEmail>> {
    return api.post<Response<VerificaoEmail>>(`/verificaoes/email`, dadosVerificacao)
        .then(response => response.data)
        .catch(err => {
            console.error("Erro ao verificar codigo:", err);
            return {
                dado: {} as VerificaoEmail,
                erro: err
            }
        })
}

export function reenviarCodigoEmail(email: string) {
    return api.post<Response<VerificaoEmail>>(`/usuarios/reenvio/codigo`, { email })
        .then(response => response.data)
        .catch(err => {
            console.error("Erro ao reenviar codigo:", err);
            return {
                dado: {} as VerificaoEmail,
                erro: err
            }
        })
}

export function alterarCpfCnpj(idUsuario: string, novosDados: Usuario): Promise<Response<Usuario>> {
    return api.put<Response<Usuario>>(`/usuarios/${idUsuario}`, novosDados)
        .then(response => response.data)
        .catch(err => {
            console.error("Erro ao alterar cpf/cnpj:", err);
            return {
                dado: {} as Usuario,
                erro: err
            }
        })
}

export function editarSenha(senha: string, token: string): Promise<Response<Usuario>> {
    return api.patch<Response<Usuario>>(`/usuarios/alterar/senha`, { novaSenha: senha, codigo: token })
        .then(response => response.data)
        .catch(err => {
            console.error("Erro ao editar senha:", err);
            return {
                dado: {} as Usuario,
                erro: err
            }
        })
}

export function solicitarNovaSenha(email: string): Promise<Response<Usuario>> {
    return api.post<Response<Usuario>>(`/senhas/solicitar/nova`, { emailUsuario: email })
        .then(response => response.data)
        .catch(err => {
            console.error("Erro ao solicitar nova senha:", err);
            return {
                dado: {} as Usuario,
                erro: err
            }
        })
}

export function cadastrarLogoUsuario(idUsuario: string, file: File): void {
    const formData = new FormData();
    formData.append('logo', file);
    formData.append('idUsuario', idUsuario);

    api.post('/arquivos/logo', formData, {headers: { 'Content-Type': 'multipart/form-data' }});
}

export function atualizarUsuario(idUsuario: string, novosDados: Usuario): Promise<Response<Usuario>> {
    return api.put<Response<Usuario>>(`usuarios/${idUsuario}`, novosDados)
        .then(response => response.data)
        .catch(err => {
            console.error("Erro ao solicitar nova senha:", err);
            return {
                dado: {} as Usuario,
                erro: err
            }
        })
}

export function avaliar(avaliacao: Avaliacao): Promise<Response<Avaliacao>> {
    return api.post<Response<Avaliacao>>('/avaliacoes', avaliacao)
        .then(response => response.data)
        .catch(err => {
            console.error("Erro ao avaliar usuario:", err);
            return {
                dado: {} as Avaliacao,
                erro: err
            }
        })
}

