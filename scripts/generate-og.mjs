import sharp from "sharp";

const logo = await sharp("public/brand/logo-transparent.png")
  .resize({ width: 820, withoutEnlargement: true })
  .png()
  .toBuffer();

const background = Buffer.from(`
  <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="light" cx="75%" cy="20%" r="85%">
        <stop offset="0" stop-color="#174c82" stop-opacity=".75" />
        <stop offset="1" stop-color="#071c30" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#light)" />
    <path d="M640 630L1000 220L1200 330V630Z" fill="#0b2b50" opacity=".72" />
    <path d="M640 630L1000 220L1200 330" fill="none" stroke="#83addb" stroke-opacity=".4" stroke-width="2" />
  </svg>
`);

await sharp({
  create: {
    width: 1200,
    height: 630,
    channels: 3,
    background: "#071c30",
  },
})
  .composite([
    { input: background, top: 0, left: 0 },
    { input: logo, top: 160, left: 86 },
  ])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile("public/og-assentin.jpg");
