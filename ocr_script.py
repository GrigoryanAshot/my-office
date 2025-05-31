import pytesseract
from PIL import Image
import os

def extract_text_from_image(image_path):
    """
    Extract text from an image using OCR.
    
    Args:
        image_path (str): Path to the image file
        
    Returns:
        str: Extracted text from the image
    """
    try:
        # Open the image using PIL
        image = Image.open(image_path)
        
        # Extract text from the image
        text = pytesseract.image_to_string(image)
        
        return text.strip()
    except Exception as e:
        return f"Error processing image: {str(e)}"

def main():
    # Get the current directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Create an 'images' directory if it doesn't exist
    images_dir = os.path.join(current_dir, 'images')
    if not os.path.exists(images_dir):
        os.makedirs(images_dir)
        print(f"Created 'images' directory at: {images_dir}")
    
    # Process all images in the images directory
    for filename in os.listdir(images_dir):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.tiff')):
            image_path = os.path.join(images_dir, filename)
            print(f"\nProcessing image: {filename}")
            print("-" * 50)
            
            # Extract text from the image
            extracted_text = extract_text_from_image(image_path)
            
            # Print the extracted text
            print("Extracted text:")
            print(extracted_text)
            print("-" * 50)

if __name__ == "__main__":
    main() 