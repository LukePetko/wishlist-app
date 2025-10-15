import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { type FC, useState } from 'react';

type ZoomImageProps = {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
};

const ZoomImage: FC<ZoomImageProps> = ({
  src,
  alt = '',
  width = 96,
  height = 96,
  className,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        onClick={() => setOpen(true)}
        className="cursor-zoom-in"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
        />
      </motion.div>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[90vw] max-h-[90vh]"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              onClick={() => setOpen(false)}
            >
              <Image
                src={src}
                alt={alt}
                width={1400}
                height={900}
                className="max-h-[90vh] w-auto h-auto rounded-lg object-contain"
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ZoomImage;
