import { useState } from 'react';

export default function ProjectListItemTeam({ members }) {
	console.log('list item team', members);

	const [expandTeam, setExpandTeam] = useState(false);

	function handleTeamClick() {
		console.log('handleTeamClick');
		setExpandTeam(!expandTeam);
	}
	// Sort list of members by role [ owner -> manager -> member]

	members.sort((a, b) => a.role_type.priority - b.role_type.priority);

	return (
		<ul className='projectListItemTeamList'>
			{/* Render the team owner */}
			{members.length > 0 && (
				<li>
					<div className='projectListItemTeamLine'>
						<div>{members[0].profile.full_name}</div>
						<div>
							[{members[0].role_type.role_type}]{' '}
							{members.length > 1 && (
								<button
									className='button button-small'
									onClick={handleTeamClick}>
									{expandTeam ? '-' : '+'}
								</button>
							)}
						</div>
					</div>
				</li>
			)}
			{/* Render additional team members */}
			{expandTeam &&
				members.slice(1).map((member) => (
					<li key={member.user_id}>
						<div className='projectListItemTeamLine'>
							<div>{member.profile.full_name}</div>
							<div>[{member.role_type.role_type}]</div>
						</div>
					</li>
				))}
		</ul>
	);
}
