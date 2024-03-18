import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// API
import * as ProjectAPI from '../../utilities/project-api';

// Components
import ProjectListItemTeam from '../ProjectListItemTeam/ProjectListItemTeam';
import MenuDefault from '../MenuButton/MenuButton';

export default function ProjectListItem({ project, reloadProjects }) {
	const navigateTo = useNavigate();

	const menuItemsRef = useRef([
		{
			name: 'Edit',
			onClick: () => {
				handleEditButton();
			},
			active: true,
		},
		{
			name: 'Archive',
			onClick: () => {
				handleArchiveButton();
			},
			active: true,
		},
		{
			name: 'Set Active',
			onClick: () => {
				handleSetActiveButton();
			},
			active: false,
		},
		{
			name: 'Delete',
			onClick: () => {
				handleDeleteButton();
			},
			active: true,
		},
	]);

	if (project.is_archived) {
		menuItemsRef.current[1].active = false;
		menuItemsRef.current[2].active = true;
	}

	function handleEditButton() {
		console.log('edit');
		navigateTo(`/projects/${project.id}`);
	}

	async function handleArchiveButton() {
		console.log('archive');
		const { data, error } = await ProjectAPI.archiveProject(project.id);
		console.log('archive', data, error);
		reloadProjects();
	}

	async function handleSetActiveButton() {
		console.log('set active');
		const { data, error } = await ProjectAPI.unarchiveProject(project.id);
		console.log('set active', data, error);
		reloadProjects();
	}

	async function handleDeleteButton() {
		console.log('delete');
		const { error } = await ProjectAPI.deleteProject(project.id);
		console.log('delete', error);
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
