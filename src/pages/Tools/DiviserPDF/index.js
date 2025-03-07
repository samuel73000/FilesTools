import { useRef, useState, useEffect } from "react";
import PdfViewer from "../../../Components/PdfViewer/PdfViewer";
import "./DiviserPDF.css";

export default function DiviserPDF() {
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [pdfUrls, setPdfUrls] = useState([]);
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);

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

  const handleMerge = async () => {
    if (selectedFiles.length < 2) {
      alert("Veuillez sélectionner au moins deux fichiers PDF.");
      return;
    }

    const filePromises = selectedFiles.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result.split(",")[1]); // Récupérer la base64
          reader.readAsDataURL(file);
        })
    );

    const filesBase64 = await Promise.all(filePromises);

    const response = await fetch("/api/merge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ files: filesBase64 }),
    });

    if (!response.ok) {
      alert("Erreur lors de la fusion des fichiers.");
      return;
    }

    const blob = await response.blob();
    setMergedPdfUrl(URL.createObjectURL(blob));
  };

  return (
    <section
      className='section-fusionnerPDF'
      onDragOver={handleDragOver}
      onDrop={handleDrop}>
      {selectedFiles.length === 0 ? (
        <>
          <h2 className='titre-fusionnerPDF'>Diviser le fichier PDF</h2>
          <p className='texte-fusionnerPDF'>
          Sélectionner la portée de pages, séparer une page, ou convertir chaque page du document en fichier PDF indépendant.
          </p>
          <button className='bouton-fusionnerPDF' onClick={handleClick}>
          Sélectionner le fichier PDF
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
          ou déposer le PDF ici
          </p>
        </>
      ) : (
        <section>
          <div className='container-fusionnerPDF-pdf-viewer'>
            {pdfUrls.map((url, index) => (
              <div key={index}>
                <PdfViewer url={url} width={200} height={300} />
                <p className='texte-fusionnerPDF-pdf-viewer'>
                  {selectedFiles[index].name}
                </p>
              </div>
            ))}
          </div>
          {mergedPdfUrl ? (
            <div style={{ marginTop: "50px" }}>
              <a
                href={mergedPdfUrl}
                download='FileTransfomer-Merged.pdf'
                className='bouton-fusionnerPDF'>
                Télécharger le PDF fusionné
              </a>
            </div>
          ) : (
            <div>
              <button onClick={handleMerge} className='bouton-fusionnerPDF'>
                Diviser PDF
              </button>
            </div>
          )}
        </section>
      )}
    </section>
  );
}
