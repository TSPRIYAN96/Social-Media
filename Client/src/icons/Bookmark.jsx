import React from 'react'

const Bookmark = ({fill}) => {
  return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="27px"
    height="27px"
    viewBox="0 0 27 27"
    version="1.1"
    className='svg-clickable'
  >
    <g id="surface1">
      <path
        style={{
          stroke: "none",
          fillRule: "evenodd",
          fill: fill,
          fillOpacity: 1
        }}
        d="M 17.550781 20.363281 C 14.96875 17.714844 15.929688 18.699219 13.5 16.210938 C 11.089844 18.679688 11.71875 18.039062 9.449219 20.363281 L 9.449219 2.699219 L 17.550781 2.699219 Z M 6.75 0 L 6.75 27 L 13.5 20.078125 L 20.25 27 L 20.25 0 Z M 6.75 0 "
      />
    </g>
  </svg>
  )
}

export default Bookmark