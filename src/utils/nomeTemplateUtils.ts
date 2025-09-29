export default function formatarNomeTemplate(nomeArquivo: string): string {
  // remove extensão (ex.: .jpg, .png)
  const semExt = nomeArquivo.replace(/\.[a-z0-9]+$/i, "");

  // troca _ e - por espaço e normaliza múltiplos espaços
  const comEspacos = semExt.replace(/[-_]+/g, " ").trim().replace(/\s+/g, " ");

  // Title Case
  return comEspacos
    .split(" ")
    .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(" ");
}
