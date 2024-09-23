import React, { useState, useEffect } from 'react';
import { Panel, Input, Checkbox, Button, Form, Small } from '@bigcommerce/big-design';

interface PublicSquareSettingsProps {
  initialApiKey: string;
  initialToggleState: boolean;
  onSave: (apiKey: string, toggleState: boolean) => Promise<void>;
}

const PublicSquareSettings: React.FC<PublicSquareSettingsProps> = ({ 
  initialApiKey, 
  initialToggleState, 
  onSave 
}) => {
  // State for the API key input
  const [apiKey, setApiKey] = useState(initialApiKey);
  // State for the toggle
  const [toggleState, setToggleState] = useState(initialToggleState);
  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  // State for error message
  const [error, setError] = useState<string | null>(null);

  // Reset form state when initial values change
  useEffect(() => {
    setApiKey(initialApiKey);
    setToggleState(initialToggleState);
  }, [initialApiKey, initialToggleState]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onSave(apiKey, toggleState);
      // You might want to show a success message here
    } catch (err) {
      console.log(err);
      setError('Failed to save settings. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Panel header="PublicSquare Settings">
      <Form onSubmit={handleSubmit}>
        <Input
          label="PublicSquare API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          required
          description="Enter your PublicSquare API key here"
        />
        <Checkbox
          label="Enable PublicSquare Custom Checkout"
          checked={toggleState}
          onChange={(e) => setToggleState(e.target.checked)}
          description="Turn on to use PublicSquare's custom checkout"
        />
        <Small>
          <a 
            href="https://publicsquare.com/api-keys" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Get your API key here
          </a>
        </Small>
        {error && <Small error>{error}</Small>}
        <Button 
          type="submit" 
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Save Settings
        </Button>
      </Form>
    </Panel>
  );
};

export default PublicSquareSettings;
