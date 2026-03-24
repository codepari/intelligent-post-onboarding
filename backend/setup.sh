#!/bin/bash

echo "🚀 Starting Post-Onboarding System Setup"
echo "========================================"
echo ""

# Step 1: Start Docker PostgreSQL
echo "Step 1: Starting PostgreSQL via Docker..."
docker ps | grep postgres-onboarding > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ PostgreSQL container already running"
else
    docker start postgres-onboarding > /dev/null 2>&1
    if [ $? -ne 0 ]; then
        echo "Creating new PostgreSQL container..."
        docker run --name postgres-onboarding \
            -e POSTGRES_PASSWORD=password \
            -e POSTGRES_DB=post_onboarding \
            -p 5432:5432 \
            -d postgres:15

        if [ $? -eq 0 ]; then
            echo "✅ PostgreSQL container started"
            echo "⏳ Waiting 5 seconds for PostgreSQL to initialize..."
            sleep 5
        else
            echo "❌ Failed to start PostgreSQL. Please start Docker Desktop first."
            echo "   Then run this script again."
            exit 1
        fi
    else
        echo "✅ PostgreSQL container started"
        sleep 2
    fi
fi

# Step 2: Run migrations
echo ""
echo "Step 2: Running database migrations..."
npx prisma generate
npx prisma migrate dev --name init

if [ $? -eq 0 ]; then
    echo "✅ Database migrations completed"
else
    echo "❌ Migration failed. Check the error above."
    exit 1
fi

# Step 3: Seed database
echo ""
echo "Step 3: Seeding database with sample data..."
npm run seed

if [ $? -eq 0 ]; then
    echo "✅ Database seeded successfully"
else
    echo "❌ Seeding failed. Check the error above."
    exit 1
fi

echo ""
echo "=========================================="
echo "✅ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Start the backend server:"
echo "   npm run dev"
echo ""
echo "2. In a new terminal, start the frontend:"
echo "   cd ../frontend && npm run dev"
echo ""
echo "3. Open your browser to: http://localhost:3000"
echo ""
echo "Login credentials:"
echo "  Email: ta@company.com"
echo "  Password: password123"
echo "=========================================="
