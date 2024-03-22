import { useState, useRef } from 'react';

// Contexts
import { useAuth } from '../../contexts/AuthProvider';

export default function ChatMessage({ message, projectMembers }) {
	const { user } = useAuth();
	const isOwnMessage = useRef(message.user_id === user.id);

	// console.log(
	// 	'chat message',
	// 	projectMembers,
	// 	projectMembers.get(message.user_id)
	// );
	// Change surname of full name to be only the first letter
	function trimSurname(name) {
		if (!name) return name;
		const names = name.split(' ');
		if (names.length <= 1) return name;
		names[names.length - 1] = names[names.length - 1].slice(0, 1);
		return names.join(' ');
	}

	return (
		<div
			className={`flex  ${
				!isOwnMessage.current ? 'justify-start' : 'justify-end'
			}`}>
			<div
				className={`max-w-4/5 min-w-1/5 text-black p-1 pl-2 pr-2 border-gray-300 border-solid border-2 rounded-lg ${
					!isOwnMessage.current
						? 'bg-slate-300 border-gray-300 text-left'
						: 'bg-sky-300 border-none text-right'
				}`}>
				{!isOwnMessage.current && (
					<p className='text-xs font-semibold'>
						{trimSurname(projectMembers.get(message.user_id)) ??
							'Anonymous'}
					</p>
				)}
				<p className='whitespace-pre-wrap text-start'>
					{message.content}
				</p>
				<p className='text-xs italic'>
					{new Date(message.created_at).toLocaleTimeString('en', {
						timeStyle: 'short',
					})}
				</p>
			</div>
		</div>
	);
}
