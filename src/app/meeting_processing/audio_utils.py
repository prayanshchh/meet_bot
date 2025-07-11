import ffmpeg

def video_to_audio(video_path: str, audio_path: str):
    (
        ffmpeg
        .input(video_path)
        .output(audio_path, format='mp3', acodec='libmp3lame', ab='192k', ar='44100', vn=None)
        .overwrite_output()
        .run()
    ) 
    return audio_path