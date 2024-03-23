import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Contexts
import { useAuth } from '../../contexts/AuthProvider';

// Components
import ProjectList from '../../components/ProjectList/ProjectList';
import SpinnerIcon from '../../components/SpinnerIcon/SpinnerIcon';

// APIs
import * as ProjectAPI from '../../utilities/project-api';

// Icons
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function ProjectsPage({ projectNames, reloadProjects }) {
	const { user, userProjectInvites } = useAuth();
	const navigateTo = useNavigate();

	const [projects, setProjects] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [fieldProjectName, setFieldProjectName] = useState('');
	const [fieldProjectDescription, setFieldProjectDescription] = useState('');
	const [fieldProjectNameUnique, setFieldProjectNameUnique] = useState(true);
	const [loading, setLoading] = useState(true);

	// Reload project details
	useEffect(() => {
		if (!user) return;
		getProjectDetails();
	}, [user, userProjectInvites, projectNames]);

	// Get project details
	async function getProjectDetails() {
		if (projectNames.length === 0) return;

		const { projects, error } = await ProjectAPI.getProjectDetails(
			projectNames.map((project) => project.id)
		);

		if (error) {
			console.error(error);
			return;
		}

		setProjects(projects);

		if (loading) setLoading(false);
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

		// Add new project to db
		const { data, error } = await ProjectAPI.addProject(
			user.id,
			fieldProjectName,
			fieldProjectDescription
		);

		if (error) {
			console.error(error);
			return;
		}

		cleanModal();

		reloadProjects();
		navigateTo(`/projects/${data.id}`);
	}

	// Hide modal and clean modal fields
	function cleanModal() {
		setShowModal(false);
		setFieldProjectName('');
		setFieldProjectDescription('');
		setFieldProjectNameUnique(true);
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
			{loading ? (
				<SpinnerIcon />
			) : (
				<>
					{' '}
					<div className='block p-6  border  rounded-lg shadow bg-gray-800 border-gray-700'>
						<h5 className='mb-2 text-2xl font-bold tracking-tight mb-4'>
							My Projects
						</h5>

						<ProjectList
							projects={projects}
							reloadProjects={reloadProjects}
							setShowModal={setShowModal}
						/>
						{/* Modal sourced from https://www.creative-tim.com/learning-lab/tailwind-starter-kit/documentation/react/modals/regular */}
						{showModal ? (
							<>
								<div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
									<div className='relative w-auto my-6 mx-auto max-w-3xl'>
										{/*content*/}
										<div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-slate-700 outline-none focus:outline-none'>
											{/*header*/}
											<div className='flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t'>
												<h3 className='text-2xl font-semibold'>
													New Project
												</h3>
												<button
													className='ml-auto bg-transparent border-0 outline-none focus:outline-none'
													onClick={cleanModal}>
													<XMarkIcon className='text-white w-6 h-6 hover:text-slate-300' />
												</button>
											</div>
											{/*body*/}
											<div className='flex flex-col gap-4 p-6 flex-auto'>
												<div className='flex gap-4 items-center justify-between'>
													<label
														htmlFor='name'
														className='font-bold w-40 text-left'>
														Project Name
													</label>
													<input
														type='text'
														name='name'
														id='name'
														onChange={
															handleNewProjectName
														}
														value={fieldProjectName}
														className='w-full bg-gray-800 border border-gray-700 rounded p-2 m-0'
													/>
												</div>
												{!fieldProjectNameUnique && (
													<p>
														You already have a
														project with that name
													</p>
												)}
												<div className='flex gap-4 items-top justify-between'>
													<label
														htmlFor='description'
														className='pt-2 font-bold w-40 text-left'>
														Description
													</label>
													<textarea
														name='description'
														id='description'
														onChange={
															handleNewProjectDescription
														}
														value={
															fieldProjectDescription
														}
														className='w-full h-32 bg-gray-800 border border-gray-700 rounded p-2 m-0'
													/>
												</div>
											</div>
											{/*footer*/}
											<div className='flex gap-2 items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b'>
												<button
													className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'
													type='button'
													onClick={cleanModal}>
													Close
												</button>
												<button
													className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
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
					</div>
				</>
			)}
		</>
	);
}
