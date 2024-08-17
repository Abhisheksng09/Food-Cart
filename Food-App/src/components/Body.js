import ResturantCard, { withPromotedLabel } from "./ResturantCard";
import { useState, useEffect } from "react";
import Shimmer from "./Shimmer";
import { Link } from "react-router-dom";
import useOnlineStatus from "../utils/useOnlineStatus.js";
import { ITEM_URL } from "../utils/constants.js";


const Body = () => {

  const [bestOffer, setBestOffer] = useState([]);
  const [listOfResturant, setlistOfResturant] = useState([]);
  const [filteredRestaurant, setFilteredRestaurant] = useState([]);
  const [searchText, setSearchText] = useState("");

  const ResturantCardPromoted = withPromotedLabel(ResturantCard);

  useEffect(() => {
    fetchdata();
  }, []);

  const fetchdata = async () => {
    try {
      const data = await fetch(
        // 'https://www.swiggy.com/dapi/restaurants/list/v5?lat=30.3164945&lng=78.03219179999999&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING',
        'https://corsproxy.io/?https://www.swiggy.com/dapi/restaurants/list/v5?lat=30.3164945&lng=78.03219179999999&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING',
      );
      const json = await data.json();

      setlistOfResturant(json?.data?.cards[4]?.card?.card?.gridElements?.infoWithStyle?.restaurants);
      setFilteredRestaurant(json?.data?.cards[4]?.card?.card?.gridElements?.infoWithStyle?.restaurants);
      setBestOffer(json?.data?.cards[0]?.card?.card?.imageGridCards?.info);
      // console.log(json?.data?.cards[4]?.card?.card?.gridElements?.infoWithStyle?.restaurants);
      // console.log(json?.data?.cards[0]?.card?.card?.imageGridCards?.info);
    } catch (error) {
      console.log("Error");
    }
  }

  if (listOfResturant === 0) {
    return <Shimmer />;
  }

  const onlineStatus = useOnlineStatus();
  if (onlineStatus === false) {
    return <h1>Internet Connection Interupted!!</h1>
  }

  return (
    <>
      <div className="w-9/12 m-auto">

        <div className="p-1 bg-gray-100 rounded-xl shadow-xl shadow-slate-200">
          <div className="m-4 font-bold text-2xl">Best Offers For You</div>
            <div className="flex place-content-evenly">
              {
                bestOffer.slice(0, 3).map((res) => {
                  return <Link key={res.id} className="m-1">
                    {
                      <img src={ITEM_URL + res.imageId} className="h-52 w-full" />
                    }
                  </Link>
                })
              }
            </div>
        </div>

        <div className="flex">
          <div className="search m-4 p-4 " >
            <input type="text" className="border-black border rounded-sm" value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
              }} />

            <button className="px-4 py-0.9 m-4 bg-green-300 rounded-sm"
              onClick={() => {

                const filteredRestaurant = listOfResturant.filter(
                  (res) => res.info.name.toLowerCase().includes(searchText.toLowerCase())
                );

                setFilteredRestaurant(filteredRestaurant);

              }}>Search</button>

          </div>



          <div className="m-4 p-4 flex items-center">
            <button
              className="px-4 py-0.9 m-4 bg-gray-300 rounded-sm"
              onClick={() => {

                console.log("top rated clicked");
                const filteredList = listOfResturant.filter(
                  (res) => res.info.avgRating >= 4.0
                )
                setFilteredRestaurant(filteredList);
              }}>

              Top rated Resturant
            </button>
          </div>

        </div>

        <div className="p-1 bg-gray-100 rounded-xl shadow-xl shadow-slate-200">
          <h2 className="m-4 font-bold text-2xl">Restaurants With Online Food Delivery Near You</h2>
          <div className="flex flex-wrap place-content-evenly ">
            {
              Array.isArray(filteredRestaurant) && filteredRestaurant.map((res) => {
                return <Link
                  key={res.info.id}
                  to={"/restaurants/" + res.info.id} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {
                    res.info.aggregatedDiscountInfoV3 ? <ResturantCardPromoted resData={res} /> : <ResturantCard resData={res} />
                  }
                </Link>
              })
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default Body;