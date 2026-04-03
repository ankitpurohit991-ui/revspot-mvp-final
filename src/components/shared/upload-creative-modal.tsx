"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Image as ImageIcon } from "lucide-react";

export interface UploadCreativeModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: (creative: { imageFile: string; postText: string }) => void;
  angleName: string;
  personaName: string;
}

export function UploadCreativeModal({ open, onClose, onComplete, angleName, personaName }: UploadCreativeModalProps) {
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [postText, setPostText] = useState("");

  const canSubmit = imageFile && postText.trim().length > 0;

  const handleComplete = () => {
    if (!imageFile || !postText.trim()) return;
    onComplete({ imageFile, postText: postText.trim() });
    setImageFile(null);
    setPostText("");
  };

  const handleClose = () => {
    setImageFile(null);
    setPostText("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/30" onClick={handleClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative bg-white rounded-card border border-border shadow-xl w-full max-w-[600px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h3 className="text-[16px] font-semibold text-text-primary">Upload Creative</h3>
                <p className="text-[12px] text-text-secondary mt-0.5">{personaName} — {angleName}</p>
              </div>
              <button onClick={handleClose} className="p-1.5 text-text-tertiary hover:text-text-primary hover:bg-surface-secondary rounded-button transition-colors">
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              {/* Upload + Text side by side */}
              <div className="grid grid-cols-2 gap-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-[12px] font-medium text-text-primary mb-1.5">Creative Image</label>
                  {!imageFile ? (
                    <div
                      onClick={() => setImageFile("godrej_air_creative.jpg")}
                      className="border-2 border-dashed border-border rounded-[8px] p-6 text-center cursor-pointer hover:border-border-hover hover:bg-surface-page/50 transition-all duration-150 aspect-square flex flex-col items-center justify-center"
                    >
                      <Upload size={20} strokeWidth={1.5} className="text-text-tertiary mb-2" />
                      <p className="text-[12px] text-text-secondary">Upload image</p>
                      <p className="text-[10px] text-text-tertiary mt-1">JPG, PNG up to 10MB</p>
                    </div>
                  ) : (
                    <div className="relative border border-border rounded-[8px] aspect-square bg-surface-secondary flex items-center justify-center">
                      <ImageIcon size={32} strokeWidth={1} className="text-text-tertiary" />
                      <span className="absolute bottom-2 left-2 right-2 text-[10px] text-text-secondary bg-white/80 rounded px-1.5 py-0.5 truncate">{imageFile}</span>
                      <button onClick={() => setImageFile(null)} className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm text-text-tertiary hover:text-text-primary">
                        <X size={12} strokeWidth={1.5} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Post Text */}
                <div>
                  <label className="block text-[12px] font-medium text-text-primary mb-1.5">Ad Copy</label>
                  <textarea
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    rows={8}
                    placeholder="Write the ad copy that will appear with this creative..."
                    className="w-full px-3 py-2.5 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Meta Ad Preview */}
              <div>
                <label className="block text-[12px] font-medium text-text-primary mb-2">Ad Preview</label>
                <div className="border border-border rounded-[8px] overflow-hidden max-w-[320px]">
                  {/* Header */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-white">
                    <div className="w-8 h-8 rounded-full bg-surface-secondary flex items-center justify-center">
                      <span className="text-[10px] font-semibold text-text-tertiary">GP</span>
                    </div>
                    <div>
                      <div className="text-[12px] font-semibold text-text-primary">Godrej Properties</div>
                      <div className="text-[10px] text-text-tertiary">Sponsored</div>
                    </div>
                  </div>

                  {/* Post text */}
                  {postText && (
                    <div className="px-3 py-2">
                      <p className="text-[12px] text-text-primary leading-relaxed line-clamp-3">{postText}</p>
                    </div>
                  )}

                  {/* Image */}
                  <div className={`aspect-square bg-surface-secondary flex items-center justify-center ${imageFile ? "" : "opacity-40"}`}>
                    <ImageIcon size={40} strokeWidth={1} className="text-text-tertiary" />
                  </div>

                  {/* CTA */}
                  <div className="flex items-center justify-between px-3 py-2 border-t border-border-subtle bg-surface-page">
                    <span className="text-[11px] text-text-secondary">godrejproperties.com</span>
                    <span className="text-[11px] font-medium text-accent">Learn More</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={handleClose}
                className="h-9 px-4 text-[13px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page transition-colors duration-150">
                Cancel
              </button>
              <button onClick={handleComplete} disabled={!canSubmit}
                className="h-9 px-5 text-[13px] font-medium bg-accent text-white rounded-button hover:bg-accent-hover transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed">
                Add Creative
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
