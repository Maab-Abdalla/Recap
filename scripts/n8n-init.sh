#!/bin/sh
# Imports and activates the Recap workflow using n8n API key auth.
# N8N_API_KEY must be set in .env — generate it from the n8n UI: Settings -> n8n API

N8N_URL="http://n8n:5678"
WORKFLOW_FILE="/workflow/recap.json"
MAX_RETRIES=40
RETRY_INTERVAL=5

if [ -z "$N8N_API_KEY" ]; then
  echo "❌ N8N_API_KEY is empty. Generate one in the n8n UI (Settings -> n8n API), put it in .env, then re-run:"
  echo "   docker compose --profile init up n8n-init"
  exit 1
fi

echo "⏳ Waiting for n8n to be ready..."
i=0
while [ $i -lt $MAX_RETRIES ]; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$N8N_URL/healthz" 2>/dev/null)
  if [ "$STATUS" = "200" ]; then
    echo "✅ n8n is ready"
    break
  fi
  i=$((i + 1))
  echo "   Attempt $i/$MAX_RETRIES..."
  sleep $RETRY_INTERVAL
done

if [ $i -eq $MAX_RETRIES ]; then
  echo "❌ n8n never became ready. Exiting."
  exit 1
fi

# Extra wait for internal init
sleep 8

echo "📥 Importing workflow..."
IMPORT_RESP=$(curl -s -X POST "$N8N_URL/api/v1/workflows" \
  -H "Content-Type: application/json" \
  -H "X-N8N-API-KEY: $N8N_API_KEY" \
  --data-binary @"$WORKFLOW_FILE")

echo "   Import response: $(echo "$IMPORT_RESP" | head -c 300)"

# n8n workflow IDs are STRINGS, e.g. "id":"aBc123". Match a quoted value.
WORKFLOW_ID=$(echo "$IMPORT_RESP" | sed -n 's/.*"id"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -1)

if [ -z "$WORKFLOW_ID" ]; then
  echo "⚠️  Could not get workflow ID."
  echo "   This usually means the API key is wrong, or a workflow named 'Recap' already exists."
  echo "   Open http://localhost:5678 -> Workflows to import/activate manually."
  exit 0
fi

echo "▶️  Activating workflow ID: $WORKFLOW_ID..."
# The public API uses a dedicated /activate endpoint (it rejects 'active' in a PATCH body).
ACTIVATE_RESP=$(curl -s -X POST "$N8N_URL/api/v1/workflows/$WORKFLOW_ID/activate" \
  -H "X-N8N-API-KEY: $N8N_API_KEY")

echo "   Activate response: $(echo "$ACTIVATE_RESP" | head -c 200)"
echo "✅ Workflow imported."
echo ""
echo "⚠️  REQUIRED FINAL STEP — do this once in the UI:"
echo "   API import marks the workflow active but n8n does NOT register the"
echo "   production webhook until the workflow is saved from the editor."
echo "   (Known n8n behaviour: API-created webhooks only register on a UI save.)"
echo ""
echo "     1. Open http://localhost:5678 and open the 'Recap' workflow"
echo "     2. Drag any node a few pixels so the workflow is marked changed"
echo "     3. Press Ctrl+S to save  ← this registers the webhook"
echo "     4. Make sure the Active toggle (top-right) is ON"
echo ""
echo "   Verify it worked:"
echo "     curl -X POST http://localhost:5678/webhook/recap/process \\"
echo "       -H 'Content-Type: application/json' -d '{\"transcript\":\"test\"}'"
echo "   You should NOT see 'is not registered'."
echo ""
echo "🎉 Then open http://localhost:3000"
