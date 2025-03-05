import "./Header.css";
import Link from "next/link";

const Header = () => {
  return (
    <header>
      <div className='header-container'>
        <Link href={"/"}>
          <h1 className='titre-header'>FileTransformer</h1>
        </Link>
        <Link href={"/Tools/FusionnerPDF"}>
        <p className='texte-header'>Fusionner PDF</p>
        </Link>
        <p className='texte-header'>Diviser PDF</p>
        <p className='texte-header'>Compresser PDF</p>
        <p className='texte-header'>Convertire PDF</p>
        <p className='texte-header'>Touts les outils PDF</p>
      </div>
      <div className='btn-container-header'>
        <button className='btn-header'>S'inscrire</button>
        <button className='btn-header'>Se connecter</button>
      </div>
    </header>
  );
};

export default Header; // Exportation correcte
