import React from 'react';
import ConnectionsController from './ConnectionsController';

interface PovezniceProps {
  onBack: () => void;
}

const Poveznice: React.FC<PovezniceProps> = ({ onBack }) => {
  return <ConnectionsController onBack={onBack} />;
};

export default Poveznice;
