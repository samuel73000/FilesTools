import { useRef, useState, useEffect } from "react";
import PdfViewer from "../../../Components/PdfViewer/PdfViewer";
import "./FusionnerPDF.css";

export default function FusionnerPDF() {
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [pdfUrls, setPdfUrls] = useState([]);

  /**
   * Déclenche le clic sur l'input file caché lorsque le bouton est cliqué
   */
  const handleClick = () => {
    fileInputRef.current.click();
  };

  /**
   * Gère le changement de fichiers lorsque l'utilisateur sélectionne des fichiers via l'input
   */
  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      setSelectedFiles(Array.from(files));
      // Créer les URLs pour tous les fichiers PDF
      const urls = Array.from(files).map((file) => URL.createObjectURL(file));
      setPdfUrls(urls);
      console.log(
        "Fichiers sélectionnés :",
        Array.from(files).map((file) => file.name)
      );
    }
  };

  /**
   * Empêche le comportement par défaut lors du survol d'un fichier
   */
  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  /**
   * Gère le dépôt de fichiers PDF dans la zone de drop
   * Filtre uniquement les fichiers PDF et met à jour l'input file
   */
  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const files = Array.from(event.dataTransfer.files).filter(
      (file) => file.type === "application/pdf"
    );

    if (files.length > 0) {
      setSelectedFiles(files);
      // Créer les URLs pour tous les fichiers PDF
      const urls = files.map((file) => URL.createObjectURL(file));
      setPdfUrls(urls);
      console.log(
        "Fichiers déposés :",
        files.map((file) => file.name)
      );
      const dataTransfer = new DataTransfer();
      files.forEach((file) => dataTransfer.items.add(file));
      fileInputRef.current.files = dataTransfer.files;
    }
  };

  useEffect(() => {
    return () => {
      // Nettoyer toutes les URLs lors du démontage
      pdfUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [pdfUrls]);

  return (
    <section
      className='section-fusionnerPDF'
      onDragOver={handleDragOver}
      onDrop={handleDrop}>
      {selectedFiles.length === 0 ? (
        <>
          <h2 className='titre-fusionnerPDF'>Fusionner des fichiers PDF</h2>
          <p className='texte-fusionnerPDF'>
            Fusionner et combiner des fichiers PDF et les mettre dans l'ordre
            que vous voulez.
          </p>
          <button className='bouton-fusionnerPDF' onClick={handleClick}>
            Sélectionner les fichiers PDF
          </button>
          <input
            type='file'
            ref={fileInputRef}
            onChange={handleFileChange}
            accept='application/pdf'
            multiple
            style={{ display: "none" }}
          />
          <p className='texte-2-fusionnerPDF'>
            ou déposez des fichiers PDF ici
          </p>
        </>
      ) : (
        <section>
          <div className="container-fusionnerPDF-pdf-viewer">
          {pdfUrls.map((url, index) => (
            <div key={index}>
              <PdfViewer url={url} width={200} height={300} />
              <p className='texte-fusionnerPDF-pdf-viewer'>
                {selectedFiles[index].name}
              </p>
            </div>
          ))}
          </div>
          <div>
          <button className="bouton-fusionnerPDF ">Fusionner PDF</button>
          </div>
        </section>
      )}
    </section>
  );
}
