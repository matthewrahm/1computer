"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { galleryImages } from "@/data/gallery-images";

export function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const doubled = [...galleryImages, ...galleryImages];

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="w-full overflow-hidden">
        <div className="gallery-scroll flex gap-3">
          {doubled.map((img, i) => (
            <button
              key={`${img.src}-${i}`}
              onClick={() => setLightbox(i % galleryImages.length)}
              className="group relative flex-shrink-0 cursor-pointer overflow-hidden rounded-xl border border-white/5 transition-all duration-300 hover:border-accent/20"
            >
              <div className="relative h-48 w-72 sm:h-56 sm:w-80">
                <Image src={img.src} alt={img.alt} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative max-h-[85vh] max-w-[85vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={galleryImages[lightbox].src}
                alt={galleryImages[lightbox].alt}
                width={1200}
                height={900}
                className="max-h-[80vh] w-auto rounded-xl object-contain"
              />
              <button
                onClick={() => setLightbox(null)}
                className="absolute -top-3 -right-3 rounded-full border border-white/10 bg-surface p-1.5 text-text-secondary transition-colors hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
