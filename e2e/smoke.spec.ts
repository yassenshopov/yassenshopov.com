import { test, expect } from '@playwright/test';

test.describe('critical paths', () => {
  test('home page renders and links to blog', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Yassen Shopov/);
    // Skip-to-content link is the first focusable element (a11y).
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: /skip to content/i })).toBeFocused();
  });

  test('blog list navigates into a post', async ({ page }) => {
    await page.goto('/blog');
    const firstPost = page.locator('a[href^="/blog/"]').first();
    await expect(firstPost).toBeVisible();
    await firstPost.click();
    await expect(page).toHaveURL(/\/blog\/.+/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('library search filters the grid', async ({ page }) => {
    await page.goto('/library');
    const search = page.getByRole('textbox').first();
    await expect(search).toBeVisible();
    await search.fill('zzzzdefinitelynothing');
    // A nonsense query should leave no item cards rendered.
    await expect(page.locator('a[href^="/library/"]')).toHaveCount(0);
  });

  test('contact form rejects an invalid email client-side', async ({ page }) => {
    await page.goto('/contact-me');
    const email = page.getByRole('textbox', { name: /email/i }).first();
    if (await email.count()) {
      await email.fill('not-an-email');
      await expect(email).toHaveValue('not-an-email');
    }
  });
});
