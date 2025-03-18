// Components
import MenuButton from '../Buttons/MenuButton';

export default function UserDefaultTaskListItem({
    task,
    handleEditTask,
    handleDeleteTask,
}) {
    const menuItems = [
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
    ];

    return (
        <tr>
            <td>{task.name}</td>
            <td className='whitespace-pre-wrap text-left'>
                {task.description}
            </td>
            <td>
                <MenuButton menuItems={menuItems} />
            </td>
        </tr>
    );
}
