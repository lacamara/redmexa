import React, { useState, useEffect, useMemo } from "react";

import Button from "@agir/front/genericComponents/Button";
import ShareLink from "@agir/front/genericComponents/ShareLink.js";
import Spacer from "@agir/front/genericComponents/Spacer.js";
import HeaderPanel from "./HeaderPanel";

import { StyledTitle } from "./styledComponents.js";

import { getFinance } from "@agir/groups/groupPage/api.js";
import { useGroup } from "@agir/groups/groupPage/hooks/group.js";

const [GROUP_IS_2022, GROUP_LFI] = ["équipe", "groupe"];

const GroupFinancePage = (props) => {
  const { onBack, illustration, groupPk } = props;

  const [donation, setDonation] = useState(0);

  const group = useGroup(groupPk);
  const is2022 = useMemo(() => group?.is2022, [group]);

  const getFinanceAPI = async () => {
    const res = await getFinance(groupPk);
    setDonation(res.data.donation);
  };

  useEffect(() => {
    getFinanceAPI(groupPk);
  }, [groupPk]);

  return (
    <>
      <HeaderPanel onBack={onBack} illustration={illustration} />

      <StyledTitle>
        Dons alloués aux personnes de mon
        {" " + (is2022 ? GROUP_IS_2022 : GROUP_LFI)}
      </StyledTitle>

      <Spacer size="1rem" />

      <span style={{ fontSize: "2rem" }}>{donation} €</span>

      <Spacer size="1rem" />

      <div>
        {!donation && (
          <>
            Personne n'a encore alloué de dons à vos actions.
            <br />
          </>
        )}
        Vous pouvez allouer des dons à vos actions sur la{" "}
        <a href="/dons/">page de dons</a>.
        <Spacer size="0.5rem" />
        Vous pouvez déjà créer une demande, mais vous ne pourrez la faire
        valider que lorsque votre allocation sera suffisante.
      </div>

      <Spacer size="1rem" />

      <Button as="a" href="/dons/">
        Allouer un don
      </Button>
      <Button as="a" href={`/groupes/${groupPk}/depenses/`} $wrap>
        Je crée une demande de dépense
      </Button>

      <Spacer size="1rem" />

      <StyledTitle>
        Solliciter des dons pour mon
        {" " + (is2022 ? GROUP_IS_2022 : GROUP_LFI)}
      </StyledTitle>

      <span>
        Partagez ce lien pour solliciter des dons pour votre
        {" " + (is2022 ? GROUP_IS_2022 : GROUP_LFI) + " "} :
      </span>

      <ShareLink
        color="primary"
        label="Copier le lien"
        url="https://actionpopulaire.fr/dons/?group=627ff9f0-e53d-478d-91fb-1a22c76a34d0"
      />
    </>
  );
};

export default GroupFinancePage;
