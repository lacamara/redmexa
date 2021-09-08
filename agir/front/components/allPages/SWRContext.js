import PropTypes from "prop-types";
import React from "react";
import { SWRConfig } from "swr";

import axios from "@agir/lib/utils/axios";

const fetcher = async (url) => {
  if (url === "/api/session/") {
    const res = await fetch(url, {
      mode: "no-cors",
      headers: { Accept: "*/*" },
    });
    return res.json();
  }
  const res = await axios.get(url);
  return res.data;
};

const errorRetry = (error, ...rest) => {
  if ([403, 404].includes(error.status)) return;
  SWRConfig.default.onErrorRetry(error, ...rest);
};

const SWRContext = ({ children }) => (
  <SWRConfig
    value={{
      fetcher,
      onErrorRetry: errorRetry,
    }}
  >
    {children}
  </SWRConfig>
);

SWRContext.propTypes = {
  children: PropTypes.node,
};

export default SWRContext;