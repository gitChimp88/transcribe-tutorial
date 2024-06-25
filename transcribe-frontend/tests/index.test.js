import { renderHook, act } from '@testing-library/react-hooks';
import { useInsightGpt } from '../hooks/useInsightGpt';
import { callInsightGpt } from '../api/analysis';
import { updateMeeting } from '../api/meetings';
import { updateTranscription } from '../api/transcriptions';

jest.mock('../api/analysis');
jest.mock('../api/meetings');
jest.mock('../api/transcriptions');

describe('useInsightGpt', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle transcription analysis successfully', async () => {
    const mockData = { data: { message: 'Test analysis message' } };
    callInsightGpt.mockResolvedValueOnce(mockData);
    updateTranscription.mockResolvedValueOnce({});

    const { result } = renderHook(() => useInsightGpt());

    await act(async () => {
      await result.current.getAndSaveTranscriptionAnalysis(
        'analysis',
        'input',
        'transcriptionId'
      );
    });

    expect(callInsightGpt).toHaveBeenCalledWith('analysis', 'input');
    expect(updateTranscription).toHaveBeenCalledWith(
      { analysis: 'Test analysis message' },
      'transcriptionId'
    );
    expect(result.current.transcriptionIdLoading).toBe('');
    expect(result.current.analysisError).toBe(null);
  });

  it('should handle overview analysis successfully', async () => {
    const mockData = { data: { message: 'Test overview message' } };
    callInsightGpt.mockResolvedValueOnce(mockData);
    updateMeeting.mockResolvedValueOnce({});

    const { result } = renderHook(() => useInsightGpt());

    await act(async () => {
      await result.current.getAndSaveOverviewAnalysis(
        'overview',
        'input',
        'meetingId'
      );
    });

    expect(callInsightGpt).toHaveBeenCalledWith('overview', 'input');
    expect(updateMeeting).toHaveBeenCalledWith(
      { overview: 'Test overview message' },
      'meetingId'
    );
    expect(result.current.loadingAnalysis).toBe(false);
    expect(result.current.analysisError).toBe(null);
  });

  it('should handle errors in transcription analysis', async () => {
    const mockError = new Error('Test error');
    callInsightGpt.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useInsightGpt());

    await act(async () => {
      await result.current.getAndSaveTranscriptionAnalysis(
        'analysis',
        'input',
        'transcriptionId'
      );
    });

    expect(result.current.transcriptionIdLoading).toBe('');
    expect(result.current.analysisError).toBe(
      'Error getting analysis',
      mockError
    );
  });

  it('should handle errors in overview analysis', async () => {
    const mockError = new Error('Test error');
    callInsightGpt.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useInsightGpt());

    await act(async () => {
      await result.current.getAndSaveOverviewAnalysis(
        'overview',
        'input',
        'meetingId'
      );
    });

    expect(result.current.loadingAnalysis).toBe(false);
    expect(result.current.analysisError).toBe(
      'Error getting overview',
      mockError
    );
  });
});
