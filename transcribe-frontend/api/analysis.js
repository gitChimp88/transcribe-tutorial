const baseUrl = 'http://localhost:1337';
const url = `${baseUrl}/api/transcribe-insight-gpt/exampleAction`;

export async function callInsightGpt(operation, input) {
  const payload = {
    data: {
      input: input,
      operation: operation,
    },
  };
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
