# Convocado Extractor

import requests

class ConvocadoExtractor:
    def __init__(self, api_url):
        self.api_url = api_url

    def fetch_convocados(self):
        response = requests.get(self.api_url)
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception('Failed to fetch data: {}'.format(response.status_code))

    def extract_data(self, data):
        # Example extraction logic
        extracted = []
        for item in data:
            extracted.append({
                'id': item.get('id'),
                'name': item.get('name'),
            })
        return extracted

# Example usage
if __name__ == '__main__':
    extractor = ConvocadoExtractor('https://api.example.com/convocados')
    data = extractor.fetch_convocados()
    extracted_data = extractor.extract_data(data)
    print(extracted_data)