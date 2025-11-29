// Cache the PDFParse class
let PDFParseClass: any = null;

function getPDFParseClass() {
  if (!PDFParseClass) {
    try {
      // Use eval to bypass Next.js bundler for require
      const pdfParse = eval('require')('pdf-parse');
      PDFParseClass = pdfParse.PDFParse;
      
      if (!PDFParseClass) {
        throw new Error('PDFParse class not found in pdf-parse module');
      }
    } catch (e: any) {
      console.error('Failed to load pdf-parse:', e);
      throw new Error(`PDF parser library not available: ${e.message}`);
    }
  }
  return PDFParseClass;
}

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  let parser: any = null;
  
  try {
    // Validate buffer
    if (!buffer || buffer.length === 0) {
      throw new Error('Invalid or empty PDF buffer');
    }

    console.log('Loading pdf-parse library...');
    const PDFParse = getPDFParseClass();
    
    console.log('Creating PDF parser instance...');
    // Create parser instance with the buffer
    parser = new PDFParse({ data: buffer });

    console.log('Extracting text from PDF...');
    // Extract text using getText method
    const result = await parser.getText();

    if (!result || !result.text) {
      throw new Error('No text content extracted from PDF');
    }

    if (result.text.trim().length === 0) {
      throw new Error('PDF appears to be empty or contains only images');
    }

    console.log(`Successfully extracted ${result.text.length} characters from ${result.pages.length} pages`);
    return result.text;
  } catch (error: any) {
    console.error('Error parsing PDF:', error);
    console.error('Error stack:', error.stack);
    
    // Provide more specific error messages
    if (error.message?.includes('Invalid PDF') || error.message?.includes('InvalidPDFException')) {
      throw new Error('Invalid PDF file format');
    } else if (error.message?.includes('encrypted') || error.message?.includes('PasswordException')) {
      throw new Error('PDF is password protected');
    } else if (error.message?.includes('empty')) {
      throw new Error(error.message);
    } else if (error.message?.includes('not available')) {
      throw new Error(error.message);
    } else {
      throw new Error(`Failed to parse PDF: ${error.message || 'Unknown error'}`);
    }
  } finally {
    // Clean up parser instance
    if (parser && typeof parser.destroy === 'function') {
      try {
        await parser.destroy();
      } catch (e) {
        console.warn('Failed to destroy PDF parser:', e);
      }
    }
  }
}

export function cleanResumeText(text: string): string {
  if (!text || text.trim().length === 0) {
    throw new Error('No text content to clean');
  }

  // Preserve line breaks initially for better structure
  let cleaned = text;
  
  // Remove excessive whitespace while preserving single spaces
  cleaned = cleaned.replace(/[ \t]+/g, ' ');
  
  // Normalize line breaks (max 2 consecutive)
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  // Remove special characters but keep important ones for resumes
  // Keep: letters, numbers, spaces, @, ., ,, -, (), /, +, #, &, :, ;, ', "
  cleaned = cleaned.replace(/[^\w\s@.,\-()\/+#&:;'"]/g, '');
  
  // Clean up any remaining excessive spaces
  cleaned = cleaned.replace(/\s+/g, ' ');
  
  // Trim and ensure we have content
  cleaned = cleaned.trim();
  
  if (cleaned.length < 50) {
    throw new Error('Extracted text is too short to be a valid resume');
  }
  
  console.log(`Cleaned text: ${cleaned.length} characters`);
  return cleaned;
}
