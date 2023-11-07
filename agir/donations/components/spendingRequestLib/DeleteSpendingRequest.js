import _ from "gettext";
import PropTypes from "prop-types";
import React, { useCallback, useRef, useState } from "react";

import { getCookie } from "@agir/lib/utils/cookies";

import Button from "@agir/lib/bootstrap/Button";
import ModalConfirmation from "@agir/front/genericComponents/ModalConfirmation";

const DeleteSpendingRequest = ({ deleteUrl }) => {
  const deleteForm = useRef();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleConfirm = useCallback(() => {
    deleteForm.current && deleteForm.current.submit();
  }, []);

  return (
    <>
      <Button bsSize="sm" bsStyle="danger" onClick={handleOpen}>
        <span className="fa fa-trash" />
        &nbsp;{_("Supprimer la demande")}
      </Button>
      <ModalConfirmation
        shouldShow={isOpen}
        onClose={handleClose}
        title={_("Supprimer la demande de dépenses")}
        dismissLabel={_("Annuler")}
        confirmationLabel={_("Supprimer la demande")}
        onConfirm={handleConfirm}
        shouldDismissOnClick
      >
        <form ref={deleteForm} method="post" action={deleteUrl}>
          <input
            type="hidden"
            name="csrfmiddlewaretoken"
            value={getCookie("csrftoken")}
          />
          <p>
           {_(" Confirmez-vous la suppression définitive de cette demande de dépense et de tous les documents associés")}&nbsp;?
          </p>
          <p>{_("Attention")}&nbsp;: {_("cette action est irréversible.")}</p>
        </form>
      </ModalConfirmation>
    </>
  );
};

DeleteSpendingRequest.propTypes = {
  deleteUrl: PropTypes.string,
};

export default DeleteSpendingRequest;
