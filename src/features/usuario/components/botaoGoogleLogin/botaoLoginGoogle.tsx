import './botaoGoogleLogin.css';
import GoogleIcon from '../../../../assets/google-icon.svg';
import { useNavigate } from 'react-router-dom';

export default function GoogleLoginButton() {

  const navigate = useNavigate();

  const handleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <button className="google-login-button" onClick={handleLogin}>
      <img src={GoogleIcon} alt="Google" className="google-icon" />
      Entrar com Google
    </button>
  );
};

