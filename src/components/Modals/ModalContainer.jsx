import { XMarkIcon } from '@heroicons/react/24/outline';

export default function ModalContainer({
    visible,
    handleCloseModal,
    title,
    body,
    buttons = []
}) {
    if (!visible) return null;

    return (
        <div className="modal-container">
            <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
                <div className='relative w-full px-4 sm:w-auto my-6 mx-auto max-w-sm md:max-w-md lg:max-w-lg'>
                    <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-slate-700 outline-none focus:outline-none'>
                        {/* Header */}
                        <div className='flex items-center justify-between p-4 border-b border-solid border-blueGray-200 rounded-t'>
                            <h3 className='text-xl font-semibold'>
                                {title}
                            </h3>
                            <button
                                className='ml-auto bg-transparent border-0 outline-none focus:outline-none'
                                onClick={handleCloseModal}>
                                <XMarkIcon className='text-white w-6 h-6 hover:text-slate-300' />
                            </button>
                        </div>

                        {/* Body */}
                        {body}

                        {/* Footer with buttons */}
                        {buttons.length > 0 && (
                            <div className='flex flex-col-reverse sm:flex-row gap-2 items-center justify-end p-4 border-t border-solid border-blueGray-200 rounded-b'>
                                {buttons.map((button, index) => (
                                    <button
                                        key={index}
                                        className={`w-full sm:w-auto ${button.primary
                                            ? 'bg-blue-500 hover:bg-blue-700 text-white font-bold'
                                            : 'bg-transparent hover:bg-blue-500 text-white font-semibold border border-blue-500 hover:border-transparent'
                                            } py-2 px-4 rounded`}
                                        type='button'
                                        onClick={button.onClick}>
                                        {button.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className='opacity-50 fixed inset-0 z-40 bg-black'></div>
        </div>
    );
}