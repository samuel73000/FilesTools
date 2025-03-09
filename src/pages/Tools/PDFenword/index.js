import "./PdfToWord.css";

export default function PDFenword() {
    
  return (
    <section className='section-fusionnerPDF'>
      <h2 className='titre-fusionnerPDF'>Convertir PDF en WORD</h2>
      <p className='texte-fusionnerPDF'>
      Convertissez vos documents PDF en WORD avec une précision incroyable.
      </p>
      <button className='bouton-fusionnerPDF'>
        Sélectionner les fichiers PDF
      </button>
      <input
        type='file'
        accept='application/pdf'
        multiple
        style={{ display: "none" }}
      />
      <p className='texte-2-fusionnerPDF'>ou déposez le PDF ici</p>
    </section>
  );
}
