import ModalContainer from './ModalContainer';

export default function NewProjectModal({
    visible,
    handleCloseModal,
    handleAddProject,
    handleNewProjectName,
    handleNewProjectDescription,
    projectName,
    projectDescription,
    projectNameUnique
}) {
    const modalBody = (
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
    );

    const modalButtons = [
        {
            label: 'Close',
            onClick: handleCloseModal,
            primary: false
        },
        {
            label: 'Save Changes',
            onClick: handleAddProject,
            primary: true
        }
    ];

    return (
        <ModalContainer
            visible={visible}
            handleCloseModal={handleCloseModal}
            title="New Project"
            body={modalBody}
            buttons={modalButtons}
        />
    );
}