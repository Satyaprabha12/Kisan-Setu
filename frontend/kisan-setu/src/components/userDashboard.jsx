import banner1 from "../assets/user-banner.jpg"
import banner2 from "../assets/user-banner2.jpg"
import banner3 from "../assets/user-banner3.avif"
import banner4 from "../assets/user-banner4.jpg"
import { useEffect, useRef, useState } from "react"
import Nav from "./nav"
import { categories } from "../category"
import CategoryCard from "./categoryCard"
import { FaCircleChevronLeft } from "react-icons/fa6"
import { FaCircleChevronRight } from "react-icons/fa6"
import { useSelector } from "react-redux"
import FoodCard from "./foodCard"
import aboutImg from "../assets/aboutimg.jpg"
import { AiTwotoneMail } from "react-icons/ai"
import { FaPhoneVolume } from "react-icons/fa6"
import { IoLocationSharp } from "react-icons/io5"
import { FaFacebook } from "react-icons/fa6"
import { FaTwitter } from "react-icons/fa"
import { GrInstagram } from "react-icons/gr"
import { BsLinkedin } from "react-icons/bs"
import { FaArrowUp } from "react-icons/fa"

import { useNavigate } from "react-router-dom"

function UserDashboard() {
  const { currentCity, shopInMyCity, itemsInMyCity, searchItems, userData } =
    useSelector((state) => state.user)
  const cateScrollRef = useRef()
  const shopScrollRef = useRef()
  const navigate = useNavigate()
  const [showLeftCateButton, setShowLeftCateButton] = useState(false)
  const [showRightCateButton, setShowRightCateButton] = useState(false)
  const [showLeftShopButton, setShowLeftShopButton] = useState(false)
  const [showRightShopButton, setShowRightShopButton] = useState(false)
  const [updatedItemsList, setUpdatedItemsList] = useState([])
  const banners = [banner1, banner2, banner3, banner4]
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [banners.length])

  const handleFilterByCategory = (category) => {
    if (category === "All") {
      setUpdatedItemsList(itemsInMyCity)
    } else {
      const filteredList = itemsInMyCity?.filter(
        (i) => i.category?.toLowerCase().includes(category.toLowerCase())
      )
      console.log("Filtered List:", filteredList)
      setUpdatedItemsList(filteredList)
    }
  }

  useEffect(() => {
    setUpdatedItemsList(itemsInMyCity)
  }, [itemsInMyCity])

  const updateButton = (ref, setLeftButton, setRightButton) => {
    const element = ref.current
    if (element) {
      setLeftButton(element.scrollLeft > 0)
      setRightButton(
        element.scrollLeft + element.clientWidth < element.scrollWidth
      )
    }
  }
  const scrollHandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction == "left" ? -200 : 200,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    if (cateScrollRef.current) {
      updateButton(
        cateScrollRef,
        setShowLeftCateButton,
        setShowRightCateButton
      )
      updateButton(
        shopScrollRef,
        setShowLeftShopButton,
        setShowRightShopButton
      )
      cateScrollRef.current.addEventListener("scroll", () => {
        updateButton(
          cateScrollRef,
          setShowLeftCateButton,
          setShowRightCateButton
        )
      })
      shopScrollRef.current.addEventListener("scroll", () => {
        updateButton(
          shopScrollRef,
          setShowLeftShopButton,
          setShowRightShopButton
        )
      })
    }

    return () => {
      cateScrollRef?.current?.removeEventListener("scroll", () => {
        updateButton(
          cateScrollRef,
          setShowLeftCateButton,
          setShowRightCateButton
        )
      })
      shopScrollRef?.current?.removeEventListener("scroll", () => {
        updateButton(
          shopScrollRef,
          setShowLeftShopButton,
          setShowRightShopButton
        )
      })
    }
  }, [categories])

  return (
    <div className="w-screen min-h-screen flex flex-col gap-5 items-center overflow-y-auto">
      <Nav />

      {userData?.user?.role === "user" && (
        <div className="mb-4 w-full h-[500px] overflow-hidden rounded-lg shadow-md relative">
          <div
            className="flex h-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {banners.map((banner, index) => (
              <img
                key={index}
                src={banner}
                alt={`Banner ${index + 1}`}
                className="w-full shrink-0 h-full object-cover"
              />
            ))}
          </div>
        </div>
      )}
      {searchItems && searchItems.length > 0 && (
        <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-5 bg-white shadow-md rounded-2xl mt-4">
          <h1 className="text-gray-900 text-2xl sm:text-3xl font-semibold border-b border-gray-200 pb-2">
            Search Results
          </h1>
          <div className="w-full h-auto flex flex-wrap gap-6 justify-center">
            {searchItems.map((item) => (
              <FoodCard data={item} key={item._id} />
            ))}
          </div>
        </div>
      )}

      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-2.5">
        <h1 className="text-gray-800 font-bold font-serif text-center text-2xl sm:text-3xl">
          Inspiration for your first order
        </h1>
        <div className="w-full relative">
          {showLeftCateButton && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-orange-500 text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
              onClick={() => scrollHandler(cateScrollRef, "left")}
            >
              <FaCircleChevronLeft />
            </button>
          )}

          <div
            className="w-full flex overflow-x-auto gap-4 pb-2 "
            ref={cateScrollRef}
          >
            {categories.map((cate, index) => (
              <CategoryCard
                name={cate.category}
                image={cate.image}
                key={index}
                onClick={() => handleFilterByCategory(cate.category)}
              />
            ))}
          </div>
          {showRightCateButton && (
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-orange-500 text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
              onClick={() => scrollHandler(cateScrollRef, "right")}
            >
              <FaCircleChevronRight />
            </button>
          )}
        </div>
      </div>

      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-2.5">
        <h1 className="text-gray-800 text-2xl font-serif font-bold sm:text-3xl">
          Best Farmers Shop in {currentCity}
        </h1>
        <div className="w-full relative">
          {showLeftShopButton && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-orange-500 text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
              onClick={() => scrollHandler(shopScrollRef, "left")}
            >
              <FaCircleChevronLeft />
            </button>
          )}

          <div
            className="w-full flex overflow-x-auto gap-4 pb-2 "
            ref={shopScrollRef}
          >
            {shopInMyCity?.map((shop, index) => (
              <CategoryCard
                name={shop.name}
                image={shop.image}
                key={index}
                onClick={() => navigate(`/shop/${shop._id}`)}
              />
            ))}
          </div>
          {showRightShopButton && (
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-orange-500 text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
              onClick={() => scrollHandler(shopScrollRef, "right")}
            >
              <FaCircleChevronRight />
            </button>
          )}
        </div>
      </div>

      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-2.5">
        <h1 className="text-gray-800 text-2xl font-serif font-bold sm:text-3xl">
          Suggested Food Items
        </h1>

        <div className="w-full h-auto flex flex-wrap gap-5 justify-center">
          {updatedItemsList?.map((item, index) => (
            <FoodCard key={index} data={item} />
          ))}
        </div>
      </div>
      <section className="w-full max-w-6xl h-full p-5 mt-20 bg-white rounded-lg shadow-md flex flex-col items-center justify-center">
        <img src={aboutImg} alt="aboutImg" className="w-full h-[400px]" />
        <h2 className="text-4xl font-semibold font-serif mt-4 mb-4 text-center uppercase">About Us</h2>
        <p className="text-gray-700 leading-relaxed mb-5 text-center max-w-full">
          Kisan Setu is a modern digital bridge designed to connect farmers directly with customers, eliminating unnecessary middlemen and empowering the agricultural community through technology. This platform allows farmers to create their own online shops where they can list and sell their fresh produce, grains, dairy, and other farm-grown goods directly to consumers. For customers, Kisan Setu offers a transparent and reliable way to purchase high-quality, farm-fresh products straight from the source — ensuring better quality, fair pricing, and complete trust in what they consume. The website makes it simple for both sides to interact: farmers can easily manage their shops, track sales, and reach a wider market, while customers can explore different categories, browse by location, and get doorstep access to authentic, chemical-free produce. By building this farm-to-home connection, Kisan Setu not only supports local farmers in increasing their profits but also promotes sustainable living and strengthens the rural economy. It’s more than just an e-commerce website — it’s a movement towards fair trade, healthier food, and a stronger connection between those who grow and those who consume.
        </p>
      </section>

      <footer className="w-full max-w-full p-5 mt-10 bg-black rounded-t-lg shadow-md flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
         <h2 className="text-4xl font-serif font-semibold mb-4 text-orange-400">Contact Us</h2>
  <ul className="list-disc list-inside text-white/80 leading-relaxed space-y-2">
    <li>
      <span>
        <AiTwotoneMail size={25} className="text-orange-500 inline mr-2" />
        Email: support@kisansetuae.com
      </span>
    </li>
    <li>
      <FaPhoneVolume size={20} className="text-orange-500 inline mr-2"/>
      <span>Phone: +91 9876543210</span>
    </li>
    <li>
      <IoLocationSharp size={25} className="text-orange-500 inline mr-2" />
      <span>Address: 123 Farm Road, Mumbai, Maharastra.</span>
    </li>
  </ul> 
        </div>
        <div className="flex flex-col items-center md:items-end space-y-3">
        <button
    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition mb-5"
  >
    <FaArrowUp />
    Back to Top
  </button>
  

    <span className="text-2xl text-orange-500 font-semibold font-serif mb-3">Get Connect with Us</span>
    <div className="flex gap-4 text-white cursor-pointer text-2xl">
      <FaFacebook size={30} className="text-gray-300 hover:scale-110 hover:text-blue-600 transition" />
      <FaTwitter size={30} className="text-gray-300 hover:scale-110 hover:text-blue-400 transition" />
      <GrInstagram size={30}  className="text-gray-300 hover:scale-110 hover:text-pink-500 transition" />
      <BsLinkedin size={30} className="text-gray-300 hover:scale-110 hover:text-blue-700 transition" />
    </div>
  </div>
  
</footer>

    </div>
  )
}

export default UserDashboard
