import { PDFDocument } from 'pdf-lib';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    const { files } = req.body; // Les fichiers seront envoyés en base64 ou buffer

    if (!files || files.length < 2) {
      return res.status(400).json({ message: 'Au moins deux fichiers PDF sont requis' });
    }

    // Crée un nouveau document PDF
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const pdfBytes = Buffer.from(file, 'base64');
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=merged.pdf');
    res.status(200).send(Buffer.from(mergedPdfBytes));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la fusion des PDF' });
  }
}
