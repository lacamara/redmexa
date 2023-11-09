import _ from "gettext";
import PropTypes from "prop-types";
import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";

import { Button } from "@agir/donations/common/StyledComponents";
import AmountField from "@agir/donations/spendingRequest/common/AmountField";
import BankAccountField from "@agir/donations/spendingRequest/common/BankAccountField";
import CategoryField from "@agir/donations/spendingRequest/common/CategoryField";
import ContactField from "@agir/donations/spendingRequest/common/ContactField";
import EventField from "@agir/donations/spendingRequest/common/EventField";
import AgreementField from "@agir/donations/spendingRequest/common/SpendingRequestAgreement";
import AppRedirect from "@agir/front/app/Redirect";
import DateTimeField from "@agir/front/formComponents/DateTimeField";
import RadioField from "@agir/front/formComponents/RadioField";
import TextField from "@agir/front/formComponents/TextField";
import Spacer from "@agir/front/genericComponents/Spacer";
import Steps, { useSteps } from "@agir/front/genericComponents/Steps";
import { Hide } from "@agir/front/genericComponents/grid";

import { updateSpendingRequest } from "@agir/donations/spendingRequest/common/api";
import {
  TIMING_OPTIONS,
  getInitialDataFromSpendingRequest,
  validateSpendingRequest,
} from "@agir/donations/spendingRequest/common/form.config";

const FORM_STEP_NAMES = [
  "Détails",
  "Montant et financement",
  "Coordonnées bancaires",
  "Finalisation",
];

const FORM_STEPS = [
  [
    "comment",
    "timing",
    "title",
    "campaign",
    "category",
    "explanation",
    "event",
    "spendingDate",
    "contact",
  ],
  ["amount"],
  ["bankAccount"],
  ["agreement", "global"],
];

const timingOptions = Object.values(TIMING_OPTIONS);

const StyledLabel = styled.h6`
  font-size: 1.375rem;
  font-weight: 700;
  margin: 0 0 1.5rem;

  @media (max-width: ${(props) => props.theme.collapse}px) {
    font-size: 1.125rem;
    margin: 0 0 1rem;
  }
`;

const StyledGlobalError = styled.p`
  padding: 1rem 0 0;
  margin: 0;
  font-size: 1rem;
  color: ${(props) => props.theme.redNSP};
  text-align: center;

  strong {
    font-weight: 600;
  }

  small {
    display: block;
    font-size: 0.875rem;
  }
`;

const StyledFieldset = styled.fieldset`
  padding: 2rem;
  box-shadow: ${(props) => props.theme.cardShadow};
  border-radius: ${(props) => props.theme.borderRadius};

  @media (max-width: ${(props) => props.theme.collapse}px) {
    padding: 0;
    box-shadow: none;
    border-radius: 0;
  }
`;

export const getFieldStepFromErrors = (errors) =>
  FORM_STEPS.findIndex(
    (stepFields) =>
      stepFields.length > 0 &&
      stepFields.some((field) => typeof errors[field] !== "undefined"),
  );

const EditSpendingRequestForm = (props) => {
  const { spendingRequest, availableAmount = 0, onUpdate } = props;

  const spendingRequestPk = spendingRequest.id;
  const initialData = useMemo(
    () => getInitialDataFromSpendingRequest(spendingRequest),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [formStep, goToPreviousFormStep, goToNextFormStep, goToStep] =
    useSteps(0);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState(null);
  const [hasAgreement, setHasAgreement] = useState();
  const [isUpdated, setIsUpdated] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setErrors((state) => ({
      ...state,
      [name]: undefined,
    }));
    setData((state) => ({
      ...state,
      [name]: value,
    }));
  }, []);

  const handleChangeNested = useCallback((name, prop, value) => {
    setErrors((state) => ({
      ...state,
      [name]: {
        ...((state && state[name]) || {}),
        [prop]: undefined,
      },
    }));
    setData((state) => ({
      ...state,
      [name]: {
        ...((state && state[name]) || {}),
        [prop]: value,
      },
    }));
  }, []);

  const handleChangeTiming = useCallback((value) => {
    setErrors((state) => ({
      ...state,
      timing: undefined,
    }));
    setData((state) => ({
      ...state,
      timing: value,
    }));
  }, []);

  const handleChangeCategory = useCallback((value) => {
    setErrors((state) => ({
      ...state,
      category: undefined,
    }));
    setData((state) => ({
      ...state,
      category: value,
    }));
  }, []);

  const handleChangeEvent = useCallback((value) => {
    setErrors((state) => ({
      ...state,
      event: undefined,
    }));
    setData((state) => ({
      ...state,
      event: value,
    }));
  }, []);

  const handleChangeSpendingDate = useCallback((value) => {
    setErrors((state) => ({
      ...state,
      spendingDate: undefined,
    }));
    setData((state) => ({
      ...state,
      spendingDate: value ? value.split("T")[0] : value,
    }));
  }, []);

  const handleChangeAmount = useCallback((amount) => {
    setErrors((state) => ({
      ...state,
      amount: undefined,
    }));
    setData((state) => ({
      ...state,
      amount,
    }));
  }, []);

  const handleErrors = useCallback(
    (errors) => {
      errors = typeof errors === "string" ? { global: errors } : errors;
      setErrors(errors);
      const fieldStep = getFieldStepFromErrors(errors);
      if (
        typeof fieldStep === "number" &&
        fieldStep >= 0 &&
        fieldStep !== formStep
      ) {
        goToStep(fieldStep);
      }
    },
    [formStep, goToStep],
  );

  const saveRequest = useCallback(
    async (shouldValidate = false) => {
      const validationErrors = validateSpendingRequest(
        data,
        shouldValidate,
        false,
      );
      if (validationErrors) {
        return handleErrors(validationErrors);
      }
      setErrors(null);
      setIsLoading(true);
      const response = await updateSpendingRequest(
        spendingRequestPk,
        data,
        shouldValidate,
      );
      if (response.error) {
        handleErrors(response.error);
      } else {
        onUpdate();
        setIsUpdated(true);
      }
      setIsLoading(false);
    },
    [spendingRequestPk, data, handleErrors, onUpdate],
  );

  const handleSave = useCallback(
    async (e) => {
      e.preventDefault();
      saveRequest(false);
    },
    [saveRequest],
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      saveRequest(true);
    },
    [saveRequest],
  );

  const hasChanged = data !== initialData;
  const globalError = errors?.global || errors?.detail;

  if (isUpdated) {
    return (
      <AppRedirect
        route="spendingRequestDetails"
        routeParams={{ spendingRequestPk }}
        toast={_("La demande a bien été mise à jour")}
      />
    );
  }

  return (
    <Steps
      as="form"
      type="index"
      stepNames={FORM_STEP_NAMES}
      onSave={handleSave}
      onSubmit={handleSubmit}
      submitLabel={spendingRequest.status.action}
      isLoading={isLoading}
      disabled={!hasAgreement}
      saveDisabled={!hasChanged}
      step={formStep}
      goToPrevious={goToPreviousFormStep}
      goToNext={goToNextFormStep}
      goToStep={goToStep}
    >
      <StyledFieldset style={{ margin: 0 }}>
        <Hide
          $over
          as={Button}
          wrap
          link
          color="link"
          icon="arrow-right"
          route="spendingRequestHelp"
          style={{ textAlign: "left" }}
        >
          {_("Un doute ? Consultez le centre d'aide")}
        </Hide>
        <Hide $under as={StyledLabel}>
          {_("Détails (obligatoire)")}
        </Hide>
        <RadioField
          autoFocus
          disabled={isLoading}
          id="timing"
          name="timing"
          value={data.timing}
          onChange={handleChangeTiming}
          label=""
          options={timingOptions}
        />
        <Spacer size="2rem" />
        <TextField
          disabled={isLoading}
          id="title"
          name="title"
          value={data.title}
          onChange={handleChange}
          error={errors?.title}
          label={_("Titre de la dépense (obligatoire)")}
          maxLength={200}
          hasCounter={false}
        />
        <Spacer size="2rem" />
        <StyledLabel>{_("Catégorie de dépense (obligatoire)")}</StyledLabel>
        <CategoryField
          disabled={isLoading}
          id="category"
          name="category"
          value={data.category}
          onChange={handleChangeCategory}
          error={errors?.category}
          label=""
        />
        <Spacer size="1.5rem" />
        <TextField
          disabled={isLoading}
          id="explanation"
          name="explanation"
          value={data.explanation}
          onChange={handleChange}
          error={errors?.explanation}
          label={_("Motif de l'achat (obligatoire)")}
          textArea
          rows={3}
          maxLength={1500}
          hasCounter
        />
        <Spacer size="1.5rem" />
        <EventField
          disabled={isLoading}
          groupPk={data.group}
          id="event"
          name="event"
          value={data.event}
          onChange={handleChangeEvent}
          error={errors?.event}
          label={_("Événement lié à la dépense")}
        />
        <Spacer size="1.5rem" />
        <DateTimeField
          type="date"
          disabled={isLoading}
          id="spendingDate"
          name="spendingDate"
          value={data.spendingDate}
          onChange={handleChangeSpendingDate}
          error={errors?.spendingDate}
          label={_("Date de l'achat (obligatoire)")}
        />
        <Spacer size="1.5rem" />
        <ContactField
          id="contact"
          name="contact"
          disabled={isLoading}
          value={data.contact}
          onChange={handleChangeNested}
          error={errors?.contact}
        />
      </StyledFieldset>
      <StyledFieldset>
        <Hide $under as={StyledLabel}>
          {_("Montant et financement (obligatoire)")}
        </Hide>
        <AmountField
          value={data.amount}
          onChange={handleChangeAmount}
          error={errors?.amount}
          disabled={isLoading}
          availableAmount={availableAmount}
        />
      </StyledFieldset>
      <StyledFieldset>
        <Hide $under as={StyledLabel}>
          {_("Coordonnées bancaires (obligatoire)")}
        </Hide>
        <BankAccountField
          id="bankAccount"
          name="bankAccount"
          value={data.bankAccount}
          onChange={handleChangeNested}
          error={errors?.bankAccount}
        />
      </StyledFieldset>
      <StyledFieldset>
        <StyledLabel>{_("Validation (obligatoire)")}</StyledLabel>
        <AgreementField
          initialValue={hasAgreement}
          onChange={setHasAgreement}
          disabled={isLoading}
        />
        {globalError && (
          <StyledGlobalError>
            {Array.isArray(globalError) ? globalError[0] : globalError}
          </StyledGlobalError>
        )}
        {errors?.attachments && (
          <StyledGlobalError>
            <strong>
              {_("La demande n'a pas pu être validée car aucune pièce justificative n'a été jointe.")}
            </strong>
            <small>
              {_("Vous pouvez sauvegarder vos modifications en cliquant sur le bouton")} &laquo;&nbsp;
              <em>{_("Enregistrer")}</em>
              &nbsp;&raquo;.
              <br />
              {_("Vous pourrez ensuite ajouter les pièces nécessaires puis valider la demande directement depuis la page de détail.")}
            </small>
          </StyledGlobalError>
        )}
      </StyledFieldset>
    </Steps>
  );
};

EditSpendingRequestForm.propTypes = {
  spendingRequest: PropTypes.object,
  availableAmount: PropTypes.number,
  onUpdate: PropTypes.func,
};

export default EditSpendingRequestForm;
