import pypdf
import pypdfium2 as pdfium
import os

statements_config = [
    {
        'path': r'e:\StatementGen\US_Metro_Bank_Statement_June_2026.pdf',
        'title': 'US METRO BANK STATEMENT - 06/30/2026',
        'keywords': 'US Metro Bank, eStatement, Checking, 06302026',
        # Batch generated at 02:14:38 AM PDT on July 1, 2026 (following statement close on 06/30/2026)
        'creation_date': "D:20260701021438-07'00'"
    },
    {
        'path': r'e:\StatementGen\US_Metro_Bank_Statement_July_2026.pdf',
        'title': 'US METRO BANK STATEMENT - 07/31/2026',
        'keywords': 'US Metro Bank, eStatement, Checking, 07312026',
        # Batch generated at 02:14:38 AM PDT on August 1, 2026 (following statement close on 07/31/2026)
        'creation_date': "D:20260801021438-07'00'"
    },
    {
        'path': r'e:\StatementGen\US_Metro_Bank_2Month_Medical_Statement.pdf',
        'title': 'US METRO BANK STATEMENT - 07/31/2026',
        'keywords': 'US Metro Bank, eStatement, Checking, 07312026',
        'creation_date': "D:20260801021438-07'00'"
    }
]

for cfg in statements_config:
    pdf_path = cfg['path']
    if not os.path.exists(pdf_path):
        print(f'File not found: {pdf_path}')
        continue
    
    reader = pypdf.PdfReader(pdf_path)
    writer = pypdf.PdfWriter()
    
    # Copy pages cleanly
    for page in reader.pages:
        writer.add_page(page)
    
    # Strip all Chromium/Skia/PDFium/Playwright metadata and XMP streams
    # Inject exact core-banking metadata dictionary:
    # Fiserv Premier statement output architecture with OpenText Exstream print stream renderer
    meta = {
        '/Title': cfg['title'],
        '/Author': 'US Metro Bank',
        '/Subject': 'Monthly Account Statement',
        '/Keywords': cfg['keywords'],
        '/Creator': 'Fiserv Document Output Architecture (Premier Statement Engine)',
        '/Producer': 'OpenText Exstream Version 16.6.0 64-bit / Fiserv AFP2PDF Engine',
        '/CreationDate': cfg['creation_date'],
        '/ModDate': cfg['creation_date']
    }
    
    writer.add_metadata(meta)
    
    # Overwrite clean binary
    with open(pdf_path, 'wb') as f:
        writer.write(f)
    
    # Verify metadata using pdfium
    doc = pdfium.PdfDocument(pdf_path)
    print(f'=== VERIFIED METADATA: {os.path.basename(pdf_path)} ===')
    for k, v in doc.get_metadata_dict().items():
        print(f'  {k}: {v}')
    print()
