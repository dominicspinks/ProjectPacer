import { useState, useEffect } from 'react';

// Contexts
import { useAuth } from '../../contexts/AuthProvider';
import { useRoles } from '../../contexts/RoleProvider';

// API
import * as ProjectAPI from '../../utilities/project-api';

// Components
import ProjectMembersListItem from '../ProjectMembersListItem/ProjectMembersListItem';

// Icons
import { XMarkIcon } from '@heroicons/react/24/outline';

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

	// Load list of invites for the project
	useEffect(() => {
		if (!project) return;
		getProjectInvites();
	}, [project]);

	async function getProjectInvites() {
		const { data, error } = await ProjectAPI.getProjectInvites(project.id);
		if (error) console.error(error);
		setProjectInvites(data);
	}

	// Sort member list by role priority
	project.project_member.sort(
		(a, b) => a.role_type.priority - b.role_type.priority
	);

	function findEmailInTeam(email) {
		if (
			project.project_member.find(
				(member) =>
					member.profile.email.toLowerCase() === email.toLowerCase()
			)
		) {
			return false;
		}
		return true;
	}

	async function handleInviteMember() {
		// Check if email address already belongs to the project
		if (!findEmailInTeam(fieldEmail)) {
			setFieldEmailUnique(false);
			return;
		}

		if (fieldRole === '') {
			setFieldRoleInvalid(true);
			return;
		}

		const { data, error } = await ProjectAPI.addProjectMember(
			project.id,
			fieldEmail,
			fieldRole,
			user.id
		);

		cleanModal();
		handleReloadProjectDetails();
		getProjectInvites();
	}

	// Hide modal and clean modal fields
	function cleanModal() {
		setShowModal(false);
		setFieldEmail('');
		setFieldRole('');
		setFieldEmailUnique(true);
		setFieldRoleInvalid(false);
	}

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

	async function handleRemoveInvite(inviteId) {
		//
		const { error } = await ProjectAPI.removeProjectInvite(inviteId);

		if (error) console.error(error);
		getProjectInvites();
	}

	return (
		<>
			{project.project_member && (
				<table>
					<thead>
						<tr>
							<th>Name</th>
							<th>Role</th>
							<th>
								{['owner', 'manager'].includes(projectRole) && (
									<button
										className='bg-blue-500 text-sm  hover:bg-blue-700 text-white font-bold py-1 px-2 rounded'
										onClick={() => setShowModal(true)}>
										Invite
									</button>
								)}
							</th>
						</tr>
					</thead>
					<tbody>
						{project?.project_member.map((member) => (
							<ProjectMembersListItem
								key={member.user_id}
								member={member}
								projectRole={projectRole}
								handleRemoveMember={handleRemoveMember}
							/>
						))}
						{projectInvites?.map((member) => (
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
			)}
			{showModal ? (
				<>
					<div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
						<div className='relative w-auto my-6 mx-auto max-w-3xl'>
							{/*content*/}
							<div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-slate-700 outline-none focus:outline-none'>
								{/*header*/}
								<div className='flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t'>
									<h3 className='text-2xl font-semibold'>
										Invite Member
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
											htmlFor='email'
											className='font-bold w-32 text-left'>
											Email Address
										</label>
										<input
											type='email'
											name='email'
											id='email'
											onChange={handleEmailChange}
											value={fieldEmail}
											required
											className='bg-gray-800 border border-gray-700 rounded p-2 m-0 min-w-60'
										/>
									</div>
									{!fieldEmailUnique && (
										<p className='mb-2'>
											This user is already in the team
										</p>
									)}
									<div className='flex gap-4 items-center justify-start'>
										<label
											htmlFor='roleId'
											className='pt-2 font-bold w-32 text-left'>
											Role
										</label>
										<select
											name='roleId'
											id='roleId'
											onChange={handleRoleChange}
											value={fieldRole}
											required
											className='capitalize'>
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
										{fieldRoleInvalid && (
											<p className='mb-2'>
												Please select a role
											</p>
										)}
									</div>
								</div>
								{/*footer*/}
								<div className='flex gap-2 items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b'>
									<button
										className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'
										type='button'
										onClick={() => setShowModal(false)}>
										Close
									</button>
									<button
										className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
										type='button'
										onClick={handleInviteMember}>
										Invite
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
