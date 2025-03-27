import { useMemo } from 'react';

// Components
import MenuButton from '../Buttons/MenuButton';

export default function ProjectTaskList({
    task,
    projectRole,
    handleRemoveTask,
}) {
    const menuItems = useMemo(() => {
        const items = [];
        if (['owner', 'manager'].includes(projectRole)) {
            items.push({
                name: 'Remove',
                onClick: () => {
                    handleRemoveTask(task.id);
                },
            });
        }

        return items;
    }, [projectRole]);

    return (
        <tr className="text-sm md:text-base">
            <td>{task.name}</td>
            <td>{task.description}</td>
            <td className="px-1 py-2 text-center w-[10%]">
                <MenuButton menuItems={menuItems} />
            </td>
        </tr>
    );
}
