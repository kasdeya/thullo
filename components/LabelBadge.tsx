import { Label } from '@prisma/client';

interface LabelBadgeProps {
  label: Label;
}

const LabelBadge = ({ label }: LabelBadgeProps) => {
  return (
    <div className={`w-min !p-0 relative rounded-xl`}>
      <div
        style={{
          backgroundColor: label.color,
          filter: 'opacity(0.5)', // Adjust the saturation level for the background
        }}
        className={`w-full absolute inset-0 rounded-xl`}></div>
      <div
        style={{
          color: label.color,
          filter: 'saturate(2)', // Adjust the saturation level for the text
        }}
        className={`relative px-3`}>
        {label.body}
      </div>
    </div>
  );
};

export default LabelBadge;
