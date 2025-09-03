import './botaoGoogleLogin.css';
import GoogleIcon from '../../../../assets/google-icon.svg';

interface GoogleLoginButtonProps {
  label: string
}

export default function GoogleLoginButton({label} : GoogleLoginButtonProps) {

  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogin = () => {
    window.location.href = `${API_URL}/oauth2/authorization/google`;
  };

  return (
    <button className="google-login-button" onClick={handleLogin}>
      <img src={GoogleIcon} alt="Google" className="google-icon" />
      {label}
    </button>
  );
};

