"use client";

import { useState, useEffect } from 'react';

const RANDOM_MESSAGES = [
  "Welcome to DM Automation! 🚀",
  "Ready to automate your conversations? 💬",
  "Let's build something amazing together! ✨",
  "Your customers are waiting! 📱",
  "Time to scale your business! 📈",
  "Automation made simple! 🎯",
  "Connect, automate, succeed! 🌟",
  "The future of messaging is here! 🤖",
  "Transform your customer experience! 💫",
  "Say hello to efficiency! 👋"
];

export default function RandomMessagePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Show popup after 1 second
    const timer = setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * RANDOM_MESSAGES.length);
      setMessage(RANDOM_MESSAGES[randomIndex]);
      setIsOpen(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform animate-scaleIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white text-center">
            {message}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 text-center mb-6">
            Start automating your social media conversations in minutes!
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg"
            >
              Let's Go! 🚀
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
