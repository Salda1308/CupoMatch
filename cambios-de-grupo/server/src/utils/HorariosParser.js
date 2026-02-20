import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { allQuery, runQuery } from '../models/database.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Parser de horarios con soporte para extraer información de PDFs automáticamente
 * El formato se detecta analizando las características del PDF
 */
class HorariosParser {
  constructor() {
    this.pdfPath = null;
    this.horariosData = [];
    this.format = null;
  }

  /**
   * Detectar el formato del PDF analizando su estructura
   */
  async detectarFormato(pdfPath) {
    // Usar Python para extraer datos del PDF
    return new Promise((resolve) => {
      const pythonScript = `
import pdfplumber
import json
import sys

pdf_path = r'${pdfPath}'

try:
    with pdfplumber.open(pdf_path) as pdf:
        page = pdf.pages[0]
        text = page.extract_text()
        
        # Buscar patrones comunes
        result = {
            'total_pages': len(pdf.pages),
            'primer_texto': text[:500] if text else '',
            'tiene_tablas': len(page.extract_tables()) > 0,
            'num_tablas': len(page.extract_tables())
        }
        
        print(json.dumps(result))
except Exception as e:
    print(json.dumps({'error': str(e)}))
`;

      const python = spawn('python', ['-c', pythonScript]);
      let output = '';

      python.stdout.on('data', (data) => {
        output += data.toString();
      });

      python.on('close', () => {
        try {
          const result = JSON.parse(output);
          resolve(result);
        } catch (e) {
          resolve({ error: 'Cannot parse' });
        }
      });
    });
  }

  /**
   * Extraer horarios del PDF usando Python
   */
  async extraerHorariosDePDF(pdfPath, semestre = '2026-1') {
    return new Promise((resolve, reject) => {
      const pythonScript = `
import pdfplumber
import json
import re

pdf_path = r'${pdfPath}'
horarios = []

try:
    with pdfplumber.open(pdf_path) as pdf:
        current_carrera = ''
        current_materia = ''
        current_grupo = ''
        
        for page_num, page in enumerate(pdf.pages):
            text = page.extract_text()
            
            if not text:
                continue
                
            lines = text.split('\\n')
            
            for i, line in enumerate(lines):
                # Detectar carrera (PROYECTO CURRICULAR)
                if 'PROYECTO CURRICULAR' in line:
                    current_carrera = line.replace('PROYECTO CURRICULAR', '').strip()
                
                # Detectar materia (ESPACIO ACADEMICO)
                elif 'ESPACIO ACADEMICO' in line:
                    current_materia = line.replace('ESPACIO ACADEMICO', '').strip()
                
                # Detectar grupo
                elif line.startswith('GRP.'):
                    match = re.search(r'GRP\\.\\s*([0-9\\-]+)', line)
                    if match:
                        current_grupo = match.group(1)
                    inscritos_match = re.search(r'INSCRITOS\\s*(\\d+)', line)
                    inscritos = int(inscritos_match.group(1)) if inscritos_match else 0
                
                # Extraer datos (líneas con horarios)
                elif re.match(r'^\\d+\\s+', line) and current_grupo:
                    try:
                        # Formato: Cod NombreMateria Dia Hora Sede Edificio Salon Docente
                        # Ejemplo: 1 CALCULO DIFERENCIAL MARTES 6-7 EDIFICIO EDIFICIO CRISANTO LUQUE AULA 809 ALGARIN MEZA NELSON JORGE
                        
                        # Extraer código de materia (primer número)
                        cod_match = re.match(r'^(\\d+)', line)
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
                        hora_match = re.search(r'(\\d+)-(\\d+)', line)
                        hora = hora_match.group(0) if hora_match else ''
                        
                        # Extraer docente (después de AULA o SALON)
                        docente = ''
                        # Buscar patrones de salón
                        salon_patterns = [
                            r'AULA\\s+\\d+',
                            r'AULA\\s+DE\\s+CLASE\\s+\\d+',
                            r'SALON\\s+\\d+',
                            r'LABORATORIO\\s+\\d+',
                            r'SALA\\s+DE\\s+INFORMATICA\\s+\\d+',
                            r'TALLER\\s+\\d+'
                        ]
                        
                        for pattern in salon_patterns:
                            match = re.search(pattern, line)
                            if match:
                                # Todo lo que viene después del salón es el docente
                                pos = match.end()
                                posible_docente = line[pos:].strip()
                                
                                # Filtrar si empieza con palabras que no son nombres
                                if posible_docente and not any(posible_docente.startswith(x) for x in [
                                    'SALA', 'AULA', 'EDIFICIO', 'LABORATORIO', 'TALLER', 
                                    'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'
                                ]):
                                    # Limpiar prefijos como "ASIGNAR" o "SIN"
                                    posible_docente = re.sub(r'^(SIN\\s+ASIGNAR|ASIGNAR|PROFESOR)\\s*', '', posible_docente).strip()
                                    if posible_docente and len(posible_docente) > 5:
                                        docente = posible_docente
                                break
                        
                        # Si no se encontró docente válido
                        if not docente:
                            docente = 'PROFESOR SIN ASIGNAR'
                        
                        horario_obj = {
                            'codigo_materia': cod,
                            'nombre_materia': current_materia,
                            'grupo': current_grupo,
                            'carrera': current_carrera,
                            'dia': dia,
                            'hora': hora,
                            'docente': docente,
                            'semestre': '${semestre}'
                        }
                        horarios.append(horario_obj)
                    except Exception as e:
                        pass
        
        print(json.dumps(horarios, ensure_ascii=False, indent=2))
except Exception as e:
    print(json.dumps({'error': str(e)}))
`;

      const python = spawn('python', ['-c', pythonScript]);
      let output = '';
      let error = '';

      python.stdout.on('data', (data) => {
        output += data.toString();
      });

      python.stderr.on('data', (data) => {
        error += data.toString();
      });

      python.on('close', (code) => {
        try {
          const result = JSON.parse(output);
          if (result.error) {
            reject(new Error(result.error));
          } else {
            resolve(result);
          }
        } catch (e) {
          reject(new Error(`Error parsing PDF: ${error || e.message}`));
        }
      });
    });
  }

  /**
   * Procesar y guardar horarios en la BD
   */
  async procesarYGuardarHorarios(pdfPath, semestre = '2026-1') {
    try {
      console.log(`📄 Procesando: ${pdfPath}`);
      
      // Extraer datos del PDF
      const horarios = await this.extraerHorariosDePDF(pdfPath, semestre);
      
      // Limpiar horarios duplicados
      const horariosFiltrados = this.filtrarDuplicados(horarios);
      
      // Guardar en la BD
      let guardados = 0;
      for (const horario of horariosFiltrados) {
        try {
          await runQuery(
            `INSERT INTO horarios 
            (codigo_materia, nombre_materia, grupo, carrera, dia, hora_inicio, hora_fin, sala, edificio, sede, docente, semestre)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              horario.codigo_materia || '',
              horario.nombre_materia || '',
              horario.grupo || '',
              horario.carrera || '',
              horario.dia || '',
              this.parseHora(horario.hora)?.inicio || 0,
              this.parseHora(horario.hora)?.fin || 0,
              horario.sala || '',
              horario.edificio || '',
              horario.sede || '',
              horario.docente || '',
              semestre
            ]
          );
          guardados++;
        } catch (e) {
          // Duplicado o error - continuar
        }
      }
      
      console.log(`✓ ${guardados} horarios procesados`);
      return guardados;
    } catch (error) {
      console.error('Error procesando horarios:', error);
      throw error;
    }
  }

  /**
   * Filtrar duplicados por materia, grupo y horario
   */
  filtrarDuplicados(horarios) {
    const set = new Set();
    return horarios.filter(h => {
      const key = `${h.codigo_materia}-${h.grupo}-${h.dia}-${h.hora}`;
      if (set.has(key)) return false;
      set.add(key);
      return true;
    });
  }

  /**
   * Parsear hora de formato "6-7" a {inicio: 6, fin: 7}
   */
  parseHora(horaStr) {
    if (!horaStr) return { inicio: 0, fin: 0 };
    const match = horaStr.match(/(\d+)-(\d+)/);
    if (match) {
      return { inicio: parseInt(match[1]), fin: parseInt(match[2]) };
    }
    return { inicio: 0, fin: 0 };
  }
}

export default HorariosParser;
