import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import APP_STORE_APPLE from "@agir/front/genericComponents/logos/appstore_apple.svg";
import APP_STORE_GOOGLE from "@agir/front/genericComponents/logos/appstore_google.svg";

export const CONFIG = {
  apple: {
    href: "#",
    title: "Télécharger dans l'App Store",
    $image: APP_STORE_APPLE,
  },
  google: {
    href: "#",
    title: "Disponible sur Google Play",
    $image: APP_STORE_GOOGLE,
  },
};

const AppStoreLink = styled.a`
  display: block;
  width: 170px;
  height: 50px;
  background-image: url(${({ $image }) => $image});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  border-radius: 0.5px;
  cursor: pointer;
`;

const AppStore = (props) => {
  const { type, ...rest } = props;
  const config = CONFIG[type];

  if (!config) {
    return null;
  }

  return <AppStoreLink {...config} {...rest} />;
};

AppStore.propTypes = {
  type: PropTypes.oneOf(Object.keys(CONFIG)).isRequired,
  params: PropTypes.object,
};

export default AppStore;
