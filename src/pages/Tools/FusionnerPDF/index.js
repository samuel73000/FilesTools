import { useCallback, useRef, useState, useEffect } from "react";
import PdfViewer from "../../../Components/PdfViewer/PdfViewer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHand, faTimes } from "@fortawesome/free-solid-svg-icons";

import "./FusionnerPDF.css";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableItem(props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginRight: "8px",
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className='drag-handle' {...attributes} {...listeners}>
        <FontAwesomeIcon icon={faHand} className='icon-fusionner-grab' />
      </div>
      {props.children}
    </div>
  );
}

export default function FusionnerPDF() {
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [pdfUrls, setPdfUrls] = useState([]);
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

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
    setIsMounted(true);
    return () => {
      pdfUrls.forEach((url) => URL.revokeObjectURL(url));
      setIsMounted(false);
    };
  }, [selectedFiles]);

  const handleMerge = useCallback(async () => {
    if (selectedFiles.length < 2) {
      alert("Veuillez sélectionner au moins deux fichiers PDF.");
      return;
    }

    // Utiliser l'ordre actuel des fichiers sélectionnés
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
  }, [selectedFiles]);

  // Fonction pour gérer le déplacement des éléments
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setSelectedFiles((prevItems) => {
        const oldIndex = prevItems.findIndex((file) => file.name === active.id);
        const newIndex = prevItems.findIndex((file) => file.name === over.id);
        const newItems = arrayMove(prevItems, oldIndex, newIndex);

        // Mettre à jour les URLs pour correspondre au nouvel ordre des fichiers
        setPdfUrls((prevUrls) => {
          const newUrls = arrayMove(prevUrls, oldIndex, newIndex);
          return newUrls;
        });

        return newItems;
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  /**
   * Supprime un fichier de la liste des fichiers sélectionnés
   * @param {string} fileName
   */
  const handleRemoveFile = (fileName) => {
    setSelectedFiles((prevFiles) => {
      const newFiles = prevFiles.filter((file) => file.name !== fileName);
      return newFiles;
    });

    setPdfUrls((prevUrls) => {
      return prevUrls.filter((url, index) => {
        return selectedFiles[index].name !== fileName;
      });
    });
  };

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
          <p>
            Pour modifier l'ordre de vos fichiers PDF, glissez-déposez les
            fichiers comme bon vous semble.
          </p>
          <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
            <SortableContext
              items={selectedFiles.map((file) => file.name)}
              strategy={rectSortingStrategy}>
              <div
                className='container-fusionnerPDF-pdf-viewer'
                style={{ display: "flex", overflowX: "auto" }}>
                {isMounted &&
                  selectedFiles.map((file, index) => (
                    <SortableItem key={file.name} id={file.name}>
                      <div style={{ position: "relative" }}>
                        <PdfViewer
                          url={pdfUrls[index]}
                          width={200}
                          height={300}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <FontAwesomeIcon
                          icon={faTimes}
                          className='icon-fusionner-croix'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile(file.name);
                          }}
                        />
                      </div>
                      <p
                        className='texte-fusionnerPDF-pdf-viewer'
                        onClick={(e) => e.stopPropagation()}>
                        {file.name}
                      </p>
                    </SortableItem>
                  ))}
              </div>
            </SortableContext>
          </DndContext>

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
                Fusionner PDF
              </button>
            </div>
          )}
        </section>
      )}
    </section>
  );
}
