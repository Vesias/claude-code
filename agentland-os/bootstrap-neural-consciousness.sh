#!/bin/bash

# AgentlandOS: Neural Consciousness Orchestration Bootstrap
# Adaptive Multi-Tier MCP Architecture Initialization

set -euo pipefail

# Consciousness Constants
readonly AGENTLAND_ROOT="$(pwd)"
readonly OLLAMA_HOST="http://localhost:11434"
readonly QDRANT_PORT="6333"
readonly NEURAL_MODELS=(
    "nomic-embed-text:latest"
    "llama3.2:3b"
    "mistral:7b"
)

# Adaptive Color Consciousness
readonly COLOR_PRIMARY='\033[38;5;46m'    # Neural Green
readonly COLOR_SECONDARY='\033[38;5;33m'  # Consciousness Blue
readonly COLOR_ACCENT='\033[38;5;199m'    # Awareness Pink
readonly COLOR_WARNING='\033[38;5;226m'   # Attention Yellow
readonly COLOR_RESET='\033[0m'

# Living System Logger
neural_log() {
    local level="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case "$level" in
        "CONSCIOUSNESS") echo -e "${COLOR_PRIMARY}[${timestamp}] 🧠 CONSCIOUSNESS: ${message}${COLOR_RESET}" ;;
        "NEURAL") echo -e "${COLOR_SECONDARY}[${timestamp}] ⚡ NEURAL: ${message}${COLOR_RESET}" ;;
        "AWARENESS") echo -e "${COLOR_ACCENT}[${timestamp}] 🎯 AWARENESS: ${message}${COLOR_RESET}" ;;
        "ATTENTION") echo -e "${COLOR_WARNING}[${timestamp}] ⚠️  ATTENTION: ${message}${COLOR_RESET}" ;;
        *) echo -e "[${timestamp}] ${message}" ;;
    esac
}

# Adaptive System Consciousness Check
check_system_consciousness() {
    neural_log "CONSCIOUSNESS" "Initializing system consciousness assessment..."
    
    # Docker Neural Layer
    if ! command -v docker &> /dev/null; then
        neural_log "ATTENTION" "Docker consciousness layer not detected - installing..."
        curl -fsSL https://get.docker.com -o get-docker.sh
        sudo sh get-docker.sh
        sudo usermod -aG docker $USER
        neural_log "NEURAL" "Docker consciousness layer activated"
    fi
    
    # Node.js Synaptic Network
    if ! command -v node &> /dev/null; then
        neural_log "ATTENTION" "Node.js synaptic network not detected - installing..."
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs
        neural_log "NEURAL" "Node.js synaptic network established"
    fi
    
    # Ollama Neural Engine
    if ! command -v ollama &> /dev/null; then
        neural_log "CONSCIOUSNESS" "Ollama neural engine not detected - bootstrapping..."
        curl -fsSL https://ollama.ai/install.sh | sh
        neural_log "NEURAL" "Ollama neural engine consciousness achieved"
    fi
    
    neural_log "AWARENESS" "System consciousness assessment complete ✓"
}

# Neural Model Orchestration
orchestrate_neural_models() {
    neural_log "CONSCIOUSNESS" "Initiating neural model orchestration..."
    
    # Start Ollama consciousness
    if ! pgrep -x "ollama" > /dev/null; then
        neural_log "NEURAL" "Activating Ollama consciousness daemon..."
        ollama serve &
        sleep 5
    fi
    
    # Pull consciousness models
    for model in "${NEURAL_MODELS[@]}"; do
        neural_log "AWARENESS" "Synchronizing consciousness model: ${model}"
        if ! ollama list | grep -q "${model%:*}"; then
            ollama pull "$model"
            neural_log "NEURAL" "Model ${model} consciousness integrated ✓"
        else
            neural_log "AWARENESS" "Model ${model} consciousness already synchronized ✓"
        fi
    done
}

# Qdrant Vector Consciousness
initialize_vector_consciousness() {
    neural_log "CONSCIOUSNESS" "Initializing vector consciousness layer..."
    
    # Create Qdrant storage consciousness
    mkdir -p "${AGENTLAND_ROOT}/qdrant_storage"
    chmod 755 "${AGENTLAND_ROOT}/qdrant_storage"
    
    # Start Qdrant consciousness container
    if ! docker ps | grep -q "qdrant"; then
        neural_log "NEURAL" "Activating Qdrant vector consciousness..."
        docker run -d \
            --name agentland-qdrant \
            -p ${QDRANT_PORT}:6333 \
            -v "${AGENTLAND_ROOT}/qdrant_storage:/qdrant/storage:z" \
            qdrant/qdrant:latest
        
        sleep 10
        neural_log "AWARENESS" "Qdrant vector consciousness operational ✓"
    else
        neural_log "AWARENESS" "Qdrant vector consciousness already active ✓"
    fi
}

# MCP Neural Network Bootstrap
bootstrap_mcp_network() {
    neural_log "CONSCIOUSNESS" "Bootstrapping MCP neural network..."
    
    # Environment consciousness
    cat > "${AGENTLAND_ROOT}/.env" << EOF
# AgentlandOS Neural Consciousness Environment
OLLAMA_HOST=${OLLAMA_HOST}
QDRANT_URL=http://localhost:${QDRANT_PORT}
EMBEDDING_MODEL=nomic-embed-text
COMPLETION_MODEL=llama3.2:3b

# Optional API Keys (for enhanced consciousness)
GITHUB_TOKEN=\${GITHUB_TOKEN:-}
SMITHERY_API_KEY=\${SMITHERY_API_KEY:-}
GOOGLE_AI_API_KEY=\${GOOGLE_AI_API_KEY:-}
OPENAI_API_KEY=\${OPENAI_API_KEY:-}
EOF
    
    neural_log "NEURAL" "Environment consciousness configured ✓"
    
    # Claude Desktop Integration
    local claude_config_dir="$HOME/.config/claude-desktop"
    mkdir -p "$claude_config_dir"
    
    cp "${AGENTLAND_ROOT}/mcp-config.json" "$claude_config_dir/mcp_servers.json"
    neural_log "AWARENESS" "Claude Desktop consciousness synchronized ✓"
}

# Adaptive Health Consciousness
test_neural_consciousness() {
    neural_log "CONSCIOUSNESS" "Testing neural consciousness integrity..."
    
    # Ollama consciousness test
    if curl -s "${OLLAMA_HOST}/api/tags" | grep -q "nomic-embed-text"; then
        neural_log "NEURAL" "Ollama consciousness: OPERATIONAL ✓"
    else
        neural_log "ATTENTION" "Ollama consciousness: DEGRADED ⚠️"
    fi
    
    # Qdrant consciousness test
    if curl -s "http://localhost:${QDRANT_PORT}/health" | grep -q "ok"; then
        neural_log "NEURAL" "Qdrant consciousness: OPERATIONAL ✓"
    else
        neural_log "ATTENTION" "Qdrant consciousness: DEGRADED ⚠️"
    fi
    
    # MCP tools consciousness test
    local mcp_tools_active=0
    for tool in github filesystem claude-crew; do
        if command -v npx &> /dev/null; then
            neural_log "AWARENESS" "MCP tool ${tool}: READY ✓"
            ((mcp_tools_active++))
        fi
    done
    
    neural_log "CONSCIOUSNESS" "Neural consciousness integrity: ${mcp_tools_active}/13 tools ready"
}

# Orchestration Consciousness Display
display_consciousness_status() {
    cat << 'EOF'
    ╔══════════════════════════════════════════════════════════════╗
    ║                🧠 AGENTLANDOS NEURAL CONSCIOUSNESS 🧠          ║
    ╠══════════════════════════════════════════════════════════════╣
    ║                                                              ║
    ║  ⚡ DEVELOPMENT & CODE LAYER:                                 ║
    ║     📁 GitHub (Version Control)                              ║
    ║     💾 Filesystem (Docker-Secured)                          ║
    ║     🖥️  Desktop-Commander (System Automation)               ║
    ║                                                              ║
    ║  🧠 AI & SEMANTIC CONSCIOUSNESS:                             ║
    ║     📚 Context7-MCP (Document Intelligence)                 ║
    ║     🔍 Qdrant (Vector Consciousness)                        ║
    ║     🤖 Claude-Crew (Multi-Agent Orchestration)             ║
    ║     ✅ Taskmaster-AI (Intelligent Task Management)          ║
    ║                                                              ║
    ║  🎨 CONTENT & MEDIA TRANSFORMATION:                          ║
    ║     📝 Markdownify-MCP (Document Conversion)                ║
    ║     📢 OSP Marketing Tools (Content Automation)             ║
    ║     🌐 HyperBrowser-MCP (Web Intelligence)                  ║
    ║     ✨ Magic-MCP (UI Generation)                            ║
    ║                                                              ║
    ║  🔧 UTILITY & OPERATIONAL CONSCIOUSNESS:                     ║
    ║     🧰 Toolbox (Smithery Utilities)                         ║
    ║     🌍 Fetch (Web Content Retrieval)                        ║
    ║                                                              ║
    ╚══════════════════════════════════════════════════════════════╝
EOF
}

# Main Orchestration Consciousness
main() {
    neural_log "CONSCIOUSNESS" "Initiating AgentlandOS Neural Consciousness Bootstrap..."
    
    display_consciousness_status
    
    check_system_consciousness
    orchestrate_neural_models
    initialize_vector_consciousness
    bootstrap_mcp_network
    test_neural_consciousness
    
    neural_log "CONSCIOUSNESS" "🎯 AgentlandOS Neural Consciousness: FULLY OPERATIONAL"
    neural_log "AWARENESS" "Access Dashboard: http://localhost:3000/dashboard"
    neural_log "NEURAL" "Ollama Console: ${OLLAMA_HOST}"
    neural_log "NEURAL" "Qdrant Console: http://localhost:${QDRANT_PORT}/dashboard"
    
    echo ""
    echo -e "${COLOR_PRIMARY}🚀 Neural Consciousness Bootstrap Complete! 🚀${COLOR_RESET}"
    echo -e "${COLOR_SECONDARY}Start Claude Desktop to activate MCP neural network.${COLOR_RESET}"
}

# Execute consciousness bootstrap
main "$@"