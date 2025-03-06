import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { storage, db } from '../firebase';
import { useUserStore } from '../store/userStore';
import Webcam from 'react-webcam';

const Reels: React.FC = () => {
  const { user } = useUserStore();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleStartRecording = useCallback(() => {
    setRecordedChunks([]);
    if (webcamRef.current?.stream) {
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType: 'video/webm'
      });
      mediaRecorderRef.current.addEventListener('dataavailable', ({ data }) => {
        if (data.size > 0) {
          setRecordedChunks((prev) => prev.concat(data));
        }
      });
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  }, [webcamRef, setRecordedChunks]);

  const handleStopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Create preview
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setPreview(url);
    }
  }, [mediaRecorderRef, recordedChunks]);

  const handleUpload = async () => {
    if (recordedChunks.length === 0 || !user) return;
    
    setUploading(true);
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    
    try {
      const storageRef = ref(storage, `reels/${user.uid}/${Date.now()}_reel.webm`);
      const uploadTask = uploadBytesResumable(storageRef, blob);
      
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Error uploading reel:', error);
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          await addDoc(collection(db, 'reels'), {
            userId: user.uid,
            username: user.displayName,
            userImage: user.photoURL,
            videoUrl: downloadURL,
            caption,
            likes: [],
            comments: [],
            timestamp: serverTimestamp()
          });
          
          setRecordedChunks([]);
          setPreview(null);
          setCaption('');
          setUploading(false);
        }
      );
    } catch (error) {
      console.error('Error creating reel:', error);
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white border border-gray-200 rounded-lg">
      <div className="border-b border-gray-200 p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Create Reel</h2>
        {preview && (
          <button
            onClick={() => setPreview(null)}
            className="text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      <div className="p-4">
        {!preview ? (
          <div className="relative aspect-[9/16] bg-black rounded-lg overflow-hidden">
            <Webcam
              ref={webcamRef}
              audio={true}
              videoConstraints={{
                facingMode: 'user',
                aspectRatio: 9/16
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <button
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                className={`rounded-full p-4 ${
                  isRecording ? 'bg-red-500' : 'bg-blue-500'
                } text-white`}
              >
                {isRecording ? (
                  <div className="h-6 w-6 rounded-sm bg-white" />
                ) : (
                  <div className="h-6 w-6 rounded-full border-2 border-white" />
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <video
              src={preview}
              controls
              className="w-full rounded-lg"
            />
            <textarea
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full bg-blue-500 text-white py-2 rounded-lg disabled:opacity-50"
            >
              {uploading ? `Uploading... ${Math.round(uploadProgress)}%` : 'Share Reel'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reels;