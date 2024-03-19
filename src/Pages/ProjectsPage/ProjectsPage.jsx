import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthProvider';
import { useNavigate } from 'react-router-dom';

// Components
import ProjectList from '../../components/ProjectList/ProjectList';

// APIs
import * as ProjectAPI from '../../utilities/project-api';

export default function ProjectsPage({ projectNames, reloadProjects }) {
	const [projects, setProjects] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [fieldProjectName, setFieldProjectName] = useState('');
	const [fieldProjectDescription, setFieldProjectDescription] = useState('');
	const [fieldProjectNameUnique, setFieldProjectNameUnique] = useState(true);

	const { user, userProjectInvites } = useAuth();
	const navigateTo = useNavigate();

	useEffect(() => {
		if (!user) return;
		getProjectDetails();
	}, [user, userProjectInvites, projectNames]);

	useEffect(() => {
		if (!showModal) {
			setFieldProjectName('');
			setFieldProjectDescription('');
			setFieldProjectNameUnique(true);
		}
	}, [showModal]);

	async function getProjectDetails() {
		if (projectNames.length === 0) return;

		const { projects } = await ProjectAPI.getProjectDetails(
			projectNames.map((project) => project.id)
		);

		setProjects(projects);
	}

	// Validate and add new project to the db
	async function handleAddProject() {
		// check if project name is unique
		if (uniqueProjectName(fieldProjectName)) {
			setFieldProjectNameUnique(true);
		} else {
			setFieldProjectNameUnique(false);
			return;
		}

		const { data, error } = await ProjectAPI.addProject(
			user.id,
			fieldProjectName,
			fieldProjectDescription
		);
		if (error) console.error(error);
		setShowModal(false);
		reloadProjects();
		navigateTo(`/projects/${data.id}`);
	}

	function uniqueProjectName(projectName) {
		if (
			projectNames.find(
				(project) =>
					project.name.toLowerCase() === projectName.toLowerCase()
			)
		) {
			return false;
		} else {
			return true;
		}
	}

	function handleNewProjectName(e) {
		setFieldProjectName(e.target.value);

		if (uniqueProjectName(e.target.value)) {
			setFieldProjectNameUnique(true);
		} else {
			setFieldProjectNameUnique(false);
		}
	}

	function handleNewProjectDescription(e) {
		setFieldProjectDescription(e.target.value);
	}

	return (
		<>
			<div className='page-header'>
				<h1>My Projects</h1>
				<button className='btn' onClick={() => setShowModal(true)}>
					New Project
				</button>
			</div>
			<ProjectList projects={projects} reloadProjects={reloadProjects} />
			{/* Model sourced from https://www.creative-tim.com/learning-lab/tailwind-starter-kit/documentation/react/modals/regular */}
			{showModal ? (
				<>
					<div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
						<div className='relative w-auto my-6 mx-auto max-w-3xl'>
							{/*content*/}
							<div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-slate-700 outline-none focus:outline-none'>
								{/*header*/}
								<div className='flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t'>
									<h3 className='text-3xl font-semibold'>
										New Project
									</h3>
									<button
										className='p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none'
										onClick={() => setShowModal(false)}>
										<span className='text-white h-6 w-6 text-2xl block outline-none focus:outline-none'>
											×
										</span>
									</button>
								</div>
								{/*body*/}
								<div className='relative p-6 flex-auto'>
									<div>
										<label htmlFor='name'>
											Project Name
										</label>
										<input
											type='text'
											name='name'
											id='name'
											onChange={handleNewProjectName}
											value={fieldProjectName}
										/>
									</div>
									{!fieldProjectNameUnique && (
										<p>
											You already have a project with that
											name
										</p>
									)}
									<div>
										<label htmlFor='description'>
											Description
										</label>
										<textarea
											name='description'
											id='description'
											onChange={
												handleNewProjectDescription
											}
											value={fieldProjectDescription}
										/>
									</div>
								</div>
								{/*footer*/}
								<div className='flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b'>
									<button
										className='btn'
										type='button'
										onClick={() => setShowModal(false)}>
										Close
									</button>
									<button
										className='btn'
										type='button'
										onClick={handleAddProject}>
										Save Changes
									</button>
								</div>
							</div>
						</div>
					</div>
					<div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
				</>
			) : null}
		</>
	);
}
