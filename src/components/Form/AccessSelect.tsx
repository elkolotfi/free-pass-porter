import { useEffect, useState } from 'react';
import Select, { StylesConfig } from 'react-select';
import { AccessOption, accessTypes } from '@/types/access-option.type';

interface AccessSelectProps {
  onChange: (selected: readonly AccessOption[]) => void;
  reload?: number;
  placeholder?: string;
}

export function AccessSelect({ onChange, placeholder = 'Filter by access level...', reload = 0 }: AccessSelectProps) {
  const [selectedAccessTypes, setSelectedAccessTypes] = useState<AccessOption[]>([]);

  const customStyles: StylesConfig<AccessOption, true> = {
    control: (provided) => ({
      ...provided,
      cursor: 'pointer',
    }),
    option: (provided) => ({
      ...provided,
      cursor: 'pointer',
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 2,
    }),
  };

  useEffect(() => {
    setSelectedAccessTypes([]);
    onChange([]);
  }, [reload, onChange]);

  const handleChange = (selected: readonly AccessOption[]) => {
    setSelectedAccessTypes(selected as AccessOption[]);
    onChange(selected);
  };

  const options = Object.keys(accessTypes).map(a => ({ value: a } as AccessOption));
  
  return (
    <div className="select-container" data-testid="select-component">
      <Select
        isMulti={true}
        options={options}
        value={selectedAccessTypes}
        onChange={handleChange}
        className="access-select"
        placeholder={placeholder}
        formatOptionLabel={(accessType: AccessOption) => (
          <div 
            className="access-option"
            style={{"--access-color": accessTypes[accessType.value]} as React.CSSProperties}
          >
            {accessType.value}
          </div>
        )}
        styles={customStyles}
      />
    </div>
  );
}