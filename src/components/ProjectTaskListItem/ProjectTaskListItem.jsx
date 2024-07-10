import { useState, useRef } from 'react';

// Components
import MenuButton from '../MenuButton/MenuButton';

export default function ProjectTaskList({
    task,
    projectRole,
    handleRemoveTask,
}) {
    const [loading, setLoading] = useState(true);
    const menuItemsRef = useRef([]);

    // menuList remove button
    if (loading && ['owner', 'manager'].includes(projectRole)) {
        menuItemsRef.current.push({
            name: 'Remove',
            onClick: () => {
                handleRemoveTask(task.id);
            },
        });
    }
    if (loading) setLoading(false);

    return (
        <tr>
            <td>{task.name}</td>
            <td>{task.description}</td>
            <td>
                <MenuButton menuItems={menuItemsRef.current} />
            </td>
        </tr>
    );
}
