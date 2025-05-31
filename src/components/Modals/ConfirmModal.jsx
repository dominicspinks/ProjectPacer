import ModalContainer from "./ModalContainer";

export default function ConfirmModal({
    visible,
    handleCancel,
    handleConfirm,
    message,
    confirmButtonLabel,
    idToDelete,
}) {
    const modalBody = (
        <div className='flex flex-col gap-4 p-6 flex-auto'>
            <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4'>
                <p>{message}</p>
            </div>
        </div>
    );

    const modalButtons = [
        {
            label: 'Cancel',
            onClick: handleCancel,
            primary: false
        },
        {
            label: confirmButtonLabel,
            onClick: () => handleConfirm(idToDelete),
            primary: true
        }
    ]

    if (!visible) return null;
    return (
        <ModalContainer
            visible={visible}
            handleCloseModal={handleCancel}
            title='Confirm'
            body={modalBody}
            buttons={modalButtons}
        />
    );
}