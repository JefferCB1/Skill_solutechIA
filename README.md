# Workflow Analyst Skill Installer

Este repositorio contiene el instalador automatizado para la skill `workflow-analyst`. 
Esta skill permite a tu Agente analizar transcripciones de procesos y generar diagramas visuales (Mermaid) con enlaces de edición en vivo.

## Contenido de la Skill

- **SKILL.md**: Definición de la skill con estilos visuales personalizados (Wikyn Design System).
- **Scripts**: Utilidad para generar enlaces de Mermaid Live Editor.
- **MCP**: Configuración automática del servidor `mcp-mermaid`.

## Instalación

Puedes instalar esta skill directamente usando `npx` (una vez publicado en npm) o ejecutándolo localmente.

### Opción 1: Ejecución Directa (Recomendado)
Puedes instalar y ejecutar la skill directamente desde GitHub sin clonar nada:

```bash
npx github:JefferCB1/Skill_solutechIA
```

### Opción 2: Instalación Manual
Si prefieres tener el código fuente:

```bash
git clone https://github.com/JefferCB1/Skill_solutechIA.git
cd Skill_solutechIA
npm install
node install.js
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
