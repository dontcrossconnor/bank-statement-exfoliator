from playwright.sync_api import sync_playwright
import pypdf
import pymupdf
import os

def export_scenario_pdf(scenario_id, output_path, title, date_str):
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        url = f'http://localhost:5175?scenario={scenario_id}'
        print(f'Navigating to {url}...')
        page.goto(url, wait_until='networkidle')
        page.wait_for_timeout(2000)
        
        page.emulate_media(media='print')
        page.pdf(
            path=output_path,
            format='Letter',
            print_background=True,
            margin={'top': '0', 'bottom': '0', 'left': '0', 'right': '0'}
        )
        browser.close()
        print(f'Saved {output_path}')
        
    reader = pypdf.PdfReader(output_path)
    writer = pypdf.PdfWriter()
    for pg in reader.pages:
        writer.add_page(pg)
        
    meta = {
        '/Title': title,
        '/Author': 'US 1364 Federal Credit Union',
        '/Subject': 'Member Financial Account Statement',
        '/Keywords': f'US 1364 FCU, Credit Union, eStatement, Regular Savings, Share Draft, {date_str}',
        '/Creator': 'Symitar Episys Core Document Publishing Engine (v24.2)',
        '/Producer': 'PDFlib Personalization Server 9.3 / NCUA Credit Union Statement Generator',
        '/CreationDate': "D:20261001031422-07'00'",
        '/ModDate': "D:20261001031422-07'00'"
    }
    writer.add_metadata(meta)
    with open(output_path, 'wb') as f:
        writer.write(f)
    print(f'Injected authentic metadata into {output_path}')

if __name__ == '__main__':
    # 1. September 2026
    export_scenario_pdf(
        'us1364_hashmi_september_scenario',
        'E:/StatementGen/US_1364_FCU_Statement_September_2026.pdf',
        'US 1364 FCU STATEMENT - 09/30/2026 - SEAN HASAN HASHMI',
        '09302026'
    )
    # 2. August 2026
    export_scenario_pdf(
        'us1364_hashmi_august_scenario',
        'E:/StatementGen/US_1364_FCU_Statement_August_2026.pdf',
        'US 1364 FCU STATEMENT - 08/31/2026 - SEAN HASAN HASHMI',
        '08312026'
    )
    # 3. 2-Month Combined
    export_scenario_pdf(
        'us1364_hashmi_2month_scenario',
        'E:/StatementGen/US_1364_FCU_Statement_Aug_Sept_2026_2Month.pdf',
        'US 1364 FCU STATEMENT - 08/01/2026 to 09/30/2026 - SEAN HASAN HASHMI',
        '09302026'
    )
