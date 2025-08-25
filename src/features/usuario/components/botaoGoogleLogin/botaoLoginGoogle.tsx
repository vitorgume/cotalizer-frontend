import './botaoGoogleLogin.css';
import GoogleIcon from '../../../../assets/google-icon.svg';

interface GoogleLoginButtonProps {
  label: string
}

export default function GoogleLoginButton({label} : GoogleLoginButtonProps) {

  const handleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <button className="google-login-button" onClick={handleLogin}>
      <img src={GoogleIcon} alt="Google" className="google-icon" />
      {label}
    </button>
  );
};

