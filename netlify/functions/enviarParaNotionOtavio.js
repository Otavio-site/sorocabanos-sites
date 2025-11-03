import fetch from "node-fetch";

export const handler = async (event) => {
  try {
    const { nome, telefone, endereco, itens, total } = JSON.parse(event.body);

    const NOTION_API_KEY = process.env.NOTION_API_KEY;
    const DATABASE_ID = process.env.NOTION_DATABASE_ID;

    const response = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NOTION_API_KEY}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        parent: { database_id: DATABASE_ID },
        properties: {
          Nome: { title: [{ text: { content: nome } }] },
          Telefone: { rich_text: [{ text: { content: telefone } }] },
          Endereço: { rich_text: [{ text: { content: endereco } }] },
          Itens: { rich_text: [{ text: { content: itens } }] },
          Total: { number: parseFloat(total) },
          Status: { select: { name: "Novo Pedido" } },
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error("Erro ao enviar para o Notion:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
