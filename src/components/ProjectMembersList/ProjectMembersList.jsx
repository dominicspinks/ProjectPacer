import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthProvider';
import { useRoles } from '../../contexts/RoleProvider';
import * as ProjectAPI from '../../utilities/project-api';
import ProjectMembersListItem from './ProjectMembersListItem';
import { PlusIcon } from '@heroicons/react/24/solid';
import InviteMemberModal from '../Modals/InviteMemberModal';

export default function ProjectMembersList({
    projectRole,
    project,
    handleRemoveMember,
    handleReloadProjectDetails,
}) {
    const { roles } = useRoles();
    const { user } = useAuth();

    const [showModal, setShowModal] = useState(false);
    const [fieldEmail, setFieldEmail] = useState('');
    const [fieldRole, setFieldRole] = useState('');
    const [fieldEmailUnique, setFieldEmailUnique] = useState(true);
    const [fieldRoleInvalid, setFieldRoleInvalid] = useState(false);
    const [projectInvites, setProjectInvites] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Sort member list by role priority
    const sortedMembers = useMemo(() => {
        if (!project?.project_member) return [];
        return [...project.project_member].sort(
            (a, b) => a.role_type.priority - b.role_type.priority
        );
    }, [project?.project_member]);

    // Sort invite list by role priority
    const sortedInvites = useMemo(() => {
        if (!projectInvites) return [];
        return [...projectInvites].sort(
            (a, b) => a.role_type.priority - b.role_type.priority
        );
    }, [projectInvites]);

    // Load list of invites for the project
    useEffect(() => {
        if (!project) return;
        if (projectRole === 'owner' || projectRole === 'manager') {
            getProjectInvites();
        }
    }, [project]);

    const getProjectInvites = useCallback(async () => {
        try {
            setIsLoading(true);
            const { data, error } = await ProjectAPI.getProjectInvites(project.id, user.id);
            if (error) throw error;
            setProjectInvites(data);
        } catch (err) {
            console.error("Failed to load project invites:", err);
        } finally {
            setIsLoading(false);
        }
    }, [project?.id]);

    // Check if email address already belongs to the project
    const findEmailInTeam = useCallback((email) => {
        if (!project?.project_member) return true;

        return !project.project_member.some(
            (member) =>
                member.profile.email?.toLowerCase() === email.toLowerCase()
        );
    }, [project?.project_member]);

    const validateForm = useCallback(() => {
        let isValid = true;

        if (!findEmailInTeam(fieldEmail)) {
            setFieldEmailUnique(false);
            isValid = false;
        }

        if (fieldRole === '') {
            setFieldRoleInvalid(true);
            isValid = false;
        }

        return isValid;
    }, [fieldEmail, fieldRole, findEmailInTeam]);

    async function handleInviteMember() {
        if (!validateForm()) return;

        try {
            await ProjectAPI.addProjectMember(
                project.id,
                fieldEmail,
                fieldRole,
                user.id
            );

            handleCloseModal();
            handleReloadProjectDetails();
            getProjectInvites();
        } catch (err) {
            console.error("Failed to invite member:", err);
            // Add user feedback here
        }
    }

    // Hide modal and clean modal fields
    const handleCloseModal = useCallback(() => {
        setShowModal(false);
        setFieldEmail('');
        setFieldRole('');
        setFieldEmailUnique(true);
        setFieldRoleInvalid(false);
    }, []);

    function handleEmailChange(e) {
        setFieldEmail(e.target.value);
        if (!findEmailInTeam(e.target.value)) {
            setFieldEmailUnique(false);
        } else {
            setFieldEmailUnique(true);
        }
    }

    function handleRoleChange(e) {
        setFieldRoleInvalid(false);
        setFieldRole(parseInt(e.target.value));
    }

    const handleRemoveInvite = useCallback(async (inviteId) => {
        setIsLoading(true);
        try {
            const { error } = await ProjectAPI.removeProjectInvite(inviteId, user.id);
            if (error) throw error;
            getProjectInvites();
        } catch (err) {
            console.error("Failed to remove invite:", err);
            // Consider adding a toast notification here
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <>
            {project?.project_member && (
                <div className="overflow-x-auto w-full">
                    <table className="min-w-full">
                        <thead>
                            <tr>
                                <th className="px-2 py-1 text-left align-middle h-10 w-[60%]">Name</th>
                                <th className="px-2 py-1 text-left align-middle h-10 w-[30%]">Role</th>
                                <th className="py-1 text-center align-middle h-10 w-[10%] px-0">
                                    {['owner', 'manager'].includes(projectRole) && (
                                        <button
                                            className='bg-blue-500 text-sm hover:bg-blue-700 text-white font-bold p-1 rounded'
                                            onClick={() => setShowModal(true)}
                                            disabled={isLoading}
                                            aria-label="Add team member">
                                            <PlusIcon className='w-5 h-5 text-white hover:text-gray-300' />
                                        </button>
                                    )}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedMembers.map((member) => (
                                <ProjectMembersListItem
                                    key={member.user_id}
                                    member={member}
                                    projectRole={projectRole}
                                    handleRemoveMember={handleRemoveMember}
                                />
                            ))}
                            {sortedInvites.map((member) => (
                                <ProjectMembersListItem
                                    key={member.email}
                                    member={member}
                                    projectRole={projectRole}
                                    handleRemoveMember={handleRemoveMember}
                                    handleRemoveInvite={handleRemoveInvite}
                                    isInvited={true}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <InviteMemberModal
                visible={showModal}
                handleCloseModal={handleCloseModal}
                handleInviteMember={handleInviteMember}
                handleEmailChange={handleEmailChange}
                handleRoleChange={handleRoleChange}
                fieldEmail={fieldEmail}
                fieldEmailUnique={fieldEmailUnique}
                fieldRole={fieldRole}
                fieldRoleInvalid={fieldRoleInvalid}
                roles={roles}
            />
        </>
    );
}
