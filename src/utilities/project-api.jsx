import { supabaseClient } from '../config/supabase-client';

// Get full details from the database for all projects that the user owns
export async function getProjectDetails(projectIdList) {
    if (projectIdList.length === 0) return [];

    const { data, error } = await supabaseClient
        .from('project')
        .select(
            `id,name,description,is_archived,project_member!inner(user_id, role_type!inner(role_type, priority), profile!inner(full_name))`
        )
        .in('project_member.project_id', projectIdList);

    if (error) {
        console.error(error);
        return { error };
    }
    return { projects: !data ? [] : data };
}

// Get the project names and IDs from the database that the current user owns
export async function getProjectNames(user_id) {
    if (!user_id) return [];

    const { data, error } = await supabaseClient
        .from('project')
        .select(`id,name,project_member!inner(user_id)`)
        .eq('project_member.user_id', user_id)
        .order('name', { ascending: true });

    if (error) {
        console.error(error);
        return { error };
    }

    return { projectNames: !data ? [] : data };
}

// Add new project to database
export async function addProject(userId, projectName, projectDescription) {
    // Call a procedure in supabase that inserts the line into project and project_member tables (as the owner)
    const { data, error } = await supabaseClient.rpc('add_new_project', {
        _name: projectName,
        _description: projectDescription,
        _user_id: userId,
    });

    if (error) {
        console.error(error);
        return { error };
    }

    return {
        data: !data ? { error } : { id: data[0].id },
    };
}

// Set a project status to 'archived'
export async function archiveProject(projectId) {
    const { data, error } = await supabaseClient
        .from('project')
        .update({ is_archived: true })
        .eq('id', projectId);

    if (error) {
        console.error(error);
        return { error };
    }

    return {
        data: !data ? { error } : { id: data[0].id },
    };
}

// Set a project status to 'active'
export async function unarchiveProject(projectId) {
    const { data, error } = await supabaseClient
        .from('project')
        .update({ is_archived: false })
        .eq('id', projectId);

    if (error) {
        console.error(error);
        return { error };
    }

    return {
        data: !data ? { error } : { id: data[0].id },
    };
}

// Delete a project
export async function deleteProject(projectId) {
    const { data, error } = await supabaseClient
        .from('project')
        .delete()
        .eq('id', projectId);

    if (error) {
        console.error(error);
        return { error };
    }

    return {
        data: !data ? { error } : { message: 'success' },
    };
}

// Get a single project
export async function getProject(userId, projectId) {
    const { data, error } = await supabaseClient
        .from('project')
        .select(
            'id, name, description, is_archived, created_at,project_member!left(user_id, role_type!inner(role_type, priority), profile!inner(full_name, email)),project_invite!left(id, email, role_id), project_task!left(id, name, description)'
        )
        .eq('id', projectId)
        .limit(1);
    console.log('project details', data);
    if (error || data.length === 0) {
        console.error(error);
        return { error: error };
    }

    return {
        data: { ...data[0] },
    };
}

// Remove a member from a project
export async function removeProjectMember(projectId, userId) {
    // Need to work out how to join in a delete statement, rather than use '1' for the role_id, preferably it would search by role_type='owner'
    // Possibly can input the ownerRoleId into the function since the pages have this value
    const { error } = await supabaseClient
        .from('project_member')
        .delete()
        .neq('role_id', 1)
        .eq('project_id', projectId)
        .eq('user_id', userId);

    if (error) {
        console.error(error);
        return { error: error };
    }

    return {
        data: { message: 'success' },
    };
}

// Add a member to a project
export async function addProjectMember(projectId, email, roleId, userId) {
    const { data: check_existing, error: error_check_existing } =
        await supabaseClient
            .from('project_member')
            .select('id,profile!inner(*)')
            .eq('project_id', projectId)
            .eq('profile.email', email);

    if (error_check_existing) {
        console.error(error_check_existing);
        return { error: error_check_existing };
    }

    if (check_existing && check_existing.length > 0) {
        return { error: { message: 'user already in project' } };
    }

    // User doesn't exist, add to invite list
    const { error: error_insert_invite } = await supabaseClient
        .from('project_invite')
        .insert({
            project_id: projectId,
            email: email,
            role_id: roleId,
            invited_by: userId,
        });

    if (error_insert_invite) {
        console.error(error_insert_invite);
        return { error: error_insert_invite };
    }

    return {
        data: { message: 'success' },
    };
}

// Insert new Project Member into project_member table
export async function insertProjectMember(projectId, userId, roleId) {
    const { data, error } = await supabaseClient.from('project_member').insert({
        project_id: projectId,
        user_id: userId,
        role_id: roleId,
    });

    if (error) {
        console.error(error);
        return { error: error };
    }

    return {
        data: { message: 'success' },
    };
}

// Get list of invites for a project
export async function getProjectInvites(projectId) {
    const { data, error } = await supabaseClient
        .from('project_invite')
        .select(
            'id, project_id, email, role_type!inner(id, role_type, priority)'
        )
        .eq('project_id', projectId);

    if (error) {
        console.error(error);
        return { error: error };
    }

    return {
        data: data,
    };
}

// Delete an invite
export async function removeProjectInvite(inviteId) {
    const { data, error } = await supabaseClient
        .from('project_invite')
        .delete()
        .eq('id', inviteId);

    if (error) {
        console.error(error);
        return { error: error };
    }

    return {
        data: { message: 'success' },
    };
}

// Get list of users belonging to a list of projects
export async function getProjectMembers(projectIds) {
    const { data, error } = await supabaseClient
        .from('project_member')
        .select('profile!inner(full_name, user_id)', { distinct: true })
        .in('project_id', projectIds);

    if (error) {
        console.error(error);
        return { error: error };
    }

    // Get unique list of users
    const memberMap = new Map();
    data.forEach((member) =>
        memberMap.set(member.profile.user_id, member.profile.full_name)
    );

    return {
        data: memberMap,
    };
}

// Get list of tasks belonging to a project
export async function getProjectTasks(projectId) {
    const { data, error } = await supabaseClient
        .from('project_task')
        .select('*')
        .eq('project_id', projectId);

    if (error) {
        console.error(error);
        return { error: error };
    }

    return {
        data: data,
    };
}

// Add a task to a project
export async function addProjectTask(projectId, name, description) {
    const { data, error } = await supabaseClient.from('project_task').insert({
        project_id: projectId,
        name: name,
        description: description,
    });

    if (error) {
        console.error(error);
        return { error: error };
    }

    return {
        data: { message: 'success' },
    };
}

// Remove a task from a project
export async function removeProjectTask(taskId) {
    const { data, error } = await supabaseClient
        .from('project_task')
        .delete()
        .eq('id', taskId);

    if (error) {
        console.error(error);
        return { error: error };
    }

    return {
        data: { message: 'success' },
    };
}
