import pdfplumber
import json

# Analizar el PDF para ver su estructura
pdf_path = r'c:\Users\Usuario\Documents\Aplicativo\Horarios\horarios_20261_Facultad_Ingenieria.pdf'

try:
    with pdfplumber.open(pdf_path) as pdf:
        page = pdf.pages[0]
        text = page.extract_text()
        
        # Imprimir las primeras 50 líneas para ver el formato
        lines = text.split('\n')
        print("="*80)
        print("PRIMERAS 50 LÍNEAS DEL PDF:")
        print("="*80)
        for i, line in enumerate(lines[:50]):
            print(f"{i:3d}: {line}")
        
        # Ver si hay tablas
        print("\n" + "="*80)
        print("TABLAS DETECTADAS:")
        print("="*80)
        tables = page.extract_tables()
        if tables:
            print(f"Se encontraron {len(tables)} tablas")
            if tables[0]:
                print("\nPrimeras 5 filas de la primera tabla:")
                for row in tables[0][:5]:
                    print(row)
        else:
            print("No se detectaron tablas")
            
except Exception as e:
    print(f"Error: {e}")
