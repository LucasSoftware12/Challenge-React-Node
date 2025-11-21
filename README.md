# Full Stack JS Code Challenge

Aplicación fullstack que procesa archivos CSV desde una API externa y los muestra en una interfaz web.

## Descripción

Esta aplicación consume archivos CSV de una API externa (`https://echo-serv.tbxnet.com`), los procesa y valida, y presenta los datos en una interfaz web interactiva. El backend implementa Clean Architecture con separación de capas, mientras que el frontend utiliza Atomic Design para organizar componentes reutilizables.

**Características principales:**
- Procesamiento paralelo de múltiples archivos CSV
- Validación automática de datos con descarte de líneas inválidas
- Filtrado dinámico por archivo específico
- Interfaz responsive con React Bootstrap
- API REST documentada
- Tests de integración completos
- Soporte para Docker

## Stack Tecnológico

**Backend:** Node.js + Express.js 5
**Frontend:** React 18 + Redux Toolkit
**Testing:** Mocha + Chai
**Containerización:** Docker + Docker Compose
**Linting:** StandardJS

## Requisitos

- Node.js 14+ (probado con v14, v16, v18, v20)
- npm 6+
- Docker (opcional)

## Instalación

```bash
# Clonar repositorio
git clone <repository-url>
cd project

# Instalar dependencias
npm install
```

## Uso

### Opción 1: Ejecución Local

#### Servidor Backend
```bash
npm start
```
El API estará disponible en `http://localhost:3000`

**Nota:** El servidor se conecta automáticamente a la API externa en `https://echo-serv.tbxnet.com`

#### Frontend (Desarrollo)
```bash
npm run dev
```
El frontend estará disponible en `http://localhost:5173`

### Opción 2: Ejecución con Docker

#### Docker Compose (Recomendado)
```bash
# Iniciar contenedor
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener contenedor
docker-compose down
```

#### Docker directo
```bash
# Construir imagen
docker build -t challenge-app .

# Ejecutar contenedor
docker run -d -p 3000:3000 --name challenge-app challenge-app

# Ver logs
docker logs -f challenge-app

# Detener y eliminar
docker stop challenge-app && docker rm challenge-app
```

**Características Docker:**
- Multi-stage build optimizado
- Health check integrado
- Node.js 20 Alpine (imagen ligera)
- Restart automático en caso de fallo

### Scripts Disponibles

```bash
npm start        # Iniciar servidor backend
npm run dev      # Iniciar frontend en modo desarrollo
npm test         # Ejecutar tests
npm run build    # Build del proyecto
npm run standard # Verificar estilo de código
npm run standard:fix # Auto-fix de errores de estilo
```

## API Endpoints

### `GET /`
Endpoint de bienvenida con documentación básica.

**Respuesta:**
```json
{
  "message": "API is running",
  "endpoints": {
    "/files/data": "GET - Fetch and process all CSV files from external API"
  }
}
```

### `GET /files/data`
Obtiene todos los archivos CSV procesados con sus líneas validadas.

**Query params:**
- `fileName` (opcional): Filtra por un archivo específico

**Ejemplos de uso:**
```bash
# Todos los archivos
curl http://localhost:3000/files/data

# Solo un archivo específico
curl http://localhost:3000/files/data?fileName=test1.csv
```

**Respuesta exitosa (200):**
```json
[
  {
    "file": "test1.csv",
    "lines": [
      {
        "text": "RgTya",
        "number": 64075909,
        "hex": "70ad29aacf0b690b0467fe2b2767f765"
      }
    ]
  },
  {
    "file": "test2.csv",
    "lines": []
  }
]
```

**Notas:**
- Archivos vacíos retornan `lines: []`
- Líneas inválidas se descartan automáticamente
- El procesamiento es paralelo para mejor performance

### `GET /files`
Obtiene solo la lista de nombres de archivos disponibles.

**Respuesta:**
```json
["test1.csv", "test2.csv", "test3.csv"]
```

**Uso:** Ideal para poblar dropdowns o filtros en el frontend.

## Arquitectura

### Backend: Clean Architecture

El backend implementa Clean Architecture (también conocida como Hexagonal Architecture) con cuatro capas bien diferenciadas:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│   (Controllers, Routes, HTTP)           │
│   - FileController: Maneja requests HTTP│
│   - fileRoutes: Define endpoints        │
├─────────────────────────────────────────┤
│       Infrastructure Layer              │
│   (API Client, Repositories)            │
│   - ApiClient: Cliente HTTP reutilizable│
│   - ExternalFileRepository: Impl repo   │
├─────────────────────────────────────────┤
│        Application Layer                │
│   (Use Cases, Business Logic)           │
│   - GetFilesData: Orquesta el proceso   │
├─────────────────────────────────────────┤
│          Domain Layer                   │
│   (Entities, Validation Rules)          │
│   - FileData: Entidad con validaciones  │
│   - IFileRepository: Interfaz abstracta │
└─────────────────────────────────────────┘
```

**Flujo de datos:**
1. Request HTTP → Presentation Layer
2. Controller invoca Use Case → Application Layer
3. Use Case usa Repository → Infrastructure Layer
4. Repository consulta API externa → Domain Layer valida
5. Respuesta validada → Presentation Layer → Cliente

**Ventajas:**
- **Testeable**: Cada capa puede testearse independientemente con mocks
- **Mantenible**: Cambios en una capa no afectan otras (bajo acoplamiento)
- **Escalable**: Fácil agregar nuevas features sin tocar código existente
- **SOLID**: Cumple principios de diseño (SRP, DIP, OCP)

### Frontend: Atomic Design

El frontend utiliza Atomic Design para organizar componentes en una jerarquía clara y reutilizable:

```
Atoms → Molecules → Organisms → Templates
  ↓         ↓            ↓           ↓
Button   Alert      DataTable   MainLayout
Text     Header     FileFilter
Spinner  TableRow
TableCell LoadingState
```

**Jerarquía de componentes:**
- **Atoms**: Componentes básicos indivisibles (Button, Text, Spinner, TableCell)
- **Molecules**: Combinan múltiples atoms (Alert, Header, TableRow, LoadingState)
- **Organisms**: Componentes complejos con lógica (DataTable, FileFilter)
- **Templates**: Layouts de página que estructuran organismos (MainLayout)

**Estado global con Redux:**
```
┌──────────────┐
│ Components   │ ──dispatch──> fetchFilesData()
│              │                      │
│              │                      ▼
│              │              ┌───────────────┐
│              │              │ Redux Thunk   │
│              │              │ (API call)    │
│              │              └───────┬───────┘
│              │                      │
│              │                      ▼
│              │              ┌───────────────┐
│              │              │   Reducers    │
│              │              │ (Update state)│
│              │              └───────┬───────┘
│              │                      │
│              │ <──useSelector── Store
└──────────────┘
```

## Estructura del Proyecto

```
project/
├── server/              # Backend (Clean Architecture)
│   ├── domain/          # Entidades y validaciones
│   ├── application/     # Casos de uso
│   ├── infrastructure/  # API client y repositorios
│   └── presentation/    # Controllers y rutas
├── src/                 # Frontend React
│   ├── store/           # Redux store y slices
│   └── components/      # Componentes React (Atomic Design)
│       ├── atoms/       # Button, Text, Spinner, TableCell
│       ├── molecules/   # Alert, Header, TableRow, LoadingState
│       ├── organisms/   # DataTable, FileFilter
│       └── templates/   # MainLayout
└── test/                # Tests de integración
```

## Validaciones y Reglas de Negocio

### Validaciones CSV

Cada línea CSV debe cumplir con las siguientes reglas:

1. **4 columnas mínimo**: `file,text,number,hex`
2. **text**: String no vacío
3. **number**: Entero válido (se parsea de string a integer)
4. **hex**: Exactamente 32 caracteres hexadecimales (formato MD5)

**Ejemplos:**

✅ **Línea válida:**
```
test1.csv,RgTya,64075909,70ad29aacf0b690b0467fe2b2767f765
```

❌ **Líneas inválidas:**
```
test1.csv,,64075909,70ad29aacf0b690b0467fe2b2767f765  # text vacío
test1.csv,RgTya,abc,70ad29aacf0b690b0467fe2b2767f765  # number no es entero
test1.csv,RgTya,64075909,70ad29                        # hex no tiene 32 caracteres
```

### Manejo de Errores

- **Archivo no encontrado**: Se omite y se continúa con otros archivos
- **Línea inválida**: Se descarta y se procesan las líneas válidas restantes
- **Archivo vacío**: Se retorna con `lines: []` (no es un error)
- **Error de red**: Se propaga al cliente con mensaje descriptivo
- **Logging**: Los errores no se loguean en consola (manejo silencioso)

## Testing

### Framework: Mocha + Chai

El proyecto incluye tests de integración que validan el comportamiento completo del API.

**Tests implementados:**

#### GET /files/data
1. ✓ Retorna un array
2. ✓ Estructura correcta de datos (file, lines)
3. ✓ Manejo de archivos vacíos
4. ✓ Content-Type application/json
5. ✓ Filtrado por fileName query parameter
6. ✓ Parseo correcto de números como integers
7. ✓ Normalización de hex a lowercase

#### GET /files
8. ✓ Retorna array de nombres de archivos

**Ejecutar tests:**
```bash
npm test
```

**Output esperado:**
```
API Tests
  GET /files/data
    ✔ should return an array
    ✔ should return files with correct structure
    ✔ should handle empty files gracefully
    ✔ should return content-type application/json
    ✔ should filter by fileName query parameter
    ✔ should parse numbers correctly as integers
    ✔ should normalize hex values to lowercase
  GET /files
    ✔ should return an array of file names

8 passing (2s)
```

### Linting con StandardJS

El proyecto usa [JavaScript Standard Style](https://standardjs.com/) para mantener consistencia.

```bash
# Verificar estilo de código
npm run standard

# Auto-fix de errores de estilo
npm run standard:fix
```

**Reglas aplicadas:**
- Sin semicolons
- Comillas simples para strings
- 2 espacios de indentación
- Espacio después de keywords

## Tecnologías

### Backend
- **Express.js 5** - Framework web minimalista y rápido
- **Node.js 14+** - Runtime de JavaScript
- **CORS** - Middleware para permitir peticiones cross-origin
- **Fetch API** - Cliente HTTP nativo (Node.js 18+)

### Frontend
- **React 18** - Biblioteca UI con hooks y concurrent features
- **Redux Toolkit** - State management simplificado (menos boilerplate)
- **React Redux** - Bindings oficiales React ↔ Redux
- **React Bootstrap** - Componentes UI responsive y accesibles
- **Vite** - Build tool rápido con HMR instantáneo

### Testing & Calidad
- **Mocha 10** - Framework de testing flexible
- **Chai 4** - Librería de assertions expresiva (estilo BDD)
- **StandardJS** - Linter sin configuración

### DevOps
- **Docker** - Containerización de la aplicación
- **Docker Compose** - Orquestación multi-contenedor
- **Node Alpine** - Imagen base ligera para producción

## Patrones de Diseño Implementados

### Backend

1. **Clean Architecture / Hexagonal**: Separación en capas con dependencias apuntando hacia el dominio
2. **Repository Pattern**: Abstrae la fuente de datos permitiendo cambiarla sin afectar la lógica
3. **Use Case Pattern**: Cada caso de uso representa una intención del usuario
4. **Factory Functions**: Funciones factory en lugar de clases
5. **Dependency Injection**: Inyección manual de dependencias para testing
6. **Inmutabilidad**: Los objetos no se modifican, se crean nuevos

### Frontend

7. **Atomic Design**: Organización jerárquica de componentes
8. **Container/Presentational**: Separación de lógica y presentación
9. **Redux Pattern**: Estado centralizado con actions y reducers
10. **Hooks Pattern**: Composición de lógica con hooks de React
