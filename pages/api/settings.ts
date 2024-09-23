import { NextApiRequest, NextApiResponse } from 'next';
import { getBCAuth } from '../../lib/auth';
import db from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { apiKey, toggleState } = req.body;
    const { context } = req.query;

    try {
        const { accessToken, storeHash } = await getBCAuth(context as string);

        const customScriptUrl = toggleState ? `https://your-publicsquare-script-url.com?apiKey=${apiKey}` : null;

        const response = await fetch(`https://api.bigcommerce.com/stores/${storeHash}/v3/checkouts/settings`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': accessToken,
            },
            body: JSON.stringify({
                custom_checkout_script_url: customScriptUrl,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to update checkout settings');
        }

        // Save settings to the database
        await db.savePublicSquareSettings(storeHash, apiKey, toggleState);

        res.status(200).json({ message: 'Settings updated successfully' });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
