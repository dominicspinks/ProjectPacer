import { XMarkIcon } from '@heroicons/react/24/outline';

export default function NewProjectModal({
    visible,
    handleCleanModal,
    handleAddProject,
    handleNewProjectName,
    handleNewProjectDescription,
    projectName,
    projectDescription,
    projectNameUnique
}) {
    if (!visible) return null;

    return (
        <div className="modal-container">
            <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
                <div className='relative w-full px-4 sm:w-auto my-6 mx-auto max-w-sm md:max-w-md lg:max-w-lg'>
                    <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-slate-700 outline-none focus:outline-none'>
                        {/* Modal Header */}
                        <div className='flex items-center justify-between p-4 border-b border-solid border-blueGray-200 rounded-t'>
                            <h3 className='text-xl font-semibold'>
                                New Project
                            </h3>
                            <button
                                className='ml-auto bg-transparent border-0 outline-none focus:outline-none'
                                onClick={handleCleanModal}>
                                <XMarkIcon className='text-white w-6 h-6 hover:text-slate-300' />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className='flex flex-col gap-4 p-4 flex-auto'>
                            <div className='flex flex-col gap-2'>
                                <label
                                    htmlFor='name'
                                    className='font-bold text-left'>
                                    Project Name
                                </label>
                                <input
                                    type='text'
                                    name='name'
                                    id='name'
                                    onChange={handleNewProjectName}
                                    value={projectName}
                                    className='w-full bg-gray-800 border border-gray-700 rounded p-2 m-0'
                                />
                            </div>

                            {!projectNameUnique && (
                                <p className='text-red-400 text-sm'>
                                    You already have a project with that name
                                </p>
                            )}

                            <div className='flex flex-col gap-2'>
                                <label
                                    htmlFor='description'
                                    className='font-bold text-left'>
                                    Description
                                </label>
                                <textarea
                                    name='description'
                                    id='description'
                                    onChange={handleNewProjectDescription}
                                    value={projectDescription}
                                    className='w-full h-24 bg-gray-800 border border-gray-700 rounded p-2 m-0'
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className='flex flex-col-reverse sm:flex-row gap-2 items-center justify-end p-4 border-t border-solid border-blueGray-200 rounded-b'>
                            <button
                                className='w-full sm:w-auto bg-transparent hover:bg-blue-500 text-white font-semibold py-2 px-4 border border-blue-500 hover:border-transparent rounded'
                                type='button'
                                onClick={handleCleanModal}>
                                Close
                            </button>
                            <button
                                className='w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                                type='button'
                                onClick={handleAddProject}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
        </div>
    );
}