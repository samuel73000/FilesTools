import { PDFDocument } from 'pdf-lib';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    const { file } = req.body; // PDF en Base64
    if (!file) {
      return res.status(400).json({ message: 'Aucun fichier fourni' });
    }

    // Charger le fichier PDF
    const pdfBytes = Buffer.from(file, 'base64');
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const totalPages = pdfDoc.getPageCount();

    let splitFiles = [];

    // Extraire chaque page comme un fichier PDF séparé
    for (let i = 0; i < totalPages; i++) {
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(copiedPage);
      const newPdfBytes = await newPdf.save();
      splitFiles.push(Buffer.from(newPdfBytes).toString('base64'));
    }

    // Retourne les fichiers en Base64 pour le frontend
    res.status(200).json({ files: splitFiles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la division du PDF' });
  }
}
