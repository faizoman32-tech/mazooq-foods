#!/bin/bash
# scripts/run-smoke.sh - starts server, runs smoke test, cleans up
set -e
cd /home/z/my-project/mazooq-foods

# Start server in background
env ADMIN_STORE=file ADMIN_PASSWORD=test12345 PORT=8099 node server.js > /tmp/mazooq-server.log 2>&1 &
SERVER_PID=$!
echo "started server pid=$SERVER_PID"

# Wait for it to come up
for i in 1 2 3 4 5 6 7 8 9 10; do
  if curl -s http://127.0.0.1:8099/api/health > /dev/null 2>&1; then
    echo "server is up (after ${i}s)"
    break
  fi
  sleep 1
done

# Run the test
node scripts/smoke-test.mjs
TEST_EXIT=$?

# Cleanup
kill $SERVER_PID 2>/dev/null || true
wait $SERVER_PID 2>/dev/null || true

exit $TEST_EXIT
