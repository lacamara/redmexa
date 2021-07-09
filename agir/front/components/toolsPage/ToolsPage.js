import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";

import style from "@agir/front/genericComponents/_variables.scss";
import styled from "styled-components";

import { Hide } from "@agir/front/genericComponents/grid";
import Button from "@agir/front/genericComponents/Button";
import Spacer from "@agir/front/genericComponents/Spacer";
import Link from "@agir/front/app/Link";
import { RawFeatherIcon } from "@agir/front/genericComponents/FeatherIcon";

import img_JLM_2022 from "./images/JLM_2022.jpg";
import img_AvenirEnCommun from "./images/AvenirEnCommun.jpg";
import img_Linsoumission from "./images/Linsoumission.jpg";
import img_Comparateur from "./images/Comparateur.jpg";
import bricksNSP from "./images/bricksNSP.svg";

import Footer from "@agir/front/dashboardComponents/Footer";
import Navigation from "@agir/front/dashboardComponents/Navigation";
import nonReactRoutes from "@agir/front/globalContext/nonReactRoutes.config";
import { routeConfig } from "@agir/front/app/routes.config";
import { useIsDesktop } from "@agir/front/genericComponents/grid";
import { useWPPagesAndCategories } from "./api.js";
import { getIsConnected } from "@agir/front/globalContext/reducers";
import { useSelector } from "@agir/front/globalContext/GlobalContext";

const StyledPage = styled.div`
  max-width: 1320px;
  width: 100%;
  margin: 0 auto;
  padding: 0rem 1.5rem;

  @media (max-width: ${style.collapse}px) {
    padding: 0 20px;
  }
`;

const IndexLinkAnchor = styled(Link)`
  font-weight: 600;
  font-size: 12px;
  line-height: 1.4;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  margin: 2.5rem 1rem 1.5rem;

  & {
    text-decoration: none;
    color: #585858;
  }

  &:hover,
  &:focus,
  &:active {
    text-decoration: none;
    color: #333;
  }

  svg {
    height: 16px;
  }
`;

const BlockTitle = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  margin-top: 40px;

  > div:first-child {
    display: flex;
    align-items: center;
  }

  ${RawFeatherIcon} {
    margin-right: 6px;
  }
`;

const BlockContent = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 26px;

  @media (max-width: ${style.collapse}px) {
    font-size: 20px;
    font-weight: 600;
  }
`;

const Subtitle = styled.div`
  font-weight: 600;
  font-size: 1rem;
  margin: 20px 0;
`;

const StyledButton = styled(Button)`
  font-size: 1rem;
  font-weight: 500;
  border-radius: ${(props) => props.theme.borderRadius};

  ${RawFeatherIcon} {
    margin-left: 4px;
  }
`;

const ItemActionContainer = styled.div`
  box-shadow: 0px 0px 2px rgb(0 0 0 / 50%), 0px 3px 3px rgb(0 35 44 / 10%);
  border-radius: ${(props) => props.theme.borderRadius};
  overflow: hidden;
  width: 340px;
  display: inline-flex;
  flex-direction: column;
  color: ${style.black1000};

  > div:first-child {
    ${({ img }) => `
      background-image: url(${img});
      background-position: center;
      background-size: cover;
      height: 190px;
    `}
    margin-left: 1px;
  }

  > div:last-child {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    height: 82px;
    overflow: hidden;
    padding: 6px 16px;
  }
`;

const StyledLink = styled(Link)`
  margin-right: 1.5rem;
  margin-bottom: 2px;
  margin-top: 1px;
`;

const CarrouselArrowContainer = styled.div`
  z-index: 5;
  background: linear-gradient(
    270deg,
    rgba(0, 10, 44, 0.75) -34.62%,
    rgba(79, 79, 79, 0.627155) 21.79%,
    rgba(79, 79, 79, 0.365386) 47.12%,
    rgba(79, 79, 79, 0) 94.23%
  );
  ${({ toRight }) =>
    toRight
      ? `
  right: 0px;
  `
      : `
  left: 0px;
  transform: rotate(-180deg);
  `};

  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0px;
  height: 100%;
  width: 80px;
  cursor: pointer;

  ${RawFeatherIcon} {
    color: white;
  }

  @media (max-width: ${style.collapse}px) {
    display: none;
  }
`;

const ListItemActionContainer = styled.div`
  display: flex;
  position: relative;
  max-width: 100%;
  overflow-x: auto;

  @media (min-width: ${style.collapse}px) {
    overflow-y: hidden;
    overflow: hidden;
  }
`;

const Carrousel = styled.div`
  display: flex;
  position: relative;
  max-width: 100%;
  overflow-x: auto;

  @media (min-width: ${style.collapse}px) {
    overflow-y: hidden;
    overflow: hidden;
  }

  > a:first-child {
    margin-left: 1px;
  }
`;

const ItemWebsiteContainer = styled.div`
  display: inline-flex;
  height: 65px;
  max-width: 388px;
  width: 100%;
  border-radius: ${(props) => props.theme.borderRadius};
  box-shadow: 0px 0px 2px rgb(0 0 0 / 50%), 0px 3px 3px rgb(0 35 44 / 10%);
  margin-right: 1.5rem;
  margin-bottom: 1rem;
  overflow: hidden;
  color: ${style.black1000};

  > div:first-child {
    div {
      width: 113px;
      height: 100%;
      ${({ img }) => `
        background-image: url(${img});
        background-position: center;
        background-size: cover;
      `}
    }
  }

  > div:last-child {
    align-items: center;
    display: flex;

    justify-content: space-between;
    flex-grow: 1;
    padding: 20px;
  }
`;

const BannerTool = styled.div`
  width: 100%;
  height: 138px;
  background-color: ${style.primary500};
  color: white;
  font-size: 48px;
  font-weight: 700;
  padding: 42px;
  margin-bottom: 48px;
  overflow: hidden;
  position: relative;
  border-radius: ${(props) => props.theme.borderRadius};

  ::before {
    content: "Outils";
  }

  ::after {
    content: "";
    top: 50px;
    right: -64px;
    width: 600px;
    height: 170px;
    position: absolute;
    background-color: ${style.redNSP};
    transform: rotate(-6deg);
  }
`;

const BannerHelpContainer = styled.div`
  width: 100%;
  background-color: ${style.secondary100};
  font-size: 20px;
  font-weight: 700;
  overflow: hidden;
  position: relative;
  border-radius: ${(props) => props.theme.borderRadius};
  padding: 47px;

  @media (max-width: ${style.collapse}px) {
    padding: 24px;
  }

  ::after {
    content: url(${bricksNSP});
    position: absolute;
    right: -232px;
    top: -485px;

    @media (max-width: ${style.collapse}px) {
      right: -465px;
      top: -460px;
      transform: scale(0.5);
    }
  }
`;

export const WEBSITES = [
  {
    title: "Mélenchon 2022",
    img: img_JLM_2022,
    href: nonReactRoutes.jlm2022,
  },
  {
    title: "L'avenir en commun",
    img: img_AvenirEnCommun,
    href: nonReactRoutes.programme,
  },
  {
    title: "L'insoumission",
    img: img_Linsoumission,
    href: nonReactRoutes.linsoumission,
  },
  {
    title: "Comparateur de programme",
    img: img_Comparateur,
    href: nonReactRoutes.comparateur,
  },
];

const LinkInfoAction = () => (
  <StyledButton
    small
    as="Link"
    color="secondary"
    href="https://materiel.lafranceinsoumise.fr/"
    target="_blank"
    $wrap
  >
    Accéder aux fiches pratiques
    <RawFeatherIcon
      name="arrow-up-right"
      color={style.black1000}
      width="1.25rem"
    />
  </StyledButton>
);

const LinkMaterial = () => (
  <StyledButton
    small
    as="Link"
    color="secondary"
    href="https://materiel.lafranceinsoumise.fr/"
    target="_blank"
    $wrap
  >
    Accéder au site matériel
    <RawFeatherIcon
      name="arrow-up-right"
      color={style.black1000}
      width="1.25rem"
    />
  </StyledButton>
);

const BannerHelp = () => (
  <BannerHelpContainer>
    <span style={{ zIndex: 2, position: "relative" }}>
      Une question&nbsp;? Un&nbsp;problème&nbsp;?
      Pas&nbsp;de&nbsp;panique&nbsp;!
    </span>
    <br />
    <Spacer size="30px" />
    <StyledButton
      small
      as="Link"
      color="secondary"
      href="https://infos.actionpopulaire.fr"
      target="_blank"
      $wrap
      style={{ zIndex: 2, position: "relative" }}
    >
      Accéder au centre d'aide
      <RawFeatherIcon
        name="arrow-up-right"
        color={style.black1000}
        width="1.25rem"
      />
    </StyledButton>
  </BannerHelpContainer>
);

export const ItemAction = ({ image, title, href }) => {
  return (
    <StyledLink href={href}>
      <ItemActionContainer img={image}>
        <div />
        <div dangerouslySetInnerHTML={{ __html: title }}></div>
      </ItemActionContainer>
    </StyledLink>
  );
};
ItemAction.propTypes = {
  title: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};

export const ListItemAction = ({ pages }) => {
  const containerRef = useRef(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);
  const [isUpdateCarrousel, setUpdateCarrousel] = useState(true);

  const updateCarrousel = () => {
    const containerSize = containerRef.current?.offsetWidth;
    const children = containerRef.current.querySelectorAll("a");
    const childrenSize = Array.from(children).reduce(
      (size, element) => size + element.offsetWidth,
      0
    );
    const scrollLeft = containerRef.current.scrollLeft;

    if (childrenSize <= containerSize) {
      setShowLeftScroll(false);
      setShowRightScroll(false);
      return;
    }

    if (scrollLeft <= 0) {
      setShowLeftScroll(false);
      setShowRightScroll(true);
      return;
    }
    if (scrollLeft + containerSize >= childrenSize) {
      setShowLeftScroll(true);
      setShowRightScroll(false);
      return;
    }

    if (scrollLeft > 0) setShowLeftScroll(true);
    if (scrollLeft + containerSize < childrenSize) setShowRightScroll(true);
  };

  const handleScroll = (direction) => {
    const containerSize = containerRef.current?.offsetWidth;
    let position = containerRef.current.scrollLeft - containerSize;
    if (direction == "right")
      position = containerRef.current.scrollLeft + containerSize;
    containerRef.current.scrollTo({
      top: 0,
      left: position,
      behavior: "smooth",
    });
    setUpdateCarrousel(true);
  };

  const CarrouselArrow = ({ direction }) => (
    <CarrouselArrowContainer
      toRight={direction === "right"}
      onClick={() => handleScroll(direction)}
    >
      <RawFeatherIcon name="chevron-right" />
    </CarrouselArrowContainer>
  );

  useEffect(() => {
    let timeout;
    if (isUpdateCarrousel) {
      timeout = setTimeout(() => {
        updateCarrousel();
        setUpdateCarrousel(false);
      }, 600);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [pages, isUpdateCarrousel, containerRef]);

  if (!pages) return null;

  return (
    <ListItemActionContainer>
      {showLeftScroll && <CarrouselArrow direction="left" />}

      <Carrousel ref={containerRef}>
        {pages?.map((page, id) => (
          <ItemAction
            key={id}
            image={page.img}
            title={page.title}
            href={page.link}
          />
        ))}
      </Carrousel>

      {showRightScroll && <CarrouselArrow direction="right" />}
    </ListItemActionContainer>
  );
};
ListItemAction.propTypes = {
  pages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      img: PropTypes.string,
      link: PropTypes.string,
      category_id: PropTypes.number,
      category_name: PropTypes.string,
    })
  ),
};

export const ItemWebsite = ({ img, href, title }) => (
  <Link href={href}>
    <ItemWebsiteContainer img={img}>
      {/* <div /> */}
      <div>
        <div />
      </div>
      <div>
        <div>{title}</div>
        <div>
          <RawFeatherIcon
            name="arrow-right"
            color={style.black1000}
            width="1.25rem"
          />
        </div>
      </div>
    </ItemWebsiteContainer>
  </Link>
);
ItemWebsite.propTypes = {
  title: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
};

const ToolsPage = () => {
  const isDesktop = useIsDesktop();
  const [categories, pages] = useWPPagesAndCategories();
  const isConnected = useSelector(getIsConnected);

  return (
    <StyledPage>
      <Helmet>
        <title>Outils - Action Populaire</title>
      </Helmet>
      <div>
        {isConnected && (
          <Hide under>
            <IndexLinkAnchor route="events">
              <RawFeatherIcon name="arrow-left" /> &nbsp; Liste des événements
            </IndexLinkAnchor>
          </Hide>
        )}

        <Hide under>
          <BannerTool />
        </Hide>

        {/* TO ADD LATER :
        <BlockTitle>
        <div>
          <RawFeatherIcon name="shopping-bag" color={style.black1000} />
          <Title>Commandez du matériel</Title>
        </div>

        <Hide under>
          <LinkMaterial />
        </Hide>
      </BlockTitle>

      <BlockContent></BlockContent>

      <Hide over>
        <LinkMaterial />
        <hr />
      </Hide> */}

        <BlockTitle>
          <div>
            <RawFeatherIcon name="book-open" color={style.black1000} />
            <Title>Se former à l'action</Title>
          </div>

          <Hide under>
            <LinkInfoAction />
          </Hide>
        </BlockTitle>

        <BlockContent>
          {categories.map((category) => (
            <React.Fragment key={category.id}>
              <Subtitle>{category.name}</Subtitle>
              <ListItemAction pages={pages[category.id]} />
            </React.Fragment>
          ))}
        </BlockContent>

        <Hide over>
          <LinkInfoAction />
        </Hide>

        <Hide over>
          <hr />
        </Hide>

        <BlockTitle>
          <div>
            <RawFeatherIcon name="mouse-pointer" color={style.black1000} />
            <Title>Je m'informe en ligne</Title>
          </div>
        </BlockTitle>

        <BlockContent>
          {WEBSITES.map((w, id) => (
            <ItemWebsite key={id} img={w.img} href={w.href} title={w.title} />
          ))}
        </BlockContent>

        <Hide over>
          <hr />
        </Hide>

        <BlockTitle>
          <div>
            <RawFeatherIcon name="help-circle" color={style.black1000} />
            <Title>Besoin d'aide ?</Title>
          </div>
        </BlockTitle>

        <BannerHelp />

        <Spacer size="30px" />

        {!isDesktop && <Navigation active={routeConfig.tools.id} />}

        <Footer />
      </div>
    </StyledPage>
  );
};

export default ToolsPage;
