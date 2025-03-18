import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Contexts
import { useAuth } from '../contexts/AuthProvider';

// APIs
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
        <div className='block p-6  border  rounded-lg shadow bg-gray-800 border-gray-700'>
            <h5 className='mb-2 text-2xl font-bold tracking-tight mb-4'>
                Edit Profile
            </h5>
            <form className='flex flex-col gap-4'>
                <div className='flex gap-4 items-center justify-between'>
                    <label htmlFor='fullName' className='font-bold'>
                        Full Name:
                    </label>
                    <input
                        className='w-72'
                        type='text'
                        id='fullName'
                        name='fullName'
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                    />
                </div>
                <div className='flex gap-4 items-center justify-between'>
                    <label htmlFor='email' className='font-bold'>
                        Email:
                    </label>
                    <input
                        className='w-72'
                        type='email'
                        id='email'
                        name='email'
                        required
                        value={formData.email}
                        onChange={handleChange}
                        disabled
                    />
                </div>
                <div className='flex gap-4 items-center justify-between'>
                    <label htmlFor='department' className='font-bold'>
                        Department:
                    </label>
                    <input
                        className='w-72'
                        type='text'
                        id='department'
                        name='department'
                        required
                        value={formData.department}
                        onChange={handleChange}
                    />
                </div>
                <div className='flex gap-4 items-center justify-center'>
                    <Link to='/profile'>
                        <button className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'>
                            Cancel
                        </button>
                    </Link>

                    <button
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                        onClick={handleSubmit}>
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}
