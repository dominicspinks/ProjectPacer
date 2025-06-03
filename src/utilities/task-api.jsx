import { supabaseClient } from '../config/supabase-client';

// Get tasks from the database for a project
export async function getTaskList(projectId) {
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

// Create a new task time entry
export async function addTaskTime(taskId, userId) {
    const { data, error } = await supabaseClient
        .from('task_time')
        .insert({
            task_id: taskId,
            user_id: userId,
        })
        .select();
    if (error) throw new Error(error.message);
    return { data: data[0] };
}

// Update stopped_at for a task time entry
export async function updateTaskStopTime(taskTimeId, comment = '') {
    const stoppedAt = new Date().toISOString();
    const { data, error } = await supabaseClient
        .from('task_time')
        .update({ stopped_at: stoppedAt, comment: comment })
        .eq('id', taskTimeId)
        .select(
            'id, user_id, profile!inner(full_name), project_task!inner(name), created_at, stopped_at, duration, comment'
        );

    if (error) throw new Error(error.message);
    return { data: data[0] };
}

// Calculate accumulated time for a project
export async function getAccumulatedTime(projectId) {
    if (!projectId) return { data: 0 };

    const { data, error } = await supabaseClient.rpc('get_accumulated_time', {
        _project_id: projectId,
    });

    if (error) {
        console.error('Error fetching accumulated time:', error);
        return { data: null, error };
    }

    return { data: data[0].sum || 0 };
}

// Get all task time entries for a project
export async function getTaskTimeHistory(projectId) {
    const { data, error } = await supabaseClient
        .from('task_time')
        .select(
            'id, user_id, profile!inner(full_name), project_task!inner(name), created_at, stopped_at, duration, comment'
        )
        .eq('project_task.project_id', projectId)
        .not('duration', 'is', null);

    if (error) {
        console.error(error);
        return { error: error };
    }

    return {
        data,
        error,
    };
}

export async function getAllProjectsTaskTimeHistoryForWeek() {
    const { data: userData, error: userError } =
        await supabaseClient.auth.getUser();

    if (userError || !userData?.user) {
        console.error(userError || 'No user found');
        return { error: userError || new Error('No user found') };
    }

    const userId = userData.user.id;

    // Calculate the Monday of the current week
    const now = new Date();
    const day = now.getDay(); // 0 (Sun) to 6 (Sat)
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    const mondayISO = monday.toISOString();

    // Get IDs of projects belonging to the user
    const { data: projects, error: projectsError } = await supabaseClient
        .from('project_member')
        .select('project_id')
        .eq('user_id', userId);

    if (projectsError) {
        console.error(projectsError);
        return { error: projectsError };
    }

    const projectIds = projects.map((p) => p.project_id);

    // Fetch task time records from current week for user's projects
    const { data, error } = await supabaseClient
        .from('task_time')
        .select(
            'profile!inner(full_name), project_task!inner(name, project!inner(id,name)), created_at, stopped_at, duration, comment'
        )
        .gte('created_at', mondayISO)
        .not('duration', 'is', null)
        .in('project_task.project.id', projectIds);

    if (error) {
        console.error(error);
        return { error };
    }

    return {
        data,
    };
}

// Delete a task history by task ID
export async function deleteTaskHistory(taskId) {
    const result = await supabaseClient
        .from('task_time')
        .delete()
        .eq('id', taskId);

    if (result.error) {
        console.error(result.error);
        return result;
    }

    return result;
}

export function transformDataForExport(data) {
    return data.map((item) => ({
        Project: item.project_task.project.name,
        'Task Name': item.project_task.name,
        'Performed By': item.profile.full_name,
        Date: formatDateString(item.created_at),
        'Start Time': formatTimeString(item.created_at),
        'End Time': formatTimeString(item.stopped_at),
        'Duration (min)': Math.max(1, Math.round(+item.duration / 60)),
        Comments: item.comment,
    }));
}

function formatDateString(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatTimeString(dateString) {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}
