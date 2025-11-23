# 🔄 Git Workflow Guide

Complete guide for working with this project across multiple machines using Git.

## Table of Contents

- [Initial Setup](#initial-setup)
- [Daily Workflow](#daily-workflow)
- [Working Across Multiple Laptops](#working-across-multiple-laptops)
- [Common Scenarios](#common-scenarios)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Initial Setup

### First Time Setup (Current Laptop - Already Done)

Your current laptop already has git initialized and pushed. Skip to "Setting Up on Another Laptop".

### Setting Up on Another Laptop

1. **Clone the Repository**
   ```bash
   cd ~/Desktop  # or wherever you prefer
   git clone https://github.com/ioanniskon12/dm-automation-platform.git
   cd dm-automation-platform
   ```

2. **Install Dependencies**
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. **Set Up Environment Files**

   **Backend** - Create `backend/.env`:
   ```env
   DATABASE_URL="file:./dev.db"
   FACEBOOK_APP_ID="your-app-id"
   FACEBOOK_APP_SECRET="your-app-secret"
   FACEBOOK_PAGE_ID="your-page-id"
   FACEBOOK_PAGE_ACCESS_TOKEN="your-page-token"
   INSTAGRAM_BUSINESS_ACCOUNT_ID="your-ig-account-id"
   PORT=3001
   NODE_ENV=development
   ```

   **Frontend** - Create `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. **Initialize Database**
   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   ```

5. **Verify Setup**
   ```bash
   # Start backend
   cd backend
   PORT=3001 npm run dev

   # In another terminal, start frontend
   cd frontend
   npm run dev -- --port 3002
   ```

## Daily Workflow

### Starting Your Work Session

```bash
# Navigate to project
cd ~/Desktop/dm-automation-platform

# ALWAYS pull latest changes first
git pull origin main

# Start working...
```

### During Your Work Session

```bash
# Check what files you've changed
git status

# See detailed changes
git diff

# Check commit history
git log --oneline -5
```

### Ending Your Work Session

```bash
# Stage all changes
git add .

# OR stage specific files
git add backend/src/specific-file.ts
git add frontend/components/SomeComponent.js

# Commit with descriptive message
git commit -m "Add feature X and fix bug Y"

# Push to GitHub
git push origin main
```

## Working Across Multiple Laptops

### Scenario 1: Working on Laptop A, then Laptop B

**On Laptop A (Morning):**
```bash
# Pull latest changes
git pull origin main

# Make changes to files...
# ... work on feature X ...

# Commit and push
git add .
git commit -m "Started implementing feature X"
git push origin main
```

**On Laptop B (Afternoon):**
```bash
# Pull changes from Laptop A
git pull origin main

# Continue working...
# ... complete feature X ...

# Commit and push
git add .
git commit -m "Completed feature X"
git push origin main
```

**Back on Laptop A (Evening):**
```bash
# Pull changes from Laptop B
git pull origin main

# Your code is now up to date with the work from Laptop B
# Start new work...
```

### Scenario 2: Switching Laptops Mid-Task

**On Laptop A:**
```bash
# Work in progress, but need to switch laptops
git add .
git commit -m "WIP: Implementing user authentication (incomplete)"
git push origin main
```

**On Laptop B:**
```bash
# Pull the work-in-progress
git pull origin main

# Continue where you left off...
# ... complete the work ...

# Commit and push
git add .
git commit -m "Complete user authentication implementation"
git push origin main
```

## Common Scenarios

### You Made Changes and Forgot to Pull First

```bash
# You've been working and now want to push
git push origin main

# Error: Updates were rejected because the remote contains work...
# Solution:

# Option 1: If your changes don't conflict
git pull --rebase origin main
git push origin main

# Option 2: If you're not sure
git pull origin main  # This might create a merge commit
# If there are conflicts, resolve them manually
git add .
git commit -m "Merge remote changes"
git push origin main
```

### Accidentally Edited the Same File on Both Laptops

```bash
# On Laptop A: You edited file.js
git add .
git commit -m "Update file.js with feature A"
git push origin main

# On Laptop B: You also edited file.js (without pulling first)
git add .
git commit -m "Update file.js with feature B"
git push origin main  # This will fail!

# Error: Updates were rejected

# Solution:
git pull origin main

# Git will tell you there's a conflict in file.js
# Open file.js and you'll see:

<<<<<<< HEAD
// Your changes (feature B)
=======
// Changes from Laptop A (feature A)
>>>>>>> origin/main

# Manually edit to keep both changes or choose one
# Remove the conflict markers (<<<<<<, =======, >>>>>>>)

# After resolving:
git add file.js
git commit -m "Merge feature A and feature B in file.js"
git push origin main
```

### Want to Discard All Local Changes

```bash
# Careful! This will delete all uncommitted changes
git reset --hard origin/main

# Safer option: Stash changes (save for later)
git stash
# Your changes are saved, working directory is clean

# Later, to restore:
git stash pop
```

### Check Differences Between Local and Remote

```bash
# Fetch remote changes without merging
git fetch origin

# Compare your branch with remote
git diff main origin/main

# See commits on remote you don't have
git log main..origin/main

# See commits you have that remote doesn't
git log origin/main..main
```

### Create a Backup Before Risky Operation

```bash
# Create a backup branch
git branch backup-$(date +%Y%m%d)

# Now you can experiment safely
# If something goes wrong:
git checkout backup-20250123
```

## Troubleshooting

### Problem: "Git pull" requires merge but I don't want a merge commit

```bash
# Use rebase instead
git pull --rebase origin main
```

### Problem: I committed to the wrong branch

```bash
# Move last commit to a new branch
git branch new-branch-name
git reset --hard HEAD~1  # Remove commit from current branch
git checkout new-branch-name  # Switch to new branch with your commit
```

### Problem: I need to undo my last commit

```bash
# Keep the changes in your working directory
git reset --soft HEAD~1

# Discard the changes completely
git reset --hard HEAD~1
```

### Problem: I pushed sensitive data (API keys, passwords)

```bash
# Remove from latest commit
git rm --cached path/to/sensitive-file
git commit --amend -m "Remove sensitive file"
git push --force origin main

# IMPORTANT: Then change those credentials!
# Once pushed, consider them compromised
```

### Problem: Repository is out of sync

```bash
# Nuclear option - make your local exactly match remote
git fetch origin
git reset --hard origin/main
# Warning: This deletes all local changes!
```

## Best Practices

### 1. Always Pull Before Starting Work
```bash
# Start of every work session
git pull origin main
```

### 2. Commit Early and Often
```bash
# Better to have many small commits than one huge commit
git add feature-x.js
git commit -m "Implement user login validation"

git add feature-y.js
git commit -m "Add error handling for login"

# Then push all at once
git push origin main
```

### 3. Write Descriptive Commit Messages

**Bad:**
```bash
git commit -m "fix"
git commit -m "update"
git commit -m "changes"
```

**Good:**
```bash
git commit -m "Fix Instagram trigger not loading on flow builder"
git commit -m "Add validation for email field in user registration"
git commit -m "Update README with git workflow documentation"
```

### 4. Keep Environment Files in Sync Manually

**⚠️ IMPORTANT:** `.env` files are in `.gitignore` and won't sync

When you add new environment variables on one laptop:
1. Update the `.env` file
2. Document it in a message to yourself
3. Manually update the `.env` on your other laptop

### 5. Use .gitignore Properly

The project `.gitignore` excludes:
- `node_modules/`
- `.env` and `.env.local`
- `*.db` (database files)
- `uploads/`
- Build artifacts

Never commit these files!

### 6. Regular Backups

Even with git, keep backups of:
- `.env` files (stored securely, not in git)
- Database files (if they contain important data)
- Any uploaded files in `backend/uploads/`

## Quick Reference

### Most Used Commands

```bash
# Check status
git status

# Pull latest changes
git pull origin main

# Stage and commit
git add .
git commit -m "Your message"

# Push to remote
git push origin main

# View history
git log --oneline -10

# Discard local changes
git checkout -- filename

# Discard all local changes
git reset --hard origin/main

# Stash changes temporarily
git stash
git stash pop  # Restore stashed changes

# View differences
git diff
git diff filename

# Check which files changed
git status
```

### Git Command Cheat Sheet

| Command | Description |
|---------|-------------|
| `git status` | Show modified files |
| `git add <file>` | Stage specific file |
| `git add .` | Stage all changes |
| `git commit -m "msg"` | Commit staged changes |
| `git push` | Push commits to remote |
| `git pull` | Pull and merge remote changes |
| `git fetch` | Download remote changes (no merge) |
| `git log` | View commit history |
| `git diff` | Show unstaged changes |
| `git branch` | List branches |
| `git checkout -b <name>` | Create and switch to new branch |
| `git stash` | Temporarily save changes |
| `git stash pop` | Restore stashed changes |
| `git reset --hard HEAD` | Discard all local changes |

## Working with Branches (Optional)

If you want to work on features without affecting the main code:

```bash
# Create and switch to a new branch
git checkout -b feature/my-new-feature

# Make changes and commit
git add .
git commit -m "Implement my new feature"

# Push the branch
git push origin feature/my-new-feature

# Switch back to main
git checkout main

# Merge the feature branch
git merge feature/my-new-feature

# Delete the branch after merging
git branch -d feature/my-new-feature
git push origin --delete feature/my-new-feature
```

## Emergency Procedures

### Lost Work (Accidental Delete/Reset)

```bash
# Git keeps a reflog of all operations
git reflog

# Find the commit before the mistake (e.g., HEAD@{2})
git reset --hard HEAD@{2}
```

### Corrupt Repository

```bash
# Re-clone from GitHub
cd ~/Desktop
mv dm-automation-platform dm-automation-platform-backup
git clone https://github.com/ioanniskon12/dm-automation-platform.git
cd dm-automation-platform

# Copy your .env files from backup
cp ../dm-automation-platform-backup/backend/.env backend/
cp ../dm-automation-platform-backup/frontend/.env.local frontend/
```

---

**Remember:** When in doubt, commit and push your work before trying anything risky!
