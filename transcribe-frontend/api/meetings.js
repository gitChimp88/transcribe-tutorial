const baseUrl = 'http://localhost:1337';
const url = `${baseUrl}/api/meetings`;

export async function fetchMeetings() {
  try {
    const res = await fetch(url);
    return await res.json();
  } catch (e) {
    console.error('Error fetching meetings:', error);
    throw error;
  }
}

export async function createNewMeeting() {
  // Create new empty meeting
  const payload = {
    data: {
      title: '',
      overview: '',
      ended: false,
      transcribed_chunks: [],
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
    console.error('Error creating new meeting:', error);
    throw error;
  }
}

export async function fetchMeetingDetails(meetingId) {
  try {
    const response = await fetch(
      `${baseUrl}/api/meetings/${meetingId}?populate=*`
    );

    return await response.json();
  } catch (error) {
    console.error('Error fetching meeting details:', error);
    throw error;
  }
}

export async function updateMeeting(updatedMeeting, meetingId) {
  const updateURL = `${baseUrl}/api/meetings/${meetingId}`;
  const payload = {
    data: updatedMeeting,
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

export async function connectTranscriptionToMeeting(
  meetingId,
  meetingTitle,
  transcriptionId
) {
  const updateURL = `${baseUrl}/api/meetings/${meetingId}`;
  const payload = {
    data: {
      title: meetingTitle,
      transcribed_chunks: {
        connect: [transcriptionId],
        position: { start: true },
      },
    },
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
    console.error('Error connecting transcription to meeting:', error);
    throw error;
  }
}

export async function deleteMeeting(meetingId) {
  try {
    const response = await fetch(`${baseUrl}/api/meetings/${meetingId}`, {
      method: 'DELETE',
    });

    return await response.json();
  } catch (error) {
    console.error('Error deleting meeting:', error);
    throw error;
  }
}
