import _ from "gettext";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import style from "@agir/front/genericComponents/_variables.scss";
import AppStore from "@agir/front/genericComponents/AppStore";
import Link from "@agir/front/app/Link";
import LogoAPFooter from "@agir/front/genericComponents/LogoAPFooter";
import Spacer from "@agir/front/genericComponents/Spacer";
import FooterBanner from "./FooterBanner";
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
            <LogoAPFooter/>
          </div>
          <div>
            <h3 className="secondaryTextColorLightRed">{/*_("Action populaire")*/}CLAUDIALÍZATE </h3>
            <p>
              <Link className="primaryTextColorPurple" route="eventMap">{_("Carte des événements")}</Link>
              <Link className="primaryTextColorPurple" route="groupMap">{_("Carte des groupes")}</Link>
              <Link className="primaryTextColorPurple" route="materiel" target="_blank">
                {_(" Commander du matériel")}
              </Link>
            </p>
          </div>

          <div>
            <h3 className="secondaryTextColorLightRed">{/*_("Liens utiles")*/} ENLACES ÚTILES</h3>
            <p>
              {isSignedIn ? (
                <Link className="primaryTextColorPurple" route="logout">{_("Se déconnecter")}</Link>
              ) : (
                <Link className="primaryTextColorPurple" route="login">{_("Se connecter")}</Link>
              )}
              <Link className="primaryTextColorPurple" route="help">{_("Besoin d'aide ?")}</Link>
              <Link className="primaryTextColorPurple" route="legal">{_("Mentions légales")}</Link>
              <Link className="primaryTextColorPurple" route="contact">{_("Contact")}</Link>
            </p>
          </div>

          <div>
            <h3 className="secondaryTextColorLightRed">{_("Le programme")}</h3>
            <p>
              <Link className="primaryTextColorPurple" route="nupesPlatform" target="_blank">
                {_("Le programme de la")}{" "}
                <abbr title="Nouvelle Union Populaire Écologique et sociale">
                  {_("NUPES")}
                </abbr>
              </Link>
              <Link className="primaryTextColorPurple" route="programme" target="_blank">
                {_("Le programme l'Avenir en commun")}
              </Link>
            </p>
          </div>

          <div>
            <h3 className="secondaryTextColorLightRed">{/*_("Les autres sites")*/} OTROS SITIOS</h3>
            <p>
              <Link className="primaryTextColorPurple" route="nupes" target="_blank">
                {_("La")}{" "}
                <abbr
                  title={_("Nouvelle Union Populaire Écologique et sociale")}
                >
                  {_("NUPES")}
                </abbr>
              </Link>
              <Link className="primaryTextColorPurple" route="lafranceinsoumise">{_("La France insoumise")}</Link>
              <Link className="primaryTextColorPurple" route="linsoumission">{_("L'insoumission")}</Link>
              <Link className="primaryTextColorPurple" route="jlmBlog">{_("Le blog de Jean-Luc Mélenchon")}</Link>
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
