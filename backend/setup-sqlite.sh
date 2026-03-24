#!/bin/bash

echo "🚀 Post-Onboarding System Setup (No Docker Required!)"
echo "======================================================="
echo ""

cd /Users/i300314/git/onboarding/backend

# Step 1: Generate Prisma Client
echo "Step 1: Generating Prisma client..."
npx prisma generate

if [ $? -eq 0 ]; then
    echo "✅ Prisma client generated"
else
    echo "❌ Failed to generate Prisma client"
    exit 1
fi

# Step 2: Push schema to database (creates tables)
echo ""
echo "Step 2: Creating database tables..."
npx prisma db push --accept-data-loss

if [ $? -eq 0 ]; then
    echo "✅ Database tables created"
else
    echo "❌ Failed to create tables"
    exit 1
fi

# Step 3: Seed database
echo ""
echo "Step 3: Seeding database with sample data..."
npm run seed

if [ $? -eq 0 ]; then
    echo "✅ Database seeded successfully"
else
    echo "❌ Seeding failed"
    exit 1
fi

echo ""
echo "=========================================="
echo "✅ Setup Complete!"
echo ""
echo "Database file created at: backend/dev.db"
echo ""
echo "Next steps:"
echo "1. Start the backend server:"
echo "   npm run dev"
echo ""
echo "2. In a new terminal, start the frontend:"
echo "   cd ../frontend && npm run dev"
echo ""
echo "3. Open browser: http://localhost:3000"
echo ""
echo "Login: ta@company.com / password123"
echo "=========================================="
