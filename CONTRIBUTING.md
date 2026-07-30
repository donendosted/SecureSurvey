# Contributing to Midnight Survey DApp

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding/updating tests
- `chore:` Maintenance tasks
- `ci:` CI/CD changes
- `perf:` Performance improvements
- `security:` Security fixes

## Development Workflow

1. Create a feature branch from `develop`
2. Make your changes
3. Run `pnpm lint` and `pnpm typecheck`
4. Write/update tests
5. Create a changeset: `pnpm changeset`
6. Commit using conventional commit format
7. Push and create a PR

## PR Guidelines

- Keep PRs focused on a single concern
- Include screenshots for UI changes
- Update documentation as needed
- Ensure all CI checks pass
