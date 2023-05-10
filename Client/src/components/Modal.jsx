import React from 'react'

const Modal = (props) => {
  return (
    <diaglog ref={props.ref}>
      {props.children}
    </diaglog>
  )
}

export default Modal