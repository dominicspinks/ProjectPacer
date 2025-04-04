import { supabaseClient } from '../config/supabase-client';

async function checkProjectAuthorization(userId, projectId, requiredLevel = null) {
    // If no user ID provided, not authorized
    if (!userId) {
        return {
            authorized: false,
            error: { message: 'No user ID provided' },
            role: null
        };
    }

    // First check if user is a member of the project
    const { data: roleCheck, error: roleError } = await supabaseClient
        .from('project_member')
        .select('role_type!inner(role_type)')
        .eq('project_id', projectId)
        .eq('user_id', userId)
        .limit(1);

    if (roleError) {
        console.error(roleError);
        return {
            authorized: false,
            error: roleError,
            role: null
        };
    }

    // If no role found, user is not a member
    if (!roleCheck || roleCheck.length === 0) {
        return {
            authorized: false,
            error: { message: 'Access denied: User is not a member of this project' },
            role: null
        };
    }

    const userRole = roleCheck[0].role_type.role_type;

    // If just checking membership, any role is sufficient
    if (!requiredLevel || requiredLevel === 'member') {
        return {
            authorized: true,
            error: null,
            role: userRole
        };
    }

    // For manager level, user must be owner or manager
    if (requiredLevel === 'manager') {
        if (userRole === 'owner' || userRole === 'manager') {
            return {
                authorized: true,
                error: null,
                role: userRole
            };
        } else {
            return {
                authorized: false,
                error: { message: 'Access denied: Must be an owner or manager for this operation' },
                role: userRole
            };
        }
    }

    // For owner level, user must be owner
    if (requiredLevel === 'owner') {
        if (userRole === 'owner') {
            return {
                authorized: true,
                error: null,
                role: userRole
            };
        } else {
            return {
                authorized: false,
                error: { message: 'Access denied: Only project owners can perform this operation' },
                role: userRole
            };
        }
    }

    // If we reached here, the required level is invalid
    return {
        authorized: false,
        error: { message: 'Invalid permission level requested' },
        role: userRole
    };
}

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
export async function getProjectNames(userId) {
    if (!userId) return [];

    const { data, error } = await supabaseClient
        .from('project')
        .select(`id,name,project_member!inner(user_id)`)
        .eq('project_member.user_id', userId)
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
export async function archiveProject(userId, projectId) {
    // Check authorization - requires manager level
    const auth = await checkProjectAuthorization(userId, projectId, 'manager');

    if (!auth.authorized) {
        return { error: auth.error };
    }

    // User is authorized, proceed with the operation
    const { data, error } = await supabaseClient
        .from('project')
        .update({ is_archived: true })
        .eq('id', projectId);

    if (error) {
        console.error(error);
        return { error };
    }

    return {
        data: !data ? { error } : { id: data[0]?.id },
    };
}

// Set a project status to 'active'
export async function unarchiveProject(userId, projectId) {
    // Check authorization - requires manager level
    const auth = await checkProjectAuthorization(userId, projectId, 'manager');

    if (!auth.authorized) {
        return { error: auth.error };
    }

    // User is authorized, proceed with the operation
    const { data, error } = await supabaseClient
        .from('project')
        .update({ is_archived: false })
        .eq('id', projectId);

    if (error) {
        console.error(error);
        return { error };
    }

    return {
        data: !data ? { error } : { id: data[0]?.id },
    };
}

// Delete a project
export async function deleteProject(userId, projectId) {
    // Check authorization - requires owner level
    const auth = await checkProjectAuthorization(userId, projectId, 'owner');

    if (!auth.authorized) {
        return { error: auth.error };
    }

    // User is authorized, proceed with the operation
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
    // Check authorization - requires any membership
    const auth = await checkProjectAuthorization(userId, projectId, 'member');

    if (!auth.authorized) {
        return { error: auth.error };
    }

    // User is authorized, proceed with the operation
    const { data, error } = await supabaseClient
        .from('project')
        .select(
            'id, name, description, is_archived, created_at,project_member!left(user_id, role_type!inner(role_type, priority), profile!inner(full_name, email)),project_invite!left(id, email, role_id), project_task!left(id, name, description)'
        )
        .eq('id', projectId)
        .limit(1);

    if (error || data.length === 0) {
        console.error(error);
        return { error: error || { message: 'Project not found' } };
    }

    return {
        data: { ...data[0] },
    };
}

// Remove a member from a project
export async function removeProjectMember(userId, projectId, userIdToRemove) {
    // Check authorization - requires manager level
    const auth = await checkProjectAuthorization(userId, projectId, 'manager');

    if (!auth.authorized) {
        return { error: auth.error };
    }

    // Check if the user to remove is an owner (owners cannot be removed)
    const { data: memberCheck, error: memberError } = await supabaseClient
        .from('project_member')
        .select('role_type!inner(role_type, id)')
        .eq('project_id', projectId)
        .eq('user_id', userIdToRemove)
        .single();

    if (memberError) {
        console.error(memberError);
        return { error: memberError };
    }

    // If the user to remove is an owner, deny the operation
    if (memberCheck && memberCheck.role_type.role_type === 'owner') {
        return { error: { message: 'Project owners cannot be removed from projects' } };
    }

    // Proceed with removing the member
    const { error } = await supabaseClient
        .from('project_member')
        .delete()
        .eq('project_id', projectId)
        .eq('user_id', userIdToRemove);

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
    // Check authorization - requires manager level
    const auth = await checkProjectAuthorization(userId, projectId, 'manager');

    if (!auth.authorized) {
        return { error: auth.error };
    }

    // Check if user is already in the project
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
export async function getProjectInvites(projectId, userId) {
    const auth = await checkProjectAuthorization(userId, projectId, 'manager');

    if (!auth.authorized) {
        return { error: auth.error };
    }

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
export async function removeProjectInvite(inviteId, userId) {
    // First, get the invite details to check permissions
    const { data: inviteData, error: inviteError } = await supabaseClient
        .from('project_invite')
        .select('project_id, email')
        .eq('id', inviteId)
        .single();

    if (inviteError) {
        console.error(inviteError);
        return { error: inviteError };
    }

    if (!inviteData) {
        return { error: { message: 'Invitation not found' } };
    }

    // Check if the user is the one who was invited
    // Get the user's email
    const { data: userData, error: userError } = await supabaseClient
        .from('profile')
        .select('email')
        .eq('user_id', userId)
        .single();

    if (userError) {
        console.error(userError);
        return { error: userError };
    }

    const isInvitee = userData.email === inviteData.email;

    // If not the invitee, check if they're a manager in the project
    let hasManagerPermission = false;

    if (!isInvitee) {
        // Check if the user has manager permissions for this project
        const auth = await checkProjectAuthorization(userId, inviteData.project_id, 'manager');
        hasManagerPermission = auth.authorized;
    }

    // Only proceed if the user is either the invitee or has manager permissions
    if (!isInvitee && !hasManagerPermission) {
        return {
            error: {
                message: 'Access denied: You must be the invitee or have manager permissions in the project'
            }
        };
    }

    // User is authorized, proceed with removing the invite
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
export async function getProjectMembers(projectIds, userId) {
    // Validate that the user is a member of all projects they're requesting
    const { data: userProjects, error: membershipError } = await supabaseClient
        .from('project_member')
        .select('project_id')
        .eq('user_id', userId)
        .in('project_id', projectIds);

    if (membershipError) {
        console.error(membershipError);
        return { error: membershipError };
    }

    // Get the set of projects the user actually belongs to
    const userProjectIds = userProjects.map(item => item.project_id);

    // Check if user is a member of all requested projects
    const unauthorizedProjects = projectIds.filter(id => !userProjectIds.includes(id));

    if (unauthorizedProjects.length > 0) {
        return {
            error: {
                message: 'Access denied: You are not a member of one or more requested projects',
                unauthorizedProjects
            }
        };
    }

    // User is authorized for all projects, proceed with getting members
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
export async function getProjectTasks(projectId, userId) {
    const auth = await checkProjectAuthorization(userId, projectId, 'member');

    if (!auth.authorized) {
        return { error: auth.error };
    }

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
export async function addProjectTask(projectId, name, description, userId) {
    // Check authorization - requires member level (any project member can add tasks)
    const auth = await checkProjectAuthorization(userId, projectId, 'member');

    if (!auth.authorized) {
        return { error: auth.error };
    }

    const { error } = await supabaseClient.from('project_task').insert({
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
export async function removeProjectTask(taskId, userId) {
    // First, we need to get the project ID from the task
    const { data: taskData, error: taskError } = await supabaseClient
        .from('project_task')
        .select('project_id')
        .eq('id', taskId)
        .single();

    if (taskError) {
        console.error(taskError);
        return { error: taskError };
    }

    if (!taskData) {
        return { error: { message: 'Task not found' } };
    }

    // Check authorization - requires member level (any project member can remove tasks)
    const auth = await checkProjectAuthorization(userId, taskData.project_id, 'member');

    if (!auth.authorized) {
        return { error: auth.error };
    }

    // User is authorized, proceed with removing the task
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
