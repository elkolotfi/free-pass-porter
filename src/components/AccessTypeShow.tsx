import { accessTypes } from "../types/access-option.type";

interface AccessTypeProps {
  access: string;
}

export default function AccessTypeShow({ access }: AccessTypeProps) {
  const backgroundColor = accessTypes[access.split('(')[0].trim()] || '#9E9E9E';

  return (
    <div
      style={{
        backgroundColor,
        color: '#FFF',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px',
        borderRadius: '4px',
        fontSize: '0.9em',
      }}
    >
      {access}
    </div>
  );
};