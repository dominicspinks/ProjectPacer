import ModalContainer from "./ModalContainer";

export default function AddCommentModal({
    visible,
    handleCloseModal,
    handleAddComment,
    handleCommentChange,
    fieldComment,
}) {
    const modalBody = (
        <div className='flex flex-col gap-4 p-6 flex-auto'>
            <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4'>
                <label
                    htmlFor='comment'
                    className='font-bold sm:w-32 text-left mb-1 sm:mb-0 sm:pt-2'>
                    Comment
                </label>
                <textarea
                    name='comment'
                    id='comment'
                    onChange={handleCommentChange}
                    value={fieldComment}
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
            onClick: handleAddComment,
            primary: true
        }
    ]

    if (!visible) return null;
    return (
        <ModalContainer
            visible={visible}
            handleCloseModal={handleCloseModal}
            title='Add Comment'
            body={modalBody}
            buttons={modalButtons}
        />
    );
}