
import { useState, useEffect } from 'react';

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  orientation: 'portrait' | 'landscape';
}

export function useDevice(): DeviceInfo {
  // Default to desktop for SSR
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    orientation: 'landscape',
  });

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Define breakpoints
      const isMobileDevice = width < 768;
      const isTabletDevice = width >= 768 && width < 1024;
      const isDesktopDevice = width >= 1024;
      
      // Determine orientation
      const isPortrait = height > width;
      
      setDeviceInfo({
        isMobile: isMobileDevice,
        isTablet: isTabletDevice,
        isDesktop: isDesktopDevice,
        orientation: isPortrait ? 'portrait' : 'landscape',
      });
    };
    
    // Initial check
    checkDevice();
    
    // Add resize listener
    window.addEventListener('resize', checkDevice);
    
    // Add orientation change listener for mobile devices
    window.addEventListener('orientationchange', checkDevice);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);
  
  return deviceInfo;
}
