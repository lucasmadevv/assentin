import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://assentin.com.br/",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      images: [
        "https://assentin.com.br/og-assentin.jpg",
        "https://assentin.com.br/images/authentic-personal-consulting.webp",
        "https://assentin.com.br/images/authentic-business-team.webp",
      ],
    },
  ];
}
