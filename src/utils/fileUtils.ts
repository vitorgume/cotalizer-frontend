export function removerFilePrefix(caminho: string): string {
    return caminho.replace("file:///", "");
}