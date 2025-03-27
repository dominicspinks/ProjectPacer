/**
 * Safely executes an API call with standard error handling
 * @param {Function} apiCall - The API function to call (should return {data, error})
 * @param {Function} errorCallback - Optional custom error handler
 * @returns {Object} - {data, success} where success is a boolean indicating if the call succeeded
 */
export const safeApiCall = async (apiCall, errorCallback = console.error) => {
    try {
        const { data, error } = await apiCall();
        if (error) {
            errorCallback(error);
            return { data: null, success: false };
        }
        return { data, success: true };
    } catch (err) {
        errorCallback(err);
        return { data: null, success: false };
    }
};