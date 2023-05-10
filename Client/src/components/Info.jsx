import React from "react";
import chat_logo from '../../src/social_chat.jpg'
export default function Info() {
    return(
        <div className="absolute flex flex-row top-28 sm:top-16 md:top-20 lg:top-24 xl:top-32 left-0 h-3/4 w-full">
            <div className="flex flex-col justify-center w-1/2 h-full">
                <span className="text-black font-semibold text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">Simple.Secure.Reliable</span>
                <span className="block text-black font-semibold text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl mb-5 sm :mb-0 md:mb-3 lg:mb-4 xl:mb-5">Messaging</span>
                <span className="text-black text-xs sm:text-sm md:text-lg lg:text-xl xl:text-2xl">Simple, reliable, private messaging</span>
                <span className="text-black text-xs sm:text-sm md:text-lg lg:text-xl xl:text-2xl">available all over the world.</span>
            </div>
            <div className="flex justify-center sm:justify-start items-center w-1/2 h-full">
                <img src={chat_logo} alt="chat_logo" className="w-7/12"/>
            </div> 
        </div>
    )
}

