# Test Generation Instructions

Generate tests following the project test pyramid (70% unit, 20% integration, 10% E2E).

## Go Backend

- Use `testify` (assert/require/mock), table-driven tests, `testcontainers-go` for integration
- Naming: `TestServiceName_MethodName/scenario`
- Always test error paths and edge cases

## TypeScript/React (Next.js)

- Use Vitest + React Testing Library
- Test user behavior, not implementation details
- Use MSW for API mocking
- Test React Query hooks with QueryClientProvider wrapper

## React Native (Expo)

- Use Jest + @testing-library/react-native
- Mock native modules properly
- Test navigation flows

## Python AI

- Use pytest + pytest-asyncio
- Use httpx.AsyncClient for FastAPI endpoint tests
- Mock LLM calls to avoid API costs in tests

## Always

- Arrange → Act → Assert pattern
- Test happy path + error cases + edge cases
- Meaningful test names describing behavior
- No test interdependence
- Minimum 80% coverage target
