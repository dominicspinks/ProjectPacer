import { useRef } from 'react';

// Components
import MenuButton from '../MenuButton/MenuButton';

export default function UserDefaultTaskListItem({
    task,
    handleEditTask,
    handleDeleteTask,
}) {
    const menuItemsRef = useRef([
        {
            name: 'Edit',
            onClick: () => {
                handleEditTask(task);
            },
        },
        {
            name: 'Delete',
            onClick: () => {
                handleDeleteTask(task.id);
            },
        },
    ]);

    return (
        <tr>
            <td>{task.name}</td>
            <td className='whitespace-pre-wrap text-left'>
                {task.description}
            </td>
            <td>
                <MenuButton menuItems={menuItemsRef.current} />
            </td>
        </tr>
    );
}
