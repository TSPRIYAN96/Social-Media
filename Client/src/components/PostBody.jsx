import React from 'react'
import Tag from './Tag'
import SmartText from './SmartText';

const PostBody = ({data}) => {




  return (
    <div className='w-full mb-4'>
        <div className='text-xl text-left text-clip py-3'>
            <SmartText text={data.text_content}/>
        </div>
        <div className='text-left my-3'>
                 {data.links.map((link, id) => <a target="_blank" className='block' href={link} key={id}>{link}</a>)}
        </div>
        <div className='text-left my-3'>
            {data.tags.map((tag, id) => <Tag  key={id} tagName={tag}/>)}
        </div>
    </div>
  )
}

export default PostBody