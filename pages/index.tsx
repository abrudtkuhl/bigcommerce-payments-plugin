import { Box } from '@bigcommerce/big-design';
import PublicSquareSettings from '../components/PublicSquareSettings';
import { useSession } from '../context/session';

const IndexPage: React.FC = () => {
    const { context } = useSession();

    const handleSavePublicSquareSettings = async (apiKey: string, toggleState: boolean) => {
        try {
            const response = await fetch(`/api/settings?context=${context}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    apiKey,
                    toggleState,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save settings');
            }

            // Handle successful save (e.g., show a success message)
            console.log('Settings saved successfully');
        } catch (error) {
            console.error('Error saving settings:', error);
            // Handle error (e.g., show an error message to the user)
        }
    };

    return (
        <Box padding="medium">
            <PublicSquareSettings
                initialApiKey=""
                initialToggleState={false}
                onSave={handleSavePublicSquareSettings}
            />
        </Box>
    );
};

export default IndexPage;