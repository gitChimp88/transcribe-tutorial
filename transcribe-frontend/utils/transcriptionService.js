import axios from 'axios';

export const transcriptionService = async (
  file,
  apiKey,
  whisperApiEndpoint,
  mode
) => {
  const body = new FormData();
  body.append('file', file);
  body.append('model', 'whisper-1');
  body.append('language', 'en');

  const headers = {};
  headers['Content-Type'] = 'multipart/form-data';

  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const response = await axios.post(`${whisperApiEndpoint}${mode}`, body, {
    headers,
  });

  return response.data.text;
};
