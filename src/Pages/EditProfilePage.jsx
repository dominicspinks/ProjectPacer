import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';
import * as UserAPI from '../utilities/user-api';

export default function EditProfilePage() {
    const { user, userDetails, getUserDetails } = useAuth();
    const navigateTo = useNavigate();

    const [formData, setFormData] = useState({
        fullName:
            !userDetails || userDetails.full_name === null
                ? ''
                : userDetails.full_name,
        department:
            !userDetails || userDetails.department === null
                ? ''
                : userDetails.department,
        email: user.user_metadata.email,
    });

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const profile_data = {
            user_id: user.id,
            full_name: formData.fullName,
            department: formData.department,
        };

        const { error } = await UserAPI.updateUserDetails(profile_data);

        if (error) {
            console.error(error);
            return;
        }

        getUserDetails(); // Reload user details
        navigateTo('/profile');
    }

    return (
        <div className='block p-4 m-2 rounded-lg shadow bg-gray-900 w-[95%] md:max-w-xl'>
            <h5 className='text-2xl font-bold tracking-tight mb-4'>
                Edit Profile
            </h5>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                    <label htmlFor='fullName' className='font-bold sm:w-32 text-left'>
                        Full Name:
                    </label>
                    <input
                        className='w-full bg-gray-700 border border-gray-600 rounded p-2'
                        type='text'
                        id='fullName'
                        name='fullName'
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                    />
                </div>
                <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                    <label htmlFor='email' className='font-bold sm:w-32 text-left'>
                        Email:
                    </label>
                    <input
                        className='w-full bg-gray-700 border border-gray-600 rounded p-2 opacity-70'
                        type='email'
                        id='email'
                        name='email'
                        required
                        value={formData.email}
                        onChange={handleChange}
                        disabled
                    />
                </div>
                <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                    <label htmlFor='department' className='font-bold sm:w-32 text-left'>
                        Department:
                    </label>
                    <input
                        className='w-full bg-gray-700 border border-gray-600 rounded p-2'
                        type='text'
                        id='department'
                        name='department'
                        required
                        value={formData.department}
                        onChange={handleChange}
                    />
                </div>
                <div className='flex flex-col sm:flex-row gap-3 items-center sm:justify-end mt-4'>
                    <Link to='/profile' className='w-full sm:w-auto'>
                        <button type="button" className='w-full bg-transparent hover:bg-blue-500 text-white font-semibold py-2 px-4 border border-blue-500 hover:border-transparent rounded'>
                            Cancel
                        </button>
                    </Link>
                    <button
                        type="submit"
                        className='w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}