import Logo from '../../../../assets/ChatGPT_Image_6_de_jun._de_2025__14_33_15-removebg-preview 2.png';
import './headerForms.css';

export default function HeaderForms({titulo}: {titulo: string}) {

    return (
        <div>
            <header className='header-cadastro-usuario'>
                <div className='container-header-centralizado'>
                    <div className='div-header-cadastro-usuario'>
                        <img src={Logo} alt="Logo" />
                        <h1>OrçaJá</h1>
                    </div>
                    <h2>{titulo}</h2>
                </div>
            </header>
        </div>
    );
}