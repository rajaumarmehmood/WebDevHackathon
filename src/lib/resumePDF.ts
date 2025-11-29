import { jsPDF } from 'jspdf';

export async function generateResumePDF(resumeData: any): Promise<Buffer> {
  const doc = new jsPDF();
  
  let yPosition = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  // Helper function to add text with word wrap
  const addText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 11) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + (lines.length * (fontSize * 0.4));
  };

  // Header - Name
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(resumeData.name, margin, yPosition);
  yPosition += 10;

  // Contact Info
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${resumeData.email} | ${resumeData.phone || 'N/A'}`, margin, yPosition);
  yPosition += 8;

  // Line separator
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 8;

  // Professional Summary
  if (resumeData.summary) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PROFESSIONAL SUMMARY', margin, yPosition);
    yPosition += 6;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    yPosition = addText(resumeData.summary, margin, yPosition, contentWidth, 10);
    yPosition += 6;
  }

  // Skills
  if (resumeData.skills && resumeData.skills.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('SKILLS', margin, yPosition);
    yPosition += 6;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const skillsText = resumeData.skills.join(' • ');
    yPosition = addText(skillsText, margin, yPosition, contentWidth, 10);
    yPosition += 6;
  }

  // Experience
  if (resumeData.experience && resumeData.experience.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PROFESSIONAL EXPERIENCE', margin, yPosition);
    yPosition += 6;

    resumeData.experience.forEach((exp: any) => {
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(exp.title, margin, yPosition);
      yPosition += 5;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text(`${exp.company} | ${exp.duration}`, margin, yPosition);
      yPosition += 5;

      doc.setFont('helvetica', 'normal');
      yPosition = addText(exp.description || '', margin, yPosition, contentWidth, 10);
      yPosition += 5;
    });
    yPosition += 2;
  }

  // Projects
  if (resumeData.projects && resumeData.projects.length > 0) {
    // Check if we need a new page
    if (yPosition > 220) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PROJECTS', margin, yPosition);
    yPosition += 6;

    resumeData.projects.forEach((project: any) => {
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(project.name, margin, yPosition);
      yPosition += 5;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      if (project.description) {
        yPosition = addText(project.description, margin, yPosition, contentWidth, 10);
      }

      if (project.tech && project.tech.length > 0) {
        doc.setFont('helvetica', 'italic');
        const techText = `Technologies: ${project.tech.join(', ')}`;
        yPosition = addText(techText, margin, yPosition, contentWidth, 9);
      }
      yPosition += 5;
    });
    yPosition += 2;
  }

  // Education
  if (resumeData.education && resumeData.education.length > 0) {
    // Check if we need a new page
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('EDUCATION', margin, yPosition);
    yPosition += 6;

    resumeData.education.forEach((edu: any) => {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(edu.degree, margin, yPosition);
      yPosition += 5;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`${edu.school} | ${edu.year}`, margin, yPosition);
      yPosition += 5;

      if (edu.gpa) {
        doc.text(`GPA: ${edu.gpa}`, margin, yPosition);
        yPosition += 5;
      }
    });
  }

  // Convert to buffer
  const pdfOutput = doc.output('arraybuffer');
  return Buffer.from(pdfOutput);
}
