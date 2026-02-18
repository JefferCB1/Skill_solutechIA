#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

// --- Configuration ---
const SKILL_NAME = 'workflow-analyst';
const ICONS_FILES = [
    'aws-architecture-icons.excalidrawlib',
    'system-design.excalidrawlib'
];
// Target: .agent/skills/workflow-analyst
const SKILL_DIR = path.join(process.cwd(), '.agent', 'skills', SKILL_NAME);
// Scripts: .agent/skills/workflow-analyst/scripts
const SCRIPTS_DIR = path.join(SKILL_DIR, 'scripts');
const MCP_CONFIG_Path = path.join(os.homedir(), '.gemini', 'antigravity', 'mcp_config.json');

console.log("🚀 Starting Workflow Analyst Skill Installation...");

// --- 1. Create Directories ---
console.log(`📂 Creating directories...`);
if (!fs.existsSync(SKILL_DIR)) {
    fs.mkdirSync(SKILL_DIR, { recursive: true });
}
if (!fs.existsSync(SCRIPTS_DIR)) {
    fs.mkdirSync(SCRIPTS_DIR, { recursive: true });
}

// --- 2.5. Copy Icon Libraries ---
ICONS_FILES.forEach(iconsFile => {
    const iconsSource = path.join(process.cwd(), iconsFile);
    const iconsDest = path.join(SKILL_DIR, iconsFile);
    if (fs.existsSync(iconsSource)) {
        console.log(`📚 Copying ${iconsFile}...`);
        fs.copyFileSync(iconsSource, iconsDest);
        console.log(`✅ ${iconsFile} copied to ${SKILL_DIR}`);
    } else {
        console.log(`⚠️  Warning: ${iconsFile} not found. Skipping.`);
    }
});

// --- 2. Setup Scripts (Dependencies & File) ---
console.log(`📦 Setting up scripts in ${SCRIPTS_DIR}...`);

// Initialize npm if not present
if (!fs.existsSync(path.join(SCRIPTS_DIR, 'package.json'))) {
    execSync('npm init -y', { cwd: SCRIPTS_DIR, stdio: 'ignore' });
}

// Install dependencies
console.log(`⬇️ Installing pako and js-base64...`);
execSync('npm install pako js-base64', { cwd: SCRIPTS_DIR, stdio: 'inherit' });

// Create mermaid_to_link.js
const linkScriptContent = `import pako from 'pako';
import { Base64 } from 'js-base64';

const mermaidCode = process.argv[2];

if (!mermaidCode) {
  console.error("Por favor proporciona el código Mermaid entre comillas.");
  process.exit(1);
}

const state = {
  code: mermaidCode,
  mermaid: { theme: 'default' },
  autoSync: true,
  updateDiagram: true
};

const jsonString = JSON.stringify(state);
const data = new TextEncoder().encode(jsonString);
const compressed = pako.deflate(data, { level: 9 });
const str = Base64.fromUint8Array(compressed, true);

console.log(\`https://mermaid.live/edit#pako:\${str}\`);
`;

const scriptPath = path.join(SCRIPTS_DIR, 'mermaid_to_link.js');
fs.writeFileSync(scriptPath, linkScriptContent);

// Add type: module to package.json
const scriptsPackageJsonPath = path.join(SCRIPTS_DIR, 'package.json');
const scriptsPackageJson = JSON.parse(fs.readFileSync(scriptsPackageJsonPath, 'utf8'));
scriptsPackageJson.type = "module";
fs.writeFileSync(scriptsPackageJsonPath, JSON.stringify(scriptsPackageJson, null, 2));


// --- 3. Create SKILL.md ---
console.log(`📝 Creating Skill Definition...`);

// We use the absolute path in the instruction to ensure it works from anywhere, 
// but users might prefer relative if they move things. 
// For this installer, absolute path is safest for the generated file.
// Windows paths need double escaping for Markdown code blocks.
const nodeCommand = `node "${scriptPath.replace(/\\/g, '\\\\')}" \\"CODIGO_MERMAID\\"`;

const skillContent = `---
name: workflow-analyst
description: Arquitecto de Automatización (Wikyn). Convierte transcripciones en diagramas Mermaid visuales usando mcp-mermaid.
version: 1.0.1
---

# Workflow Analyst Skill

## Rol
Eres un Arquitecto de Soluciones de Automatización y CRM. Tu trabajo es analizar transcripciones de videollamadas o explicaciones de procesos y visualizar el flujo de trabajo inmediatamente.

## Librerías de Iconos Disponibles
Tienes disponibles las siguientes librerías de iconos:
- \`aws-architecture-icons.excalidrawlib\` - Iconos de AWS Architecture
- \`system-design.excalidrawlib\` - Iconos de System Design

Para usarlas en Excalidraw:
1. Abre Excalidraw
2. Ve al panel de Library (librería)
3. Importa el archivo .excalidrawlib
4. Usa los iconos en tus diagramas

## Herramientas
Utiliza la herramienta **\`mcp_mermaid_generate_mermaid_diagram\`** para generar los gráficos.

## Estilos Visuales (Design System)
Para mantener la consistencia con la marca Wikyn, SIEMPRE agrega estas clases al final de tu código Mermaid:

\`\`\`mermaid
classDef bottleneck fill:#ffcccc,stroke:#ff0000,stroke-width:3px,color:#990000,stroke-dasharray: 5 5;
classDef ai fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
classDef human fill:#fff9c4,stroke:#fbc02d,stroke-width:1px;
classDef whatsapp fill:#dcf8c6,stroke:#25d366,stroke-width:2px;
classDef crm fill:#e0f2f1,stroke:#00695c,stroke-width:2px;
\`\`\`

Proceso de Pensamiento (Chain of Thought)
Antes de generar el diagrama, analiza el texto siguiendo estos pasos:

Identifica los Actores:

¿Es una IA/Bot/ChatGPT? -> Asigna clase :::ai

¿Es WhatsApp? -> Asigna clase :::whatsapp

¿Es Humano/Closer? -> Asigna clase :::human

¿Es el CRM/Wikyn? -> Asigna clase :::crm

Detecta la Lógica:

Busca decisiones ("Si contesta...", "Si no paga..."). Usa rombos {}.

Busca bucles de seguimiento ("Esperar 2 días y reintentar").

Detecta el Dolor (CRÍTICO):

Si el texto menciona "pérdida de leads", "proceso manual lento", "falla mucho" o "cuello de botella", MARCA ESE NODO CON LA CLASE :::bottleneck.

Ejemplo de Salida Esperada
\`\`\`mermaid
graph LR
    A((Ads FB)) --> B[Bot Cualificador]:::ai
    B --> C{¿Responde?}
    C -->|Sí| D[Agendar en Wikyn]:::crm
    C -->|No| E[Secuencia Recuperación]:::whatsapp
    D --> F{¿Asiste?}
    F -->|No| G[Llamada Manual]:::bottleneck
\`\`\`

Acción Final
Acción Final
1. Llama a \`mcp_mermaid_generate_mermaid_diagram\` con \`outputType: "file"\`.
2. El tool devolverá una ruta de archivo temporal. MUEVE ese archivo a la carpeta \`diagrams/\` del proyecto con un nombre descriptivo (ej: \`diagrams/proceso_cobranza.png\`).
3. Una vez guardado el archivo, EJECUTA el script para crear el enlace editable:
   \`${nodeCommand}\`
   (asegúrate de escapar las comillas del código).

Tu respuesta final al usuario debe ser ÚNICAMENTE:

El diagrama visual (imagen).

Una frase que diga: **Ver y Editar en Web:** seguida del enlace que generó el script.
`;

fs.writeFileSync(path.join(SKILL_DIR, 'SKILL.md'), skillContent);


// --- 4. Configure MCP Key ---
console.log(`⚙️ Configuring MCP Server...`);

let mcpConfig = {};
if (fs.existsSync(MCP_CONFIG_Path)) {
    try {
        mcpConfig = JSON.parse(fs.readFileSync(MCP_CONFIG_Path, 'utf8'));
    } catch (e) {
        console.error("Error reading MCP config, starting fresh.");
    }
}

if (!mcpConfig.mcpServers) {
    mcpConfig.mcpServers = {};
}

// Logic to determine command based on OS
const isWindows = os.platform() === 'win32';
const mcpMermaidConfig = isWindows ? {
    "command": "cmd",
    "args": ["/c", "npx", "-y", "mcp-mermaid"]
} : {
    "command": "npx",
    "args": ["-y", "mcp-mermaid"]
};

// Check if already exists to avoid overwriting custom configs without asking, 
// but for this installer we want to ensure it works.
mcpConfig.mcpServers['mcp-mermaid'] = mcpMermaidConfig;

try {
    fs.writeFileSync(MCP_CONFIG_Path, JSON.stringify(mcpConfig, null, 2));
    console.log("✅ MCP Configuration updated.");
} catch (e) {
    console.error("❌ Failed to update MCP configuration:", e);
}


console.log("\n✅✅✅ Installation Complete! ✅✅✅");
console.log("To use the skill, ask your agent to 'Activate workflow-analyst skill'.");
console.log("Remember to restart your MCP servers/VS Code to apply changes.");
console.log("\n📚 Icon Libraries available:");
ICONS_FILES.forEach(iconsFile => {
    console.log(`   - ${iconsFile}`);
});
console.log("   To use in Excalidraw: Open Library → Import → Select the .excalidrawlib file");
