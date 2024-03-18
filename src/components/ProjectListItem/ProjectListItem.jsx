import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Contexts
import { useAuth } from '../../contexts/AuthProvider';

// API
import * as ProjectAPI from '../../utilities/project-api';

// Components
import ProjectListItemTeam from '../ProjectListItemTeam/ProjectListItemTeam';
import MenuDefault from '../MenuButton/MenuButton';

export default function ProjectListItem({ project, reloadProjects }) {
	const { user } = useAuth();
	const navigateTo = useNavigate();
	const [loading, setLoading] = useState(true);

	const menuItemsRef = useRef([
		{
			name: 'View',
			onClick: () => {
				handleViewButton();
			},
		},
	]);

	const projectRoleRef = useRef(
		project.project_member.filter((member) => member.user_id === user.id)[0]
			.role_type.role_type
	);

	// menuList archive button
	if (
		loading &&
		['owner', 'manager'].includes(projectRoleRef.current) &&
		!project.is_archived
	) {
		menuItemsRef.current.push({
			name: 'Archive',
			onClick: () => {
				handleArchiveButton();
			},
		});
	}

	// menuList set active button
	if (
		loading &&
		['owner', 'manager'].includes(projectRoleRef.current) &&
		project.is_archived
	) {
		menuItemsRef.current.push({
			name: 'Set Active',
			onClick: () => {
				handleSetActiveButton();
			},
		});
	}

	// menuLust delete button
	if (loading && ['owner'].includes(projectRoleRef.current)) {
		menuItemsRef.current.push({
			name: 'Delete',
			onClick: () => {
				handleDeleteButton();
			},
		});
	}

	if (loading) setLoading(false);

	function handleViewButton() {
		navigateTo(`/projects/${project.id}`);
	}

	async function handleArchiveButton() {
		console.log('archive');
		const { data, error } = await ProjectAPI.archiveProject(project.id);
		if (error) console.error(error);
		reloadProjects();
	}

	async function handleSetActiveButton() {
		const { data, error } = await ProjectAPI.unarchiveProject(project.id);
		if (error) console.error(error);
		reloadProjects();
	}

	async function handleDeleteButton() {
		const { error } = await ProjectAPI.deleteProject(project.id);
		if (error) console.error(error);
		reloadProjects();
	}

	return (
		<tr>
			<td>{project.name}</td>
			<td>
				{
					<ProjectListItemTeam
						key={project.project_member.user_id}
						members={project.project_member}
					/>
				}
			</td>
			<td>
				<MenuDefault menuItems={menuItemsRef.current} />
			</td>
		</tr>
	);
}
