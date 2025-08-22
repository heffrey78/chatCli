import { launch, Browser, Page } from 'puppeteer';

/**
 * Converts a webpage to a PDF.
 * @param page The page to convert to PDF.
 * @param output The name of the output file.
 * @param options Custom options for the PDF.
 */
export async function convertWebpageToPdf(url: string, saved_page: string = 'saved_page', options: any = {}): Promise<void> {
  let browser: Browser | null = null;
  
  try {
    browser = await launch();
    // Open a new tab
    const page = await browser.newPage();
    // Go to the specified URL
    await page.goto(url, { waitUntil: 'networkidle2' });
    // Set default options for the PDF if none are provided
    const defaultOptions = {
      headless: 'new ',
      path: `./output/${saved_page}_${Date.now()}.pdf`,
      format: 'A4',
      printBackground: false
    };
    // Merge default options with any provided custom options
    const pdfOptions = Object.assign({}, defaultOptions, options);
    // Generate and save the PDF
    await page.pdf(pdfOptions);
  } catch (error) {
    throw error;
  } finally {
    // Close the browser if it exists
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Gets all the headings on all the pages linked to from the input URL.
 * @param url The URL to scrape.
 * @returns An array of all the headings on all the pages.
 */
export async function getHeadingsForAllPages(url: string): Promise<string[]> {
  let browser: Browser | null = null;
  try {
    browser = await launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url);
    const pageUrls: string[] = await page.$$eval('a', (links: HTMLAnchorElement[]) =>
      links.map((link) => link.href)
    );
    const pagePromises = pageUrls.map(async (pageUrl) => {
      const page = await browser!.newPage();
      await page.goto(pageUrl);
      const pageHeadings: string[] = await page.$$eval('h1,h2,h3,h4,h5,h6', (tags: Element[]) =>
        tags.map((tag) => (tag as HTMLElement).textContent!.trim())
      );
      await page.close();
      return pageHeadings;
    });
    const headings = await Promise.all(pagePromises).then((results) => results.flat());
    return headings;
  } catch (error) {
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}