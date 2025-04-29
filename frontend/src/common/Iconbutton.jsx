import React from 'react'

const Iconbutton = ({text,onclick,children,disabled,outline=false,type,customClass}) => {

  return (
     <button disabled={disabled} onClick={onclick} type={type} className='px-4 py-2 bg-[#0B877D] text-white font-medium rounded-lg hover:bg-[#097267]'>
        {
            children?(
                <>
                <span>
                {text}
            </span>
            {children}
            </>
            ):(text)
        }
     </button>
  )
}

export default Iconbutton
