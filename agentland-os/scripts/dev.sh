#!/bin/bash

# AgentlandOS Development Startup Script
# This script starts all necessary services for development

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print functions
print_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Check if setup has been run
check_setup() {
    if [ ! -f .env ]; then
        print_error ".env file not found. Please run ./scripts/setup.sh first"
        exit 1
    fi
    
    if [ ! -d node_modules ]; then
        print_error "node_modules not found. Please run ./scripts/setup.sh first"
        exit 1
    fi
}

# Start database
start_database() {
    print_info "Starting database..."
    
    if command -v docker &> /dev/null && docker info &> /dev/null; then
        # Check if container exists
        if docker ps -a | grep -q agentland-postgres; then
            # Start container if it's stopped
            docker start agentland-postgres || print_warning "Database might already be running"
            print_success "Database started!"
        else
            print_warning "Database container not found. Running database setup..."
            docker run -d \
                --name agentland-postgres \
                -e POSTGRES_USER=agentland \
                -e POSTGRES_PASSWORD=agentland123 \
                -e POSTGRES_DB=agentlandos \
                -p 5432:5432 \
                postgres:15-alpine
            sleep 5
            print_success "Database container created and started!"
        fi
    else
        print_warning "Docker is not available. Please ensure your database is running manually."
    fi
}

# Start development server
start_dev_server() {
    print_info "Starting Next.js development server..."
    print_info "Server will be available at http://localhost:3000"
    print_info "Press Ctrl+C to stop"
    
    # Set development environment
    export NODE_ENV=development
    
    # Start Next.js dev server
    npm run dev
}

# Cleanup function
cleanup() {
    print_info "\nShutting down..."
    print_info "Database will continue running. Use 'docker stop agentland-postgres' to stop it."
    exit 0
}

# Set up trap for cleanup
trap cleanup INT TERM

# Main function
main() {
    print_info "Starting AgentlandOS development environment..."
    
    check_setup
    start_database
    start_dev_server
}

# Run main function
main