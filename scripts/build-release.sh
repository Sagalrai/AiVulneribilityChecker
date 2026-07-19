#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
VERSION="${1:-0.1.0}"
TARGET_DIR="$ROOT_DIR/release"

mkdir -p "$TARGET_DIR/linux-x64" "$TARGET_DIR/windows-x64"

cd "$ROOT_DIR"
npm run build
chmod +x bin/vulnpilot

cp -R "$ROOT_DIR/apps/api/dist" "$TARGET_DIR/linux-x64/"
cp -R "$ROOT_DIR/bin" "$TARGET_DIR/linux-x64/"
cp "$ROOT_DIR/README.md" "$TARGET_DIR/linux-x64/README.txt"
cp "$ROOT_DIR/README.md" "$TARGET_DIR/windows-x64/README.txt"

cat > "$TARGET_DIR/linux-x64/VERSION" <<EOF
${VERSION}
EOF

cat > "$TARGET_DIR/windows-x64/VERSION" <<EOF
${VERSION}
EOF

echo "Release artifacts prepared in $TARGET_DIR"
