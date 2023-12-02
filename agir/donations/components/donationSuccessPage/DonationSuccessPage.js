import _ from "gettext";
import React from "react";
import Helmet from "react-helmet";
import { useParams } from "react-router-dom";
import useSWRImmutable from "swr/immutable";

import CONFIG from "@agir/donations/common/config";
import { routeConfig } from "@agir/front/app/routes.config";

import {
  StyledBody,
  StyledIllustration,
  StyledLogo,
  StyledMain,
  StyledPage,
  Theme,
} from "@agir/donations/common/StyledComponents";
import Link from "@agir/front/app/Link";
import PageFadeIn from "@agir/front/genericComponents/PageFadeIn";
import ShareCard from "@agir/front/genericComponents/ShareCard";
import Skeleton from "@agir/front/genericComponents/Skeleton";
import Spacer from "@agir/front/genericComponents/Spacer";

const DonationPage = () => {
  const { data: session } = useSWRImmutable("/api/session/");

  const params = useParams();
  const type =
    params?.type && CONFIG[type] ? params?.type : CONFIG.default.type;
  const config = CONFIG[type];
  const { beneficiary, externalLinkRoute, title, thankYouNote } = config;

  return (
    <Theme type={type}>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <PageFadeIn ready={typeof session !== "undefined"} wait={<Skeleton />}>
        <StyledPage>
          <StyledIllustration aria-hidden="true" />
          <StyledBody>
            <StyledMain>
              <StyledLogo
                alt={`Logo ${beneficiary}`}
                route={externalLinkRoute}
                rel="noopener noreferrer"
                target="_blank"
              />
              <Spacer size="2rem" />
              <div>
                <h2>{_("Merci pour votre don")}&nbsp;!</h2>
                <h4>
                  {_("Vous allez recevoir un e-mail de confirmation dès que votre paiement aura été validé.")}
                </h4>
                <p style={{ fontSize: "0.875rem" }}>
                  {_("Vous pouvez à tout moment consulter vos dons et paiements depuis")}{" "}
                  <Link route="personalPayments">
                    {_("l'onglet &laquo;&nbsp;Dons et paiements&nbsp;&raquo;")}
                  </Link>{" "}
                  {_("de votre espace personnel sur preprod.redmexa.com.")}
                </p>
              </div>
              <Spacer size="2rem" />
              {thankYouNote}
              <Spacer size="3rem" />
              <ShareCard
                title={_("Encouragez vos ami·es à faire un don :")}
                url={routeConfig.donations.getLink({
                  type: params?.type,
                })}
              />
            </StyledMain>
          </StyledBody>
        </StyledPage>
      </PageFadeIn>
    </Theme>
  );
};

export default DonationPage;
