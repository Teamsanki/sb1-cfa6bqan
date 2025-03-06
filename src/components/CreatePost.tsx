import React, { useState } from 'react';
import { Image, X } from 'lucide-react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { storage, db } from '../firebase';
import { useUserStore } from '../store/userStore';
import { useNavigate } from 'react-router-dom';

const CreatePost: React.FC = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setSelectedImage(event.target.result);
          setStep(2);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = async () => {
    if (!user || !selectedFile || !caption.trim()) return;
    
    setUploading(true);
    
    try {
      // Upload image to Firebase Storage
      const storageRef = ref(storage, `posts/${user.uid}/${Date.now()}_${selectedFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);
      
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Error uploading image:', error);
          setUploading(false);
        },
        async () => {
          // Get download URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          // Create post document in Firestore
          await addDoc(collection(db, 'posts'), {
            userId: user.uid,
            username: user.displayName,
            userImage: user.photoURL,
            image: downloadURL,
            caption,
            likes: [],
            comments: [],
            timestamp: serverTimestamp()
          });
          
          // Reset form and navigate to home
          setSelectedFile(null);
          setSelectedImage(null);
          setCaption('');
          setStep(1);
          setUploading(false);
          navigate('/');
        }
      );
    } catch (error) {
      console.error('Error creating post:', error);
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setSelectedImage(null);
    setCaption('');
    setStep(1);
  };

  return (
    <div className="max-w-xl mx-auto bg-white border border-gray-200 rounded-lg">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 flex justify-between items-center">
        <button onClick={handleCancel} className="text-gray-500">
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-lg font-semibold">Create New Post</h2>
        {step === 2 ? (
          <button
            onClick={handlePost}
            disabled={!caption.trim() || uploading}
            className={`text-blue-500 font-semibold ${
              !caption.trim() || uploading ? 'opacity-50' : ''
            }`}
          >
            {uploading ? 'Posting...' : 'Share'}
          </button>
        ) : (
          <div className="w-6"></div> // Empty div for spacing
        )}
      </div>

      {/* Content */}
      {step === 1 ? (
        <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
          <Image className="h-20 w-20 text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold mb-4">Drag photos and videos here</h3>
          <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
            Select from computer
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
          </label>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row">
          {/* Image Preview */}
          <div className="md:w-1/2 bg-black flex items-center justify-center">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Selected"
                className="max-h-[500px] max-w-full object-contain"
              />
            )}
          </div>

          {/* Caption */}
          <div className="md:w-1/2 p-4">
            <div className="flex items-center mb-4">
              <img
                src={user?.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"}
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover mr-2"
              />
              <span className="font-semibold">{user?.displayName || 'username'}</span>
            </div>
            <textarea
              placeholder="Write a caption..."
              className="w-full h-32 resize-none focus:outline-none"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            ></textarea>
            <div className="flex justify-between text-gray-500 text-sm">
              <span>{caption.length}/2,200</span>
            </div>
            
            {uploading && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Uploading: {Math.round(uploadProgress)}%
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;