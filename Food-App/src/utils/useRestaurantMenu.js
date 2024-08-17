import { useState,useEffect } from "react";
import { MENU_API } from "../utils/constants";

const useRestaurantMenu = (resId) =>{
  
  const[resInfo, setResInfo] = useState(null);

  useEffect(()=>{
    fetchMenu();
  },[]);

  const fetchMenu = async () =>{
    try{
      // console.log(MENU_API + resId);
      const data = await fetch(MENU_API + resId);
      const json = await data.json();
      setResInfo(json.data);
       
    }catch(error){
      console.log("Error in useRestaurantMenu");
    }
  };

  return resInfo
};

export default useRestaurantMenu;