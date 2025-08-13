/**
 * One-Click Set Sharing Component
 * Enables viral growth through easy set sharing with social media integration
 */

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share,
  Copy,
  Twitter,
  Facebook,
  MessageCircle,
  Download,
  QrCode,
  Check,
  X,
} from 'lucide-react';
import { useAuth } from '@/store/authStore';

interface ShareSetProps {
  setId: string;
  setTitle: string;
  artistName: string;
  duration: number;
  trackCount: number;
  thumbnailUrl?: string;
  onClose?: () => void;
}

interface ShareLink {
  url: string;
  shortUrl: string;
  embedCode: string;
  qrCodeUrl: string;
}

const ShareSet: React.FC<ShareSetProps> = ({
  setId,
  setTitle,
  artistName,
  duration,
  trackCount,
  thumbnailUrl,
  onClose,
}) => {
  const { isGuestMode } = useAuth();
  const [shareLink, setShareLink] = useState<ShareLink | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [showEmbed, setShowEmbed] = useState(false);

  // Generate shareable link
  const generateShareLink = useCallback(async () => {
    if (shareLink) return shareLink;

    setIsGenerating(true);
    try {
      // Simulate API call to generate share link
      const baseUrl = window.location.origin;
      const fullUrl = `${baseUrl}/set/${setId}`;
      const shortUrl = `${baseUrl}/s/${setId.slice(0, 8)}`;

      // Generate QR code URL (would use a service like qr-server.com)
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(fullUrl)}`;

      // Generate embed code
      const embedCode = `<iframe src="${baseUrl}/embed/${setId}" width="400" height="300" frameborder="0"></iframe>`;

      const link: ShareLink = {
        url: fullUrl,
        shortUrl,
        embedCode,
        qrCodeUrl,
      };

      setShareLink(link);
      return link;
    } finally {
      setIsGenerating(false);
    }
  }, [setId, shareLink]);

  // Copy to clipboard with feedback
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Social media sharing functions
  const shareToTwitter = (url: string) => {
    const text = `Check out this amazing DJ set: "${setTitle}" by ${artistName} 🎵 ${trackCount} tracks, ${formatDuration(duration)} of pure energy! #DJfly #DJSet #Music`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  const shareToFacebook = (url: string) => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=550,height=420');
  };

  const shareToWhatsApp = (url: string) => {
    const text = `🎵 Check out "${setTitle}" by ${artistName} - ${trackCount} tracks of amazing music! Listen here:`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Native share API
  const shareNative = async () => {
    if (!shareLink) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${setTitle} by ${artistName}`,
          text: `Check out this DJ set - ${trackCount} tracks, ${formatDuration(duration)} of great music!`,
          url: shareLink.url,
        });
      } catch {
        // User cancelled or share failed
      }
    }
  };

  // Helper function to format duration
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}min`;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}h ${remainingMins}min`;
  };

  // Initialize share link on mount
  useEffect(() => {
    generateShareLink();
  }, [generateShareLink]);

  if (isGenerating && !shareLink) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
          <h3 className="text-lg font-semibold text-white">
            Generating Share Link...
          </h3>
        </div>
        <p className="text-gray-400">
          Creating your shareable link and preview...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-gray-800 rounded-lg overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <Share className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Share Your Set</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Set Preview */}
      <div className="p-4 bg-gray-750">
        <div className="flex items-center gap-4">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={setTitle}
              className="w-16 h-16 rounded-lg object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <Share className="w-8 h-8 text-white" />
            </div>
          )}
          <div>
            <h4 className="font-semibold text-white">{setTitle}</h4>
            <p className="text-gray-400">by {artistName}</p>
            <p className="text-sm text-gray-500">
              {trackCount} tracks • {formatDuration(duration)}
            </p>
            {isGuestMode && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-900/30 text-amber-300 mt-1">
                Made with DJfly
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Share Options */}
      <div className="p-4 space-y-4">
        {/* Quick Share URL */}
        {shareLink && (
          <div>
            <label
              htmlFor="share-link"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
            <label htmlFor="share-link-input" className="block text-sm font-medium text-gray-300 mb-2">
              Share Link
            </label>
            <div className="flex items-center gap-2">
              <input
                id="share-link"
                id="share-link-input"
                type="text"
                value={shareLink.shortUrl}
                readOnly
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
              />
              <button
                onClick={() => copyToClipboard(shareLink.shortUrl, 'url')}
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
              >
                {copied === 'url' ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Social Media Buttons */}
        <div>
          <label
            htmlFor="social-share"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Share on Social Media
          </label>
          <div
            id="social-share"
            className="grid grid-cols-2 sm:grid-cols-4 gap-2"
          >
          <div className="block text-sm font-medium text-gray-300 mb-2">
            Share on Social Media
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => shareToTwitter(shareLink?.shortUrl || '')}
              className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
            >
              <Twitter className="w-4 h-4" />
              Twitter
            </button>

            <button
              onClick={() => shareToFacebook(shareLink?.shortUrl || '')}
              className="flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded-lg transition-colors text-sm"
            >
              <Facebook className="w-4 h-4" />
              Facebook
            </button>

            <button
              onClick={() => shareToWhatsApp(shareLink?.shortUrl || '')}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </button>

            {'share' in navigator && (
              <button
                onClick={shareNative}
                className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
              >
                <Share className="w-4 h-4" />
                More
              </button>
            )}
          </div>
        </div>

        {/* Advanced Options */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowEmbed(!showEmbed)}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            Embed Code
          </button>

          <button
            onClick={() => window.open(shareLink?.qrCodeUrl, '_blank')}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
          >
            <QrCode className="w-4 h-4" />
            QR Code
          </button>
        </div>

        {/* Embed Code */}
        <AnimatePresence>
          {showEmbed && shareLink && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <label
                htmlFor="embed-code"
                className="block text-sm font-medium text-gray-300"
              >
              <label htmlFor="embed-code-textarea" className="block text-sm font-medium text-gray-300">
                Embed Code (Copy & Paste)
              </label>
              <div className="flex items-start gap-2">
                <textarea
                  id="embed-code"
                  id="embed-code-textarea"
                  value={shareLink.embedCode}
                  readOnly
                  rows={3}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm font-mono resize-none"
                />
                <button
                  onClick={() => copyToClipboard(shareLink.embedCode, 'embed')}
                  className="flex items-center gap-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                >
                  {copied === 'embed' ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Guest Mode Upgrade Prompt */}
        {isGuestMode && (
          <motion.div
            className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-600/30 rounded-lg p-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-blue-300 text-sm mb-2">
              💡 <strong>Remove watermark</strong> and get advanced sharing
              features
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded transition-colors">
              Upgrade Account
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ShareSet;
