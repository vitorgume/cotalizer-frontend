import { useNavigate } from 'react-router-dom';
import './sucessoPagamento.css';

export default function SucessoPagamento() {

    const navigate = useNavigate();

     return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <h2 style={{ color: '#38a169', marginBottom: '16px' }}>🎉 Assinatura criada com sucesso!</h2>
      <p style={{ fontSize: '16px', color: '#4a5568' }}>
        Obrigado por se inscrever. Seu pagamento foi processado com sucesso.
      </p>
      <button
        style={{
          marginTop: '24px',
          padding: '12px 24px',
          backgroundColor: '#3B82F6',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer'
        }}
        onClick={() => navigate('/menu')}
      >
        Voltar
      </button>
    </div>
  );
}
