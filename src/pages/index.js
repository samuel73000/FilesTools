import "./Home.css";
import ToolIcons from "../Components/ToolIcons/ToolIcons";

export default function Home() {
  return (
    <section className='section-home'>
      <div className='container-titre-home'>
        <h2 className='titre-home'>
          Tous les outils nécessaires pour travailler sur vos PDF, en un seul
          endroit
        </h2>
        <p className='sous-titre-home'>
          Tous les outils dont vous avez besoin pour utiliser les PDF, à portée
          de main. Ils sont tous 100% GRATUITS et simples d'utilisation !
          Fusionnez, divisez, compressez, convertissez, faites pivoter,
          déverrouillez et ajoutez un filigrane à vos PDF en seulement quelques
          clics.
        </p>
      </div>
      <div className='container-all-outils-home'>
        <ToolIcons />
      </div>
    </section>
  );
}
