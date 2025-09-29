import { useEffect, useState } from 'react';
import TemplateItem from './templateItem/templateItem';
import './templates.css';
import type Template from '../../../../models/template';
import { listarTemplates } from '../../orcamento.service';

type Props = {
  onSelectTemplate?: (template: Template | null) => void;
  defaultSelectedId?: string;
};

export default function Templates({ onSelectTemplate, defaultSelectedId }: Props) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(defaultSelectedId ?? null);

  useEffect(() => {
    (async () => {
      const resp = await listarTemplates();
      if (resp.dado) setTemplates(resp.dado);
    })();
  }, []);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    const t = templates.find(x => x.id === id) ?? null;
    onSelectTemplate?.(t);
  };

  return (
    <div className="templates glass-card">
      <h2>Templates</h2>

      {/* grupo de radios */}
      <div className="listagem-templates" role="radiogroup" aria-label="Escolha um template">
        {templates.map((template) => (
          <TemplateItem
            key={template.id}
            template={template}
            name="template-radio-group"
            checked={template.id === selectedId}
            onChange={() => handleSelect(template.id)}
          />
        ))}
      </div>
    </div>
  );
}
