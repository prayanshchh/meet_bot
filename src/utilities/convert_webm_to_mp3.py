import ffmpeg
import tempfile
import io
import os

def convert_webm_bytes_to_mp3(webm_bytes: bytes) -> bytes:
    with tempfile.NamedTemporaryFile(delete=False, suffix='.webm') as input_file:
        input_file.write(webm_bytes)
        input_path = input_file.name

    output_path = input_path.replace('.webm', '.mp3')

    try:
        (
            ffmpeg
            .input(input_path)
            .output(output_path, format='mp3', acodec='libmp3lame')
            .overwrite_output()
            .run(quiet=True)
        )

        with open(output_path, 'rb') as f:
            mp3_bytes = f.read()

        return mp3_bytes

    finally:
        os.remove(input_path)
        if os.path.exists(output_path):
            os.remove(output_path)
