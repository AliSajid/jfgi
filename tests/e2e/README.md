# End-to-End Tests

This directory contains comprehensive E2E tests for the JFGI application using Playwright.

## Test Structure

```bash
tests/e2e/
├── utils/
│   ├── page-objects.ts    # Page Object Model classes
│   └── helpers.ts         # Test utility functions
├── homepage.test.ts       # Homepage functionality tests
├── search.test.ts         # Search functionality tests
├── api.test.ts           # API endpoint tests
├── accessibility.test.ts  # Accessibility compliance tests
├── visual.test.ts        # Visual regression tests
└── legacy.test.ts        # Legacy test (to be updated)
```

## Running Tests

### All E2E Tests

```bash
npm run test:e2e
```

### Specific Test Categories

```bash
# Run in headed mode (see browser)
npm run test:e2e:headed

# Debug mode (step through tests)
npm run test:e2e:debug

# Interactive UI mode
npm run test:e2e:ui

# Run specific test file
npx playwright test homepage.test.ts

# Run specific test
npx playwright test -g "displays the correct page title"
```

### Test Reports

```bash
# Show HTML report
npm run test:e2e:report
```

## Test Categories

### Homepage Tests (`homepage.test.ts`)

- Page title and metadata
- Visitor counter functionality
- Image display and selection
- Responsive design
- Static asset loading
- Basic accessibility

### Search Tests (`search.test.ts`)

- Search query handling
- URL encoding
- Countdown timer functionality
- Progress bar animation
- Redirect functionality
- Various query types (spaces, special chars, unicode, etc.)

### API Tests (`api.test.ts`)

- Sitemap.xml generation
- Search redirect endpoints
- Static file serving
- Error handling
- Performance metrics
- Image optimization

### Accessibility Tests (`accessibility.test.ts`)

- WCAG compliance
- Keyboard navigation
- Screen reader compatibility
- Color contrast
- Text scaling
- Semantic structure
- ARIA labels

### Visual Tests (`visual.test.ts`)

- Screenshot comparison
- Responsive layouts
- Component isolation
- Theme variations (dark mode, high contrast)
- Different viewport sizes

## Configuration

The tests are configured in `playwright.config.ts`:

- **Multiple browsers**: Chrome, Firefox, Safari, Mobile Chrome/Safari
- **Base URL**: <http://localhost:4173> (preview server)
- **Parallel execution**: Enabled for faster runs
- **Retries**: 2 retries on CI, 0 locally
- **Screenshots**: On failure only
- **Videos**: Retained on failure
- **Traces**: On first retry

## Test Utilities

### Page Objects (`utils/page-objects.ts`)

- `JFGIPage` class with methods for common actions
- Centralized element selectors
- Reusable assertion methods

### Helpers (`utils/helpers.ts`)

- Mock functions for consistent testing
- Test data constants
- Viewport configurations
- Debugging utilities

## Best Practices

### Writing Tests

1. **Use Page Objects**: Centralize element selection and actions
2. **Mock Dynamic Content**: Stabilize visitor counters, timers, etc.
3. **Test Real User Scenarios**: Focus on actual user workflows
4. **Include Negative Tests**: Test error conditions and edge cases

### Debugging

1. **Use Headed Mode**: `npm run test:e2e:headed`
2. **Debug Specific Tests**: `npx playwright test --debug -g "test name"`
3. **Screenshots**: Automatically captured on failure
4. **Use `page.pause()`**: Add breakpoints in tests

### Performance

1. **Parallel Execution**: Tests run in parallel by default
2. **Selective Testing**: Run specific files or tests during development
3. **Mock External Services**: Avoid real API calls in tests

## Continuous Integration

For CI environments:

```bash
# Run all tests (unit + e2e)
npm run test:ci

# E2E only
npm run test:e2e
```

The configuration automatically:

- Uses 1 worker in CI (more stable)
- Enables retries (2 attempts)
- Generates JSON reports
- Captures artifacts on failure

## Common Issues

### Port Conflicts

If port 4173 is in use:

```bash
# Check what's using the port
lsof -i :4173

# Kill the process or change the port in playwright.config.ts
```

### Browser Dependencies

Install browser binaries:

```bash
npx playwright install
```

### Screenshots Don't Match

Update visual baselines:

```bash
npx playwright test --update-snapshots
```

## Test Data

Tests use consistent data defined in `utils/helpers.ts`:

- **TEST_QUERIES**: Various search query scenarios
- **EXPECTED_IMAGES**: Alt texts for image components
- **VIEWPORTS**: Standard screen sizes for responsive testing

This ensures tests are predictable and maintainable.
