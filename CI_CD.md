# CI/CD Documentation

Comprehensive continuous integration and deployment pipeline for the Anonymous Sports Group Buying platform.

## 📋 Table of Contents

- [Overview](#overview)
- [GitHub Actions Workflow](#github-actions-workflow)
- [Code Quality Tools](#code-quality-tools)
- [Automated Testing](#automated-testing)
- [Code Coverage](#code-coverage)
- [Security Checks](#security-checks)
- [Setup Instructions](#setup-instructions)
- [Badge Integration](#badge-integration)

## 🎯 Overview

Our CI/CD pipeline automatically runs on:

- ✅ Every push to `main` branch
- ✅ Every push to `develop` branch
- ✅ All pull requests to `main` or `develop`
- ✅ Multiple Node.js versions (18.x, 20.x)

### Pipeline Stages

1. **Code Quality Check** - Linting and formatting
2. **Testing** - Automated test suite on Node 18.x and 20.x
3. **Gas Reporting** - Gas usage analysis
4. **Security Audit** - Vulnerability scanning
5. **Build Verification** - Contract compilation

## 🔄 GitHub Actions Workflow

### Workflow File

Location: `.github/workflows/test.yml`

### Trigger Events

```yaml
on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main
      - develop
```

### Jobs Overview

| Job | Purpose | Node Version | Duration |
|-----|---------|--------------|----------|
| `lint-and-format` | Code quality | 20.x | ~1-2 min |
| `test-node-18` | Tests on Node 18 | 18.x | ~3-5 min |
| `test-node-20` | Tests on Node 20 | 20.x | ~3-5 min |
| `gas-report` | Gas analysis | 20.x | ~3-5 min |
| `security-check` | Security audit | 20.x | ~2-3 min |
| `build-check` | Build verification | 20.x | ~1-2 min |

### Workflow Diagram

```
┌─────────────────────┐
│   Code Push/PR      │
└──────────┬──────────┘
           │
           v
┌─────────────────────┐
│ Code Quality Check  │
│  - Prettier         │
│  - ESLint           │
│  - Solhint          │
└──────────┬──────────┘
           │
     ┌─────┴─────┐
     │           │
     v           v
┌─────────┐ ┌─────────┐
│ Test    │ │ Test    │
│ Node 18 │ │ Node 20 │
└────┬────┘ └────┬────┘
     │           │
     └─────┬─────┘
           │
     ┌─────┴──────────┬─────────────┐
     │                │             │
     v                v             v
┌─────────┐    ┌──────────┐  ┌──────────┐
│   Gas   │    │ Security │  │  Build   │
│  Report │    │  Check   │  │  Check   │
└─────────┘    └──────────┘  └──────────┘
     │                │             │
     └────────┬───────┴─────────────┘
              │
              v
       ┌─────────────┐
       │  All Tests  │
       │   Passed    │
       └─────────────┘
```

## 🔍 Code Quality Tools

### 1. Prettier (Code Formatting)

**Configuration**: `.prettierrc.json`

```bash
# Check formatting
npm run prettier:check

# Auto-fix formatting
npm run prettier
```

**Rules:**
- Print width: 100 characters (JS), 120 (Solidity)
- Tab width: 2 spaces (JS), 4 (Solidity)
- Semicolons: Required
- Single quotes: Disabled
- Trailing commas: ES5

### 2. ESLint (JavaScript Linting)

**Configuration**: `.eslintrc.json`

```bash
# Run linter
npm run lint

# Auto-fix issues
npm run lint:fix
```

**Key Rules:**
- ES2021 syntax
- Mocha globals enabled
- Unused variables: Warning
- Console statements: Allowed
- Prettier integration

### 3. Solhint (Solidity Linting)

**Configuration**: `.solhint.json`

```bash
# Run Solidity linter
npm run lint:sol

# Auto-fix issues
npm run lint:sol:fix
```

**Key Rules:**
- Code complexity: Max 10
- Compiler version: ^0.8.24
- Function visibility: Required
- Max line length: 120
- No console: Disabled (for testing)
- Named parameters: Warning

## 🧪 Automated Testing

### Test Suite

**51+ comprehensive test cases** across multiple suites:

```bash
# Run all tests
npm test

# Run on specific network
npm run test:sepolia

# Run with gas reporting
REPORT_GAS=true npm test
```

### Test Matrix

Tests run on multiple Node.js versions:

| Node Version | Status | Coverage |
|--------------|--------|----------|
| 18.x | ✅ Tested | Full |
| 20.x | ✅ Tested | Full |

### Test Categories

- ✅ Deployment & Initialization (5 tests)
- ✅ Product Creation (10 tests)
- ✅ Order Placement (13 tests)
- ✅ Group Target Checking (3 tests)
- ✅ Product Management (3 tests)
- ✅ View Functions (3 tests)
- ✅ Edge Cases & Security (5 tests)
- ✅ Gas Optimization (3 tests)
- ✅ Sepolia Integration (6+ tests)

## 📊 Code Coverage

### Codecov Integration

**Configuration**: `codecov.yml`

```bash
# Generate coverage report
npm run coverage
```

### Coverage Targets

| Metric | Target | Threshold |
|--------|--------|-----------|
| Project Coverage | 80% | ±2% |
| Patch Coverage | 70% | ±5% |
| Overall Range | 70-100% | - |

### Coverage Reports

Coverage is automatically uploaded to Codecov on:
- Every push to main/develop
- All pull requests

**View Reports:** `https://codecov.io/gh/YOUR_ORG/anonymous-sports-group-buying`

### Coverage Files

Generated files (in `.gitignore`):
- `coverage/` - HTML report
- `coverage/lcov.info` - LCOV format
- `coverage.json` - JSON format

## 🔒 Security Checks

### NPM Audit

Automated vulnerability scanning:

```bash
npm audit --audit-level=moderate
```

### Security Pipeline

1. **Dependency Check** - Scans all dependencies
2. **Vulnerability Report** - Identifies security issues
3. **Audit Report** - Generates JSON report
4. **Artifact Upload** - Saves report for review

### Security Best Practices

- ✅ No hardcoded secrets
- ✅ Environment variables for sensitive data
- ✅ Automated dependency updates
- ✅ Regular security audits
- ✅ Minimal permissions

## ⚙️ Setup Instructions

### 1. Repository Setup

Enable GitHub Actions in your repository settings.

### 2. Configure Secrets

Add these secrets to your GitHub repository:

**Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Description | Required |
|-------------|-------------|----------|
| `CODECOV_TOKEN` | Codecov upload token | Yes |
| `SEPOLIA_RPC_URL` | Sepolia RPC endpoint | Optional |
| `PRIVATE_KEY` | Deployment private key | Optional |
| `ETHERSCAN_API_KEY` | Etherscan verification | Optional |

### 3. Codecov Setup

1. Visit [codecov.io](https://codecov.io/)
2. Sign in with GitHub
3. Add your repository
4. Copy the upload token
5. Add to GitHub secrets as `CODECOV_TOKEN`

### 4. Branch Protection

Enable branch protection for `main`:

**Settings → Branches → Add rule**

```
✅ Require status checks to pass before merging
  ✅ lint-and-format
  ✅ test-node-18
  ✅ test-node-20
  ✅ gas-report
  ✅ security-check
  ✅ build-check
✅ Require branches to be up to date
✅ Require conversation resolution
```

### 5. Local Development

Install dependencies:

```bash
npm install
```

Run quality checks locally:

```bash
# Format code
npm run format

# Run all linters
npm run lint
npm run lint:sol

# Run tests
npm test

# Generate coverage
npm run coverage
```

## 📛 Badge Integration

Add these badges to your README.md:

### CI/CD Status

```markdown
![CI/CD](https://github.com/YOUR_ORG/anonymous-sports-group-buying/workflows/CI%2FCD%20Testing%20Pipeline/badge.svg)
```

### Code Coverage

```markdown
[![codecov](https://codecov.io/gh/YOUR_ORG/anonymous-sports-group-buying/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_ORG/anonymous-sports-group-buying)
```

### Node.js Version

```markdown
![Node.js](https://img.shields.io/badge/node-18.x%20%7C%2020.x-brightgreen)
```

### License

```markdown
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
```

## 🔧 Troubleshooting

### Common Issues

**1. Tests failing locally but passing in CI**

```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
npm test
```

**2. Linting errors**

```bash
# Auto-fix most issues
npm run format
```

**3. Coverage upload fails**

- Check `CODECOV_TOKEN` is set correctly
- Verify `coverage/lcov.info` exists after test run
- Check Codecov service status

**4. Gas report not generated**

```bash
# Ensure REPORT_GAS is set
REPORT_GAS=true npm test
```

### Debug Mode

Enable verbose logging:

```bash
# Detailed test output
npm test -- --verbose

# Debug GitHub Actions
# Add to workflow:
- name: Debug
  run: |
    echo "Node version: $(node --version)"
    echo "NPM version: $(npm --version)"
    ls -la
```

## 📈 Performance Metrics

### Typical Pipeline Duration

- **Fast Check** (~5 min): Lint + single test run
- **Full Pipeline** (~15 min): All jobs parallel
- **With Dependencies** (~20 min): First run with cache miss

### Optimization Tips

1. **Use npm ci** instead of npm install
2. **Enable caching** for node_modules
3. **Run jobs in parallel** where possible
4. **Skip redundant** checks (e.g., coverage on all Node versions)

## 📚 Additional Resources

### Documentation

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Codecov Documentation](https://docs.codecov.com/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Solhint Rules](https://github.com/protofire/solhint)
- [Prettier Options](https://prettier.io/docs/en/options.html)

### Tools

- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [Codecov Dashboard](https://app.codecov.io/)
- [Hardhat Documentation](https://hardhat.org/docs)

## ✅ Checklist

Before merging PRs:

- [ ] All tests pass locally
- [ ] Code is formatted (`npm run prettier`)
- [ ] No linting errors (`npm run lint`)
- [ ] Solidity is linted (`npm run lint:sol`)
- [ ] Coverage >80%
- [ ] All CI checks pass
- [ ] Security audit clean
- [ ] Gas usage acceptable
- [ ] Documentation updated

---

**Pipeline Status**: ✅ Active
**Supported Node Versions**: 18.x, 20.x
**Code Coverage Target**: 80%+
**Last Updated**: January 2025
