import { useRef, useState, useEffect } from "react";
import PdfViewer from "../../../Components/PdfViewer/PdfViewer";
import "./DiviserPDF.css";

export default function DiviserPDF() {
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [pdfUrls, setPdfUrls] = useState([]);
  const [splitFiles, setSplitFiles] = useState([]);
  const [file, setFile] = useState(null);
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
      const file = files[0];
      setSelectedFiles([file]);
      // Créer l'URL pour le fichier PDF
      const url = URL.createObjectURL(file);
      setPdfUrls([url]);
      console.log("Fichier sélectionné :", file.name);
      setFile(file);
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
      // Modifier ici pour ne prendre que le premier fichier
      const file = files[0];
      setSelectedFiles([file]);
      // Créer l'URL pour le fichier PDF
      const url = URL.createObjectURL(file);
      setPdfUrls([url]);
      console.log("Fichier déposé :", file.name);
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
      setFile(file);
    }
  };

  useEffect(() => {
    return () => {
      // Nettoyer toutes les URLs lors du démontage
      pdfUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [pdfUrls]);

  const handleSplit = async () => {
    if (!file) {
      alert("Veuillez sélectionner un fichier PDF.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64File = e.target.result.split(",")[1]; // Extraire le contenu Base64

      const response = await fetch("/api/split", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: base64File }),
      });

      if (!response.ok) {
        alert("Erreur lors de la division du fichier.");
        return;
      }

      const data = await response.json();
      setSplitFiles(data.files);
    };

    reader.onerror = () => {
      alert("Erreur lors de la lecture du fichier.");
    };

    reader.readAsDataURL(file);
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
            Sélectionner la portée de pages, séparer une page, ou convertir
            chaque page du document en fichier PDF indépendant.
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
          <p className='texte-2-fusionnerPDF'>ou déposer le PDF ici</p>
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
          {splitFiles.length > 0 ? (
            <div style={{ marginTop: "50px" }}>
              {splitFiles.map((pdfBase64, index) => (
                <a
                className='bouton-fusionnerPDF'
                  key={index}
                  href={`data:application/pdf;base64,${pdfBase64}`}
                  download={`page-${index + 1}.pdf`}
                  style={{ display: "block", marginTop: "5px" }}>
                  Télécharger page {index + 1}
                </a>
              ))}
            </div>
          ) : (
            <div>
              <button onClick={handleSplit} className='bouton-fusionnerPDF'>
                Diviser PDF
              </button>
            </div>
          )}
        </section>
      )}
    </section>
  );
}
