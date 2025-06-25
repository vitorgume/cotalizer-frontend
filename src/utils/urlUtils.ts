export function extrairNomeArquivo(url: string): string {
    return url.split('/').pop() || '';
}