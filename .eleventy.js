import Image from "@11ty/eleventy-img";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/admin");

  // Responsive images: WebP + JPEG/PNG fallback, width/height always set.
  eleventyConfig.addAsyncShortcode("image", async (src, alt, sizes, opts = {}) => {
    const metadata = await Image(`src/images/${src}`, {
      widths: opts.widths || [400, 800, 1200],
      formats: ["webp", opts.png ? "png" : "jpeg"],
      outputDir: "_site/img/",
      urlPath: "/img/",
    });
    const attrs = { alt, sizes, loading: opts.eager ? "eager" : "lazy", decoding: "async" };
    if (opts.eager) attrs.fetchpriority = "high";
    if (opts.class) attrs.class = opts.class;
    return Image.generateHTML(metadata, attrs);
  });

  eleventyConfig.addFilter("usd", (n) => "$" + Number(n).toLocaleString("en-US"));
  // ["Corporate events","Weddings"] -> "Corporate events and weddings"
  eleventyConfig.addFilter("sentenceList", (arr) => {
    const items = arr.map((a, i) => (i === 0 ? a : a.charAt(0).toLowerCase() + a.slice(1)));
    return items.length < 2 ? items.join("") : items.slice(0, -1).join(", ") + " and " + items.at(-1);
  });
  eleventyConfig.addShortcode("year", () => String(new Date().getFullYear()));

  return { dir: { input: "src", output: "_site" }, markdownTemplateEngine: "njk" };
}
