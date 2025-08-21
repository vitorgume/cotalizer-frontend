export function formatarChave(chave: string): string {
    // Substitui underscores por espaços
    const comEspacos = chave.replace(/_/g, ' ');

    // Capitaliza a primeira letra de cada palavra
    return comEspacos
        .split(' ')
        .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
        .join(' ');
}