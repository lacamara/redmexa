import _ from "gettext";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

import { getIconDataUrl } from "@agir/front/genericComponents/Button/utils";
import Button from "@agir/front/genericComponents/Button";
import { RawFeatherIcon } from "@agir/front/genericComponents/FeatherIcon";
import { useResponsiveMemo } from "@agir/front/genericComponents/grid";
import { useImageLoad } from "@agir/lib/utils/hooks";

import logoSmall from "@agir/events/TokTok/images/TokTok.svg";
import bannerBGSmall from "@agir/events/TokTok/images/TokTokBannerBGSmall.jpg";
import logoLarge from "@agir/events/TokTok/images/TokTokLogoLarge.jpg";
import bannerBGLarge from "@agir/events/TokTok/images/TokTokBannerBGLarge.jpg";

const StyledBanner = styled.header`
  width: 100%;
  height: 166px;
  background-image: url(${logoSmall}), url(${bannerBGSmall});
  background-size:
    auto 76px,
    cover;
  background-position: center center;
  background-repeat: no-repeat;
  opacity: ${({ $isReady }) => ($isReady ? 1 : 0)};
  transition: opacity 300ms ease-in;

  @media (min-width: ${(props) => props.theme.collapse}px) {
    height: 191px;
    background-image: url(${logoLarge}), url(${bannerBGLarge});
    background-size:
      680px 158px,
      cover;
    background-position: bottom center;
  }
`;

export const Banner = (props) => {
  const bg = useResponsiveMemo(logoSmall, logoLarge);
  const bgSea = useResponsiveMemo(bannerBGSmall, bannerBGLarge);
  const bgReady = useImageLoad(bg);
  const bgSeaReady = useImageLoad(bgSea);

  return <StyledBanner {...props} $isReady={!!bgReady && !!bgSeaReady} />;
};

export const BackButton = styled(Button).attrs((props) => ({
  ...props,
  icon: "arrow-left",
  children: props.children || "Retour",
}))`
  &,
  &:hover,
  &:focus,
  &:active {
    font-size: 0.75rem;
    font-weight: 600;
    line-height: 1.7;
    text-transform: uppercase;
    padding-left: 0;
    padding-right: 0;
    color: #585858;
    background-color: transparent;
    border-color: transparent;
  }

  &[disabled],
  &[disabled]:hover,
  &[disabled]:focus,
  &[disabled]:active {
    opacity: 0.75;
    text-decoration: none;
    cursor: default;
  }

  &:hover,
  &:focus,
  &:active {
    text-decoration: underline;
  }

  &:before {
    background-image: ${getIconDataUrl({ color: "#585858" })};
  }

  @media (max-width: ${(props) => props.theme.collapse}px) {
    display: none;
  }
`;

export const PageContent = styled.main`
  margin: 0 auto;
  max-width: 680px;
  padding: 0 3.25rem 3.5rem;

  @media (max-width: ${(props) => props.theme.collapse}px) {
    padding: 1.5rem;
  }

  h2 {
    font-size: 1.625rem;
    line-height: 1.5;
    font-weight: 700;
    margin: 0 0 1.5rem;

    @media (max-width: ${(props) => props.theme.collapse}px) {
      font-size: 1.25rem;
    }
  }
`;

export const GroupCreationWarning = styled.div.attrs(() => ({
  children: (
    <>
      <RawFeatherIcon name="alert-triangle" />
      <p>
        <strong>{_("Vous n’êtes pas gestionnaire d’un groupe d’action.")}</strong>{" "}
        {_("Créez un groupe d’action ou devenez gestionnaire d’un groupe existant pour indiquer les portes auxquelles vous avez toqué")}
      </p>
    </>
  ),
}))`
  display: flex;
  padding: 1rem;
  box-shadow: ${(props) => props.theme.cardShadow};
  gap: 1rem;
  align-items: flex-start;
  border-radius: ${(props) => props.theme.borderRadius};

  ${RawFeatherIcon} {
    flex: 0 0 auto;
  }

  p {
    flex: 1 1 auto;
    font-size: 0.875rem;
    line-height: 1.5;
    font-weight: 400;

    strong {
      font-weight: 600;
    }
  }
`;
