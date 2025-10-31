const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Método não permitido' })
        };
    }

    try {
        const NOTION_API_KEY = process.env.NOTION_API_KEY;
        const DATABASE_ID = process.env.NOTION_DATABASE_ID;

        if (!NOTION_API_KEY || !DATABASE_ID) {
            return {
                statusCode: 500,
                body: JSON.stringify({ 
                    error: 'Configuração do servidor incompleta' 
                })
            };
        }

        const requestData = JSON.parse(event.body);
        
        const response = await fetch('https://api.notion.com/v1/pages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_API_KEY}`,
                'Content-Type': 'application/json',
                'Notion-Version': '2022-06-28'
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            return {
                statusCode: response.status,
                body: errorText
            };
        }

        const result = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify(result)
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Erro interno: ' + error.message 
            })
        };
    }
};