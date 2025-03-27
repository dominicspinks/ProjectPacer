import ModalContainer from './ModalContainer';

export default function NewTaskModal({
    visible,
    handleCloseModal,
    handleSaveTask,
    setShowModal,
    currentTask,
    setCurrentTask
}) {
    const modalBody = (
        <div className='flex flex-col gap-4 p-4 flex-auto'>
            <div className='flex flex-col md:flex-row md:items-center md:gap-4'>
                <label
                    htmlFor='name'
                    className='font-bold md:w-40 text-left mb-1 md:mb-0'>
                    Name
                </label>
                <input
                    type='text'
                    name='name'
                    id='name'
                    onChange={(e) =>
                        setCurrentTask({
                            ...currentTask,
                            name: e.target.value,
                        })
                    }
                    value={
                        currentTask
                            ? currentTask.name
                            : ''
                    }
                    className='w-full bg-gray-800 border border-gray-700 rounded p-2 m-0'
                />
            </div>
            <div className='flex flex-col md:flex-row md:gap-4'>
                <label
                    htmlFor='description'
                    className='font-bold md:w-40 text-left mb-1 md:mb-0 md:pt-2'>
                    Description
                </label>
                <textarea
                    name='description'
                    id='description'
                    onChange={(e) =>
                        setCurrentTask({
                            ...currentTask,
                            description: e.target.value,
                        })
                    }
                    value={
                        currentTask?.description
                            ? currentTask.description
                            : ''
                    }
                    className='w-full h-32 bg-gray-800 border border-gray-700 rounded p-2 m-0'
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
            onClick: () => {
                handleSaveTask(currentTask);
                setShowModal(false);
            },
            primary: true
        }
    ];

    return (
        <ModalContainer
            visible={visible}
            handleCloseModal={handleCloseModal}
            title={currentTask ? 'Edit Task' : 'Add New Task'}
            body={modalBody}
            buttons={modalButtons}
        />
    );
}