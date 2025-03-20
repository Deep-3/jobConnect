import React from 'react'
import Iconbutton from './Iconbutton';

const Confirmmodal = ({modalData,onClose}) => {
  return (
    <>
      {/* Dark overlay with blur */}
      <div className="fixed inset-0 z-[999]  bg-opacity-50 backdrop-blur-[4px]" />

      {/* Modal */}
      <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto">
        <div className="w-11/12 max-w-[350px] rounded-lg border border-slate-200 bg-white p-6">
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
              onClose={onClose}
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
