import { useState } from 'react';

// Components
import ProjectListItemTeam from '../ProjectListItemTeam/ProjectListItemTeam';

export default function ProjectListItem({ project }) {
    return (
        <tr>
            <td>{project.name}</td>
            <td>
                {
                    <ProjectListItemTeam
                        key={project.project_member.user_id}
                        members={project.project_member}
                    />
                }
            </td>
            <td>this will be the menu</td>
        </tr>
    );
}
