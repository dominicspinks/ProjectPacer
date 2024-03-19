import { useState, useEffect } from 'react';

// Contexts
import { useAuth } from '../../contexts/AuthProvider';
import { useRoles } from '../../contexts/RoleProvider';

// API
import * as ProjectAPI from '../../utilities/project-api';

// Components
import ProjectMembersListItem from '../ProjectMembersListItem/ProjectMembersListItem';

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

	console.log('project members list', project.project_member);

	// Load list of invites for the project
	useEffect(() => {
		getProjectInvites();
	}, [project.id]);
	console.log('project invites', projectInvites);
	async function getProjectInvites() {
		const { data, error } = await ProjectAPI.getProjectInvites(project.id);
		if (error) console.error(error);
		setProjectInvites(data);
	}

	// Clear field values when modal is closed
	useEffect(() => {
		if (!showModal) {
			setFieldEmail('');
			setFieldRole('');
			setFieldEmailUnique(true);
		}
	}, [showModal]);

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
		console.log('project', project, fieldRole);
		const { data, error } = await ProjectAPI.addProjectMember(
			project.id,
			fieldEmail,
			fieldRole,
			user.id
		);
		console.log('project member list - invite member', data, error);
		setShowModal(false);
		handleReloadProjectDetails();
		getProjectInvites();
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
		console.log(parseInt(e.target.value));
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
								<button
									className='btn px-3 py-2 text-xs'
									onClick={() => setShowModal(true)}>
									Invite
								</button>
							</th>
						</tr>
					</thead>
					<tbody>
						{project.project_member.map((member) => (
							<ProjectMembersListItem
								key={member.user_id}
								member={member}
								projectRole={projectRole}
								handleRemoveMember={handleRemoveMember}
							/>
						))}
						{projectInvites.map((member) => (
							<ProjectMembersListItem
								key={member.user_id}
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
									<h3 className='text-3xl font-semibold'>
										Invite Member
									</h3>
									<button
										className='p-1 ml-auto bg-transparent border-0 text-black opacity-2 float-right text-3xl leading-none font-semibold outline-none focus:outline-none'
										onClick={() => setShowModal(false)}>
										<span className='text-white h-6 w-6 text-2xl block outline-none focus:outline-none'>
											×
										</span>
									</button>
								</div>
								{/*body*/}
								<div className='relative p-6 flex-auto gap-1'>
									<div>
										<label htmlFor='email'>
											Email Address
										</label>
										<input
											type='email'
											name='email'
											id='email'
											onChange={handleEmailChange}
											value={fieldEmail}
											required
										/>
									</div>
									{!fieldEmailUnique && (
										<p className='mb-2'>
											This user is already in the team
										</p>
									)}
									<div>
										<label htmlFor='roleId'>Role</label>
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
