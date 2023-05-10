import React from 'react'

const CommentsIcon = ({fill}) => {
  return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="28px"
    height="28px"
    viewBox="0 0 28 28"
    version="1.1"
    className='svg-clickable'
  >
    <g id="surface1">
      <path
        style={{
          stroke: "none",
          fillRule: "nonzero",
          fill: fill,
          fillOpacity: 1
        }}
        d="M 17.5 5.25 C 21.363281 5.25 24.5 8.386719 24.5 12.25 C 24.5 16.113281 21.363281 19.25 17.5 19.25 L 10.5 19.25 C 8.21875 19.25 6.183594 20.351562 4.90625 22.050781 C 4.054688 21.410156 3.5 20.390625 3.5 19.25 L 3.5 10.5 C 3.5 7.605469 5.859375 5.25 8.75 5.25 L 17.5 5.25 M 17.5 1.75 L 8.75 1.75 C 3.917969 1.75 0 5.667969 0 10.5 L 0 19.25 C 0 23.117188 3.136719 26.25 7 26.25 C 7 24.316406 8.570312 22.75 10.5 22.75 L 17.5 22.75 C 23.300781 22.75 28 18.046875 28 12.25 C 28 6.453125 23.300781 1.75 17.5 1.75 Z M 17.5 1.75 "
      />
    </g>
  </svg>
  )
}

export default CommentsIcon;