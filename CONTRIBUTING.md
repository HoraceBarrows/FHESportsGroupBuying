# Contributing to Anonymous Sports Group Buying

Thank you for your interest in contributing to the Anonymous Sports Group Buying platform! This document provides guidelines and instructions for contributing.

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, Node version, etc.)

### Suggesting Features

We welcome feature suggestions! Please:
- Check existing issues first
- Describe the feature clearly
- Explain the use case
- Consider implementation details

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the coding standards
   - Add tests if applicable
   - Update documentation

4. **Test your changes**
   ```bash
   npm run compile
   npm run test
   ```

5. **Commit your changes**
   ```bash
   git commit -m "Add: description of your changes"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**

## 📝 Coding Standards

### Solidity

- Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Use meaningful variable names
- Add NatSpec comments for all functions
- Keep functions small and focused
- Run solhint before committing

### JavaScript

- Use ES6+ syntax
- Follow ESLint configuration
- Use async/await over callbacks
- Add JSDoc comments for complex functions
- Keep code modular and reusable

### Git Commit Messages

Format: `Type: Description`

Types:
- `Add`: New feature
- `Fix`: Bug fix
- `Update`: Update existing feature
- `Refactor`: Code refactoring
- `Docs`: Documentation changes
- `Test`: Test additions or changes
- `Chore`: Maintenance tasks

Example:
```
Add: encrypted order cancellation feature
Fix: order revelation callback signature
Update: deployment script with gas optimization
```

## 🧪 Testing

Before submitting:

1. **Compile contracts**
   ```bash
   npm run compile
   ```

2. **Run tests**
   ```bash
   npm run test
   ```

3. **Test deployment locally**
   ```bash
   npx hardhat node
   npm run deploy
   ```

4. **Run simulations**
   ```bash
   npm run simulate
   ```

## 📋 Pull Request Process

1. Update README.md with details of changes if needed
2. Update DEPLOYMENT.md if deployment process changes
3. Add tests for new functionality
4. Ensure all tests pass
5. Update version numbers if applicable
6. Request review from maintainers

## 🔒 Security

If you discover a security vulnerability:
- **DO NOT** open a public issue
- Email the maintainers directly
- Provide detailed information
- Allow time for fixes before disclosure

## 📚 Documentation

Good documentation helps everyone:

- Update README.md for user-facing changes
- Update DEPLOYMENT.md for deployment changes
- Add inline comments for complex logic
- Create examples for new features
- Keep documentation clear and concise

## 🎨 Design Principles

When contributing, keep these principles in mind:

1. **Privacy First**: Maintain FHE encryption integrity
2. **User Security**: Never compromise user data
3. **Code Quality**: Clean, readable, maintainable code
4. **Gas Efficiency**: Optimize for lower transaction costs
5. **Simplicity**: Keep interfaces simple and intuitive

## 🛠️ Development Setup

Complete setup instructions:

```bash
# Clone the repository
git clone https://github.com/HoraceBarrows/AnonymousSportsGroupBuying.git
cd AnonymousSportsGroupBuying

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure .env with your settings

# Compile contracts
npm run compile

# Run tests
npm run test

# Start local node
npx hardhat node

# Deploy to local network (in another terminal)
npm run deploy --network localhost
```

## 📞 Getting Help

Need help?
- Check existing documentation
- Review closed issues
- Ask in discussions
- Reach out to maintainers

## ✅ Checklist

Before submitting a PR, ensure:

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Code is commented where needed
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] No console warnings/errors
- [ ] Git commits are clean
- [ ] PR description is clear

## 🙏 Thank You

Your contributions make this project better for everyone. We appreciate your time and effort!

---

**Happy Coding!**
