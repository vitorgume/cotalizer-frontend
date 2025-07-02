import { toast } from "react-toastify";

export function notificarSucesso(mensagem: string) {
    toast.success(mensagem);
}

export function notificarErro(mensagem: string) {
    toast.error(mensagem);
}