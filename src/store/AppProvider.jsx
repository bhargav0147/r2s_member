import { createContext, useEffect, useState } from 'react';

import axiosInstance from 'src/utils/axios';

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [promotions, setPromotions] = useState([]);
  const [supportTitle, setSupportTitle] = useState([]);

  const getPromotions = async () => {
    try {
      const { data } = await axiosInstance.get('/api/member/promotion/current');
      console.log(data);
      setPromotions(data?.data?.promotionData);
    } catch (error) {
      console.log(error);
    }
  };

  const getSupportTitle = async () => {
    let page = 1;
    let totalpage = 1;
    const limit = 5;
    try {
      while (page <= totalpage) {
        const { data } = await axiosInstance.get(`/api/member/support/title?page=${page}&limit=${limit}`);
        totalpage = Math.ceil((data.total || 0) / limit);
        setSupportTitle(prevTitles => [...prevTitles, ...(data?.data || [])]);
        page += 1;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPromotions();
    getSupportTitle();
  }, []);
  return <AppContext.Provider value={{ promotions, supportTitle }}>{children}</AppContext.Provider>;
};

export default AppProvider;
