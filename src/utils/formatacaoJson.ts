export function formatarChave(chave: string): string {
    const comEspacos = chave.replace(/_/g, ' ');

    return comEspacos
        .split(' ')
        .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
        .join(' ');
}