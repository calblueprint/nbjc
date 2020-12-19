module.exports = {
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/applications',
        permanent: true,
      },
    ];
  },
};
