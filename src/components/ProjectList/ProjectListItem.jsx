import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthProvider';
import * as ProjectAPI from '../../utilities/project-api';
import ProjectListItemTeam from './ProjectListItemTeam';
import MenuDefault from '../Buttons/MenuButton';

export default function ProjectListItem({ project, reloadProjects }) {
    const { user } = useAuth();
    const navigateTo = useNavigate();

    // Get the user's role in the current project
    const projectRole = useMemo(() => {
        return project?.project_member?.find((member) => member.user_id === user.id)
            ?.role_type?.role_type ?? '';
    }, [project, user.id]);

    // Generate menu items based on user role and project status
    const menuItems = useMemo(() => {
        const items = [
            {
                name: 'View',
                onClick: handleViewButton,
            },
        ];

        // Add Archive button for owners and managers of non-archived projects
        if (['owner', 'manager'].includes(projectRole) && !project.is_archived) {
            items.push({
                name: 'Archive',
                onClick: handleArchiveButton,
            });
        }

        // Add Set Active button for owners and managers of archived projects
        if (['owner', 'manager'].includes(projectRole) && project.is_archived) {
            items.push({
                name: 'Set Active',
                onClick: handleSetActiveButton,
            });
        }

        // Add Delete button for owners
        if (projectRole === 'owner') {
            items.push({
                name: 'Delete',
                onClick: handleDeleteButton,
            });
        }

        return items;
    }, [projectRole, project.is_archived]);

    function handleViewButton() {
        navigateTo(`/projects/${project.id}`);
    }

    async function handleArchiveButton() {
        try {
            await ProjectAPI.archiveProject(project.id);
            reloadProjects();
        } catch (error) {
            console.error('Error archiving project:', error);
        }
    }

    async function handleSetActiveButton() {
        try {
            await ProjectAPI.unarchiveProject(project.id);
            reloadProjects();
        } catch (error) {
            console.error('Error unarchiving project:', error);
        }
    }

    async function handleDeleteButton() {
        try {
            await ProjectAPI.deleteProject(project.id);
            reloadProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    }

    return (
        <tr className="text-sm md:text-base">
            <td className="p-2">{project.name}</td>
            <td className="p-2">
                <ProjectListItemTeam
                    key={project.project_member.user_id}
                    members={project.project_member}
                />
            </td>
            <td className="px-1 py-2 text-center w-[10%]">
                <MenuDefault menuItems={menuItems} />
            </td>
        </tr>
    );
}
