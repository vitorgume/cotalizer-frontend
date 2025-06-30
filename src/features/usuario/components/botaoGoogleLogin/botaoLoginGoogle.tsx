import './botaoGoogleLogin.css';
import GoogleIcon from '../../../../assets/google-icon.svg';

export default function GoogleLoginButton() {
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

