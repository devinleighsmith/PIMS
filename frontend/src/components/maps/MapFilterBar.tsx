import React, { useState } from 'react';
import { Container, Row, Col, Dropdown, DropdownButton, Form } from 'react-bootstrap';
import _ from 'lodash';
import { ILookupCode } from 'actions/lookupActions';
import './MapFilterBar.scss';

type MapFilterProps = {
  agencyLookupCodes: ILookupCode[];
  propertyClassifications: ILookupCode[];
  onSelectAgency: (agencyId: number | null) => void;
  onSelectPropertyClassification: (propertyClassificationId: number | null) => void;
};

const getNameById = (codeSet: ILookupCode[], codeId: number) => {
  return _.find(codeSet, ['id', codeId])?.name || '';
}

function MapFilterBar(props: MapFilterProps) {
  const [agencyDropdownTitle, setAgencyDropdownTitle] = useState("View Properties in \u00A0");
  const [propertyClassificationDropdownTitle, setPropertyClassificationDropdownTitle] = useState("View by Classification \u00A0");

  const onAgencyChange = (eventKey: string) => {
    const eventKeyId = parseInt(eventKey);
    if (eventKeyId < 0) {
      setAgencyDropdownTitle("Any");
      props.onSelectAgency(null);
      return;
    }
    const agencyName = getNameById(props.agencyLookupCodes, eventKeyId);
    setAgencyDropdownTitle(agencyName);
    props.onSelectAgency(eventKeyId);
  }
  const onSelectPropertyClassification = (eventKey: string) => {
    const eventKeyId = parseInt(eventKey);
    if (eventKeyId < 0) {
      setPropertyClassificationDropdownTitle("Any");
      props.onSelectPropertyClassification(null);
      return;
    }
    const classificationName = getNameById(props.propertyClassifications, eventKeyId);
    setPropertyClassificationDropdownTitle(classificationName);
    props.onSelectPropertyClassification(eventKeyId);
  }

  return (
    <Container fluid={true} className="map-filter-bar">
      <Row>
        <Col md={{ span: 5, offset: 2 }}>

          <Form.Control type="text" placeholder="Search Bar Not Implemented" />
          <DropdownButton id="dropdown-basic-button" title={agencyDropdownTitle} bsPrefix="map-filter-dropdown" onSelect={onAgencyChange}>
            <Dropdown.Item eventKey={'-1'}>Any</Dropdown.Item>
            {props.agencyLookupCodes.map((code) => {
              return <Dropdown.Item eventKey={code.id.toString()}>{code.name}</Dropdown.Item>
            })
            }
          </DropdownButton>
          <DropdownButton id="dropdown-basic-button" title={propertyClassificationDropdownTitle} bsPrefix="map-filter-dropdown" onSelect={onSelectPropertyClassification}>
            <Dropdown.Item eventKey={'-1'}>Any</Dropdown.Item>
            {props.propertyClassifications.map((code) => {
              return <Dropdown.Item eventKey={code.id.toString()}>{code.name}</Dropdown.Item>
            })
            }
          </DropdownButton>
        </Col>
      </Row>
    </Container>
  );
}

export default MapFilterBar;


