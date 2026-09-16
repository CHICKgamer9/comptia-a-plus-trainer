import type { NextConfig } from "next";

const aplusDomains = [
  "mobile-devices",
  "networking",
  "hardware",
  "virtualization-cloud",
  "hw-net-troubleshooting",
  "operating-systems",
  "security",
  "software-troubleshooting",
  "operational-procedures",
];

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  async redirects() {
    return aplusDomains.map((id) => ({
      source: `/learn/${id}`,
      destination: `/learn/tech/${id}`,
      permanent: false,
    }));
  },
};

export default nextConfig;
