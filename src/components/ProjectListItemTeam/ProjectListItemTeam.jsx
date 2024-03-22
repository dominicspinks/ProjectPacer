import { useState } from 'react';

// Icons
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

export default function ProjectListItemTeam({ members }) {
	const [expandTeam, setExpandTeam] = useState(false);

	function handleTeamClick() {
		setExpandTeam(!expandTeam);
	}
	// Sort list of members by role [ owner -> manager -> member]

	members.sort((a, b) => a.role_type.priority - b.role_type.priority);

	return (
		<ul className='projectListItemTeamList'>
			{/* Render the team owner */}
			{members.length > 0 && (
				<li>
					<div className='flex justify-between items-center capitalize'>
						<div>{members[0].profile.full_name}</div>
						<div>
							{members.length > 1 && (
								<button
									className='button button-small'
									onClick={handleTeamClick}>
									{expandTeam ? (
										<MinusIcon className='w-4 h-4 text-white hover:text-gray-300' />
									) : (
										<PlusIcon className='w-4 h-4 text-white hover:text-gray-300' />
									)}
								</button>
							)}{' '}
							[{members[0].role_type.role_type}]
						</div>
					</div>
				</li>
			)}
			{/* Render additional team members */}
			{expandTeam &&
				members.slice(1).map((member) => (
					<li key={member.user_id}>
						<div className='flex justify-between items-center capitalize'>
							<div>{member.profile.full_name}</div>
							<div>[{member.role_type.role_type}]</div>
						</div>
					</li>
				))}
		</ul>
	);
}
