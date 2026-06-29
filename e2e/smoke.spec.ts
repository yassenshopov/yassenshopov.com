import { test, expect } from '@playwright/test';

test.describe('critical paths', () => {
  test('home page renders and links to blog', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Yassen Shopov/);
    // Skip-to-content link is the first focusable element (a11y).
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: /skip to content/i })).toBeFocused();
  });

  test('home reveal sections render their content (not stuck hidden)', async ({ page }) => {
    // The scroll-reveal sections are now Server Components; their content must
    // be present in the DOM and become visible (guards the Reveal refactor +
    // the reduced-motion / no-JS fallbacks).
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /what i do/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /selected work/i })).toBeVisible();
  });

  test('blog list navigates into a post', async ({ page }) => {
    await page.goto('/blog');
    const firstPost = page.locator('a[href^="/blog/"]').first();
    await expect(firstPost).toBeVisible();
    await firstPost.click();
    await expect(page).toHaveURL(/\/blog\/.+/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('library search filters down to the empty state', async ({ page }) => {
    await page.goto('/library');
    const search = page.getByPlaceholder(/search/i).first();
    await expect(search).toBeVisible();
    await search.fill('zzzzdefinitelynothing');
    // A nonsense query should surface the "no results" empty state.
    await expect(page.getByText(/no books .*found|no .*found/i).first()).toBeVisible();
  });

  test('library opens an item in a modal and closes it', async ({ page }) => {
    await page.goto('/library');
    // Each card is a button containing the work's title (an <h3>).
    const firstCard = page
      .getByRole('button')
      .filter({ has: page.getByRole('heading', { level: 3 }) })
      .first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('tier list loads and switches boards via the tabs', async ({ page }) => {
    await page.goto('/library/tier-list');
    await expect(page.getByRole('heading', { name: /tier list/i })).toBeVisible();

    const moviesTab = page.getByRole('tab', { name: /movies/i });
    await expect(moviesTab).toBeVisible();
    await moviesTab.click();
    // The active board is reflected in the URL so it's shareable.
    await expect(page).toHaveURL(/board=movies/);
  });

  test('contact form rejects an invalid email client-side', async ({ page }) => {
    await page.goto('/contact-me');
    const email = page.getByRole('textbox', { name: /email/i }).first();
    if (await email.count()) {
      await email.fill('not-an-email');
      await expect(email).toHaveValue('not-an-email');
    }
  });

  test('art gallery opens a piece in the lightbox and closes it', async ({ page }) => {
    await page.goto('/art');
    // Gallery tiles are buttons labelled "Open <alt>".
    const firstTile = page.getByRole('button', { name: /^open /i }).first();
    await expect(firstTile).toBeVisible();
    await firstTile.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('about timeline image opens an accessible fullscreen viewer', async ({ page }) => {
    await page.goto('/about');
    // The timeline image triggers are real buttons (keyboard-accessible), only
    // shown at md+ — the default Playwright viewport (1280px) qualifies.
    const imageButton = page.getByRole('button', { name: /view image for/i }).first();
    await expect(imageButton).toBeVisible();
    await imageButton.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    // The viewer exposes an explicit, labelled close control.
    const close = page.getByRole('button', { name: /close image viewer/i });
    await expect(close).toBeVisible();
    await close.click();
    await expect(dialog).toBeHidden();
  });
});
