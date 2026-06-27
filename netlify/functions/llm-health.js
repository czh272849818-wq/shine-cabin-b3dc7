exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return json(405, { error: 'Method Not Allowed' })
  }

  return json(200, {
    hasKey: Boolean(process.env.DEEPSEEK_API_KEY),
    source: process.env.DEEPSEEK_API_KEY ? 'netlifyEnv' : null,
  })
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }
}
