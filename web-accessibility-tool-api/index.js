const express = require('express');
const pa11y = require('pa11y');
const cors = require('cors');
const axios= require('axios');
const path = require('path');
const { Pa11yResult, connectDB } = require('./mongoose');


const app = express();
const PORT = 3001;
app.use(cors({
    origin: '*',
}));

// MongoDB bağlantısını başlat
connectDB();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

function processResponse(data, url) {
    const res = data.replaceAll('src="//', 'src="https://').replace(/src="(?!https?:\/\/)(\/?[^"]+)"/g, (match, path) => {
      return `src="${url}${path.startsWith("/") ? "" : "/"}${path}"`;
    });
  
   const res2= res.replaceAll('href="//', 'href="https://').replace(/href="(?!https?:\/\/)(\/?[^"]+)"/g, (match, path) => {
      return `href="${url}${path.startsWith("/") ? "" : "/"}${path}"`;
    });
  
    const lastSlashIndex = url.lastIndexOf('/');
  
    // URL'yi son '/' konumundan önceki kısmı alacak şekilde kes
    const baseUrl = url.substring(0, lastSlashIndex);
    
    return res2.replaceAll('url(..', `url(${baseUrl}/..`).replaceAll('url("//', 'url("https://').replace(/url\("(?!https?:\/\/|data:image)(\/?[^"]+)"/g, (match, path) => {
      return `url("${url}${path.startsWith('/') ? '' : '/'}${path}")`;
  });
  }

function hasImage(url) {
  return (
    url.includes(".png") ||
    url.includes(".svg") ||
    url.includes(".jpg") ||
    url.includes(".jpeg") ||
    url.includes(".webp")
  );
}

app.get("/proxy", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).send("URL parameter is required.");
  }

  try {
     // Fetch the target URL's content
    const response = await axios.get(targetUrl, {
      headers: { "User-Agent": "Mozilla/5.0" }, // Mimic a browser
      responseType: hasImage(targetUrl) ? "arraybuffer" : "",
    });
    const contentType = response.headers.get("content-type");
    if (!contentType) {
      return res.status(500).send("Unable to determine Content-Type");
    }
    console.log(contentType);

    // Set the appropriate Content-Type header
    res.set("content-type", contentType);

    if (hasImage(targetUrl)) {
      return res.send(response.data);
    }

    // Process the HTML content for links and resources
    const processedHTML = processResponse(response.data, "http://localhost:3001/proxy?url=" + targetUrl);

      res.send(processedHTML);
  } catch (error) {
    res.status(500).send("Error fetching content: " + error.message);
  }
});

app.get("/pa11y", async (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).send("URL parameter is required.");
      }

            // Perform Pa11y accessibility testing
    const pa11yResults = await pa11y(targetUrl, {
        standard: 'WCAG2AA', // You can specify the standard (e.g., WCAG2A, WCAG2AA, etc.)
        log: {
          debug: console.log,
          error: console.error,
          info: console.log,
        },
        includeNotices: true,
        includeWarnings: true,
      });

        // Sonuçları MongoDB'ye kaydet
        const savedResult = await Pa11yResult.create({
            url: targetUrl,
            results: pa11yResults,
        });

        console.log("Results saved to MongoDB:", savedResult);

      res.json(pa11yResults);
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
