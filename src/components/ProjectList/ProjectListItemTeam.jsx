import { useState, useMemo } from 'react';

// Icons
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

export default function ProjectListItemTeam({ members }) {
	const [expandTeam, setExpandTeam] = useState(false);

	function handleTeamClick() {
		setExpandTeam(!expandTeam);
	}

	// Sort list of members by role [ owner -> manager -> member]
	useMemo(() => {
		members.sort((a, b) => a.role_type.priority - b.role_type.priority);
	}, [members]);

	return (
		<ul className='list-none m-0 p-0 pr-2'>
			{/* Render the team owner */}
			{members.length > 0 && (
				<li>
					<div className='flex justify-between items-center capitalize'>
						<div>{members[0].profile.full_name}</div>
						<div>
							{members.length > 1 && (
								<button onClick={handleTeamClick}>
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
