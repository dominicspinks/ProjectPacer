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
export async function updateTaskStopTime(taskTimeId) {
    const stoppedAt = new Date().toISOString();
    const { data, error } = await supabaseClient
        .from('task_time')
        .update({ stopped_at: stoppedAt })
        .eq('id', taskTimeId)
        .select();
    console.log(data, error);
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
            'profile!inner(full_name), project_task!inner(name), created_at, stopped_at, duration'
        )
        .eq('project_task.project_id', projectId)
        .not('duration', 'is', null);

    if (error) {
        console.error(error);
        return { error: error };
    }

    return {
        data: transformData(data),
    };
}

function transformData(data) {
    return data.map((item) => ({
        'Task Name': item.project_task.name,
        'Performed By': item.profile.full_name,
        Date: formatDateString(item.created_at),
        'Start Time': formatTimeString(item.created_at),
        'End Time': formatTimeString(item.stopped_at),
        'Duration (min)': Math.max(1, Math.round(+item.duration / 60)),
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
