import React from "react";
import dp from '/src/profile_dp.jpg'
export default function Dashboard() {
    return (
        <div className="w-full h-full flex">
            <div className="w-2/3 h-full bg-wcolor flex flex-col border-2 border-gray-400 px-28 sm:px-16 md:px-20 lg:px-24 xl:px-28">
                <div className="flex items-center h-2/5">
                    <div className="w-1/3 flex justify-center">
                        <img src={dp} alt="profile_dp" className="rounded-full w-8 h-8 sm:w-16 sm:h-16 md:h-20 md:w-20 lg:h-28 lg:w-28 xl:h-36 xl:w-36"/>
                    </div>
                    <div className="flex flex-col items-start w-4/5 font-semibold sm:p-2 md:p-4 lg:p-6 xl:p-8">
                        <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">shelby_sigma</div>
                        <div className="sm:text-xs md:text-sm lg:text-md xl:text-lg">thomas@gmail.com</div>
                        <div className="flex text-xs md:text-sm lg:text-md xl:text-lg font-normal">
                            <div>0 Posts &emsp; 100 Followers &emsp; 100 Following</div>
                        </div>
                        <div>Thomas Shelby</div>
                        <p className="sm:text -xs xl:text-sm font-normal">Stay Woke!</p>
                    </div>
                    {/* <div>
                        <button className="w-32 border-2 border-gray-400">Messages</button>
                    </div> */}
                </div>
                <div className="h-full border-t border-gray-300">Posts</div>
            </div>
            <div className="w-1/3 h-full bg-wcolor">
            </div>
        </div>
    )
}