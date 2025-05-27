#!/bin/bash

# AgentlandOS Deployment Script
# This script handles deployment to production

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

# Default values
ENVIRONMENT="production"
SKIP_TESTS=false
SKIP_BUILD=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --staging)
            ENVIRONMENT="staging"
            shift
            ;;
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --help)
            echo "Usage: $0 [options]"
            echo "Options:"
            echo "  --staging      Deploy to staging environment"
            echo "  --skip-tests   Skip running tests"
            echo "  --skip-build   Skip building (use existing build)"
            echo "  --help         Show this help message"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."
    
    # Check if .env.production exists
    if [ "$ENVIRONMENT" = "production" ] && [ ! -f .env.production ]; then
        print_error ".env.production not found!"
        exit 1
    fi
    
    # Check if .env.staging exists for staging
    if [ "$ENVIRONMENT" = "staging" ] && [ ! -f .env.staging ]; then
        print_error ".env.staging not found!"
        exit 1
    fi
    
    print_success "Prerequisites check passed!"
}

# Run tests
run_tests() {
    if [ "$SKIP_TESTS" = true ]; then
        print_warning "Skipping tests..."
        return
    fi
    
    print_info "Running tests..."
    npm test || {
        print_error "Tests failed! Aborting deployment."
        exit 1
    }
    print_success "All tests passed!"
}

# Build application
build_application() {
    if [ "$SKIP_BUILD" = true ]; then
        print_warning "Skipping build..."
        return
    fi
    
    print_info "Building application for $ENVIRONMENT..."
    
    # Copy appropriate env file
    if [ "$ENVIRONMENT" = "production" ]; then
        cp .env.production .env.production.local
    elif [ "$ENVIRONMENT" = "staging" ]; then
        cp .env.staging .env.production.local
    fi
    
    # Run build
    npm run build || {
        print_error "Build failed!"
        exit 1
    }
    
    print_success "Build completed successfully!"
}

# Deploy to Vercel
deploy_vercel() {
    print_info "Deploying to Vercel ($ENVIRONMENT)..."
    
    if ! command -v vercel &> /dev/null; then
        print_error "Vercel CLI not installed. Run: npm i -g vercel"
        exit 1
    fi
    
    if [ "$ENVIRONMENT" = "production" ]; then
        vercel --prod || {
            print_error "Vercel deployment failed!"
            exit 1
        }
    else
        vercel || {
            print_error "Vercel deployment failed!"
            exit 1
        }
    fi
    
    print_success "Deployed to Vercel successfully!"
}

# Deploy to custom server
deploy_custom() {
    print_info "Deploying to custom server ($ENVIRONMENT)..."
    
    # This is a placeholder for custom deployment logic
    # You would typically:
    # 1. SSH to your server
    # 2. Pull latest code
    # 3. Install dependencies
    # 4. Run migrations
    # 5. Restart services
    
    print_warning "Custom deployment not implemented. Add your deployment logic here."
}

# Run database migrations
run_migrations() {
    print_info "Running database migrations..."
    
    # Set appropriate DATABASE_URL based on environment
    if [ "$ENVIRONMENT" = "production" ]; then
        export $(grep -v '^#' .env.production | xargs)
    elif [ "$ENVIRONMENT" = "staging" ]; then
        export $(grep -v '^#' .env.staging | xargs)
    fi
    
    npx prisma migrate deploy || {
        print_warning "Migration failed or no pending migrations"
    }
    
    print_success "Migrations completed!"
}

# Main deployment flow
main() {
    print_info "Starting deployment to $ENVIRONMENT..."
    
    check_prerequisites
    run_tests
    build_application
    run_migrations
    
    # Choose deployment method
    if [ -f vercel.json ]; then
        deploy_vercel
    else
        deploy_custom
    fi
    
    print_success "Deployment completed successfully!"
    print_info "Environment: $ENVIRONMENT"
    print_info "Timestamp: $(date)"
}

# Run main function
main