import type { MetadataRoute } from "next";

/** Privates Bewerbungs-Portfolio: komplette Site für Crawler gesperrt. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
  };
}
