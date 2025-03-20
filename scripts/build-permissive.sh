#!/bin/bash
echo "Building project with permissive type checking..."
npx tsc -p tsconfig.build.json --skipLibCheck --skipDefaultLibCheck --noEmit false --emitDeclarationOnly false
echo "Done! Project built with type errors ignored."
