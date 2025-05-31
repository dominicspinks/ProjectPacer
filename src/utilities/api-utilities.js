/**
 * Safely executes an API call with standard error handling
 * @param {Function} apiCall - The API function to call (should return {data, error})
 * @param {Function} errorCallback - Optional custom error handler
 * @returns {Object} - {data, success} where success is a boolean indicating if the call succeeded
 */
export const safeApiCall = async (apiCall, errorCallback = console.error) => {
    try {
        const result = await apiCall();

        if (!result || typeof result !== 'object') {
            throw new Error('API call did not return a valid response object');
        }

        const { data, error } = result;

        if (error) {
            errorCallback(error);
            return { data: null, success: false };
        }

        return { data: data ?? null, success: true };
    } catch (err) {
        errorCallback(err);
        return { data: null, success: false };
    }
};