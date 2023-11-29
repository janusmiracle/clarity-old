import whisper
import torch

model = whisper.load_model("small.en")


def transcribe_audio(username, filepath):
    result = model.transcribe(filepath, fp16=torch.cuda.is_available())
    print(username + ": " + result["text"] + "\n")

    with open("transcription.txt", "w", encoding="utf-8") as txt:
        txt.write(username + ": " + result["text"] + "\n")


# transcribe_audio(
# "alesso", "/Users/yacquub/home/clarity/main/recordings/1701199552436-alesso.ogg"
# )
