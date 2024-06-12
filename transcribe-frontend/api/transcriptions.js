const baseUrl = 'http://localhost:1337';
const url = `${baseUrl}/api/transcribed-chunks`;

export async function createNewTranscription(transcription) {
  const payload = {
    data: {
      text: transcription,
      analysis: '',
      answer: '',
    },
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return await res.json();
  } catch (error) {
    console.error('Error saving meeting:', error);
    throw error;
  }
}
