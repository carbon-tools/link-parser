'use strict';

const puppeteer = require('puppeteer');

async function ssr(url) {
  const start = Date.now();

  const browser = await puppeteer.launch({
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  try {
    // networkidle0 waits for the network to be idle (no requests for 500ms).
    // The page's JS has likely produced markup by this point, but wait longer
    // if your site lazy loads, etc.
    await page.goto(url, {waitUntil: 'networkidle0'});
  } catch (err) {
    console.error(err);
    throw new Error('page.goto timed out.');
  }

  const html = await page.content(); // serialized HTML of page DOM.

  const ttRenderMs = Date.now() - start;
  console.info(`Headless rendered page in: ${ttRenderMs}ms`);

  const meta = await page.evaluate(() => {

    const getTitle = document => {
      const fbTitle = document.querySelector('meta[property="og:title"]');
      if (fbTitle) {
        return fbTitle.getAttribute('content');
      }

      return document.title;
    };

    const getDescription = document => {
      const fbDesc = document.querySelector('meta[property="og:description"]');
      if (fbDesc) {
        return fbDesc.getAttribute('content');
      }

      const descMeta = document.querySelector('meta[name="description"]');
      if (descMeta) {
        return descMeta.getAttribute('content');
      }

      return '';
    }

    const getImage = document => {
      const fbImg = document.querySelector('meta[property="og:image"]')
      if (fbImg) {
        return fbImg.getAttribute('content');
      }

      const images = Array.from(document.querySelectorAll('img'));
      if (images.length > 0) {
        return images[0];
      }
    }

    const title = getTitle(document);
    const description = getDescription(document);
    const image = getImage(document);
    const images = Array.from(document.querySelectorAll('img'))
        .map(img => img.getAttribute('src'));
    return {
      title,
      description,
      image,
      images,
    }
  });

  await browser.close();

  // console.log(html, meta);
  return {html, meta, ttRenderMs};
}

exports.ssr = ssr;

