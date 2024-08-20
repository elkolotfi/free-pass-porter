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
  }, [reload]);

  const handleChange = (selected: readonly AccessOption[]) => {
    setSelectedAccessTypes(selected as AccessOption[]);
    onChange(selected);
  };
  
  return (
    <div className="select-container">
      <Select
        isMulti={true}
        options={Object.keys(accessTypes).map(a => ({ value: a } as AccessOption))}
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