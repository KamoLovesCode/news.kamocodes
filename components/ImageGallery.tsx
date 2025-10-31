import React, { useState, useEffect } from 'react';
import { generateImageGallery, createSolidColorPlaceholderUrl } from '../services/geminiService';
import { GalleryImage } from '../types';

const Skeleton: React.FC = () => <div className="aspect-video bg-gray-200 dark:bg-zinc-800 rounded-lg shimmer-bg"></div>;

const ImageGallery: React.FC = () => {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

    useEffect(() => {
        const loadImages = async () => {
            setIsLoading(true);
            try {
                const galleryImages = await generateImageGallery();
                setImages(galleryImages);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Could not load images.");
            } finally {
                setIsLoading(false);
            }
        };
        loadImages();
    }, []);

    const handleImageClick = (image: GalleryImage) => {
        setSelectedImage(image);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = createSolidColorPlaceholderUrl('800x450');
    };

    return (
        <div className="animate-fade-in">
            {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)}
                </div>
            )}
            {error && <p className="text-center text-red-500">{error}</p>}
            {!isLoading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {images.map((image, index) => (
                        <div key={index} className="group relative cursor-pointer overflow-hidden rounded-lg" onClick={() => handleImageClick(image)}>
                            <img src={image.imageUrl} alt={image.prompt} loading="lazy" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" onError={handleImageError} />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                                <p className="text-white text-center text-sm line-clamp-3">{image.prompt}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedImage && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={handleCloseModal}>
                    <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
                        <button onClick={handleCloseModal} className="absolute -top-3 -right-3 h-8 w-8 bg-white text-black rounded-full flex items-center justify-center z-10 text-xl font-bold">&times;</button>
                        <img src={selectedImage.imageUrl} alt={selectedImage.prompt} className="w-full h-auto object-contain rounded-lg max-h-[80vh]" onError={handleImageError} />
                        <p className="text-white text-center mt-4 text-sm bg-black/50 p-2 rounded-md max-w-full">{selectedImage.prompt}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageGallery;
