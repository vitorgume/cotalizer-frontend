import React, { useState } from 'react';
import './formsProdutoList.css';
import InputPadrao from '../inputPadrao/inputPadrao';
import type { Produto } from '../../../../models/produto';

interface FormsProdutoListProps {
  onAddProduto: (produto: Produto) => void;
}

export function FormsProdutoList({ onAddProduto }: FormsProdutoListProps) {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!descricao.trim() || !valor || !quantidade) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    const valorNumerico = parseFloat(valor.replace(',', '.'));
    const quantidadeNumerica = parseInt(quantidade);

    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      alert('Por favor, insira um valor válido');
      return;
    }

    if (isNaN(quantidadeNumerica) || quantidadeNumerica <= 0) {
      alert('Por favor, insira uma quantidade válida');
      return;
    }

    setIsSubmitting(true);

    try {
      const novoProduto: Produto = {
        id: '',
        descricao: descricao.trim(),
        quantidade: quantidadeNumerica,
        valor: valorNumerico,
      };

      onAddProduto(novoProduto);

      setDescricao('');
      setValor('');
      setQuantidade('');
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      alert('Erro ao adicionar produto. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setDescricao('');
    setValor('');
    setQuantidade('');
  };

  return (
    <div className="forms-produto-container">
      <form className="forms-produto glass-card" onSubmit={handleSubmit}>
        <div className="form-header">
          <h3>Adicionar Produto</h3>
          <p className="form-subtitle">Preencha os dados do produto</p>
        </div>

        <div className="form-field">
          <label htmlFor="descricao">Descrição do Produto</label>
          <textarea
            id="descricao"
            className="textarea-descricao"
            placeholder="Digite a descrição do produto..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={3}
            required
            maxLength={250}
          />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="valor">Valor Unitário (R$)</label>
            <InputPadrao
              placeholder="0,00"
              value={valor}
              onChange={setValor}
              inativo={false}
              senha={false}
              limiteCaracteres={1000}
              mascara='numeroDecimal'
               upperCase={true}
            />
          </div>

          <div className="form-field">
            <label htmlFor="quantidade">Quantidade</label>
            <InputPadrao
              placeholder="1"
              value={quantidade}
              onChange={setQuantidade}
              inativo={false}
              senha={false}
              limiteCaracteres={1000}
              mascara=''
              upperCase={true}
            />
          </div>
        </div>

        <div className="form-preview">
          {descricao && valor && quantidade && (
            <div className="preview-card glass-slot">
              <h4>Preview do Produto</h4>
              <div className="preview-details">
                <p><strong>Produto:</strong> {descricao}</p>
                <p><strong>Quantidade:</strong> {quantidade}</p>
                <p><strong>Valor Unit.:</strong> R$ {parseFloat(valor.replace(',', '.') || '0').toFixed(2)}</p>
                <p><strong>Total:</strong> R$ {(parseFloat(valor.replace(',', '.') || '0') * parseInt(quantidade || '0')).toFixed(2)}</p>
              </div>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-limpar"
            onClick={handleReset}
            disabled={isSubmitting}
          >
            Limpar
          </button>
          <button
            type="submit"
            className="btn-adicionar"
            disabled={isSubmitting || !descricao.trim() || !valor || !quantidade}
          >
            {isSubmitting ? 'Adicionando...' : 'Adicionar Produto'}
          </button>
        </div>
      </form>
    </div>
  );
}
