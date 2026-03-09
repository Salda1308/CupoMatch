import pdfplumber
import json
import re

pdf_path = r'c:\Users\Usuario\Documents\Aplicativo\Horarios\horarios_20261_Facultad_Ingenieria.pdf'
horarios = []

try:
    with pdfplumber.open(pdf_path) as pdf:
        current_carrera = ''
        current_materia = ''
        current_grupo = ''
        
        # Solo procesar primera página para prueba
        page = pdf.pages[0]
        text = page.extract_text()
        
        if not text:
            print("No hay texto en la página")
        else:
            lines = text.split('\n')
            
            for i, line in enumerate(lines):
                # Detectar carrera (PROYECTO CURRICULAR)
                if 'PROYECTO CURRICULAR' in line:
                    current_carrera = line.replace('PROYECTO CURRICULAR', '').strip()
                    print(f"Carrera encontrada: {current_carrera}")
                
                # Detectar materia (ESPACIO ACADEMICO
                elif 'ESPACIO ACADEMICO' in line:
                    current_materia = line.replace('ESPACIO ACADEMICO', '').strip()
                    print(f"Materia encontrada: {current_materia}")
                
                # Detectar grupo
                elif line.startswith('GRP.'):
                    match = re.search(r'GRP\.\s*([0-9\-]+)', line)
                    if match:
                        current_grupo = match.group(1)
                        print(f"Grupo encontrado: {current_grupo}")
                
                # Extraer datos (líneas con horarios)
                elif re.match(r'^\d+\s+', line) and current_grupo:
                    print(f"\nProcesando línea: {line}")
                    
                    # Extraer código de materia (primer número)
                    cod_match = re.match(r'^(\d+)', line)
                    if not cod_match:
                        continue
                    cod = cod_match.group(1)
                    
                    # Buscar día de la semana
                    dias = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO']
                    dia = ''
                    for d in dias:
                        if d in line:
                            dia = d
                            break
                    
                    # Buscar hora (formato X-Y)
                    hora_match = re.search(r'(\d+)-(\d+)', line)
                    hora = hora_match.group(0) if hora_match else ''
                    
                    # Extraer docente (después de AULA o SALON)
                    docente = ''
                    # Buscar patrones de salón
                    salon_patterns = [r'AULA\s+\d+', r'AULA\s+DE\s+CLASE\s+\d+', r'SALON\s+\d+', r'LABORATORIO\s+\d+']
                    for pattern in salon_patterns:
                        match = re.search(pattern, line)
                        if match:
                            # Todo lo que viene después del salón es el docente
                            pos = match.end()
                            docente = line[pos:].strip()
                            print(f"  Docente extraído: {docente}")
                            break
                    
                    # Si no se encontró docente
                    if not docente and hora:
                        # Partir después de la hora y tomar las últimas palabras
                        hora_pos = line.find(hora) + len(hora)
                        resto = line[hora_pos:].strip().split()
                        # Las últimas 3-4 palabras suelen ser el nombre del docente
                        if len(resto) >= 4:
                            docente = ' '.join(resto[-4:])
                        elif len(resto) >= 3:
                            docente = ' '.join(resto[-3:])
                        print(f"  Docente (método 2): {docente}")
                    
                    horario_obj = {
                        'codigo_materia': cod,
                        'nombre_materia': current_materia,
                        'grupo': current_grupo,
                        'carrera': current_carrera,
                        'dia': dia,
                        'hora': hora,
                        'docente': docente or 'PROFESOR SIN ASIGNAR',
                        'semestre': '2026-1'
                    }
                    horarios.append(horario_obj)
                    
                    # Solo procesar primeros 5 horarios para prueba
                    if len(horarios) >= 5:
                        break
        
        print(f"\n{'='*80}")
        print(f"Total de horarios extraídos: {len(horarios)}")
        print(f"{'='*80}\n")
        print(json.dumps(horarios, ensure_ascii=False, indent=2))
        
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
