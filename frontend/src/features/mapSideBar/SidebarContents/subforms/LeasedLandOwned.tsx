import * as React from 'react';
import { Input } from 'components/common/form';
import { Row } from 'react-bootstrap';
import { Label } from 'components/common/Label';
import { useFormikContext, getIn } from 'formik';
import { IGeocoderResponse } from 'hooks/useApi';
import { pidFormatter } from 'features/properties/components/forms/subforms/PidPinForm';
import { useCallback } from 'react';
import { debounce } from 'lodash';

interface ILeasedLandOwnedProps {
  nameSpace?: string;
  disabled?: boolean;
  handleGeocoderChanges: (data: IGeocoderResponse, nameSpace?: string) => Promise<void>;
  /** to autopopulate fields based on Geocoder information */
  handlePidChange: (pid: string, nameSpace?: string) => void;
}

/**
 * Subform that allows the user to either find or enter the associated parcel when the are the owner.
 * @param {ILeasedLandOwnedProps} props
 */
const LeasedLandOwned: React.FunctionComponent<ILeasedLandOwnedProps> = props => {
  const withNameSpace: Function = (fieldName: string) => {
    const { nameSpace } = props;
    return nameSpace ? `${nameSpace}.${fieldName}` : fieldName;
  };
  const debouncedHandlePidChange = useCallback(
    debounce((pid: string) => {
      props.handlePidChange(pid, props.nameSpace);
    }, 100),
    [props.nameSpace],
  );
  const { initialValues } = useFormikContext();
  return (
    <>
      <h6>Owned Land</h6>

      <Row>
        <p>
          To identify the land this building sits on, enter the parcel's pid or higlight the parcel
          on the map.
        </p>
      </Row>
      <Row className="field-row">
        <Label>PID lookup</Label>
        <Input
          placeholder="###-###-###"
          displayErrorTooltips
          className="input-small"
          disabled={props.disabled}
          pattern={RegExp(/^[\d\- ]*$/)}
          onBlurFormatter={(pid: string) => {
            if (pid && getIn(initialValues, withNameSpace('pid')) !== pid) {
              debouncedHandlePidChange(pid);
            }
            return pid.replace(pid, pidFormatter(pid));
          }}
          field={withNameSpace('pidLookup')}
        />
      </Row>
    </>
  );
};

export default LeasedLandOwned;
