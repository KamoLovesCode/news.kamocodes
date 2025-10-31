import React from 'react';

interface OllamaApiKeyModalProps {
  onSave: (apiKey: string) => void;
}

const OllamaApiKeyModal: React.FC<OllamaApiKeyModalProps> = ({ onSave }) => {
  // This feature has been disabled to run the app on demo data.
  return null;
};

export default OllamaApiKeyModal;
