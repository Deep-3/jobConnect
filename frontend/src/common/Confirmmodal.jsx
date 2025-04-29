import React from 'react'
import Iconbutton from './Iconbutton';

const Confirmmodal = ({modalData}) => {
  return (
    <>
      <div className="fixed inset-0 z-[1000] !mt-0 bg-black/50 grid place-items-center overflow-auto bg-opacity-50">
        <div className="w-11/12 max-w-[350px] rounded-lg border border-black-500 bg-white p-6">
          <p className="text-2xl font-semibold text-gray-800">
            {modalData?.text1}
          </p>
          <p className="mt-3 mb-5 leading-6 text-[#0B877D]">
            {modalData?.text2}
          </p>
          <div className="flex items-center gap-x-4">
            <Iconbutton
              onclick={modalData?.btn1Handler}
              text={modalData?.btn1Text}
            />
            <button
              className="cursor-pointer rounded-md bg-gray-200 py-[8px] px-[20px] font-semibold text-gray-900 hover:bg-gray-300"
              onClick={modalData?.btn2Handler}
            >
              {modalData?.btn2Text}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Confirmmodal;
