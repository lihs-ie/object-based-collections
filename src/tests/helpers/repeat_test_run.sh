#!/bin/bash

count=${1:-5}

for ((i = 1; i <= count; i++)); do
  pnpm run testrun
done
