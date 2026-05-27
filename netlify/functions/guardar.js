exports.handler = async (event) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: corsHeaders, body: "Method Not Allowed" };
  }

  try {
    const { filename, content } = JSON.parse(event.body);
    const token = process.env.GH_TOKEN;

    const response = await fetch(
      `https://api.github.com/repos/ilsamariaorientadora/cuestionarios/contents/${filename}`,
      {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/vnd.github+json"
        },
        body: JSON.stringify({
          message: `Cuestionario: ${filename}`,
          content: content,
          branch: "main"
        })
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message);
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ ok: true })
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: err.message })
    };
  }
};
