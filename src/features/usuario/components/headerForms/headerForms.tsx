import Logo from '../../../../assets/image_1-removebg-preview.png';
import './headerForms.css';

export default function HeaderForms({titulo}: {titulo: string}) {

    return (
        <div>
            <header className='header-cadastro-usuario'>
                <div className='container-header-centralizado'>
                    <div className='div-header-cadastro-usuario'>
                        <img src={Logo} alt="Logo" />
                        <h1>Cotalizer</h1>
                    </div>
                    <h2>{titulo}</h2>
                </div>
            </header>
        </div>
    );
}