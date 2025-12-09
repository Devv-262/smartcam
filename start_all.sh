#!/bin/bash
echo "Starting Smart Campus System..."

# Start backend in background
cd ~/smart-campus-project
./start_backend.sh &
BACKEND_PID=$!

# Wait for backend to initialize
sleep 3

# Start frontend
./start_frontend.sh &
FRONTEND_PID=$!

echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "System started! Access at http://localhost:5173"
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
wait
