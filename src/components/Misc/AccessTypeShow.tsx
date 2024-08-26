import { accessTypes } from "@/types/access-option.type";

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
        padding: '4px',
        fontSize: '1rem',
      }}
    >
      {access}
    </div>
  );
};