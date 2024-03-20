import { useState, useEffect } from 'react';

import { supabaseClient } from '../../config/supabase-client';

// API
import * as MessageAPI from '../../utilities/messages-api';
import * as ProjectAPI from '../../utilities/project-api';

// contexts
import { useAuth } from '../../contexts/AuthProvider';

// Components
import ChatMessage from '../ChatMessage/ChatMessage';

export default function ChatContainer({ projectNames }) {
	// console.log(projectNames);
	const { user } = useAuth();

	const [messages, setMessages] = useState([]);
	const [filteredMessages, setFilteredMessages] = useState([]);
	const [loadingMessages, setLoadingMessages] = useState(true);

	const [incomingMessage, setIncomingMessage] = useState(null);

	const [fieldProjectId, setFieldProjectId] = useState(
		projectNames.length > 0 ? projectNames[0].id : ''
	);
	const [fieldMessage, setFieldMessage] = useState('');
	const [projectMembers, setProjectMembers] = useState(new Map());

	// Get messages list if user updates
	useEffect(() => {
		console.log('get messages');
		if (user) {
			getMessages();
		}
	}, [user]);

	// Listen for changes in the messages table
	// To do, listen only for changes to specific projects, when the project changes, the listener will be closed and a new one opened. This will reduce memory requirements, but means new message alerts wont work for projects not selected
	useEffect(() => {
		const subscription = supabaseClient
			.channel('messagesTable')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'message',
				},
				handleMessageSubscription
			)
			.subscribe();

		return () => supabaseClient.removeChannel(subscription);
	}, []);

	// Handle incoming messages
	useEffect(() => {
		if (incomingMessage) {
			console.log('existing', messages);
			console.log('new message list', [incomingMessage, ...messages]);
			setMessages([incomingMessage, ...messages]);
			setIncomingMessage(null);
		}
	}, [incomingMessage]);

	// Update default fieldProjectId value if projectNames changes
	useEffect(() => {
		console.log('effect - project Name, set fieldProjectId', projectNames);
		if (projectNames.length === 0) return;
		console.log(
			'set field project id',
			projectNames[0].id,
			typeof projectNames[0].id
		);
		setFieldProjectId(projectNames[0].id);
		getProjectMembers();
		getMessages();
	}, [projectNames]);

	// Filter the messages by the new fieldProjectId
	useEffect(() => {
		console.log('effect - fieldProjectId', fieldProjectId);
		if (fieldProjectId) {
			filterByProjectId(messages);
		}
	}, [fieldProjectId]);

	// Update project members and filtered list when messages change
	useEffect(() => {
		console.log('messages has changed', messages);
		if (messages.length === 0 || loadingMessages) return;

		const newMessage = messages[0];
		// check if the new message was created by a new user
		// If there are any new members, reload the project member details
		console.log(
			'projectMembers',
			projectMembers,
			!projectMembers,
			'new message',
			newMessage
		);
		if (
			!projectMembers ||
			!projectMembers.size ||
			!projectMembers.has(newMessage.user_id)
		)
			getProjectMembers();

		// Add the new message to the filtered message if it was created for the current project and doesn't already exist
		console.log(
			'check project field type',
			'message project id',
			newMessage.project_id,
			'selected project id',
			fieldProjectId,
			newMessage.project_id === fieldProjectId,
			!filteredMessages.includes(newMessage)
		);
		if (
			newMessage.project_id === fieldProjectId &&
			!filteredMessages.includes(newMessage)
		) {
			console.log(
				'update filtered messages',
				newMessage,
				filteredMessages
			);
			const newFilteredMessages = [newMessage, ...filteredMessages];
			setFilteredMessages(newFilteredMessages);
		}
	}, [messages]);

	// Function to run when a new message arrives from the db
	function handleMessageSubscription(payload) {
		console.log('Change received!', payload);

		// If a new line was created, add it to the list
		if (payload.eventType === 'INSERT') {
			setIncomingMessage(payload.new);
		}
	}

	// Get list of users belonging to the current list of projects
	async function getProjectMembers() {
		console.log('get project members', projectNames);
		if (projectNames.length === 0) return;
		const { data, error } = await ProjectAPI.getProjectMembers(
			projectNames.map((project) => project.id)
		);
		console.log('project members', data);
		if (error) {
			console.error(error);
			return { error: error };
		}
		setProjectMembers(data);
		console.log('project members', data);
	}

	// Get existing messages for the user's projects
	async function getMessages() {
		console.log('getMessages');
		if (projectNames.length === 0) return;
		const { data, error } = await MessageAPI.getMessages(projectNames);
		if (error) {
			console.error(error);
			return { error: error };
		}
		setMessages(data);
		console.log('get messages', typeof data, data);

		// Filter messages by the selected project
		filterByProjectId(data);
		setLoadingMessages(false);
	}

	function filterByProjectId(data) {
		// Filter messages by the selected project
		console.log(
			'filter messages',
			'projectId',
			parseInt(fieldProjectId),
			'original',
			data,
			'filtered',
			data.filter(
				(message) => message.project_id === parseInt(fieldProjectId)
			)
		);
		setFilteredMessages([
			...data.filter(
				(message) => message.project_id === parseInt(fieldProjectId)
			),
		]);
	}

	async function sendMessage(e) {
		//
		e.preventDefault();
		console.log('send message', fieldMessage);
		console.log('existing messages', messages);
		console.log(
			'send message validations',
			!fieldProjectId,
			fieldProjectId === '',
			!fieldMessage
		);
		if (!fieldProjectId || fieldProjectId === '' || !fieldMessage) return;

		const { error } = await MessageAPI.sendMessage(
			user.id,
			fieldProjectId,
			fieldMessage
		);
		console.log('checking messages', messages);
		if (error) {
			console.error(error);
			return { error: error };
		}
		setFieldMessage('');
		console.log('checking messages', messages);
	}

	function handleMessageChange(e) {
		setFieldMessage(e.target.value);
	}

	function handleProjectChange(e) {
		console.log(
			'set field project id',
			e.target.value,
			typeof e.target.value
		);
		setFieldProjectId(parseInt(e.target.value));
	}

	return (
		<>
			<div id='messagesContainer'>
				<div id='messagesHeader' className='container'>
					Messages
				</div>
				<select
					id='projectSelector'
					value={fieldProjectId}
					onChange={handleProjectChange}>
					{projectNames.map((project) => (
						<option key={project.id} value={parseInt(project.id)}>
							{project.name}
						</option>
					))}
				</select>
				<div id='messages'>
					<div
						id='messageList'
						className='flex flex-col-reverse overflow-y-scroll gap-2 p-2 max-h-72 min-h-36 overscroll-contain max-w-96'>
						{filteredMessages.length === 0 && <p>No messages</p>}
						{filteredMessages.map((message) => (
							<ChatMessage
								key={message.id}
								message={message}
								projectMembers={projectMembers}
							/>
						))}
					</div>
					<form id='messageInput' onSubmit={sendMessage}>
						<input
							type='text'
							value={fieldMessage}
							onChange={handleMessageChange}
						/>
						<button type='submit'>Send</button>
					</form>
				</div>
			</div>
		</>
	);
}
