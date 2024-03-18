// Components
import ProjectMembersListItem from '../ProjectMembersListItem/ProjectMembersListItem';

export default function ProjectMembersList({
	projectRole,
	projectMembers,
	handleRemoveMember,
}) {
	console.log('project members list', projectMembers);

	return (
		<>
			{projectMembers && (
				<table>
					<thead>
						<tr>
							<th>Name</th>
							<th>Role</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{projectMembers.map((member) => (
							<ProjectMembersListItem
								key={member.user_id}
								member={member}
								projectRole={projectRole}
								handleRemoveMember={handleRemoveMember}
							/>
						))}
					</tbody>
				</table>
			)}
		</>
	);
}
