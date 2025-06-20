export function formatarData(dataAtendimento: string) {
    return dataAtendimento.split("-").reverse().join("/");
} 