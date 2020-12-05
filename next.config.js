module.exports = {
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/organizations',
        permanent: true,
      },
    ];
  },
};
