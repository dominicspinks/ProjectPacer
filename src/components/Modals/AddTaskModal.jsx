import ModalContainer from "./ModalContainer";

export default function AddTaskModal({
    visible,
    handleCloseModal,
    handleAddTask,
    handleNameChange,
    fieldName,
    handleDescriptionChange,
    fieldDescription
}) {
    const modalBody = (
        <div className='flex flex-col gap-4 p-6 flex-auto'>
            <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4'>
                <label
                    htmlFor='name'
                    className='font-bold sm:w-32 text-left mb-1 sm:mb-0'>
                    Name
                </label>
                <input
                    name='name'
                    id='name'
                    onChange={handleNameChange}
                    value={fieldName}
                    required
                    className='w-full bg-gray-800 border border-gray-700 rounded p-2 m-0'
                />
            </div>
            <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4'>
                <label
                    htmlFor='description'
                    className='font-bold sm:w-32 text-left mb-1 sm:mb-0 sm:pt-2'>
                    Description
                </label>
                <input
                    name='description'
                    id='description'
                    onChange={handleDescriptionChange}
                    value={fieldDescription}
                    className='w-full bg-gray-800 border border-gray-700 rounded p-2 m-0'
                />
            </div>
        </div>
    );

    const modalButtons = [
        {
            label: 'Close',
            onClick: handleCloseModal,
            primary: false
        },
        {
            label: 'Save',
            onClick: handleAddTask,
            primary: true
        }
    ]

    if (!visible) return null;
    return (
        <ModalContainer
            visible={visible}
            handleCloseModal={handleCloseModal}
            title='Add Task'
            body={modalBody}
            buttons={modalButtons}
        />
    );
}