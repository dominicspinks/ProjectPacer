import ModalContainer from "./ModalContainer";

export default function InviteMemberModal({
    visible,
    handleCloseModal,
    handleInviteMember,
    handleEmailChange,
    handleRoleChange,
    fieldEmail,
    fieldEmailUnique,
    fieldRole,
    fieldRoleInvalid,
    roles
}) {
    const modalBody = (
        <div className='flex flex-col gap-4 p-4 flex-auto'>
            <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4'>
                <label
                    htmlFor='email'
                    className='font-bold sm:w-32 text-left'>
                    Email Address
                </label>
                <input
                    type='email'
                    name='email'
                    id='email'
                    onChange={handleEmailChange}
                    value={fieldEmail}
                    required
                    className='w-full bg-gray-800 border border-gray-700 rounded p-2 m-0'
                />
            </div>
            {!fieldEmailUnique && (
                <p className='text-red-400 text-sm'>
                    This user is already in the team
                </p>
            )}
            <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4'>
                <label
                    htmlFor='roleId'
                    className='font-bold sm:w-32 text-left sm:pt-2'>
                    Role
                </label>
                <select
                    name='roleId'
                    id='roleId'
                    onChange={handleRoleChange}
                    value={fieldRole}
                    required
                    className='capitalize pr-8 w-full bg-gray-800 border border-gray-700 rounded p-2 m-0'>
                    <option value='' hidden>
                        -- Select Role --
                    </option>
                    {roles &&
                        roles
                            .filter(
                                (role) =>
                                    role.role_type !==
                                    'owner'
                            )
                            .map((role) => (
                                <option
                                    key={role.id}
                                    value={role.id}
                                    className='capitalize'>
                                    {role.role_type}
                                </option>
                            ))}
                </select>
            </div>
            {fieldRoleInvalid && (
                <p className='text-red-400 text-sm'>
                    Please select a role
                </p>
            )}
        </div>
    );

    const modalButtons = [
        {
            label: 'Close',
            onClick: handleCloseModal,
            primary: false
        },
        {
            label: 'Invite',
            onClick: handleInviteMember,
            primary: true
        }
    ];

    return (
        <ModalContainer
            visible={visible}
            handleCloseModal={handleCloseModal}
            title='Invite Member'
            body={modalBody}
            buttons={modalButtons}
        />
    );
}