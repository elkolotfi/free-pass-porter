interface AccessTypeProps {
  access: string;
}

const accessTypeColors: { [key: string]: string } = {
  'citizen': '#4CAF50',
  'visa free': '#8BC34A',
  'visa on arrival': '#6bd38c',
  'e-visa': '#FFC107',
  'visa required': '#FF5722',
};

export default function AccessType({ access }: AccessTypeProps) {
  const backgroundColor = accessTypeColors[access.split('(')[0].trim()] || '#9E9E9E';

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