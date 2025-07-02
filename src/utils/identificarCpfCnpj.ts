export function identificarCpfOuCnpj(valor: string): 'CPF' | 'CNPJ' | 'Inválido' {
    const somenteNumeros = valor.replace(/\D/g, '');

    if (somenteNumeros.length === 11) {
        return 'CPF';
    } else if (somenteNumeros.length === 14) {
        return 'CNPJ';
    } else {
        return 'Inválido';
    }
}