import { supabaseClient } from '../config/supabase-client';

// Get list of user default tasks
export async function getUserDefaultTasks(userId) {
    const { data, error } = await supabaseClient
        .from('user_task_default')
        .select('id, name, description')
        .eq('user_id', userId);

    if (error) throw new Error(error.message);
    return data;
}

// Add new user default task
export async function addUserDefaultTask(task) {
    const { data, error } = await supabaseClient
        .from('user_task_default')
        .insert({
            user_id: task.userId,
            name: task.name,
            description: task.description,
        });

    if (error) throw new Error(error.message);
    return data;
}

// Update existing user default task
export async function updateUserDefaultTask(task) {
    const { data, error } = await supabaseClient
        .from('user_task_default')
        .update({
            name: task.name,
            description: task.description,
        })
        .eq('id', task.id);
    if (error) throw new Error(error.message);
    return data;
}

// Delete user default task
export async function deleteUserDefaultTask(taskId) {
    const { data, error } = await supabaseClient
        .from('user_task_default')
        .delete()
        .eq('id', taskId);
    if (error) throw new Error(error.message);
    return data;
}
