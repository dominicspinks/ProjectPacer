import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthProvider';

// API
import * as ProjectAPI from '../../utilities/project-api';

// Components
import ProjectMembersList from '../../components/ProjectMembersList/ProjectMembersList';

export default function ProjectDetailsPage() {
	const { projectId } = useParams();
	const { user } = useAuth();
	const [project, setProject] = useState(null);

	const projectRoleRef = useRef();

	useEffect(() => {
		getProjectDetails();
	}, [projectId, user]);

	async function getProjectDetails() {
		const { data, error } = await ProjectAPI.getProject(user.id, projectId);
		if (error) console.error(error);
		setProject(data);
		console.log('details page - project', data);
		if (!data) return;
		projectRoleRef.current = data.project_member.filter(
			(member) => member.user_id === user.id
		)[0].role_type.role_type;
		console.log('role', projectRoleRef.current);
	}

	console.log('project', project);

	async function handleRemoveMember(userId) {
		console.log('click remove member', userId);
		const { data, error } = await ProjectAPI.removeProjectMember(
			projectId,
			userId
		);
		console.log('project remove member', data, error);
		getProjectDetails();

		// If a member removes themselves from a group, they should be navigated back to the project list page
		// ** TODO **
	}

	function handleReloadProjectDetails() {
		getProjectDetails();
	}

	return (
		<>
			{project && (
				<>
					<div className='flex justify-between items-end mb-2 mt-4'>
						<h1 className='p-0 m-0'>{project && project.name}</h1>
						<div className='flex items-end'>
							<p className='col-span-5 text-left items-end'>
								<span className='font-bold'>Date Created </span>
								{new Date(
									project.created_at
								).toLocaleDateString()}
							</p>
						</div>
					</div>
					<div className='container flex flex-col'>
						<div
							id='project-details'
							className='grid grid-cols-6 p-2'>
							<div className='col-span-1 text-left w-30 font-bold'>
								Date Created
							</div>
							<p className='col-span-5 text-left'>
								{new Date(
									project.created_at
								).toLocaleDateString()}
							</p>
							<div className='col-span-1 text-left w-30 font-bold'>
								Description
							</div>
							<p className='col-span-5 whitespace-pre-wrap text-left'>
								{project.description}
							</p>
						</div>
						<div id='project-members'>
							<h2 className='font-bold border-b-2 text-left pl-2'>
								Team
							</h2>
							<ProjectMembersList
								projectRole={projectRoleRef.current}
								project={project}
								handleRemoveMember={handleRemoveMember}
								handleReloadProjectDetails={
									handleReloadProjectDetails
								}
							/>
						</div>
					</div>
				</>
			)}
		</>
	);
}
