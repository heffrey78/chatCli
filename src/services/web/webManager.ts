import puppeteer from 'puppeteer';

export async function convertWebpageToPdf(url: string, output: string, options: any = {} ): Promise<void> {
  try {
    // Launch headless Chrome or Chromium browser
    const browser = await puppeteer.launch();
    // Open a new tab
    const page = await browser.newPage();
    // Go to the specified URL
    await page.goto(url, { waitUntil: 'networkidle2' });
    // Set default options for the PDF if none are provided
    const defaultOptions = {
      path: output,
      format: 'A4',
      printBackground: false
    };
    // Merge default options with any provided custom options
    const pdfOptions = Object.assign({}, defaultOptions, options);
    // Generate and save the PDF
    await page.pdf(pdfOptions);
    // Close the browser
    await browser.close();
  } catch (error) {
    throw error;
  }
}

export async function getHeadingsForAllPages(url: string): Promise<string[]> {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url);
    const pageUrls: string[] = await page.$$eval('a', (links: HTMLAnchorElement[]) =>
      links.map((link) => link.href)
    );
    let headings: string[] = [];
    for (const pageUrl of pageUrls) {
      await page.goto(pageUrl);
      const pageHeadings: string[] = await page.$$eval('h1,h2,h3,h4,h5,h6', (tags: Element[]) =>
        tags.map((tag) => (tag as HTMLElement).textContent!.trim())
      );
      headings.push(...pageHeadings);
    }
    await browser.close();
    return headings;
  }