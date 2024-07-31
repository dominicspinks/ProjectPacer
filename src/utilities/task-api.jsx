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
