"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const BrandChannelContext = createContext();

export function BrandChannelProvider({ children }) {
  const router = useRouter();
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load saved context from localStorage
  useEffect(() => {
    const savedContext = localStorage.getItem('brandChannelContext');
    if (savedContext) {
      try {
        const { brandId, channelId } = JSON.parse(savedContext);
        setSelectedBrand(brandId);
        setSelectedChannel(channelId);
      } catch (error) {
        console.error('Error parsing saved context:', error);
      }
    }
    setLoading(false);
  }, []);

  // Fetch brands
  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/brands');
      const data = await response.json();
      if (data.success) {
        setBrands(data.brands);

        // If no brand is selected but we have brands, auto-select the first one
        if (!selectedBrand && data.brands.length > 0) {
          selectBrand(data.brands[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const selectBrand = (brandId) => {
    setSelectedBrand(brandId);
    setSelectedChannel(null); // Reset channel when brand changes

    // Save to localStorage
    localStorage.setItem('brandChannelContext', JSON.stringify({
      brandId,
      channelId: null
    }));
  };

  const selectChannel = (channelId) => {
    setSelectedChannel(channelId);

    // Save to localStorage
    if (selectedBrand) {
      localStorage.setItem('brandChannelContext', JSON.stringify({
        brandId: selectedBrand,
        channelId
      }));
    }
  };

  const getCurrentBrand = () => {
    return brands.find(b => b.id === selectedBrand);
  };

  const getCurrentChannel = () => {
    const brand = getCurrentBrand();
    if (!brand) return null;
    return brand.channels?.find(c => c.id === selectedChannel);
  };

  const getChannelsForCurrentBrand = () => {
    const brand = getCurrentBrand();
    return brand?.channels || [];
  };

  const value = {
    selectedBrand,
    selectedChannel,
    brands,
    loading,
    selectBrand,
    selectChannel,
    getCurrentBrand,
    getCurrentChannel,
    getChannelsForCurrentBrand,
    refreshBrands: fetchBrands
  };

  return (
    <BrandChannelContext.Provider value={value}>
      {children}
    </BrandChannelContext.Provider>
  );
}

export function useBrandChannel() {
  const context = useContext(BrandChannelContext);
  if (!context) {
    throw new Error('useBrandChannel must be used within a BrandChannelProvider');
  }
  return context;
}
