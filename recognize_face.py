import cv2
import face_recognition
import time
import sys  # For better error reporting

# Step 1: Capture image from webcam after 3 seconds
<<<<<<< HEAD
def capture_image():
    try:
        video_capture = cv2.VideoCapture(0)
=======
def capture_image1():
    video_capture = cv2.VideoCapture(0)
>>>>>>> da3e48789d6841e628af44c7e45370a09ef2ea51

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

<<<<<<< HEAD
        video_capture.release()
        cv2.destroyAllWindows()
=======
        # Break and capture image after 3 seconds
        if time.time() - start_time >= 3:
            image_path = 'captured_image1.jpg'
            cv2.imwrite(image_path, frame)
            print(f"Image saved to {image_path}")
            break

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    video_capture.release()
    cv2.destroyAllWindows()

    return image_path

def capture_image2():
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
            image_path = 'captured_image2.jpg'
            cv2.imwrite(image_path, frame)
            print(f"Image saved to {image_path}")
            break
>>>>>>> da3e48789d6841e628af44c7e45370a09ef2ea51

        return image_path
    except Exception as e:
        print(f"An error occurred during capture: {e}")
        sys.exit(1)  # Exit with non-zero status

def recognize_face(captured_image, known_image_path):
    try:
<<<<<<< HEAD
        # Load the known image and encode
=======
        # Load the known image
>>>>>>> da3e48789d6841e628af44c7e45370a09ef2ea51
        known_image = face_recognition.load_image_file(known_image_path)
        known_face_encodings = face_recognition.face_encodings(known_image)

        if not known_face_encodings:
            print("No faces found in the known image.")
            sys.exit(1)

        known_face_encoding = known_face_encodings[0]

<<<<<<< HEAD
        # Load the captured image and encode
=======
        # Load the captured image
>>>>>>> da3e48789d6841e628af44c7e45370a09ef2ea51
        unknown_image = face_recognition.load_image_file(captured_image)
        unknown_face_encodings = face_recognition.face_encodings(unknown_image)

        if not unknown_face_encodings:
            print("No faces found in the captured image.")
<<<<<<< HEAD
            sys.exit(1)

        # Compare faces
        for unknown_face_encoding in unknown_face_encodings:
            results = face_recognition.compare_faces([known_face_encoding], unknown_face_encoding)
=======
            return

        # Compare faces and check distance
        for unknown_face_encoding in unknown_face_encodings:
            results = face_recognition.compare_faces([known_face_encoding], unknown_face_encoding)
            face_distances = face_recognition.face_distance([known_face_encoding], unknown_face_encoding)

>>>>>>> da3e48789d6841e628af44c7e45370a09ef2ea51
            if results[0]:
                print("Face matches! Return value: True")
                print(f"Face distance: {face_distances[0]}")
            else:
                print("Face does not match! Return value: False")
                print(f"Face distance: {face_distances[0]}")

    except Exception as e:
        print(f"An error occurred during recognition: {e}")
        sys.exit(1)  # Exit with non-zero status

# Main function
if __name__ == "__main__":
    image1 = capture_image()
    image2 = capture_image()

<<<<<<< HEAD
    if image1 and image2:
        recognize_face(image1, image2)
=======
    # Capture image from webcam
    captured_image_path1 =capture_image1()
    print("captured_image_path1")
    print(captured_image_path1)

    # Known image path (already existing image)
    captured_image_path2 = capture_image2()
    print("captured_image_path2")
    print(captured_image_path2)
    if captured_image_path1 and captured_image_path2:
        # Perform face recognition
        recognize_face(captured_image_path1, captured_image_path2)
>>>>>>> da3e48789d6841e628af44c7e45370a09ef2ea51
