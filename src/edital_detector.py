# Edital Detection Logic

class EditalDetector:
    def __init__(self, text):
        self.text = text

    def detect(self):
        # Logic to detect "Edital" in the text
        if "Edital" in self.text:
            return True
        return False

# Example usage
if __name__ == '__main__':
    text_to_check = "This is an example of an Edital document."
    detector = EditalDetector(text_to_check)
    print(detector.detect())  # Output should be True if "Edital" is found.