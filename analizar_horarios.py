import pdfplumber
import json

# Analizar el primer PDF para entender su estructura
pdf_path = r"c:\Users\Usuario\Documents\Aplicativo\Horarios\horarios_20261_Facultad_Ingenieria.pdf"

with pdfplumber.open(pdf_path) as pdf:
    print(f"Total de páginas: {len(pdf.pages)}")
    print("\n" + "="*80)
    print("PRIMERAS 2 PÁGINAS - CONTENIDO:")
    print("="*80 + "\n")
    
    for page_num in range(min(2, len(pdf.pages))):
        page = pdf.pages[page_num]
        print(f"\n--- PÁGINA {page_num + 1} ---\n")
        
        # Extraer texto
        text = page.extract_text()
        print("TEXTO EXTRAÍDO:")
        print(text[:1500] if text else "No hay texto")
        print("\n" + "-"*80)
        
        # Intentar extraer tablas
        tables = page.extract_tables()
        if tables:
            print(f"\nTABLAS ENCONTRADAS: {len(tables)}")
            for i, table in enumerate(tables[:2]):  # Mostrar primeras 2 tablas
                print(f"\nTabla {i+1}:")
                print(f"Dimensiones: {len(table)} filas x {len(table[0]) if table else 0} columnas")
                if table and len(table) <= 10:
                    for row in table:
                        print(row)
                else:
                    print("(Tabla grande)")
                    if table:
                        for row in table[:5]:
                            print(row)
