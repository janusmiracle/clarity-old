import os
import sys
import time
import re
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from pathlib import Path

# from transcribe import transcribe_audio

import whisper
import torch

model = whisper.load_model("small.en")


def transcribe_audio(username, filepath):
    path = Path(filepath)
    path.rename(path.with_suffix(".mp3"))
    print(path)
    result = model.transcribe(path)
    print(username + ": " + result["text"] + "\n")

    with open("./main/transcription.txt", "w", encoding="utf-8") as txt:
        txt.write(username + ": " + result["text"] + "\n")

    os.remove(filepath)
    return True


class MonitorJSON(FileSystemEventHandler):
    def on_created(self, event):
        filepath = event.src_path
        username = str((re.split("[-]", filepath)[-1]).split(".")[0])

        complete = False

        while not complete:
            complete = transcribe_audio(username, filepath)


if __name__ == "__main__":
    src_path = "main/recordings"

    event_handler = MonitorJSON()
    observer = Observer()
    observer.schedule(event_handler, path=src_path, recursive=True)
    print("Monitoring...")
    observer.start()
    try:
        while True:
            time.sleep(2)

    except KeyboardInterrupt:
        observer.stop()
        observer.join()
