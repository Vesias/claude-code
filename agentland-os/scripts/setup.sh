#!/bin/bash

# AgentlandOS Initial Setup Script
# This script sets up the development environment for the first time

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

# Check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_warning "Docker is not installed. You'll need it for the database."
    fi
    
    print_success "Prerequisites check passed!"
}

# Setup environment
setup_environment() {
    print_info "Setting up environment..."
    
    # Copy .env.local to .env if it doesn't exist
    if [ ! -f .env ]; then
        if [ -f .env.local ]; then
            cp .env.local .env
            print_success "Created .env from .env.local"
        else
            print_error ".env.local not found!"
            exit 1
        fi
    else
        print_warning ".env already exists, skipping..."
    fi
    
    # Generate Prisma client types
    if [ -f prisma/schema.prisma ]; then
        print_info "Generating Prisma client..."
        npx prisma generate
    fi
}

# Install dependencies
install_dependencies() {
    print_info "Installing dependencies..."
    npm install
    print_success "Dependencies installed!"
}

# Setup database
setup_database() {
    print_info "Setting up database..."
    
    # Check if Docker is running
    if command -v docker &> /dev/null && docker info &> /dev/null; then
        # Start PostgreSQL container
        print_info "Starting PostgreSQL container..."
        docker run -d \
            --name agentland-postgres \
            -e POSTGRES_USER=agentland \
            -e POSTGRES_PASSWORD=agentland123 \
            -e POSTGRES_DB=agentlandos \
            -p 5432:5432 \
            postgres:15-alpine || print_warning "PostgreSQL container might already exist"
        
        # Wait for database to be ready
        print_info "Waiting for database to be ready..."
        sleep 5
        
        # Run migrations
        if [ -f prisma/schema.prisma ]; then
            print_info "Running database migrations..."
            npx prisma migrate deploy || print_warning "Migrations might already be applied"
        fi
    else
        print_warning "Docker is not running. Please start Docker and run database setup manually."
    fi
}

# Main setup flow
main() {
    print_info "Starting AgentlandOS setup..."
    
    check_prerequisites
    install_dependencies
    setup_environment
    setup_database
    
    print_success "Setup completed successfully!"
    print_info "You can now run 'npm run dev' or './scripts/dev.sh' to start the development server"
}

# Run main function
main