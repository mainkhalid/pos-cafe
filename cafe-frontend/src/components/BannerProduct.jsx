import React, { useEffect, useState, useCallback } from 'react'
import image1 from '../assets/banner/image1.jpg'
import image2 from '../assets/banner/image2.jpg'
import image3 from '../assets/banner/image3.jpg'
import image4 from '../assets/banner/image4.jpg'
import image5 from '../assets/banner/image5.jpg'

import image1Mobile from '../assets/banner/img1_mobile.jpg'
import image2Mobile from '../assets/banner/img2_mobile.webp'
import image3Mobile from '../assets/banner/img3_mobile.jpg'
import image4Mobile from '../assets/banner/img4_mobile.jpg'
import image5Mobile from '../assets/banner/img5_mobile.png'

import { FaAngleRight, FaAngleLeft } from "react-icons/fa6"

const BannerProduct = () => {
    const [currentImage, setCurrentImage] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)
    const [touchStart, setTouchStart] = useState(0)
    const [touchEnd, setTouchEnd] = useState(0)

    const desktopImages = [image1, image2, image3, image4, image5]
    const mobileImages = [image1Mobile, image2Mobile, image3Mobile, image4Mobile, image5Mobile]

    const nextImage = useCallback(() => {
        setCurrentImage(prev => (prev + 1) % desktopImages.length)
    }, [desktopImages.length])

    const prevImage = useCallback(() => {
        setCurrentImage(prev => (prev - 1 + desktopImages.length) % desktopImages.length)
    }, [desktopImages.length])

    const goToSlide = useCallback((index) => {
        setCurrentImage(index)
    }, [])

    // Touch handlers for mobile swipe
    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX)
    }

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX)
    }

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return
        
        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > 50
        const isRightSwipe = distance < -50

        if (isLeftSwipe) {
            nextImage()
        } else if (isRightSwipe) {
            prevImage()
        }
    }

    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlaying) return

        const interval = setInterval(() => {
            nextImage()
        }, 5000)

        return () => clearInterval(interval)
    }, [nextImage, isAutoPlaying])

    // Pause auto-play on hover
    const handleMouseEnter = () => setIsAutoPlaying(false)
    const handleMouseLeave = () => setIsAutoPlaying(true)

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') {
                prevImage()
            } else if (e.key === 'ArrowRight') {
                nextImage()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [nextImage, prevImage])

    return (
        <div className='container mx-auto px-4 rounded'>
            <div 
                className='h-56 md:h-72 lg:h-96 w-full bg-slate-200 relative overflow-hidden rounded-lg shadow-lg'
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Navigation Arrows - Desktop */}
                <div className='absolute z-20 h-full w-full md:flex items-center justify-between px-4 hidden pointer-events-none'>
                    <button 
                        onClick={prevImage} 
                        className='bg-white/80 hover:bg-white shadow-md rounded-full p-2 transition-all duration-200 hover:scale-110 pointer-events-auto'
                        aria-label="Previous image"
                    >
                        <FaAngleLeft className="text-lg" />
                    </button>
                    <button 
                        onClick={nextImage} 
                        className='bg-white/80 hover:bg-white shadow-md rounded-full p-2 transition-all duration-200 hover:scale-110 pointer-events-auto'
                        aria-label="Next image"
                    >
                        <FaAngleRight className="text-lg" />
                    </button>
                </div>

                {/* Desktop and Tablet Version */}
                <div className='hidden md:flex h-full w-full'>
                    {desktopImages.map((imageUrl, index) => (
                        <div 
                            className='w-full h-full min-w-full min-h-full transition-transform duration-500 ease-in-out' 
                            key={`desktop-${index}`} 
                            style={{ transform: `translateX(-${currentImage * 100}%)` }}
                        >
                            <img 
                                src={imageUrl} 
                                alt={`Banner ${index + 1}`}
                                className='w-full h-full object-cover'
                                loading={index === 0 ? 'eager' : 'lazy'}
                                decoding="async"
                            />
                        </div>
                    ))}
                </div>

                {/* Mobile Version */}
                <div className='flex h-full w-full md:hidden'>
                    {mobileImages.map((imageUrl, index) => (
                        <div 
                            className='w-full h-full min-w-full min-h-full transition-transform duration-500 ease-in-out' 
                            key={`mobile-${index}`} 
                            style={{ transform: `translateX(-${currentImage * 100}%)` }}
                        >
                            <img 
                                src={imageUrl} 
                                alt={`Banner ${index + 1}`}
                                className='w-full h-full object-cover'
                                loading={index === 0 ? 'eager' : 'lazy'}
                                decoding="async"
                            />
                        </div>
                    ))}
                </div>

                {/* Dots Indicator */}
                <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20'>
                    {desktopImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                currentImage === index 
                                    ? 'bg-white scale-110' 
                                    : 'bg-white/50 hover:bg-white/75'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Loading indicator for better UX */}
                <div className='absolute top-2 right-2 z-20'>
                    {!isAutoPlaying && (
                        <div className='bg-black/50 text-white px-2 py-1 rounded text-xs'>
                            Paused
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BannerProduct