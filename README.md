# Workflow Analyst Skill Installer

Este repositorio contiene el instalador automatizado para la skill `workflow-analyst`. 
Esta skill permite a tu Agente analizar transcripciones de procesos y generar diagramas visuales (Mermaid) con enlaces de edición en vivo.

## Contenido de la Skill

- **SKILL.md**: Definición de la skill con estilos visuales personalizados (Wikyn Design System).
- **Scripts**: Utilidad para generar enlaces de Mermaid Live Editor.
- **MCP**: Configuración automática del servidor `mcp-mermaid`.

## Instalación

Puedes instalar esta skill directamente usando `npx` (una vez publicado en npm) o ejecutándolo localmente.

### Opción 1: Ejecución Local
Descarga este repositorio y ejecuta:

```bash
npm install
node install.js
```

### Opción 2: NPX (Si se publica)
```bash
npx workflow-analyst-installer
```

## Requisitos
- Node.js instalado.
- Un entorno compatible con Agentes (Antigravity/Gemini).
- VS Code (recomendado para la gestión de MCP).

## Estructura Generada
El instalador creará la siguiente estructura en tu proyecto:

```
.agent/
  skills/
    workflow-analyst/
      SKILL.md
      scripts/
        mermaid_to_link.js
        package.json
```
