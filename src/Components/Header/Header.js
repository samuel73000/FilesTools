import "./Header.css";
import Link from "next/link";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();

  return (
    <header>
      <div className='header-container'>
        <Link href={"/"}>
          <h1 className='titre-header'>FilesTools</h1>
        </Link>
        <Link href={"/Tools/FusionnerPDF"}>
          <p
            className={`texte-header ${
              router.pathname === "/Tools/FusionnerPDF" ? "active" : ""
            }`}>
            Fusionner PDF
          </p>
        </Link>
        <Link href={"/Tools/DiviserPDF"}>
          <p
            className={`texte-header ${
              router.pathname === "/Tools/DiviserPDF" ? "active" : ""
            }`}>
            Diviser PDF
          </p>
        </Link>
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
