import "./Header.css"

const Header = () => {
    return (
      <header>
        <div className="header-container">
        <h1 className="titre-header">FileTransformer</h1>
        <p>Fusionner PDF</p>
        <p>Diviser PDF</p>
        <p>Compresser PDF</p>
        <p>Convertire PDF</p>
        <p>Touts les outils PDF</p>
        </div>
        <div className="btn-container-header">
          <button className="btn-header">S'inscrire</button>
          <button className="btn-header">Se connecter</button>
        </div>
      </header>
    );
  };
  
  export default Header; // Exportation correcte
  