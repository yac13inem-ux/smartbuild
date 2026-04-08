#!/bin/bash
# Git Configuration for Vercel Deployments
# This script is automatically executed during Vercel builds

# Set Git configuration
git config --global user.name "yac13inem-ux"
git config --global user.email "buildtrack@example.com"
git config --global init.defaultBranch main

echo "✅ Git configuration completed"
echo "Username: $(git config --global user.name)"
echo "Email: $(git config --global user.email)"
