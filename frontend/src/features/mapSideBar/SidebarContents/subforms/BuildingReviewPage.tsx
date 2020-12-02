import './LandReviewPage.scss';

import {
  FastSelect,
  FastInput,
  Input,
  TextArea,
  InputGroup,
  SelectOptions,
  FastDatePicker,
  Check,
  AutoCompleteText,
  FastCurrencyInput,
} from 'components/common/form';
import React, { useCallback, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useFormikContext } from 'formik';
import { Label } from 'components/common/Label';
import { FaEdit } from 'react-icons/fa';
import { BuildingSvg } from 'components/common/Icons';
import AddressForm from 'features/properties/components/forms/subforms/AddressForm';
import { noop } from 'lodash';

interface IReviewProps {
  nameSpace?: string;
  classifications: any;
  predominateUses: SelectOptions;
  constructionType: SelectOptions;
  occupantTypes: SelectOptions;
  agencies: any;
}

export const BuildingReviewPage: React.FC<any> = (props: IReviewProps) => {
  const defaultEditValues = {
    identification: true,
    tenancy: true,
    valuation: true,
  };
  const [editInfo, setEditInfo] = useState(defaultEditValues);
  const withNameSpace: Function = useCallback(
    (fieldName: string) => {
      return props.nameSpace ? `${props.nameSpace}.${fieldName}` : fieldName;
    },
    [props.nameSpace],
  );
  const formikProps = useFormikContext();

  return (
    <Container className="review-section">
      <Row className="review-steps">
        <h4>Review your building info</h4>
        <p>
          Please review the information you have entered. You can edit it by clicking on the edit
          icon for each section. When you are satisfied that the information provided is correct,
          click the submit button to save this information to the PIMS inventory.
        </p>
      </Row>
      <Row noGutters>
        <Col md={6}>
          <Row>
            <div className="identification">
              <Row className="section-header">
                <span>
                  <BuildingSvg className="svg" />
                  <h5>Building Identification</h5>
                </span>
                <FaEdit
                  size={20}
                  className="edit"
                  onClick={() =>
                    setEditInfo({ ...defaultEditValues, identification: !editInfo.identification })
                  }
                />
              </Row>
              <Row className="content-item">
                <Label>Agency</Label>
                <AutoCompleteText
                  field={withNameSpace('agencyId')}
                  options={props.agencies}
                  disabled={editInfo.identification}
                />
              </Row>
              <Row className="content-item">
                <Label>Building Name</Label>
                <Input disabled={editInfo.identification} field={withNameSpace('name')} />
              </Row>
              <Row className="content-item">
                <Label>Description</Label>
                <TextArea disabled={editInfo.identification} field={withNameSpace('description')} />
              </Row>

              <AddressForm
                onGeocoderChange={noop}
                {...formikProps}
                disabled={editInfo.identification}
                nameSpace={withNameSpace('address')}
              />
              <br></br>
              <Row className="content-item">
                <Label>Latitude</Label>
                <FastInput
                  className="input-medium"
                  displayErrorTooltips
                  formikProps={formikProps}
                  disabled={editInfo.identification}
                  type="number"
                  field={withNameSpace('latitude')}
                />
              </Row>
              <Row className="content-item">
                <Label>Longitude</Label>
                <FastInput
                  className="input-medium"
                  displayErrorTooltips
                  formikProps={formikProps}
                  disabled={editInfo.identification}
                  type="number"
                  field={withNameSpace('longitude')}
                />
              </Row>
              <br></br>
              <Row className="content-item">
                <Label>Main Usage</Label>
                <FastSelect
                  formikProps={formikProps}
                  disabled={editInfo.identification}
                  placeholder="Must Select One"
                  field={withNameSpace('buildingPredominateUseId')}
                  type="number"
                  options={props.predominateUses}
                />
              </Row>
              <Row className="content-item">
                <Label>Type of Construction</Label>
                <FastSelect
                  formikProps={formikProps}
                  disabled={editInfo.identification}
                  placeholder="Must Select One"
                  field={withNameSpace('buildingConstructionTypeId')}
                  type="number"
                  options={props.constructionType}
                />
              </Row>
              <Row className="content-item">
                <Label>Number of Floors</Label>
                <FastInput
                  displayErrorTooltips
                  className="input-small"
                  formikProps={formikProps}
                  disabled={editInfo.identification}
                  field={withNameSpace('buildingFloorCount')}
                  type="number"
                />
              </Row>
              {(formikProps.values as any).data.projectNumber && (
                <Row>
                  <Label>SPP</Label>
                  <FastInput
                    displayErrorTooltips
                    className="input-small"
                    formikProps={formikProps}
                    disabled={editInfo.identification}
                    field={withNameSpace('projectNumber')}
                  />
                </Row>
              )}
              <Row className="sensitive check-item">
                <Label>Harmful if info released?</Label>
                <Check
                  type="radio"
                  disabled={editInfo.identification}
                  field={withNameSpace('isSensitive')}
                  radioLabelOne="Yes"
                  radioLabelTwo="No"
                />
              </Row>
            </div>
          </Row>
        </Col>

        <Col md={6}>
          <Row>
            <div className="tenancy">
              <Row className="section-header">
                <span>
                  <BuildingSvg className="svg" />
                  <h5>Tenancy</h5>
                </span>
                <FaEdit
                  size={20}
                  className="edit"
                  onClick={() => setEditInfo({ ...defaultEditValues, tenancy: !editInfo.tenancy })}
                />
              </Row>
              <Row className="content-item">
                <Label>Rentable Area</Label>
                <InputGroup
                  className="area"
                  displayErrorTooltips
                  style={{ width: '100px' }}
                  fast={true}
                  formikProps={formikProps}
                  disabled={editInfo.tenancy}
                  type="number"
                  field={withNameSpace('rentableArea')}
                  postText="Sq. Ft"
                />
              </Row>
              <Row className="content-item">
                <Label>Tenancy</Label>
                <FastInput
                  displayErrorTooltips
                  formikProps={formikProps}
                  disabled={editInfo.tenancy}
                  field={withNameSpace('buildingTenancy')}
                />
              </Row>
              <Row className="content-item">
                <Label>Type of Occupant</Label>
                <FastSelect
                  formikProps={formikProps}
                  disabled={editInfo.tenancy}
                  placeholder="Must Select One"
                  field={withNameSpace('buildingOccupantTypeId')}
                  type="number"
                  options={props.occupantTypes}
                />
              </Row>
              <Row className="content-item">
                <Label>Occupant Name</Label>
                <FastInput
                  displayErrorTooltips
                  formikProps={formikProps}
                  disabled={editInfo.tenancy}
                  field={withNameSpace('occupantName')}
                />
              </Row>
              <Row className="content-item">
                <Label>Lease Expiry Date</Label>
                <FastDatePicker
                  formikProps={formikProps}
                  disabled={editInfo.tenancy}
                  field={withNameSpace('leaseExpiry')}
                />
              </Row>
              <Row className="check-item">
                <Label>Transfer lease with land?</Label>
                <Check disabled={editInfo.tenancy} field={withNameSpace('transferLeaseOnSale')} />
              </Row>
            </div>
          </Row>
          <Row>
            <div className="valuation">
              <Row className="section-header">
                <span>
                  <BuildingSvg className="svg" />
                  <h5>Valuation</h5>
                </span>
                <FaEdit
                  size={20}
                  className="edit"
                  onClick={() =>
                    setEditInfo({ ...defaultEditValues, valuation: !editInfo.valuation })
                  }
                />
              </Row>
              <Row className="val-item">
                <Label>Net Book Value</Label>
                <FastCurrencyInput
                  formikProps={formikProps}
                  field="data.buildings.0.financials.0.netbook.value"
                  disabled={editInfo.valuation}
                />
              </Row>
              <Row className="val-item">
                <Label>Est'd Market Value</Label>
                <FastCurrencyInput
                  formikProps={formikProps}
                  field="data.buildings.0.financials.0.estimated.value"
                  disabled={editInfo.valuation}
                />
              </Row>
              <Row className="val-item">
                <Label>Assessed Value</Label>
                <FastCurrencyInput
                  formikProps={formikProps}
                  field="data.buildings.0.financials.0.assessed.value"
                  disabled={editInfo.valuation}
                />
              </Row>
            </div>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};
