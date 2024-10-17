import cv2
import face_recognition
import time

# Step 1: Capture image from webcam after 3 seconds
def capture_image():
    video_capture = cv2.VideoCapture(0) 

    if not video_capture.isOpened():
        print("Error: Could not open webcam.")
        return None
    print("Capturing image in 3 seconds...")

    time.sleep(1)
    start_time = time.time()

    while True:
        ret, frame = video_capture.read()
        if not ret:
            print("Failed to capture frame. Exiting.")
            break

        # Display the frame
        cv2.imshow('Video', frame)

        # Break and capture image after 3 seconds
        if time.time() - start_time >= 3:
            image_path = 'captured_image.jpg'
            cv2.imwrite(image_path, frame)
            print(f"Image saved to {image_path}")
            break

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    video_capture.release()
    cv2.destroyAllWindows()

    return image_path

# Step 2: Perform face recognition on captured image
def recognize_face(captured_image, known_image_path):
    try:
        
        # Load the known image
        known_image = face_recognition.load_image_file(known_image_path)
        known_face_encodings = face_recognition.face_encodings(known_image)
        if len(known_face_encodings) == 0:
            print("No faces found in the known image.")
            return
        known_face_encoding = known_face_encodings[0]
        # Load the captured image
        unknown_image = face_recognition.load_image_file(captured_image)
        unknown_face_encodings = face_recognition.face_encodings(unknown_image)
        
        if len(unknown_face_encodings) == 0:
            print("No faces found in the captured image.")
            return
        
        # Compare faces
        for unknown_face_encoding in unknown_face_encodings:
            results = face_recognition.compare_faces([known_face_encoding], unknown_face_encoding)

            if results[0]:
                print("Face matches! Return value: True")
            else:
                print("Face does not match! Return value: False")

    except Exception as e:
        print(f"An error occurred: {e}")

# Step 3: Main function to capture and recognize face
if __name__ == "__main__": 

    # Capture two images from the webcam
    captured_image_path1 = 'modi.jpeg'
    print("captureImage",type(capture_image))
    captured_image_path2 = 'known_user.jpeg'

    if captured_image_path1 and captured_image_path2:
        # Perform face recognition
        recognize_face(captured_image_path1, captured_image_path2)
