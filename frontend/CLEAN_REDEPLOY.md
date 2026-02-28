# Clean Rebuild and Redeploy Guide

This document describes the exact steps to perform a clean rebuild and redeploy of the Selforge frontend application without modifying any runtime behavior.

## When to Use This Guide

Use this clean rebuild process when:
- A deployment fails with a generic platform error (not a code error)
- The build server is busy or dependencies fail to load
- You need to retry a deployment after a transient infrastructure issue

## Prerequisites

- Node.js 18+ installed
- pnpm package manager installed
- Access to the project repository
- Deployment credentials configured

## Clean Rebuild Steps

### Option 1: Using the Clean Rebuild Script

