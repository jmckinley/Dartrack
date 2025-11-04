import React from 'react';
import Icon from './Icon';

interface AddToHomeScreenPromptProps {
  isOpen: boolean;
  onClose: () => void;
}

const getOS = (): 'ios' | 'android' | 'unknown' => {
  const userAgent = window.navigator.userAgent || window.navigator.vendor || (window as any).opera;
  if (/android/i.test(userAgent)) {
    return 'android';
  }
  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    return 'ios';
  }
  return 'unknown';
};

const IOSInstructions: React.FC = () => (
    <div className="bg-gray-900/50 p-4 rounded-md space-y-3">
        <h4 className="font-semibold text-gray-200">For iOS (Safari):</h4>
        <ol className="list-decimal list-inside space-y-2">
            <li>Tap the "Share" icon (<Icon name="arrow-up-on-square" className="w-5 h-5 inline-block -mt-1" />) in the browser toolbar.</li>
            <li>Scroll down and tap "Add to Home Screen".</li>
            <li>Confirm by tapping "Add".</li>
        </ol>
    </div>
);

const AndroidInstructions: React.FC = () => (
    <div className="bg-gray-900/50 p-4 rounded-md space-y-3">
        <h4 className="font-semibold text-gray-200">For Android (Chrome):</h4>
        <ol className="list-decimal list-inside space-y-2">
            <li>Tap the three-dot menu icon (<Icon name="ellipsis-vertical" className="w-5 h-5 inline-block -mt-1" />) in the top right corner.</li>
            <li>Tap "Install app" or "Add to Home screen".</li>
            <li>Follow the on-screen prompts to confirm.</li>
        </ol>
    </div>
);

const AddToHomeScreenPrompt: React.FC<AddToHomeScreenPromptProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const os = getOS();

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-xl shadow-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-700 flex items-center space-x-3">
            <Icon name="arrow-up-on-square" className="w-8 h-8 text-indigo-400" />
            <div>
                <h2 className="text-xl font-bold text-white">Get Quicker Access</h2>
                <p className="text-sm text-gray-400">Add DarTrack to your home screen.</p>
            </div>
        </div>
        <div className="p-6 space-y-4 text-gray-300 text-sm">
            <p>For an app-like experience, you can add this web app to your home screen. It's quick and easy!</p>
            
            {os === 'ios' && <IOSInstructions />}
            {os === 'android' && <AndroidInstructions />}
            {os === 'unknown' && (
                <>
                    <IOSInstructions />
                    <AndroidInstructions />
                </>
            )}

        </div>
        <div className="p-6 bg-gray-800/50 border-t border-gray-700 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 focus-visible:ring-indigo-500"
            >
              Got It
            </button>
        </div>
      </div>
    </div>
  );
};

export default AddToHomeScreenPrompt;