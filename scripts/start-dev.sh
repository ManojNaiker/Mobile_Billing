#!/bin/bash
set -e

PORT=8080 pnpm --filter @workspace/api-server run dev &
BACKEND_PID=$!

pnpm --filter @workspace/billease run dev

wait $BACKEND_PID
