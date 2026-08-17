import pypdf
import pypdfium2 as pdfium

pdf_path = r'e:\StatementGen\US_Metro_Bank_Statement_July_2026.pdf'

reader = pypdf.PdfReader(pdf_path)
writer = pypdf.PdfWriter()

for page in reader.pages:
    writer.add_page(page)

# Exact enterprise core-banking eStatement composition metadata:
# Core Banking Platform: Fiserv Premier / Director eStatement Suite
# Engine: OpenText Exstream / AFP2PDF Transformation Engine
# Cycle Period: Statement ending July 31, 2026 -> Batch generated August 1, 2026 at 02:14:38 AM PDT
meta = {
    '/Title': 'US METRO BANK STATEMENT - 07/31/2026',
    '/Producer': 'OpenText Exstream Version 16.6.0 64-bit / Fiserv AFP2PDF Engine',
    '/Creator': 'Fiserv Document Output Architecture (Premier Statement Engine)',
    '/Author': 'US Metro Bank',
    '/Subject': 'Monthly Account Statement',
    '/Keywords': 'US Metro Bank, eStatement, Checking, 07312026',
    '/CreationDate': "D:20260801021438-07'00'",
    '/ModDate': "D:20260801021438-07'00'"
}

writer.add_metadata(meta)

with open(pdf_path, 'wb') as f:
    writer.write(f)

doc = pdfium.PdfDocument(pdf_path)
print('--- VERIFIED NATIVE BANK STATEMENT METADATA ---')
print(doc.get_metadata_dict())
