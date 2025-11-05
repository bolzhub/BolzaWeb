import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: [
    "https://bolzanocrafts.com",
    "https://bolzanocrafts.com/fr",
    "https://bolzanocrafts.com/en"
  ],
};

export default withNextIntl(nextConfig);
