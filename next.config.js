const { createSecureHeaders } = require("next-secure-headers");
module.exports = {
  poweredByHeader: false,

  async headers() {
    return [{ source: "/(.*)", headers: createSecureHeaders() }];
  },
};