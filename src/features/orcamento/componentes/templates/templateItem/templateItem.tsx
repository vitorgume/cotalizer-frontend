import type Template from '../../../../../models/template';
import formatarNomeTemplate from '../../../../../utils/nomeTemplateUtils';
import './templateItem.css';

type Props = {
  template: Template;
  name: string;            // nome do grupo de radios
  checked: boolean;        // está selecionado?
  onChange: () => void;    // selecionar este item
};

export default function TemplateItem({ template, name, checked, onChange }: Props) {
  const src = `/${template.nomeArquivo}.jpg`;

  const title = formatarNomeTemplate(template.nomeArquivo);

  return (
    <label
      className={`template-item glass-card ${checked ? 'is-selected' : ''}`}
      title={title}
    >
      {/* Radio real, mas visualmente escondido (a11y mantém teclado/aria) */}
      <input
        type="radio"
        className="template-radio"
        name={name}
        value={template.id}
        checked={checked}
        onChange={onChange}
      />

      <div className="template-thumb">
        <img className="imagem-template" src={src} alt={`Template ${title}`} />
        {/* Indicador visual de seleção */}
        <span className="template-check" aria-hidden="true">✓</span>
      </div>

      <h3 className="template-title">{title}</h3>
    </label>
  );
}
