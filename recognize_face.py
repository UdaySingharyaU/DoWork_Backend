import cv2
import face_recognition
import time
import sys  # For better error reporting

# Step 1: Capture image from webcam after 3 seconds
def capture_image():
    try:
        video_capture = cv2.VideoCapture(0)

        if not video_capture.isOpened():
            print("Error: Could not open webcam.")
            sys.exit(1)  # Exit with non-zero status

        print("Capturing image in 3 seconds...")
        time.sleep(3)

        ret, frame = video_capture.read()
        if not ret:
            print("Failed to capture frame. Exiting.")
            sys.exit(1)  # Exit with error code

        image_path = 'captured_image.jpg'
        cv2.imwrite(image_path, frame)
        print(f"Image saved to {image_path}")

        video_capture.release()
        cv2.destroyAllWindows()

        return image_path
    except Exception as e:
        print(f"An error occurred during capture: {e}")
        sys.exit(1)  # Exit with non-zero status

def recognize_face(captured_image, known_image_path):
    try:
        # Load the known image and encode
        known_image = face_recognition.load_image_file(known_image_path)
        known_face_encodings = face_recognition.face_encodings(known_image)

        if not known_face_encodings:
            print("No faces found in the known image.")
            sys.exit(1)

        known_face_encoding = known_face_encodings[0]

        # Load the captured image and encode
        unknown_image = face_recognition.load_image_file(captured_image)
        unknown_face_encodings = face_recognition.face_encodings(unknown_image)

        if not unknown_face_encodings:
            print("No faces found in the captured image.")
            sys.exit(1)

        # Compare faces
        for unknown_face_encoding in unknown_face_encodings:
            results = face_recognition.compare_faces([known_face_encoding], unknown_face_encoding)
            if results[0]:
                print("Face matches! Return value: True")
            else:
                print("Face does not match! Return value: False")

    except Exception as e:
        print(f"An error occurred during recognition: {e}")
        sys.exit(1)  # Exit with non-zero status

# Main function
if __name__ == "__main__":
    image1 = capture_image()
    image2 = capture_image()

    if image1 and image2:
        recognize_face(image1, image2)
