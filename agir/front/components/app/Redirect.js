import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { Redirect } from "react-router-dom";

import { routeConfig } from "@agir/front/app/routes.config";
import { addQueryStringParams } from "@agir/lib/utils/url";
import { useRoute } from "./hooks";

const ExternalRedirect = (props) => {
  const { params, ...rest } = props;
  const href = params ? addQueryStringParams(props.href, params) : props.href;

  return <Redirect {...rest} to={href} />;
};
ExternalRedirect.propTypes = {
  href: PropTypes.string.isRequired,
  params: PropTypes.object,
};

const InternalRedirect = (props) => {
  const { to, params, state, backLink, ...rest } = props;

  const next = useMemo(() => {
    const pathname = params ? addQueryStringParams(pathname, params, true) : to;

    let nextState = state;

    if (backLink) {
      nextState = nextState || {};
      if (typeof backLink !== "string") {
        nextState.backLink = backLink;
      } else if (routeConfig[backLink]) {
        nextState.backLink = { route: backLink };
      } else {
        nextState.backLink = { href: backLink };
      }
    }

    return nextState ? { pathname, state: nextState } : pathname;
  }, [to, params, state, backLink]);

  return <Redirect {...rest} to={next} />;
};
InternalRedirect.propTypes = {
  to: PropTypes.string.isRequired,
  state: PropTypes.object,
  params: PropTypes.object,
  backLink: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

const RouteRedirect = (props) => {
  const { route, routeParams, ...rest } = props;
  const { url, isInternal } = useRoute(route, routeParams);

  return isInternal ? (
    <InternalRedirect {...rest} to={url} />
  ) : (
    <ExternalRedirect {...rest} href={url} />
  );
};
RouteRedirect.propTypes = {
  route: PropTypes.string.isRequired,
  routeParams: PropTypes.object,
};

const AppRedirect = (props) => {
  const { route, href, to } = props;
  if (route) {
    return <RouteRedirect {...props} />;
  }
  if (to) {
    return <InternalRedirect to={to} {...props} />;
  }
  if (href) {
    return <ExternalRedirect {...props} />;
  }

  return null;
};
AppRedirect.propTypes = {
  route: PropTypes.string,
  href: PropTypes.string,
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};
export default AppRedirect;