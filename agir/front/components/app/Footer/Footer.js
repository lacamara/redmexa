import _ from "gettext";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import style from "@agir/front/genericComponents/_variables.scss";
import AppStore from "@agir/front/genericComponents/AppStore";
import Link from "@agir/front/app/Link";
import Spacer from "@agir/front/genericComponents/Spacer";
import FooterBanner from "./FooterBanner";
import LogoAPFoot from "../../genericComponents/LogoAPFoot";
const StyledAppStore = styled(AppStore)``;
const StyledFooter = styled.div`
  width: 100%;
  background-color: ${style.white};
  border-top: 1px solid ${style.black100};

  article {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    color: ${style.black1000};
    margin: 0 auto;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    align-items: stretch;
    padding: 60px 1.5rem;
    gap: 1rem;

    @media (max-width: ${style.collapse}px) {
      flex-flow: column nowrap;
      width: 100%;
      padding: 1.5rem 1.5rem 0;
    }

    & > div {
      padding: 20px 0;
      color: inherit;

      @media (min-width: ${style.collapse}px) {
        flex: 0 1 auto;
        min-width: 110px;

        &:first-child {
          min-width: 0;
          flex: 0 0 auto;
        }

        &:last-child {
          min-width: 0;
          flex-basis: 170px;

          ${StyledAppStore} {
            width: 100%;
            background-size: contain;
            background-position: top center;
          }
        }
      }

      @media (max-width: ${style.collapse}px) {
        flex: 0 0 auto;

        &:first-child {
          display: none;
        }
      }

      img {
        width: 100%;
        height: auto;

        @media (max-width: ${style.collapse}px) {
          width: 125px;
          height: 62px;
        }
        background-color: ${style.white};
      }

      h3 {
        color: ${style.primary500};
        text-transform: uppercase;
        margin-top: 0;
        margin-bottom: 0.75rem;
        font-size: 12px;
        font-weight: bold;
      }

      p {
        color: inherit;
        font-weight: 400;
        font-size: 13px;

        a {
          display: block;
          color: inherit;
          margin-bottom: 0.75rem;
        }
      }
    }
  }
`;

const FooterWrapper = styled.footer`
  @media (max-width: ${style.collapse}px) {
    padding-bottom: 72px;
  }
`;

export const Footer = (props) => {
  const { isSignedIn, hasBanner, isMobileApp } = props;

  return (
    <FooterWrapper>
      {hasBanner && <FooterBanner />}
      <StyledFooter>
        <article>
          <div>
            <LogoAPFoot/>
          </div>
          <div>
            <h3 className="secondaryTextColorLightRed">CLAUDIALÍZATE</h3>
            <p>
              <Link className="primaryTextColorPurple" route="eventMap">{_("Carte des événements")}</Link>
              <Link className="primaryTextColorPurple" route="groupMap">{_("Carte des groupes")}</Link>
              <Link
                className="primaryTextColorPurple"
                route="materiel"
                target="_blank"
              >
                {"Bajar material"}
              </Link>
            </p>
          </div>

          <div>
            <h3 className="secondaryTextColorLightRed">ENLACES ÚTILES</h3>
            <p>
              {isSignedIn ? (
                <Link className="primaryTextColorPurple" route="logout">{_("Se déconnecter")}</Link>
              ) : (
                <Link className="primaryTextColorPurple" route="login">{_("Se connecter")}</Link>
              )}
              <Link className="primaryTextColorPurple" route="help">{/*_("Besoin d'aide ?")*/}Ayuda</Link>
              <Link className="primaryTextColorPurple" route="legal">{/*_("Mentions légales")*/}Aviso legal</Link>
              <Link className="primaryTextColorPurple" route="contact">{_("Contact")}</Link>
            </p>
          </div>

          {/*<div>
            <h3 className="secondaryTextColorLightRed">EL PROGRAMA</h3>
            <p>
              {/*<Link className="primaryTextColorPurple" route="nupesPlatform" target="_blank">
                El programa de la{" "}
                <abbr title="Nouvelle Union Populaire Écologique et sociale">
                  4T
                </abbr>
              </Link>
              <Link className="primaryTextColorPurple" route="programme" target="_blank">
                 La visión de Claudia
              </Link>
            </p>
              </div> */}

          <div>
            <h3 className="secondaryTextColorLightRed">OTROS SITIOS</h3>
            <p>
              {/*<Link className="primaryTextColorPurple" route="nupes" target="_blank">
               {" "}
                <abbr
                  title="Claudializate"
                >
                  Claudialízate
                </abbr>
              </Link>
              <Link className="primaryTextColorPurple" route="lafranceinsoumise">Morena</Link>
              <Link className="primaryTextColorPurple" route="linsoumission">Youtube</Link>*/}
              <Link className="primaryTextColorPurple" route="jlmBlog">TikTok</Link>
            </p>
          </div>

          {!isMobileApp && (
            <div>
              <StyledAppStore type="apple" />
              <Spacer size="10px" />
              <StyledAppStore type="google" />
            </div>
          )}
        </article>
      </StyledFooter>
    </FooterWrapper>
  );
};
Footer.propTypes = {
  isSignedIn: PropTypes.bool,
  hasBanner: PropTypes.bool,
  isMobileApp: PropTypes.bool,
};

export default Footer;
