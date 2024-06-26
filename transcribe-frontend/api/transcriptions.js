const baseUrl =
  process.env.NODE_ENV == 'production'
    ? process.env.NEXT_PUBLIC_STRAPI_URL
    : 'http://localhost:1337';
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

export async function updateTranscription(
  updatedTranscription,
  transcriptionId
) {
  const updateURL = `${url}/${transcriptionId}`;
  const payload = {
    data: updatedTranscription,
  };

  try {
    const res = await fetch(updateURL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return await res.json();
  } catch (error) {
    console.error('Error updating meeting:', error);
    throw error;
  }
}
